### Post-Traing and frogetting(第六讲)
[video](https://www.youtube.com/watch?v=Z6b5-77EfGk&t=575s)  

[PPT ](https://docs.google.com/presentation/d/129jFUXCPekD2Qoaq6H0Ntasm0GUiK8_X/edit#slide=id.p5)
### 后训练后 safty alianment 和所学知识被遗忘如何解决, 如何进行Post-Traing

解决: 
1.训练数据掺杂 5% 的 训练数据, (a little bit Task 1 Training Data)

- 没有训练数据可以使用模型输出数据[参照 magpie](https://arxiv.org/abs/2406.08464)
	> 实际 real data 的数据依旧比  Self-generation 表现好

- 训练数据掺杂 3% 的 safty alianment 数据

[实验论文](https://arxiv.org/abs/1909.03329)

2.SSR: 新的训练数据让 foundation model 换句话说能取得更好的效果
- 使用 foundation model 自己的答案(如果是对的答案), 
- 如果 FM 过弱, 使用更好的 LLM 生成答案, 改掉错的答案, 但保持源格式
- 语音
  >  输入语音(token) 时传入文字: `语音 ,性别, 情绪`, 避免遗忘

### RL Based post-training(最后一个阶段)
其推测能防止遗忘

