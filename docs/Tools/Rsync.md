
[TOC]

经历过服务器无缘故停止运行, 数据无法恢复事件后, 意识到必需要做起数据备份,
之前使用的方式一直是 Linux 搭建 samba, windows 映射 Linux 的网络路径, 可以直接访问文件夹, 但最终数据还是只有 Linux的一份
目前考虑新方法必须做到
1.在 windows 上编辑内容
2.传输到 Linux 方便且快捷
3.对于一台新的 Linux 也能快速传输
4.满足上传需求(考虑到 Linux 如果未装 rz, sz命令, 且刚好不能使用 sftp)

---------------

尝试过 windows 共享文件夹, Linux 通过 mount 挂载该网络路径, 但因未知原因, 只要执行 Linux 就自动关闭
  
  而为了解决个人搭载路由时传输内网映射问题, 选用了 zerotier 进行内网映射, 只要安装该软件并加入网络就能在公网互通, 这样, 不仅能解决个人路由无法直连内网服务器进行传输, 如果遇到需要使用公网服务器时传输 tgz 软件包也可以直接上传/下载, 交付项目后卸载软件也很简单, 详情自行了解, 这里直说流程. 可以访问[官网](https://my.zerotier.com/), 或者[下载](https://www.zerotier.com/download/)其它版本

这次选用的软件叫做 `rsync`,windows 或 Linux 都可以使用.

在说到传输速度, 尝试过 1G 以上的文件传输, 在建立连接后速度达到 10M/s, 在只传送脚本文件的环境来讲已经足够使用.

最后. 并且该软件支持自动备份指定地址数据的功能, 但我并未研究, 考虑到目前使用方式已经足够应付服务器无故停止的问题

ps: 最终上传下载服务器是 client 端对 server 端, 本文并未搭建 Linux server 端

---------------
结构: 


安装部分: 

### linux 安装 zerotier (如果无需穿透则跳过)
(如果不需要解决内网穿透则无需安装)

`curl -s https://install.zerotier.com | sudo bash`
会自动安装, 完成后
`zerotier-cli join {自己的组织码}`
if 200 join OK


### 安装 rsync 软件(win server)

1. 前往[下载](https://www.jb51.net/softs/16780.html) server 安装包 (正常安装即可)

2. 打开安装目录的 conf 添加配置如下配置(下方中括号name 随意更改)

```
use chroot = false
strict modes = false
lock file = rsyncd.lock 
max connections = 50
port = 28950
pid = 0
uid = 0

log file = /cygdrive/d/application/ICW/rsyncd.log

[mount]
path = /cygdrive/d/mount
read only = no
read only = false
```

3.windows 搜索 services 打开, 找到 带 rync server 字样的服务, 右键启用

4.如果开启了防火墙，则防火墙规则中要添加Tcp端口 28950 允许通信

5.检查是否启用 
`netsta -aon | findstr 28950` 是否有回显
或者直接 `telnet localhost:port `
如果出现 "RSYNCD: 30.0" 即为启动成功, 有其它报错也无妨, 直接尝试远程同步文件

6.在Linux 执行同步命令, 如果找不到命令前往下一步

### 使用
下载
`rsync --port=28950 -avrzp --progress  root@172.27.1.100::mount/mount_121 ./`
(完全同步)
`rsync --port=28950 -avrzp --progress --delete  root@172.27.1.100::mount ./`
上传
`rsync --port=28950 -avrzp --progress  ./ root@172.27.1.100::mount/mount_121`
同步时排除某指定文件或目录
`rsync --port=28950 -avzp --progress --exclude={'ljy/stream/'} ./ljy 172.27.1.100::mount/mount_151/`
忽略存在的文件名, 只同步在目标地址中不存在的目录文件(当上条执行中断时)
`rsync --port=28950 -avzp --progress  --ignore-existing --exclude={'ljy/stream/'} ./ljy/  172.27.1.100::mount/mount_151/ljy`


`如果你不想设置密码则无需以下配置`
保证 .ps 文件 owner 为 SvcCWRSYNC
但需传输目录并未此操作, 可以传输




注意:
```
注意参数 --delete  , 会把与远程文件不一样的地方全部删除, 慎用
如果出现长时间无反应需检查 windows server 是否启动
上传报错(ERROR: module is read only) 需添加 read only 配置
mount 下没有 secrets file 配置, 就不需要 root@ 指向, 只需要 ip+地址就可以
不知道 read only 具体需要 no/false 所以都配
报错 gid 4294967295 (-1) is impossible to set on , 解决: 使用添加 --no-super
```
```
windows 误删 SvcCWRSYNC 用户, 解决: 
D:\application\ICW\bin\cygrunsrv.exe --install rsync --path D:\application\ICW\Bin\rsync --args "--daemon --no-detach --config=D:/application/ICW/rsyncd.conf" --desc "Rsync Server" 
net start rsync
net stop rsync
```



**参考以下**
https://zhuanlan.zhihu.com/p/51028756  cwRsync远程同步工具部署-win篇
https://www.cnblogs.com/crnet/p/14476794.html  cwRsync远程同步工具部署-比上篇详细-win篇-下载
https://www.cnblogs.com/llddhh/p/12853259.html Rsync服务常见问题及解决
https://www.ruanyifeng.com/blog/2020/08/rsync.html   rsync 命令教程

### 安装 linux rsync

目前新版本的 Linux一般自带 rsync. 
执行 rsync 有结果返回, 而不是找不到命令则无需安装
`yum install rsync -y `


如果想在手机上传日志文件, 这是 aarch64 cpu 架构手机导出的可执行文件, 前往[下载](http://175.178.236.127:59996/rsync)


备份 rsync 配置

```
use chroot = false
strict modes = false
lock file = rsyncd.lock 
max connections = 50
port = 28950
pid = 0
uid = 0
 

# log file = /cygdrive/f/RsyncLog/rsyncd.log
log file = /cygdrive/d/application/ICW/rsyncd.log

# Module definitions
# Remember cygwin naming conventions : c:\work becomes /cygdrive/c/work

[data_backup]
path = /cygdrive/d/application/ICW/dataBackup
auth users = dbbackuper
secrets file = /cygdrive/d/application/ICW/rsync_db.ps
read only = no
read only = false
#list = no
transfer logging = yes

[mount]
path = /cygdrive/d/mount
read only = no
read only = false


[share]
path = /cygdrive/d/share
read only = no
read only = false

```


