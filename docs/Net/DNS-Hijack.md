---
title: dns-hijack
---

## 背景介绍

### 问题描述
APK 原本采用三方库进行 HTTP 请求，现改为通过中间件代理请求，中间件开始校验 HTTPS 证书。

- **证书校验问题**：对于本地时间不准确的用户，采用全局使用从服务器同步的时间进行证书校验，而非用户系统时间
- **DNS解析问题**：中间件内置 DNS 为 `8.8.8.8` DOH/DOT，配置下发无法解决第一次访问问题

### 核心矛盾
- **前提条件**：进入内网 APK 后可拿到配置下发，但前提是成功进入内网
- **现状**：新版本无法进入内网（release版本）

### 什么是"进入内网"
以前 Android 设备通过以下方式进入内网：
1. 设置内网 DNS（wifi static ip）
2. 由 dnsmasq 充当内网 DNS 服务
3. 配置 APK 内置域名指向内网地址，达到访问内网资源的效果

### 版本差异
- **Release版本**：由于上述前提条件，无法进入内网
- **Debug版本**：中间件允许读取本地 hosts 文件域名映射，可访问已知域名，之后通过配置下发获取内网域名

## 解决方案探索

### 方案一：路由器硬件劫持

#### 实施方案
开发提出购买可 SSH 的路由器，在路由器上配置 iptables 劫持 DNS 请求，达到进入内网的效果。

#### 存在问题
- 测试人员需要通过 ADB 查看日志, 而不在同一网段无法使用 WiFi ADB - 引起诸多测试不便

### 方案二：Clash TUN 模式 DNS 劫持

#### 2.1 寻找现有APK方案
寻找是否有可进行 DNS 劫持的 APK - **无果**

#### 2.2 自研APK方案
尝试利用 LLM 自己编写 APK 进行 DNS 劫持，但遇到打包问题（可能是 Java 版本引起），最终未能解决

#### 2.3 Clash规则配置方案 ✅
想到 Clash 规则配置能力很强，实验是否能劫持 DNS 到指定的内网 DNS。

**实验结果**：成功实现劫持能力  
**注意事项**：遇到了 DNS 缓存问题，一直解析到线上地址，重启后正常

### 方案三：Windows 透明劫持（探索记录）

#### 3.1 方案设想
在 Windows 电脑上开启移动热点，让 Android 测试机连接。随后在 Windows 的网络适配器层面，将所有出站的 DNS 请求（目标端口 53，如发往 `8.8.8.8`）强制重定向到内部测试 DNS 服务器（如 `10.8.24.67`）。

#### 3.2 最终结果
**失败**。主要瓶颈在于 Windows 缺乏像 Linux `iptables` 那样强大且灵活的底层网络包修改工具, 也因为。

#### 3.3 尝试过的工具及失败原因
- **StreamDivert**：规则功能受限，无法实现精确的端口和目标地址匹配转发
- **netsh**：不支持 UDP 协议的端口转发，而 DNS 主要使用 UDP
- **Python (pydivert)**：可以成功拦截到数据包，但在修改数据包并重新注入时失败
- **Python (scapy)**：功能更侧重于网络嗅探和数据包构造重放，难以实现实时、透明的数据包修改
- **WinDivert: netfilter.exe**：驱动层面的工具，但未能找到稳定可靠的方案来拦截并即时修改数据包内容

## 实际应用中遇到的问题

### 问题一：中间件优先使用 DOH 解析

#### 问题描述
中间件优先使用 DOH 解析，意味着当域名在线上可解析时会使用线上服务器而不是内网。

#### 解决方案
- 屏蔽阿里 DNS 地址
- 其它地址国内不可访问无需屏蔽
- Clash 添加规则：`- IP-CIDR,223.5.5.5/32,REJECT`

#### 特性说明
- 中间件不是使用的 DNS 解析后的地址访问的，而是指定了 DNS 地址，利好配置
- 公司无 IPv6 地址，无需理会

### 问题二：ACE 服务的 DNS 解析绕过

#### 问题描述
劫持 DNS 后第二次进入 APK 进入到了线上，查看为使用了 ACE (p2p server) 进行 DNS 解析（ACE 复用的 ranger 机制）。

#### 解决方案
同样的劫持和屏蔽手段，使用 iptables 实现：

