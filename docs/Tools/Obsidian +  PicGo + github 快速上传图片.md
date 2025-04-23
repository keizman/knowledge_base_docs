用于存储图片, 选择 github 为存储方式


参照 选用 image auto upload 点赞数高, 根据[官方指导](https://github.com/renmu123/obsidian-image-auto-upload-plugin?tab=readme-ov-file), 在我的公网服务器配置 github 方式, 并以 Server 方式运行

1.安装 [piclist](https://github.com/Kuingsmile/PicList-Core)
```shell
npm install sharp
```

```
npm install piclist -g
```


2.配置, 生成 github token [参照](https://www.cnblogs.com/rainbow-1/p/17224212.html)
- 通过 `picgo set uploader` 生成文件, 按指导填入配置
- obsidian 下载 plugin 后配置 remote Server 地址, 如果有 -k 参数 则这样配置 `http://ip:36677/upload?key=key`


3.启动服务
```
picgo-server -p port -k key
```

#### 问题: 重复文件名称


```
picgo set buildin rename
{y}{m}{d}{h}{i}{s}_{uuid}
```


<!-- truncate -->

<!-- http://142.171.5.195:33915/upload?key= -->

<!-- 
```
{
  "picBed": {
    "uploader": "github",
    "current": "github",
    "smms": {
      "token": ""
    },
    "github": {
      "repo": "keizman/Storage_PicGo",
      "branch": "main",
      "token": "",
      "path": "img/",
      "customUrl": ""
    }
  },
  "picgoPlugins": {},
  "buildIn": {
    "rename": {
      "format": "{y}{m}{d}{h}{i}{s}_{uuid}",
      "enable": true
    }
  }
}

```

-->
