

# Cursor
@recent change 1. 针对最近修改进行 review  2.针对最新修改进行
https://forum.cursor.com/t/unlimited-mcp-tools-break-the-40-tools-limit/78040


# Copilot

https://www.npmjs.com/package/copilot-api
https://github.com/sst/opencode
# Claude code


### command
```bash

wsl sudo su
claude --dangerously-skip-permissions #only not in root

```


## Claude code 双账号切换

```
同一台电脑使用不同CLaude账号的方法:
1.配置目录隔离
#账号1配置
export CLAUDE_CONFIG_DIR=~/.cLaude-account1
claude Login
#账号2配置
export CLAUDE_CONFIG_DIR=~/.cLaude-account2
claude Login

2.创建别名快速切换
#在~/.bashrc或~/.zshrc中添加
alias cLaude1= 'CLAUDE_CONFIG_DIR=~/.cLaude-account1 claude'
alias cLaude2= 'CLAUDE_CONFIG_DIR=~/.cLaude-account2 claude'


```

[src](https://x.com/BadUncleX/status/1941753662512198036)



## Claude code relay
以 api 的形式中转请求, 不再顾虑 claude code 客户端的网络环境, 只要配置好中转的即可使用

[src](https://github.com/Wei-Shaw/claude-relay-service)

使用
```
export ANTHROPIC_AUTH_TOKEN=sk_
export ANTHROPIC_BASE_URL=https://path/api/
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=8192
```
### Resolution

1.我的服务器在部署时使用 socks5 时, 向 claude auth 失败, 确认问题为使用 socks5 无法解析域名. 
```

curl -x socks5://use:passwd@ip:port https://google.com
# curl: (97) Can't complete SOCKS5 connection to google.com. (1)

curl -x socks5h://use:passwd@ip:port https://google.com
# 获取成功
```

