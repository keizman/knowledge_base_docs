---
title: About proxy
slug: clash-proxy
---

# clash
:::tip
clash relay 规则不支持 hysteria2
:::


### 透明代理

### socks5



# openclash




# 使用盒子当路由实现WIFI科学上网
什么是路由器?
路由器的主要功能是根据网络地址将数据包从源地址发送到目标地址，并决定数据包在网络中的最佳路径。它在互联网中起到关键的作用，使得数据能够在不同网络之间进行传输。
另外还有其它的一些部件构成了路由器，例如网络地址转换（NAT）、防火墙、无线局域网等。

什么是软路由?
软路由是利用通用计算机硬件和软件实现的路由功能。与传统的硬件路由器相比，软路由利用计算机的处理能力和灵活性，通过安装和配置特定的路由软件来实现路由功能。软路由可以运行在通用计算机、虚拟机或者云服务器上，通过网络接口卡（NIC）连接到网络，实现数据包的转发、路由表的管理和网络功能的定制。

### project
此配置采用了软路由的配置方法: 
**描述**
![](http://showdoc.cloudstream.com:4999/server/index.php?s=/api/attachment/visitFile/sign/d3a5cb190e7eda01a8fded255501ee09)

#### 部署
共两种部署方法
##### 一
所需设备: 路由 + 盒子 + 手机(上网节点)
1.保证盒子和手机处于同局域网.
2.通过 telnet 连接盒子, `添加 proxy.sh 文件并执行进行流量转发`
3.操作手机在 wifi 设置中将 gateway(网关)设置为盒子的 ip
`1.这种方法的前提是盒子上已经安装了clash或任意可翻墙软件, 推荐clash, 其它客户端未尝试过, 可在下方找到下载地址, 导入订阅, 打开使用即可.`

##### 二
一键部署的方式
1.所需设备相同
2.通过telnet 连接盒子, 执行命令
`wget http://192.168.1.153:59997/clash_server.tar.gz`
解压后启动 `nohup ./clash & `
3.操作手机在 wifi 设置中将 gateway(网关)设置为盒子的 ip
`这种不需要前提盒子中已安装科学上网的软件, 通过已压缩好的命令运行工作, 如果无法使用可在文末找到排错方法`


**注意事项**
`1.保证盒子可以科学上网, 否则整个规则不生效`
`2.代码部分 dev 是变量, 如果是网线连接应改为 eth0 如果是 wifi 改为 wlan0, 其它不用改`
`3.部分命令telnet连接才能使用, Android 手机必须root 才能使用`
`4. 第一种方式在盒子休眠后可能会关闭进程`



**部署建议:**
1.使用 wifi 的方式会提高延迟, 有线的方式有效提高速度
2.内部部署一台盒子公用
3.如果 wifi 所属路由器支持手动设置 DHCP 下发的网关地址, 设置后手机连接wifi将无需再次设置

![](http://showdoc.cloudstream.com:4999/server/index.php?s=/api/attachment/visitFile/sign/a8b9528d7369d17d97641a071422fcfe)

附 Android 版 clash 的下载地址: https://github.com/Kr328/ClashForAndroid/releases/download/v2.5.12/cfa-2.5.12-foss-universal-release.apk
参考发布者原文: https://unsafe.sh/go-157951.html









### 核心代码

**proxy.sh**
```
#!/system/bin/sh

#exec 1>>log.txt 2>&1

tun='tun0' #虚拟接口名称
dev='wlan0' #物理接口名称，网线:wifi: eth0、wlan0
interval=5 #检测网络状态间隔(秒)
pref=18000 #路由策略优先级

# 开启IP转发功能
sysctl -w net.ipv4.ip_forward=1

# 清除filter表转发链规则
iptables -F FORWARD

# 添加NAT转换，部分第三方VPN需要此设置否则无法上网，若要关闭请注释掉
iptables -t nat -A POSTROUTING -o $tun -j MASQUERADE

# 添加路由策略
ip rule add from all table main pref $pref
ip rule add from all iif $dev table $tun pref $(expr $pref - 1)

contain="from all iif $dev lookup $tun"

while true ;do
    # 记录当前网络接口状态
    echo -e "[$(date "+%H:%M:%S")]Current network interfaces:"
    ip link show
    echo

    # 记录当前路由表
    echo -e "[$(date "+%H:%M:%S")]Current routing rules:"
    ip rule show
    echo

    if [[ $(ip rule) != *$contain* ]]; then
            if [[ $(ip ad|grep 'state UP') != *$dev* ]]; then
                echo -e "[$(date "+%H:%M:%S")]dev has been lost."
            else
                ip rule add from all iif $dev table $tun pref $(expr $pref - 1)
                echo -e "[$(date "+%H:%M:%S")]network changed, reset the routing policy."
            fi
    fi
    sleep $interval
done
```
赋予可执行权限：`chmod +x proxy.sh`

执行：`nohup ./proxy.sh &`

### 代码解释

这是一段 bash 脚本，主要用于设置 Linux 系统的网络路由和 IP 转发。该脚本的主要目的是在网络接口变化时自动更新路由规则，以保证 VPN 的正常工作。以下是各部分的具体解释：

脚本首先定义了一些变量，如虚拟接口名称（tun），物理接口名称（dev），检查网络状态的间隔（interval）和路由策略的优先级（pref）。

然后，脚本使用 sysctl 命令打开 IP 转发功能。IP 转发是让 Linux 系统能够将接收到的网络包转发给其他设备的功能。

接下来，脚本使用 iptables 命令清除 FORWARD 链中的所有规则，并添加一个新的 NAT (网络地址转换) 规则。这个 NAT 规则的作用是对通过 VPN 接口（tun）发出的所有包进行地址伪装（MASQUERADE），使得它们看起来都是从本机发出的。

然后，脚本使用 ip 命令添加两条新的路由规则。第一条规则是设置所有流量默认遵循主路由表（main）的路由策略，第二条规则是设置所有从物理接口（dev）发出的流量遵循 VPN 接口（tun）的路由策略。

最后，脚本进入一个无限循环，每隔一段时间（由 interval 变量控制）检查网络接口和路由规则的状态，并在需要时自动添加或更新路由规则。如果物理接口丢失（比如断网），脚本会记录一条错误信息。如果网络接口发生变化（比如从一个 WiFi 切换到另一个 WiFi），脚本会自动更新路由规则，使得所有流量都通过 VPN 接口（tun）发出。

注意，这个脚本需要 root 权限才能运行，因为更改系统设置、操作 iptables 和 ip 命令都需要 root 权限。







---

### 提供命令行一键部署
梳理过程: `getprop ro.product.cpu.abi` 查看 CPU 架构
挑选对应 clash 可执行文件: https://github.com/Dreamacro/clash/releases/tag/v1.15.1
因 android 端无 tun module, 无法开启 tun 模式. 失败
参考这里: https://github.com/juewuy/ShellClash/blob/master/scripts/start.sh#L795
只能使用普通的代理模式, 命令行相关配置: 
下载包: http://175.178.236.127:59996/clash/
启动:  `./clash-linux-armv7  -d ./`
设置默认代理: 
```
export all_proxy=http://127.0.0.1:7890
export ALL_PROXY=$all_proxy
```
多版本: https://github.com/Dreamacro/clash/wiki/
这里下载到了支持 tun 的clash执行文件, 但是最终卡在流量无法转发上.

---
最终复盘可能因为 conf 文件配置错误原因.
参考[这个文档](https://gist.github.com/w1ndy/d9a99b5b9d9aa83cb6482f32864f1776)里的配置成功解决.
整合成压缩包后: 
wget http://192.168.1.153:59997/clash_server.tar.gz
解压后启动 `nohup ./clash & `
之后设置网关即可连接

#### 排错:
1.getprop ro.product.cpu.abi = armeabi-v7a, 使用的是特定版本的 clash 可执行文件, 如 CPU 架构不同, 前往[这里](https://github.com/Dreamacro/clash/releases/tag/premium)下载对应版本的执行文件, 重命名为 clash-linux-armv7

2.ipv6 转发未尝试, 不确认是否支持

3.conf.yaml 是订阅文件, 检查该订阅能否使用, [这里](https://github.com/fengkx/clash-subscription-updater )是一个 clash 单独的订阅模块

4.默认无环境变量, 也就是在命令行终端使用的不是7890的clash 监测端口, 调试请使用上方的 export 设置为 7890 端口.

5.Cannot find device "utun", 可能是配置文件有误, 未启动成功. 检查 config.yaml 文件. 单独启动.


----

#### unuseful
   sudo mkdir -p /dev/net
   sudo mknod /dev/net/tun c 10 200
   sudo chmod 0666 /dev/net/tun