

AWS Mail Console
https://us-west-1.console.aws.amazon.com/ses/home?region=us-west-1#/get-set-up


## resolution


使用 IP 无法启动服务, 即使 github app 设置的是, 看样子是 NEXTAUTH 导致, 只能使用域名方式

### send mail in queued status 
沙盒模式无法任意发送邮件

https://docs.aws.amazon.com/zh_cn/ses/latest/dg/request-production-access.html



unsend 文档

https://docs.unsend.dev/get-started/self-hosting#step-1-environment-variables



```

Like Unsend, both of these need AWS SES. If you want to send a real email to anyone, first you need to apply for **production environment permissions**. My application was rejected.

Besides the above, AWS requires you to be responsible for **email quality**, otherwise, they will terminate your account. And according to my research, there are also **sending frequency limits**, it's not unlimited.

Finally, server resources** are also an expense."
```

