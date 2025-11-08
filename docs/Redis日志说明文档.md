# Redis缓存日志输出说明文档

## 一、日志分类和标识

系统使用统一的日志格式，所有Redis相关日志都带有明确的标识：

- **`[Redis]`** - Redis连接状态相关日志
- **`[Redis读取]`** - 缓存读取操作日志
- **`[Redis写入]`** - 缓存写入操作日志
- **`[Redis更新]`** - 缓存更新操作日志（如库存原子更新）
- **`[Redis删除]`** - 缓存删除操作日志
- **`[ItemDao]`** - 数据访问层日志（包含缓存逻辑）
- **`[OrderService]`** - 订单服务日志（包含库存更新）

### 日志状态标记
- ✅ - 操作成功
- ⚠️ - 警告或未命中缓存
- ❌ - 操作失败或错误
- ========== - 操作开始/结束标记

---

## 二、场景一：首次读写（缓存未命中）

### 2.1 首次查询图书

**操作**：查询一个从未查询过的图书ID

**日志输出示例**：
```
[ItemDao] ========== 开始查询图书 ========== - itemId: book000000001
[ItemDao] 步骤1: 尝试从Redis缓存读取 - itemId: book000000001
[Redis读取] 尝试从缓存获取完整图书信息 - itemId: book000000001
[Redis读取] 尝试读取图书基础信息 - key: book:info:book000000001, itemId: book000000001
[Redis读取] ⚠️ 缓存未命中（基础信息） - key: book:info:book000000001, itemId: book000000001
[Redis读取] 尝试读取图书库存 - key: book:stock:book000000001, itemId: book000000001
[Redis读取] ⚠️ 缓存未命中（库存） - key: book:stock:book000000001, itemId: book000000001
[Redis读取] ⚠️ 缓存不完整，无法构建完整图书信息 - itemId: book000000001 (info: false, stock: false)
[ItemDao] ⚠️ 缓存未命中，降级到数据库查询 - itemId: book000000001
[ItemDao] 步骤2: 从MySQL数据库查询 - itemId: book000000001
[ItemDao] ✅ 从数据库查询图书成功 - itemId: book000000001, 书名: Java编程思想, 库存: 100
[ItemDao] 步骤3: 将数据写入Redis缓存 - itemId: book000000001
[Redis写入] 开始写入完整图书信息 - itemId: book000000001
[Redis写入] 尝试写入图书基础信息 - key: book:info:book000000001, itemId: book000000001
[Redis写入] ✅ 写入图书基础信息到缓存成功 - key: book:info:book000000001, itemId: book000000001, TTL: 3600秒, 字段数: 8
[Redis写入] 尝试写入图书库存 - key: book:stock:book000000001, itemId: book000000001, stock: 100
[Redis写入] ✅ 写入图书库存到缓存成功 - key: book:stock:book000000001, itemId: book000000001, stock: 100, TTL: 1800秒
[Redis写入] ✅ 写入完整图书信息到缓存成功 - itemId: book000000001, 书名: Java编程思想, 库存: 100
[ItemDao] ✅ 数据已写入缓存，下次查询将命中缓存 - itemId: book000000001
[ItemDao] ========== 查询完成（数据库） ==========
```

**日志解释**：
1. **开始查询**：`[ItemDao]` 开始查询流程
2. **尝试缓存读取**：系统首先尝试从Redis读取
3. **缓存未命中**：基础信息和库存都不在缓存中（首次查询）
4. **降级到数据库**：缓存未命中，从MySQL数据库查询
5. **数据库查询成功**：从数据库获取到图书信息
6. **写入缓存**：将查询结果写入Redis缓存，包括基础信息和库存
7. **缓存写入成功**：数据已缓存，下次查询可以直接从缓存读取
8. **查询完成**：返回结果

**关键特征**：
- ⚠️ 出现"缓存未命中"标记
- 包含"从MySQL数据库查询"日志
- 包含"写入Redis缓存"相关日志
- 包含TTL（过期时间）信息

---

## 三、场景二：后续读写（缓存命中）

### 3.1 再次查询相同图书

**操作**：在缓存TTL时间内，再次查询同一个图书ID

