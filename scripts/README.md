# InfluxDB系统监控脚本使用说明

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

或者直接安装：

```bash
pip install influxdb-client psutil
```

### 2. 配置脚本

编辑 `monitor_system.py`，修改配置区域：

```python
# InfluxDB Cloud配置
url = "https://us-east-1-1.aws.cloud2.influxdata.com"
token = "YOUR_TOKEN"  # 替换为你的Token
org = "YOUR_ORG_NAME"  # 替换为你的组织名称
bucket = "my-bucket"  # 替换为你的存储桶名称
```

### 3. 运行脚本

```bash
python monitor_system.py
```

### 4. 查看数据

1. 登录InfluxDB Cloud或本地InfluxDB
2. 进入Explore界面
3. 选择Bucket、Measurement和字段
4. 查看图表并截图

## 配置说明

### InfluxDB Cloud配置

1. 注册账号：https://cloud2.influxdata.com/signup
2. 创建Token：Data → Tokens → Generate API Token
3. 记录组织名称和存储桶名称

### 本地InfluxDB配置

1. 下载安装InfluxDB
2. 访问 http://localhost:8086 初始化
3. 创建Token并配置脚本

## 监控指标

脚本会收集以下指标：

- **CPU使用率**：CPU当前使用百分比
- **内存使用情况**：使用率、已用/总量（GB）
- **磁盘使用情况**：使用率、已用/总量（GB）
- **网络IO**：发送/接收的字节数和数据包数
- **磁盘IO**：读写字节数

## 注意事项

1. 确保Token有写入权限
2. 确保Bucket名称正确
3. 监控脚本需要持续运行才能收集数据
4. 建议至少运行5-10分钟以收集足够的数据用于分析

