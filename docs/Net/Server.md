

### certificate
```

#安装socat：
apt install socat

#安装acme：
curl https://get.acme.sh | sh

#添加软链接：
ln -s  /root/.acme.sh/acme.sh /usr/local/bin/acme.sh
#注册账号： 
acme.sh --register-account -m my@example.com
#开放80端口：
ufw allow 80
#申请证书： 
acme.sh  --issue -d 替换为你的域名  --standalone -k ec-256
#安装证书： 
acme.sh --installcert -d 替换为你的域名 --ecc  --key-file   /root/trojan/server.key   --fullchain-file /root/trojan/server.crt 

#如果默认CA无法颁发，则可以切换下列CA：
#切换 Let’s Encrypt：
acme.sh --set-default-ca --server letsencrypt
#切换 Buypass：
acme.sh --set-default-ca --server buypass
#切换 ZeroSSL：
acme.sh --set-default-ca --server zerossl
```





```
# vim /etc/sysctl.conf, 加入以下内容，重启生效
fs.file-max = 6553560

   
2.修改ulimit的open file，系统默认的ulimit对文件打开数量的限制是1024

# ulimit -HSn 102400  //这只是在当前终端有效，退出之后，open files又变为默认值。当然也可以写到/etc/profile中，因为每次登录终端时，都会自动执行/etc/profile
或
# vim /etc/security/limits.conf  //加入以下配置，重启即可生效
* soft nofile 65535 
* hard nofile 65535
```


```
ulimit -n 65535
```





证书申请
使用 DNS-01 质询模式和 Cloudflare (`dns_cf`) API。优点 无需让出 80 端口

1.获取 CF_TOKEN [参考这个](https://github.com/getsomecat/GetSomeCats/blob/Surge/acme.sh%E8%84%9A%E6%9C%AC%E4%BD%BF%E7%94%A8%E6%96%B0cloudflare%20api%E4%BB%A4%E7%89%8C%E7%94%B3%E8%AF%B7%E8%AF%81%E4%B9%A6.md)
2.CF_Account_ID 在 dash 主页面三个点点击后有 复制 account ID  选项, 

```
acme.sh --issue -d llmproai.xyz -d *.llmproai.xyz --dns dns_cf -k ec-256 --log ~/.acme.sh/acme.log 
```

执行申请
