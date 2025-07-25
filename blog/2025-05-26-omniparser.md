---
slug: omniparser
title: 安装 omniparser
authors:
  - Zard
tags:
  - AI
  - resolution
---

**微调步骤:** 
1.收集素材
2.生成为训练数据, 默认 `training_data`
3.校准 manual_correction.csv 为你希望的数据
4.通过脚本将校准数据应用到文件, 默认在 florence_data.json 
5.随机删除一部分旧数据, 保持比例在 20% 旧数据: 80% 新数据(手动修改的数据)
6.如果数据量太少, 希望进行数据增强, 参考 TRAINING_GUIDE 文件, 设置倍率进行增加多倍的数据
7.开始训练 florence2 模型吧. YOLO 目前使用的大概是 V11, 官方调教的还是比较好的, 目前看没有微调的必要, 努力的方向应该是把 PaddleOCR 和 YOLO detect 的合作关系搞好, 甚至在文本不多的情况关闭 PaddleOCR 获取更好的提取效果
微调的参数可以使用默认值, 数据量多的情况需要减少 lr, batch_size, 目前 22G 内存开 4 个batch 没压力, 感觉 24G 内存的可以从 8 个开试了


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


### finetune
YOLO and Florence2 model


#### florence2 


```
结论, 经过finetune 的 florence model 输出混乱

native
Element 60: {'type': 'icon', 'bbox': [0.9891748428344727, 0.05476871505379677, 1.0, 0.1757570505142212], 'interactivity': True, 'content': 'M0,0L9,0 4.5,5z', 'source': 'box_yolo_content_yolo'}
Element 61: {'type': 'icon', 'bbox': [0.0, 0.0, 0.035472117364406586, 0.02915557287633419], 'interactivity': True, 'content': 'P: 0:1', 'source': 'box_yolo_content_yolo'}
Element 62: {'type': 'icon', 'bbox': [0.9573381543159485, 0.6605868339538574, 0.9930025339126587, 0.727828323841095], 'interactivity': True, 'content': 'a tool for cutting or removing a slice of paper.', 'source': 'box_yolo_content_yolo'}

finetuned
Element 60: {'type': 'icon', 'bbox': [0.9891748428344727, 0.05476871505379677, 1.0, 0.1757570505142212], 'interactivity': True, 'content': "a black and white photo of a person's face", 'source': 'box_yolo_content_yolo'}
Element 61: {'type': 'icon', 'bbox': [0.0, 0.0, 0.035472117364406586, 0.02915557287633419], 'interactivity': True, 'content': 'a photo of a person with a camera in their hand', 'source': 'box_yolo_content_yolo'}
Element 62: {'type': 'icon', 'bbox': [0.9573381543159485, 0.6605868339538574, 0.9930025339126587, 0.727828323841095], 'interactivity': True, 'content': 'No object detected.', 'source': 'box_yolo_content_yolo'}

```

原因是保存的模型是 processor , 而不是 icon_captain model, 若要有效识别, 需要对比文件大小

参数 
lr=1e-7, epochs=7, lr=1e-5


问题2.
训练后发现结果依旧是旧的, 而不是手动修正后的结果, 
test: 坐标点不一致, 尝试重新生成数据后训练, , 将两者合并, 减少因为轻微的坐标点引起的变化导致的检测失败问题, 
已解决: 微调后的版本成功识别元素, 且未影响之前的数据
Old
```
Element 43: {'type': 'icon', 'bbox': [0.7441509366035461, 0.09064428508281708, 0.7809383273124695, 0.15792316198349], 'interactivity': True, 'content': 'Close', 'source': 'box_yolo_content_yolo'}
Element 44: {'type': 'icon', 'bbox': [0.8042857050895691, 0.08172448724508286, 0.8438908457756042, 0.16970133781433105], 'interactivity': True, 'content': 'Toggle', 'source': 'box_yolo_content_yolo'}
Element 45: {'type': 'icon', 'bbox': [0.9391891360282898, 0.07831234484910965, 0.9885223507881165, 0.1676449030637741], 'interactivity': True, 'content': 'Rounded rectangle', 'source': 'box_yolo_content_yolo'}
```

New
```
Element 43: {'type': 'icon', 'bbox': [0.7441509366035461, 0.09064428508281708, 0.7809383273124695, 0.15792316198349], 'interactivity': True, 'content': 'Close', 'source': 'box_yolo_content_yolo'}
Element 44: {'type': 'icon', 'bbox': [0.8042857050895691, 0.08172448724508286, 0.8438908457756042, 0.16970133781433105], 'interactivity': True, 'content': 'Share', 'source': 'box_yolo_content_yolo'}
Element 45: {'type': 'icon', 'bbox': [0.9391891360282898, 0.07831234484910965, 0.9885223507881165, 0.1676449030637741], 'interactivity': True, 'content': 'Screen cast', 'source': 'box_yolo_content_yolo'}
```







下一步计划:  
- 手动框选指定位置自动为 bbox, 生成 finetune dataset
- 支持对比评估 finetune 前后 model 输出, 确认其原始识别未受到影响