```bash
iptables -t nat -A OUTPUT -p udp -d 8.8.8.8 --dport 53 -j DNAT --to-destination 10.8.24.67:53
iptables -I OUTPUT -d 223.5.5.5 -j REJECT  # 禁用全部流量 tcp和udp
```

## Clash 配置文件示例

### 基础配置

```
# 混合代理端口，同时支持 HTTP 和 SOCKS5 协议。所有需要代理的软件都将流量指向这个端口。
mixed-port: 7890
allow-lan: true
bind-address: '*'
mode: rule
log-level: debug
ipv6: false

# TUN 模式可以接管系统所有 TCP/UDP 流量，实现类似 VPN 的效果，无需为每个应用单独设置代理。
tun:
  enable: true

  # system: 使用操作系统自带的网络协议栈，兼容性最好。
  # gvisor: 使用 Google 开发的用户态网络协议栈，在某些环境下可能性能更高，但兼容性稍差。
  # aries: 仅适用于 macOS。
  stack: system

  # DNS 劫持。将所有发送到 53 端口的 DNS 查询请求都强制由 Clash 的 DNS 服务器处理。
  # 'any:53' 表示劫持所有 IP 地址的 53 端口。这是实现透明代理的关键一步。
  dns-hijack:
    - any:53

  # 自动设置路由。Clash 会自动添加系统路由表规则，将所有流量（除局域网和特定目标外）指向 TUN 虚拟网卡。
  auto-route: true

  # 自动检测出口网络接口。Clash 会自动选择当前活跃的网络接口（如有线网卡、无线网卡）作为流量出口。
  auto-detect-interface: true


proxies:
  # 这是一个 Shadowsocks (ss) 节点的示例配置。
  - {"name":"USA-01", "type":"ss", "server":"test-server", "port":56051, "cipher":"chacha20-ietf-poly1305", "password":"123", "udp":true}


# 代理组用于将多个代理节点进行策略性组合，方便在不同节点间切换或实现自动选择。
proxy-groups:
  - name: "PROXY"
    type: select
    proxies:
      # "DIRECT" 是一个内置策略，表示直接连接，不使用任何代理。
      - "DIRECT"

dns:
  # 是否启用 Clash 内置的 DNS 服务器。
  enable: true

  # DNS 增强模式。这是处理 DNS 污染和实现分流的关键。
  # redir-host: [推荐] 兼容性模式。Clash 返回真实的 IP 地址，但会记录域名与 IP 的映射关系。
  # 当数据包经过时，Clash 会根据这个记录判断该连接的目标域名，然后应用规则。比 fake-ip 兼容性更好，但性能略低。
  # fake-ip: 高性能模式。Clash 会为所有 DNS 请求返回一个虚假的 IP 地址（通常在 198.18.0.0/16 网段），
  # 性能很高，但可能与某些软件或网络环境不兼容。
  enhanced-mode: redir-host

  # 上游 DNS 服务器。当 Clash 收到 DNS 查询时，会向这里的服务器请求解析。
  # 这里设置为局域网内的 DNS 服务器地址，可能是你的路由器或自建的 DNS 服务。
  nameserver:
    - 10.8.24.67 # 使用内网 dns server

  # fallback-nameserver: (已注释) 当主 DNS 解析结果受到污染时，会使用这里的服务器进行重试。通常设置为可靠的公共 DNS。
  # default-nameserver: (已注释) 用于解析 Clash 自身（如订阅更新、节点测速）和 DNS 服务器域名。应设置为不受污染的 DNS。

#------------------------------------------------#
#               分流规则 (Rules)                 #
#------------------------------------------------#
# 规则部分是 Clash 的核心，它决定了网络流量的走向。
# 规则从上到下依次匹配，一旦匹配成功，后续规则将不再执行。
rules:
  # 域名后缀规则。所有以 .fsecgnjhr.com 结尾的域名，都执行 DIRECT (直连) 策略。
  - DOMAIN-SUFFIX,fsecgnjhr.com,DIRECT
  - IP-CIDR,223.5.5.5/32,REJECT
  # 兜底规则。如果以上所有规则都未匹配成功，则执行此条规则。
  # MATCH 表示匹配所有剩余的流量。
  # PROXY 表示这些流量将走 "PROXY" 代理组的策略（即你在界面上选择的节点, 目前是依旧是DIRECT）。
  - MATCH,PROXY

```