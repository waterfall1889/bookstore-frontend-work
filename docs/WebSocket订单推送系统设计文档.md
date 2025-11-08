# WebSocket 订单推送系统设计文档

## 一、系统概述

本系统实现了基于 WebSocket 的订单处理结果实时推送功能。用户下单后，后端通过 WebSocket 将订单结果推送给对应用户。

---

## 二、WebSocket 消息格式设计

### 消息统一结构

```json
{
    "type": "消息类型",
    "message": "消息描述",
    "timestamp": 1698765432000,
    "data": { /* 业务数据 */ }
}
```

### 核心消息类型

**订单处理结果消息**（服务器推送给客户端）：
```json
{
    "type": "order_result",
    "message": "订单处理完成",
    "timestamp": 1698765432000,
    "data": {
        "orderId": "1234567890",
        "status": "WFP",
        "message": "订单创建成功，等待支付"
    }
}
```

**订单状态说明：**
- WFP：待支付
- IDL：运输中
- FIN：已完成

---

## 三、客户端筛选机制设计

### 问题：如何确保订单结果只发送给下单用户？

### 解决方案

**1. 用户识别**

客户端连接时在 URL 携带用户 ID：
```
ws://localhost:8080/ws/order?userId=user123
```

服务器解析 URI 获取用户 ID：
```java
private String getUserIdFromSession(WebSocketSession session) {
    String query = session.getUri().getQuery();
    // 解析 userId=xxx
    return userId;
}
```

**2. Session 映射**

使用 ConcurrentHashMap 维护用户到 Session 的映射：
```java
private static final ConcurrentHashMap<String, WebSocketSession> userSessions 
    = new ConcurrentHashMap<>();
```

**3. 精准推送**

```java
public boolean sendOrderResult(String userId, String orderId, String status, String message) {
    // 1. 根据 userId 获取对应的 Session
    WebSocketSession session = userSessions.get(userId);
    
    // 2. 检查 Session 是否存在且打开
    if (session == null || !session.isOpen()) {
        return false;
    }
    
    // 3. 构建消息并发送
    Map<String, Object> orderData = new ConcurrentHashMap<>();
    orderData.put("orderId", orderId);
    orderData.put("status", status);
    orderData.put("message", message);
    
    return sendMessage(userId, "order_result", "订单处理完成", orderData);
}
```

---

## 四、线程安全设计

### 问题：为什么需要线程安全？为什么选择 ConcurrentHashMap？

### 并发场景

- 多用户同时连接
- 多用户同时下单
- 用户连接/断开同时发生

### 为什么选择 ConcurrentHashMap

**如果使用普通 HashMap：**
- 并发写入会导致数据丢失
- 并发扩容可能形成死循环
- 可能出现空指针异常

**ConcurrentHashMap 的线程安全原理：**

**JDK 1.7（分段锁）：**
- 将 Map 分成 16 个 Segment
- 每个 Segment 有独立的锁
- 不同 Segment 可以并发操作

**JDK 1.8+（CAS + synchronized）：**
- 使用 CAS 无锁算法处理无冲突情况
- 使用 synchronized 锁住单个桶处理冲突
- 使用 volatile 保证可见性

**核心代码：**
```java
final V putVal(K key, V value) {
    Node<K,V> f = tabAt(tab, i);
    if (f == null) {
        // 桶为空，CAS 插入（无锁）
        casTabAt(tab, i, null, new Node<>(hash, key, value));
    } else {
        // 桶不为空，synchronized 锁住这个桶
        synchronized (f) {
            // 插入或更新
        }
    }
}
```

### 性能对比

| 数据结构 | 线程安全 | 并发性能 |
|---------|---------|---------|
| HashMap | ❌ | 快但不安全 |
| Hashtable | ✅ | 慢（全局锁） |
| ConcurrentHashMap | ✅ | **快（分段锁）** |

**结论：**ConcurrentHashMap 是高并发场景的最佳选择。

---

## 五、核心代码实现

### 后端

**WebSocketConfig.java**
```java
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(orderWebSocketHandler(), "/ws/order")
                .setAllowedOrigins("*");
    }
}
```

**OrderWebSocketHandler.java**
```java
@Component
public class OrderWebSocketHandler extends TextWebSocketHandler {
    private static final ConcurrentHashMap<String, WebSocketSession> userSessions 
        = new ConcurrentHashMap<>();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = getUserIdFromSession(session);
        userSessions.put(userId, session);
    }
    
    public boolean sendOrderResult(String userId, String orderId, String status, String message) {
        WebSocketSession session = userSessions.get(userId);
        if (session != null && session.isOpen()) {
            // 发送消息
            return true;
        }
        return false;
    }
}
```

**OrderServiceImpl.java**
```java
@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderWebSocketHandler webSocketHandler;
    
    @Override
    public OrderMeta createOrder(String userId) {
        // 1-5. 创建订单逻辑
        
        // 6. WebSocket 推送结果
        webSocketHandler.sendOrderResult(userId, orderId, "WFP", "订单创建成功");
        
        return orderMeta;
    }
}
```

### 前端

**WebSocketService.jsx**
```javascript
class WebSocketService {
    connect(userId) {
        const wsUrl = `ws://localhost:8080/ws/order?userId=${userId}`;
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };
    }
    
    on(type, handler) {
        this.messageHandlers.set(type, handler);
    }
}
```

**cart.jsx**
```javascript
useEffect(() => {
    webSocketService.connect(getUserId());
    return () => webSocketService.disconnect();
}, []);

const handleCheckout = async () => {
    // 注册订单结果处理器
    webSocketService.on('order_result', (data) => {
        alert(`订单创建成功！\n订单号: ${data.orderId}\n状态: ${data.status}`);
        navigate('/orders');
    });
    
    // 调用结算接口
    await Checkout(getUserId());
};
```

---

## 六、总结

本系统实现了基于 WebSocket 的订单推送，解决了以下关键问题：

1. **WebSocket 消息格式**：统一的 JSON 格式，包含 type、message、timestamp、data 字段
2. **客户端筛选机制**：通过 URL 参数识别用户，使用 ConcurrentHashMap 维护映射，实现精准推送
3. **线程安全保证**：选择 ConcurrentHashMap 因其使用 CAS + synchronized 实现高并发场景下的线程安全

---
