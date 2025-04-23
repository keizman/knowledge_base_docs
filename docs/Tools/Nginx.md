### Deploy

```
./configure \
    --prefix=/home/nginx/compile \
    --sbin-path=/home/nginx/compile/sbin/nginx \
    --conf-path=/home/nginx/compile/conf/nginx.conf \
    --error-log-path=/home/nginx/compile/logs/error.log \
    --http-log-path=/home/nginx/compile/logs/access.log \
    --pid-path=/home/nginx/compile/logs/nginx.pid \
    --lock-path=/home/nginx/compile/logs/nginx.lock \
    --http-client-body-temp-path=/home/nginx/compile/temp/client_body \
    --http-proxy-temp-path=/home/nginx/compile/temp/proxy \
    --http-fastcgi-temp-path=/home/nginx/compile/temp/fastcgi \
    --http-uwsgi-temp-path=/home/nginx/compile/temp/uwsgi \
    --http-scgi-temp-path=/home/nginx/compile/temp/scgi \
    --with-threads \
    --with-file-aio \
    --with-pcre \
    --with-http_ssl_module \
    --with-http_v2_module \
    --with-http_realip_module \
    --with-http_stub_status_module \
    --with-http_gzip_static_module \
    --with-stream \
    --with-stream_ssl_module \
    --with-stream_realip_module 
```

```
make -j $(nproc)
```





### Server name


### proxy_pass
