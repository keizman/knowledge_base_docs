---
slug: omniparser
title: 安装 omniparser
authors:
  - Zard
tags:
  - AI
  - resolution
---



### 解决 flash_attn 安装慢, 安装后无法启动问题
[source](https://stackoverflow.com/questions/79179992/flash-attention-flash-attn-package-fails-to-build-wheel-in-google-colab-due-to)
```


pip install torch=='2.4.1+cu121' torchvision=='0.19.1+cu121' torchaudio=='2.4.1+cu121' --index-url https://download.pytorch.org/whl/cu121
pip install flash-attn --use-pep517 --no-build-isolation
# 回退后其它包也要回退版本
pip install numpy==2.1.1
pip install packaging==24
pip install pydantic==2.10.6
```






起初使用这种方式安装 flash_attn , 但启动依旧报错找不到包
```
wget https://github.com/Dao-AILab/flash-attention/releases/download/v2.6.3/flash_attn-2.6.3+cu123torch2.4cxx11abiFALSE-cp310-cp310-linux_x86_64.whl
pip install --no-dependencies --upgrade flash_attn-2.6.3+cu123torch2.4cxx11abiFALSE-cp310-cp310-linux_x86_64.whl
```