坑: 第一层的 PaddleOCR 抢走了一部分框, 导致轮不到 YOLO 识别. 需要解决 PaddleOCR 和 YOLO detect 之间的合作问题
下方是一个示例: password 被 PaddleOCR 识别后 YOLO 不会再处理, 就会导致有些不精准
![image.png](https://raw.githubusercontent.com/keizman/Storage_PicGo/main/img/250630095105_632e76df201b4432a04fea1cbd4c422b.png)


层冻结方法导致一部分旧数据识别异常



https://huggingface.co/blog/finetune-florence2

### quantization

```python
!pip install bitsandbytes
from transformers import BitsAndBytesConfig
quantization_config_4bit = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_compute_dtype=torch.bfloat16, bnb_4bit_use_double_quant=True)
model = AutoModelForCausalLM.from_pretrained(model_name_or_path, quantization_config=quantization_config_4bit, torch_dtype=torch.float16, trust_remote_code=True).to(device)
```

```
Traceback (most recent call last):
  File "/mnt/e/git/OmniParser/demo.py", line 178, in <module>
    main('imgs/vod_play_detail_full_screen.png')
  File "/mnt/e/git/OmniParser/demo.py", line 35, in main
    caption_model_processor = get_caption_model_processor(
                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/mnt/e/git/OmniParser/util/utils.py", line 82, in get_caption_model_processor
    model = AutoModelForCausalLM.from_pretrained(model_name_or_path, quantization_config=quantization_config_4bit, torch_dtype=torch.float16, trust_remote_code=True).to(device)         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/root/miniconda3/envs/omni/lib/python3.12/site-packages/transformers/models/auto/auto_factory.py", line 556, in from_pretrained
    return model_class.from_pretrained(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/root/miniconda3/envs/omni/lib/python3.12/site-packages/transformers/modeling_utils.py", line 3502, in from_pretrained
    ) = cls._load_pretrained_model(
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/root/miniconda3/envs/omni/lib/python3.12/site-packages/transformers/modeling_utils.py", line 3926, in _load_pretrained_model
    new_error_msgs, offload_index, state_dict_index = _load_state_dict_into_meta_model(
                                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/root/miniconda3/envs/omni/lib/python3.12/site-packages/transformers/modeling_utils.py", line 802, in _load_state_dict_into_meta_model
    or (not hf_quantizer.check_quantized_param(model, param, param_name, state_dict))            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/root/miniconda3/envs/omni/lib/python3.12/site-packages/transformers/quantizers/quantizer_bnb_4bit.py", line 124, in check_quantized_param
    if isinstance(module._parameters[tensor_name], bnb.nn.Params4bit):
                  ~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^
KeyError: 'final_logits_bias'
```
尝试升级到最新版本 `pip install --upgrade transformers` 解决问题, 但引入新问题, processor 需要使用低版本的 transformer, 这意味着无法量化



尝试升级一个版本
when upgrade to `transformers==4.39.0`, has these error 

```
ValueError: `.to` is not supported for `4-bit` or `8-bit` bitsandbytes models. Please use the model as it is, since the model has already been set to the correct devices and casted to the correct
  `dtype`.
```

```
RuntimeError: Input type (c10::Half) and bias type (float) should be the same
```

最终使用量化版本成功, 建议试用 8bit 量化, `4bit 识别成功率下降严重`



### 训练后保存 model 注意事项
`model.save_pretrained()` 会把 config 文件保存成 processor 的, 导致下次模型加载异常, 请对对比本地的 florence-2 config 和 save 的模型 config 文件, 将配置同步过去








### 解决 lora 方式微调后模型未记住训练数据(欠拟合)
- **策略1：** **暂时完全移除 Dropout 的干扰。**
- **具体操作：** 设置 `lora_dropout = 0`，其他参数（`r`, `lr`, `epochs`）保持不变，重新训练一次。

| 优先级   | 调整策略          | 目的                   | 具体操作建议                                                      |
| ----- | ------------- | -------------------- | ----------------------------------------------------------- |
| **1** | **移除正则化（诊断）** | 验证欠拟合的诊断，看模型能否“死记硬背” | `lora_dropout = 0`                                          |
| **2** | **增加模型容量**    | 直接提升LoRA的学习能力        | `r` 从 16 提升到 32 ( `lora_alpha` 相应提升到 64)                    |
| **3** | **增强训练强度**    | 让模型学得更快或学得更久         | `lr` 从 `5e-5` 提升到 `7e-5`，或 `epochs` 从 20 提升到 30             |
| **4** | **数据质量检查**    | 排除数据层面的干扰            | 人工或脚本检查是否存在“同图异标”的冲突数据(一个考虑方向, 不过目前是其输出是微调前的值, 所以不大可能是这个原因) |


**建议您按照这个优先级顺序，一次只调整一个核心变量来进行实验**，这样您就能清晰地看到每个调整带来的具体效果。从第一步开始，它将为您提供最有价值的反馈。

### update
尝试了 `lora_dropout = 0` 发现结果相同, 依旧那个图标没有成功识别, 其它正常识别, 怀疑数据问题, 尝试仅增加手动矫正的数据, 多些倍数, 应用阶段保留 50% , 增强阶段增加 4 倍. 最终比例大约为 8(矫正数据):2(原始数据)

发现 lora train 时 val dataset 直接从sample 的数据里分割出 20%, 可能时因为这样导致的 train data 缺失那个 icon 的资料而无法识别, 改进code: val dataset 打乱数据后随机选择---原因确认

目前尝试后确实 mutiplayer 为 5 或 4 效果最好, 某一组 loss 非常低, 且`Fold 3: 0.0488 (350 train, 48 val)` 经验证后也确实能识别所有标注的内容. 
