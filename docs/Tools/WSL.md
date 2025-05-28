
### 什么是 WSL:


### win 10 WSL 设置桥接(和 windows 同网段)

`WSL` 启动并进入 shell

`wsl --shutdown` 关机



配置文件 
```
C:\Users\{user}\.wslconfig

[wsl2]
vmSwitch=WSL
dhcp=true
memory=40GB 
```

```

PS C:\Users\keizman> Get-VMSwitch

Name           SwitchType NetAdapterInterfaceDescription
----           ---------- ------------------------------
WSL            External   Realtek PCIe GbE Family Controller
```

如何设置. 

`启动 hyper-v, 在 Virtual Switch manage, 注意, 实际网卡(Realtek PCIe GbE Family Controller) 只能绑定一个 VMSwitch 否则会报错`


设置静态 IP , 记得改成自己的网段
```
ip addr del $(ip addr show eth0 | grep 'inet\b' | awk '{print $2}' | head -n 1) dev eth0
ip addr add 192.168.8.66/24 broadcast 192.168.8.255 dev eth0
ip route add 0.0.0.0/0 via 192.168.8.1 dev eth0
```

配置 DNS: 
```
echo "nameserver 192.168.8.1" >  /etc/resolv.conf

```

#### reference
https://www.cnblogs.com/lic0914/p/17003251.html
https://www.cnblogs.com/cheyunhua/p/17577895.html
https://www.cnblogs.com/yjmyzz/p/wsl2-tutorial-1.html