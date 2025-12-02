# 检查MCP服务器进程的PowerShell脚本

Write-Host "=== 检查MCP服务器进程 ===" -ForegroundColor Cyan
Write-Host ""

# 方法1: 检查所有Python进程的命令行（最准确）
Write-Host "方法1: 检查所有Python进程的命令行" -ForegroundColor Yellow
$pythonProcesses = Get-Process python -ErrorAction SilentlyContinue
$found = $false
if ($pythonProcesses) {
    foreach ($proc in $pythonProcesses) {
        try {
            $wmi = Get-WmiObject Win32_Process -Filter "ProcessId = $($proc.Id)"
            if ($wmi.CommandLine -like "*bookstore_mcp_server*") {
                Write-Host "✓ 找到MCP服务器进程!" -ForegroundColor Green
                Write-Host "  进程ID: $($proc.Id)" -ForegroundColor Gray
                Write-Host "  命令行: $($wmi.CommandLine)" -ForegroundColor Gray
                $found = $true
            }
        } catch {
            # 忽略权限错误
        }
    }
    if (-not $found) {
        Write-Host "✗ 没有找到MCP服务器进程" -ForegroundColor Red
    }
} else {
    Write-Host "✗ 没有找到Python进程" -ForegroundColor Red
}

Write-Host ""

# 方法2: 使用一行命令（推荐）
Write-Host "方法2: 一行命令检查（推荐）" -ForegroundColor Yellow
Write-Host "命令: Get-Process python -ErrorAction SilentlyContinue | ForEach-Object { Get-WmiObject Win32_Process -Filter `"ProcessId = `$(`$_.Id)`" } | Where-Object { `$_.CommandLine -like `"*bookstore_mcp_server*`" }" -ForegroundColor Gray
Write-Host ""

$result = Get-Process python -ErrorAction SilentlyContinue | ForEach-Object { 
    Get-WmiObject Win32_Process -Filter "ProcessId = $($_.Id)" -ErrorAction SilentlyContinue
} | Where-Object { $_.CommandLine -like "*bookstore_mcp_server*" }

if ($result) {
    Write-Host "✓ MCP服务器正在运行!" -ForegroundColor Green
    $result | ForEach-Object {
        Write-Host "  进程ID: $($_.ProcessId)" -ForegroundColor Gray
        Write-Host "  命令行: $($_.CommandLine)" -ForegroundColor Gray
    }
} else {
    Write-Host "✗ MCP服务器未运行" -ForegroundColor Red
}

Write-Host ""

# 方法3: 检查所有Python进程
Write-Host "方法3: 所有Python进程列表" -ForegroundColor Yellow
$pythonProcesses = Get-Process python -ErrorAction SilentlyContinue
if ($pythonProcesses) {
    Write-Host "找到 $($pythonProcesses.Count) 个Python进程:" -ForegroundColor Cyan
    foreach ($proc in $pythonProcesses) {
        try {
            $wmi = Get-WmiObject Win32_Process -Filter "ProcessId = $($proc.Id)" -ErrorAction SilentlyContinue
            $isMCP = if ($wmi.CommandLine -like "*bookstore_mcp_server*") { " [MCP服务器]" } else { "" }
            Write-Host "  进程ID: $($proc.Id), 路径: $($proc.Path)$isMCP" -ForegroundColor Gray
        } catch {
            Write-Host "  进程ID: $($proc.Id), 路径: $($proc.Path)" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "✗ 没有找到Python进程" -ForegroundColor Red
}

Write-Host ""

# 建议
Write-Host "=== 验证建议 ===" -ForegroundColor Cyan
Write-Host "即使找到了MCP进程，最可靠的验证方法还是功能测试：" -ForegroundColor Yellow
Write-Host "1. 在Cherry Studio中询问: '帮我找一本关于Java的书籍'" -ForegroundColor White
Write-Host "2. 如果AI返回数据库中的实际数据（包含价格、库存等），说明MCP正常工作" -ForegroundColor White
Write-Host "3. 如果AI只返回通用建议，说明MCP未正常工作" -ForegroundColor White
