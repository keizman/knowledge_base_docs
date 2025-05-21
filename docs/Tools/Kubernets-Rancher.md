

### Namespace 
访问 Kubernetes Pod 内的 `gslb-svc.control` 是通过 DNS 解析实现的, 因此对于任何内部程序都能正常访问


### Istio


### Ingress


### 测试环境 Rancher 不稳定, 经常出现重启后无法恢复, 配置丢失, 如何持久化配置


### Etcd


### 问题记录

####  Lua 后台服务通过 pod 内部地址访问其它服务 Host not found

nginx 配置
```
http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - [$time_local] $http_host \"$request\" $status $request_time \"$http_user_agent\"';
    access_log  logs/access.log  main;
    error_log   logs/error.log  notice;

    proxy_temp_path temp;
    scgi_temp_path temp;
    uwsgi_temp_path temp;
    fastcgi_temp_path temp;
    client_body_temp_path temp;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  15;

    

    lua_package_path 'lua/?.lua;;';
    
    lua_shared_dict shdict 1m;

    
    resolver local=on valid=180s;
    resolver_timeout 10s;

    server {}

```

抓包发现通过程序(图左)发出的 dns 多了一节 control 而 curl 发出请求(图右)没有这节 

![image.png](https://raw.githubusercontent.com/keizman/Storage_PicGo/main/img/250508103155_529cfdd2ef5148bd812d3bba7679bc94.png)

解决: 原先配置域名 `newgslb-svc.cdn-live` 更新为 `newgslb-svc.cdn-live.control.svc.cluster.local`

同事开发也怀疑 docker dns 问题, (为什么其它服务未出现? 只通过 ) 




抓包
tcpdump 在 `pod` 中未安装, 通过 安装 x86 binary / rpm 包方式无法安装, yum intall 也找不到包, 最后只能从 centos7 服务器上 cp 过去, 包括tcpdump 和依赖包. 主要包括 libpcap.so.1 和 libcrypto.so.10, 之后尝试启动若无法启动再追查

```
python3 -m http.server
```

查看依赖
```
ldd `which tcpdump` 
```