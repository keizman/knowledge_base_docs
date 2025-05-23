

### 通常运营商屏蔽的原因是什么, 屏蔽的手段是什么

https://www.perplexity.ai/search/bang-wo-zhao-yi-xia-mu-qian-de-Z7F7XJDKQpOmlx8npdJcbg

原因通常为
1.国家要求
2.涉及非法, 涉毒, 诈骗等
3.**网络管理和带宽保护**, 高峰期防止过载
4**商业利益**：运营商可能屏蔽或限制竞争对手的网站（如某些流媒体服务），以优先推广自己或合作伙伴的服务
5.**许可协议**：由于与内容提供商的许可协议，运营商可能需要屏蔽特定网站或服务，例如流媒体平台在某些地区的独家内容限制[6](https://clearvpn.com/blog/how-to-remove-isp-blocking/)



## 运营商屏蔽的常见手段
- **防火墙**：防止指定 IP 被访问

- **DNS过滤**：DNS不会返回真实的IP地址，而是返回一个无效地址或空白页面
    
- **深度数据包检测（DPI）**：DPI允许运营商分析用户的网络流量，查看用户请求访问的网站名称。通过这种方式，运营商可以设置防火墙或DNS过滤来管理和控制流量，屏蔽特定内容[1](https://veepn.com/blog/how-isps-block-websites/)[2](https://www.goclickchina.com/blog/internet-censorship-technologies-used-to-block-content/)[5](https://surfshark.com/blog/how-do-isps-block-sites)。
    
- **IP和协议屏蔽**：运营商可能直接屏蔽特定网站的IP地址或协议，阻止用户访问目标内容。如果某个IP或域名在黑名单中，用户将无法连接[2](https://www.goclickchina.com/blog/internet-censorship-technologies-used-to-block-content/)[4](https://townsendcenter.berkeley.edu/blog/internet-censorship-part-2-technology-information-control)。
    
- **URL屏蔽**：用户即使能访问域名，也无法打开特定页面
    
- **流量整形**：运营商通过流量整形技术延迟对某些网站的访问速度，给用户造成网站缓慢或不可靠的错觉，这种方法有时用于限制点对点文件共享网络（如BitTorrent）[4](https://townsendcenter.berkeley.edu/blog/internet-censorship-part-2-technology-information-control)。
    
- **端口屏蔽**：运营商可能屏蔽特定端口号，限制访问某些服务（如网页或电子邮件），这种方式常见于企业限制员工行为[4](https://townsendcenter.berkeley.edu/blog/internet-censorship-part-2-technology-information-control)。
    
- **带宽节流**：运营商可能故意降低用户对特定网站或服务的连接速度，干扰用户体验




以下是关于全球性视频提供应用以及其他行业如何解决运营商屏蔽问题、并快速发现屏蔽情况的分析和方法总结。内容基于提供的搜索结果，并结合相关技术实践进行补充说明。












## 什么是DNS over HTTPS（DoH）？
通过 https 流量进行 DNS 解析, 
传统 DNS 明文方式容易篡改DoH有效防止中间人攻击（MITM）、DNS劫持和DNS欺骗等安全威胁
### **DoH的局限性**
- **SNI阻断**：即使DNS查询被加密，在TLS握手阶段，客户端仍需明文发送目标域名（通过SNI字段，即Server Name Indication），审查系统可以通过识别SNI字段阻断连接[6](https://blog.csdn.net/weixin_44231059/article/details/146279373)[12](https://www.v2ex.com/t/759666)。

- **性能影响**：由于加密和HTTP协议的开销，DoH的解析速度可能略慢于传统的UDP-based DNS查询（如端口53），尽管实际影响因服务器位置和缓存机制而异[9](https://blog.tsinbei.com/archives/1844/)[15](https://www.logcg.com/archives/3127.html)。


### 动态域名下发


### PCDN



## VPN protocol

### SS

### trojan
### hysteria2




### VPN  rule