**日志输出示例**：
```
[ItemDao] ========== 开始查询图书 ========== - itemId: book000000001
[ItemDao] 步骤1: 尝试从Redis缓存读取 - itemId: book000000001
[Redis读取] 尝试从缓存获取完整图书信息 - itemId: book000000001
[Redis读取] 尝试读取图书基础信息 - key: book:info:book000000001, itemId: book000000001
[Redis读取] ✅ 缓存命中（基础信息） - key: book:info:book000000001, itemId: book000000001, 字段数: 8
[Redis读取] 尝试读取图书库存 - key: book:stock:book000000001, itemId: book000000001
[Redis读取] ✅ 缓存命中（库存） - key: book:stock:book000000001, itemId: book000000001, stock: 100
[Redis读取] ✅ 从缓存构建完整图书信息成功 - itemId: book000000001, 书名: Java编程思想, 库存: 100
[ItemDao] ✅ 缓存命中！从Redis缓存获取图书成功 - itemId: book000000001, 书名: Java编程思想, 库存: 100
[ItemDao] ========== 查询完成（缓存） ==========
```

**日志解释**：
1. **开始查询**：开始查询流程
2. **尝试缓存读取**：首先尝试从Redis读取
3. **缓存命中**：✅ 基础信息和库存都命中缓存
4. **构建完整信息**：从缓存中组装完整的图书对象
5. **查询完成**：直接从缓存返回，无需查询数据库

**关键特征**：
- ✅ 出现"缓存命中"标记
- 不包含"从MySQL数据库查询"日志
- 不包含"写入Redis缓存"日志
- 查询速度更快（无需访问数据库）

### 3.2 更新图书信息

**操作**：修改图书信息（如更新价格、库存等）

**日志输出示例**：
```
[ItemDao] ========== 开始保存/更新图书 ========== - itemId: book000000001
[ItemDao] 步骤1: 保存到MySQL数据库 - itemId: book000000001
[ItemDao] ✅ 保存图书到数据库成功 - itemId: book000000001, 书名: Java编程思想, 库存: 95
[ItemDao] 步骤2: 同步更新Redis缓存 - itemId: book000000001
[Redis写入] 开始写入完整图书信息 - itemId: book000000001
[Redis写入] 尝试写入图书基础信息 - key: book:info:book000000001, itemId: book000000001
[Redis写入] ✅ 写入图书基础信息到缓存成功 - key: book:info:book000000001, itemId: book000000001, TTL: 3600秒, 字段数: 8
[Redis写入] 尝试写入图书库存 - key: book:stock:book000000001, itemId: book000000001, stock: 95
[Redis写入] ✅ 写入图书库存到缓存成功 - key: book:stock:book000000001, itemId: book000000001, stock: 95, TTL: 1800秒
[Redis写入] ✅ 写入完整图书信息到缓存成功 - itemId: book000000001, 书名: Java编程思想, 库存: 95
[ItemDao] 步骤3: 删除图书列表缓存（因为列表可能已变化）
[Redis删除] 尝试删除图书列表缓存 - key: book:list:all
[Redis删除] ✅ 删除图书列表缓存成功 - key: book:list:all, 删除结果: true
[ItemDao] ✅ Redis缓存更新完成 - itemId: book000000001
[ItemDao] ========== 保存/更新完成 ==========
```

**日志解释**：
1. **开始保存**：开始保存/更新流程
2. **保存到数据库**：首先更新MySQL数据库
3. **同步更新缓存**：同时更新Redis缓存，保证数据一致性
4. **写入缓存成功**：基础信息和库存都更新到缓存
5. **删除列表缓存**：因为图书信息可能影响列表，删除列表缓存
6. **更新完成**：数据库和缓存都已更新

**关键特征**：
- 先写数据库，后写缓存（Write-Through模式）
- 同时更新基础信息和库存
- 删除相关列表缓存，保证一致性

---

## 四、场景三：创建订单（库存原子更新）

### 4.1 创建订单时的库存更新

**操作**：用户创建订单，库存减少

