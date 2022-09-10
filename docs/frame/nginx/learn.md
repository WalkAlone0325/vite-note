[[toc]]

## 什么是 Nginx

> Nginx (engine x) 是一款轻量级的 Web 服务器 、反向代理服务器及电子邮件（IMAP/POP3）代理服务器。

## 反向代理

> 反向代理（Reverse Proxy）方式是指以代理服务器来接受 internet 上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给 internet 上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。

## 安装和使用

安装参考：[https://github.com/dunwu/nginx-tutorial/blob/master/docs/nginx-ops.md](https://github.com/dunwu/nginx-tutorial/blob/master/docs/nginx-ops.md)

使用方式：

```sh
nginx -s reopen #重启Nginx
nginx -s reload #重新加载Nginx配置文件，然后以优雅的方式重启Nginx
nginx -s stop #强制停止Nginx服务
nginx -s quit #优雅地停止Nginx服务（即处理完所有请求后再停止服务）
nginx -?,-h #打开帮助信息
nginx -v #显示版本信息并退出
nginx -V #显示版本和配置选项信息，然后退出
nginx -t #检测配置文件是否有语法错误，然后退出
nginx -T #检测配置文件是否有语法错误，转储并退出
nginx -q #在检测配置文件期间屏蔽非错误信息
nginx -p prefix #设置前缀路径(默认是:/usr/share/nginx/)nginx -c filename #设置配置文件(默认是:/etc/nginx/nginx.conf)
nginx -g directives #设置配置文件外的全局指令
killall nginx #杀死所有nginx进程
```

## Nginx 配置

### 全局块（events 之前）

>  主要设置一些影响 Nginx 服务器整体运行的配置指令，主要包括配置运行nginx服务器的用户（组），允许生成的 `worker_processes` 数，进程 pid 存放路径、日志存放路径和类型以及配置文件的引入等

```nginx
# 全局区 有一个工作子进程，一般设置为 CPU数 * 核数

# 运行用户
#user  nobody;
# 启动进程，通常设置成和CPU的数量相等
worker_processes  1;

# 全局错误日志
error_log  logs/error.log;
error_log  logs/error.log  notice;
error_log  logs/error.log  info;

# PID 文件，记录当前启动的Nginx的进程ID
pid        logs/nginx.pid;
```

### events 块

> 涉及的指令主要影响Nginx 服务器与用户的网络连接，常用的设置包括是否开启对多 `work_process` 下的网络连接进行序列化，是否允许同时接收多个网络连接，选取哪种事件驱动模型来处理连接请求，每个 word process 可以同时支持的最大连接数等。

```nginx
# 工作模式及连接数上限
events {
    # 一般是配置nginx进程和连接的特性
    # 如1个word能同时允许多少连接，一个子进程最大允许数 1024个连接
    # 单个后台worker process 进程的最大并发链接
    worker_connections  1024;
}
```

### http 块

> Nginx 服务器配置中最频繁的部分，代理、缓存和日志定义等绝大多数功能和第三方模块的配置都在这里。

```nginx
# 配置 http 服务器的配置段
# 设定 http 服务器，利用它的反向代理功能提供负载均衡支持
http {
    # 设定 mime 类型（邮件支持类型），类型由 mime.types 文件指定
    include       mime.types;
    default_type  application/octet-stream;

    # 设定日志
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    '$status $body_bytes_sent "$http_referer" '
    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    # sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件，对于普通应用，
    #必须设为 on,如果用来进行下载等应用磁盘IO重负载应用，可设置为 off，以平衡磁盘与网络I/O处理速度，降低系统的uptime.
    sendfile        on;
    #tcp_nopunginx     on;

    # 连接超时时间
    #keepalive_timeout  0;
    keepalive_timeout  65;

    # gzip 压缩开关
    #gzip  on;

    # 设定实际服务器列表
    upstream zp_server1 {
        server 127.0.0.1: 8089;
    }

    # 配置虚拟主机段
    # http 服务器
    server {
        # 监听 80 端口，80端口是知名端口号，用于http协议
        listen       80;
        # 定义使用 xx 访问
        server_name  localhost;

        # 编码格式
        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        # 定位，把特殊的路劲或文件再次定位
        location / {
            # 项目文件夹指向路径
            root   html;
            # 首页
            index  index.html index.htm;
            # 反向代理的路径（和upstream绑定），location 后面设置映射的路径
            proxy_pass http://zp_server1;

            #代理配置参数
            proxy_connect_timeout 180;
            proxy_send_timeout 180;
            proxy_read_timeout 180;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarder-For $remote_addr;
        }

        #静态文件，nginx自己处理
        location ~ ^/(images|javascript|js|css|flash|media|static)/ {
            root views;
            #过期30天，静态文件不怎么更新，过期可以设大一点，如果频繁更新，则可以设置得小一点。
            expires 30d;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        #错误处理页面（可选择性配置）
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #监听443端口。443为知名端口号，主要用于HTTPS协议
    #    listen       443 ssl;
    #定义使用www.xx.com访问
    #    server_name  localhost;

    #ssl证书文件位置(常见证书文件格式为：crt/pem)
    #    ssl_certificate      cert.pem;
    #ssl证书key位置
    #    ssl_certificate_key  cert.key;

    #ssl配置参数（选择性配置）
    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #数字签名，此处使用MD5
    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```
