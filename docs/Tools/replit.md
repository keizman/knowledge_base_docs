# Replit SSH 配置指南

## 生成 SSH 密钥

在 PowerShell 中执行以下命令来生成新的 SSH 密钥：

```powershell
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\replit" -N '""'
```

## 查看公钥

查看生成的公钥内容（需要添加到 Replit）：

```powershell
type "$env:USERPROFILE\.ssh\replit.pub"
```

## 配置 windows SSH Config 文件

创建或修改 SSH 配置文件：

```powershell
touch "$env:USERPROFILE\.ssh\config"
notepad "$env:USERPROFILE\.ssh\config"
```

在配置文件中添加以下内容(replite 会提供)：

```
Host *.replit.dev
  Port 22
  IdentityFile C:\Users\your_user\.ssh\replit
```

> **注意**：请将 `your_user` 替换为你的实际用户名

## 问题解决

### VS Code SSH 连接问题

**问题描述**：当使用 VS Code 连接已配置好 SSH 密钥的 Replit 服务时，提示需要输入密码，但命令行却能直接连接。

**命令行连接示例**：
```powershell
ssh -i $env:USERPROFILE/.ssh/replit -p 22 spock.replit.dev
```

**原因**：VS Code 无法正确解析 PowerShell 环境变量 `$env:USERPROFILE`。

**解决方法**：在 SSH 配置文件中使用绝对路径替代环境变量：
```
Host *.replit.dev
  Port 22
  IdentityFile C:\Users\your_user\.ssh\replit
```




# replit 使用
部署服务后官方直接回映射到一个公网地址, 直接在网页访问即可