**日志输出示例**：
```
[OrderService] ========== 开始更新图书库存 ========== - itemId: book000000001, 订单: 1234567890
[OrderService] 库存变更详情 - itemId: book000000001, 书名: Java编程思想, 旧库存: 100, 减少: 2, 新库存: 98
[OrderService] 步骤1: 更新MySQL数据库中的库存
[ItemDao] ========== 开始保存/更新图书 ========== - itemId: book000000001
[ItemDao] 步骤1: 保存到MySQL数据库 - itemId: book000000001
[ItemDao] ✅ 保存图书到数据库成功 - itemId: book000000001, 书名: Java编程思想, 库存: 98
[ItemDao] 步骤2: 同步更新Redis缓存 - itemId: book000000001
[Redis写入] ✅ 写入完整图书信息到缓存成功 - itemId: book000000001, 书名: Java编程思想, 库存: 98
[ItemDao] ✅ Redis缓存更新完成 - itemId: book000000001
[OrderService] ✅ MySQL数据库库存更新成功 - itemId: book000000001, 新库存: 98
[OrderService] 步骤2: 原子更新Redis缓存中的库存
[Redis更新] 尝试更新图书库存（原子操作） - key: book:stock:book000000001, itemId: book000000001, delta: -2
[Redis更新] ✅ 更新图书库存成功（原子操作） - key: book:stock:book000000001, itemId: book000000001, delta: -2, newStock: 96
[OrderService] ✅ Redis缓存库存更新成功（原子操作） - itemId: book000000001
[OrderService] ========== 库存更新完成 ==========
```

**日志解释**：
1. **开始更新库存**：订单创建时开始更新库存
2. **库存变更详情**：显示旧库存、减少数量、新库存
3. **更新数据库**：首先更新MySQL数据库
4. **同步更新缓存**：通过ItemDao.save()同步更新缓存
5. **原子更新缓存**：使用Redis的INCR命令原子更新库存（防止并发问题）
6. **更新完成**：数据库和缓存都已更新

**关键特征**：
- 显示库存变更详情（旧库存 → 新库存）
- 双重更新：通过save()更新 + 原子操作更新（确保一致性）
- 原子操作保证并发安全

---

## 五、场景四：Redis宕机（降级处理）

### 5.1 Redis关闭后的查询操作

**操作**：关闭Redis服务器后，查询图书信息

**日志输出示例**：
```
[ItemDao] ========== 开始查询图书 ========== - itemId: book000000001
[ItemDao] 步骤1: 尝试从Redis缓存读取 - itemId: book000000001
[Redis读取] 尝试从缓存获取完整图书信息 - itemId: book000000001
[Redis读取] 尝试读取图书基础信息 - key: book:info:book000000001, itemId: book000000001
[Redis] RedisTemplate未初始化，Redis不可用
[Redis读取] ❌ Redis不可用，跳过库存缓存读取 - itemId: book000000001
[Redis读取] ⚠️ 缓存不完整，无法构建完整图书信息 - itemId: book000000001 (info: false, stock: false)
[ItemDao] ⚠️ 缓存未命中，降级到数据库查询 - itemId: book000000001
[ItemDao] 步骤2: 从MySQL数据库查询 - itemId: book000000001
[ItemDao] ✅ 从数据库查询图书成功 - itemId: book000000001, 书名: Java编程思想, 库存: 98
[ItemDao] 步骤3: 将数据写入Redis缓存 - itemId: book000000001
[Redis写入] 开始写入完整图书信息 - itemId: book000000001
[Redis] RedisTemplate未初始化，Redis不可用
[Redis写入] ❌ Redis不可用，跳过基础信息缓存写入 - itemId: book000000001
[Redis写入] ❌ Redis不可用，跳过库存缓存写入 - itemId: book000000001
[ItemDao] ✅ 数据已写入缓存，下次查询将命中缓存 - itemId: book000000001
[ItemDao] ========== 查询完成（数据库） ==========
```

**日志解释**：
1. **尝试读取缓存**：系统仍然尝试从Redis读取
2. **Redis不可用**：❌ 检测到Redis连接失败
3. **自动降级**：跳过缓存操作，直接查询数据库
4. **数据库查询成功**：从MySQL数据库获取数据
5. **尝试写入缓存**：尝试写入缓存但失败（Redis不可用）
6. **系统继续运行**：尽管缓存失败，但查询成功返回

**关键特征**：
- ❌ 出现"Redis不可用"警告
- 系统自动降级到数据库
- 不影响业务功能，系统继续正常运行
- 所有Redis操作都被跳过，但不会抛出异常

### 5.2 Redis关闭后的写操作

**操作**：关闭Redis服务器后，更新图书信息

