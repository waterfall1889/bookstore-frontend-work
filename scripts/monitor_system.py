"""
InfluxDB系统监控脚本
用于监控笔记本电脑的CPU、内存、磁盘和网络状态
"""

import time
import psutil
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS

# ==================== 配置区域 ====================
# 请根据你的实际情况修改以下配置

# InfluxDB Cloud配置（如果使用Cloud）
USE_CLOUD = True  # 如果使用本地InfluxDB，改为False

if USE_CLOUD:
    # InfluxDB Cloud配置
    url = "https://us-east-1-1.aws.cloud2.influxdata.com"  # 根据你的区域修改
    # 常见区域URL：
    # 美国东部: https://us-east-1-1.aws.cloud2.influxdata.com
    # 美国西部: https://us-west-2-1.aws.cloud2.influxdata.com
    # 欧洲: https://eu-central-1-1.aws.cloud2.influxdata.com
    token = "YOUR_TOKEN"  # 替换为你的Token
    org = "YOUR_ORG_NAME"  # 替换为你的组织名称
    bucket = "my-bucket"  # 替换为你的存储桶名称
else:
    # 本地InfluxDB配置
    url = "http://localhost:8086"
    token = "YOUR_TOKEN"  # 替换为你的Token
    org = "my-org"  # 替换为你的组织名称
    bucket = "my-bucket"  # 替换为你的存储桶名称

# 监控间隔（秒）
INTERVAL = 5

# 主机名称（用于标识不同的设备）
HOST_NAME = "my-laptop"
# ================================================


def collect_system_metrics():
    """收集系统指标"""
    try:
        # CPU使用率
        cpu_percent = psutil.cpu_percent(interval=1)
        cpu_count = psutil.cpu_count()
        cpu_per_core = psutil.cpu_percent(interval=1, percpu=True)
        
        # 内存使用情况
        memory = psutil.virtual_memory()
        memory_percent = memory.percent
        memory_used_gb = memory.used / (1024**3)
        memory_total_gb = memory.total / (1024**3)
        memory_available_gb = memory.available / (1024**3)
        
        # 磁盘使用情况（C盘）
        try:
            disk = psutil.disk_usage('C:\\')
        except:
            # 如果C盘不可访问，尝试根目录
            disk = psutil.disk_usage('/')
        disk_percent = disk.percent
        disk_used_gb = disk.used / (1024**3)
        disk_total_gb = disk.total / (1024**3)
        disk_free_gb = disk.free / (1024**3)
        
        # 网络IO
        net_io = psutil.net_io_counters()
        bytes_sent = net_io.bytes_sent
        bytes_recv = net_io.bytes_recv
        packets_sent = net_io.packets_sent
        packets_recv = net_io.packets_recv
        
        # 磁盘IO
        try:
            disk_io = psutil.disk_io_counters()
            disk_read_bytes = disk_io.read_bytes if disk_io else 0
            disk_write_bytes = disk_io.write_bytes if disk_io else 0
        except:
            disk_read_bytes = 0
            disk_write_bytes = 0
        
        # 创建数据点
        point = Point("system_metrics") \
            .tag("host", HOST_NAME) \
            .field("cpu_percent", cpu_percent) \
            .field("cpu_count", cpu_count) \
            .field("memory_percent", memory_percent) \
            .field("memory_used_gb", round(memory_used_gb, 2)) \
            .field("memory_total_gb", round(memory_total_gb, 2)) \
            .field("memory_available_gb", round(memory_available_gb, 2)) \
            .field("disk_percent", disk_percent) \
            .field("disk_used_gb", round(disk_used_gb, 2)) \
            .field("disk_total_gb", round(disk_total_gb, 2)) \
            .field("disk_free_gb", round(disk_free_gb, 2)) \
            .field("network_bytes_sent", bytes_sent) \
            .field("network_bytes_recv", bytes_recv) \
            .field("network_packets_sent", packets_sent) \
            .field("network_packets_recv", packets_recv) \
            .field("disk_read_bytes", disk_read_bytes) \
            .field("disk_write_bytes", disk_write_bytes)
        
        return point, {
            'cpu_percent': cpu_percent,
            'memory_percent': memory_percent,
            'disk_percent': disk_percent,
            'memory_used_gb': memory_used_gb,
            'memory_total_gb': memory_total_gb
        }
    except Exception as e:
        print(f"收集指标时出错: {e}")
        return None, None


def main():
    print("=" * 60)
    print("InfluxDB系统监控脚本")
    print("=" * 60)
    print(f"连接地址: {url}")
    print(f"组织: {org}")
    print(f"存储桶: {bucket}")
    print(f"监控间隔: {INTERVAL}秒")
    print(f"主机名称: {HOST_NAME}")
    print("=" * 60)
    print("\n开始监控系统状态...")
    print("按 Ctrl+C 停止监控\n")
    
    # 创建InfluxDB客户端
    try:
        client = InfluxDBClient(url=url, token=token, org=org)
        write_api = client.write_api(write_options=SYNCHRONOUS)
        print("✅ 成功连接到InfluxDB\n")
    except Exception as e:
        print(f"❌ 连接InfluxDB失败: {e}")
        print("\n请检查配置：")
        print("1. URL是否正确")
        print("2. Token是否有效")
        print("3. 组织名称和存储桶名称是否正确")
        print("4. 网络连接是否正常")
        return
    
    try:
        count = 0
        while True:
            # 收集指标
            point, metrics = collect_system_metrics()
            
            if point and metrics:
                try:
                    # 写入InfluxDB
                    write_api.write(bucket=bucket, org=org, record=point)
                    count += 1
                    
                    # 打印当前状态
                    print(f"[{count}] {time.strftime('%Y-%m-%d %H:%M:%S')} | "
                          f"CPU: {metrics['cpu_percent']:5.1f}% | "
                          f"内存: {metrics['memory_percent']:5.1f}% "
                          f"({metrics['memory_used_gb']:.1f}/{metrics['memory_total_gb']:.1f}GB) | "
                          f"磁盘: {metrics['disk_percent']:5.1f}%")
                except Exception as e:
                    print(f"❌ 写入数据失败: {e}")
            
            # 等待指定间隔
            time.sleep(INTERVAL)
            
    except KeyboardInterrupt:
        print("\n\n监控已停止")
        print(f"共收集了 {count} 条数据")
    except Exception as e:
        print(f"\n❌ 发生错误: {e}")
    finally:
        try:
            client.close()
            print("已断开InfluxDB连接")
        except:
            pass


if __name__ == "__main__":
    main()