**日志输出示例**：
```
[ItemDao] ========== 开始保存/更新图书 ========== - itemId: book000000001
[ItemDao] 步骤1: 保存到MySQL数据库 - itemId: book000000001
[ItemDao] ✅ 保存图书到数据库成功 - itemId: book000000001, 书名: Java编程思想, 库存: 95
[ItemDao] 步骤2: 同步更新Redis缓存 - itemId: book000000001
[Redis写入] 开始写入完整图书信息 - itemId: book000000001
[Redis] RedisTemplate未初始化，Redis不可用
[Redis写入] ❌ Redis不可用，跳过基础信息缓存写入 - itemId: book000000001
[Redis写入] ❌ Redis不可用，跳过库存缓存写入 - itemId: book000000001
[ItemDao] 步骤3: 删除图书列表缓存（因为列表可能已变化）
[ItemDao] ✅ Redis缓存更新完成 - itemId: book000000001
[ItemDao] ========== 保存/更新完成 ==========
```

**日志解释**：
1. **保存到数据库**：成功保存到MySQL
2. **尝试更新缓存**：尝试更新Redis缓存
3. **Redis不可用**：❌ 缓存更新失败，但记录警告
4. **继续执行**：系统继续运行，数据库更新成功
5. **功能正常**：写操作成功，只是缓存未更新

**关键特征**：
- 数据库操作成功
- Redis操作失败但不影响业务流程
- 系统自动降级，保证高可用性

### 5.3 Redis恢复后的操作

**操作**：重新启动Redis后，查询图书

**日志输出示例**：
```
========== 开始初始化Redis配置 ==========
Redis连接工厂类型: org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory
✅ Redis连接测试成功 - 服务器正常运行
✅ Redis配置初始化完成 - 序列化器配置成功
========== Redis配置初始化结束 ==========

[ItemDao] ========== 开始查询图书 ========== - itemId: book000000001
[Redis读取] 尝试读取图书基础信息 - key: book:info:book000000001, itemId: book000000001
[Redis读取] ⚠️ 缓存未命中（基础信息） - key: book:info:book000000001, itemId: book000000001
[ItemDao] ⚠️ 缓存未命中，降级到数据库查询 - itemId: book000000001
[ItemDao] ✅ 从数据库查询图书成功 - itemId: book000000001, 书名: Java编程思想, 库存: 95
[Redis写入] ✅ 写入完整图书信息到缓存成功 - itemId: book000000001, 书名: Java编程思想, 库存: 95
[ItemDao] ✅ 数据已写入缓存，下次查询将命中缓存 - itemId: book000000001
```

**日志解释**：
1. **Redis重新连接**：应用启动时检测到Redis可用
2. **缓存已清空**：Redis重启后缓存数据丢失
3. **降级到数据库**：缓存未命中，从数据库读取
4. **重新写入缓存**：查询后重新写入缓存

**关键特征**：
- Redis连接恢复日志
- 缓存数据需要重新加载
- 系统自动恢复缓存功能

---

## 六、日志总结

### 6.1 日志级别说明

- **INFO**：正常的业务操作和缓存操作（命中、写入、更新成功）
- **DEBUG**：详细的步骤信息（可选，用于调试）
- **WARN**：警告信息（Redis不可用、缓存未命中）
- **ERROR**：错误信息（Redis操作异常，但不影响业务）

### 6.2 日志识别要点

1. **首次读写**：
   - 查找"缓存未命中"
   - 查找"从MySQL数据库查询"
   - 查找"写入Redis缓存"

2. **后续读写（缓存命中）**：
   - 查找"缓存命中"
   - 不包含数据库查询日志
   - 查询速度更快

3. **Redis宕机**：
   - 查找"Redis不可用"
   - 查找"降级到数据库"
   - 系统继续正常运行

4. **库存更新**：
   - 查找"原子操作"
   - 查找库存变更详情
   - 查找双重更新日志

### 6.3 日志输出位置

- **控制台输出**：IDE的控制台窗口
- **日志文件**：如果配置了日志文件，也会写入文件
- **日志格式**：`时间戳 [日志级别] [日志标记] 日志内容`

### 6.4 测试建议

在进行测试时，建议：

1. **首次查询**：查询一个从未查询过的图书，观察缓存未命中→数据库查询→缓存写入的完整流程
2. **再次查询**：立即查询相同图书，观察缓存命中，验证缓存效果
3. **关闭Redis**：关闭Redis服务器，查询和更新图书，观察降级处理
4. **重启Redis**：重启Redis，再次查询，观察缓存重新加载

通过这些日志，可以清晰地看到Redis缓存的工作状态和系统的高可用性保证。

