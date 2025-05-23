---
slug: Prompt
---


### Prompt
创造力与限制
虽然给定明确的限制, 让LLM 能正确方向的内容, 但是这也会限制其创造力.
只有使用恰当的方法稍加引导才能即稳定又创造力, 限制多了未必是好事

还真是一门学问

```
工作缘故，最近撸了几个开源通用 Agent 的实现，我有个土到掉渣但又越来越真实的感受： 我们终究还是回到了九年义务教育的语文课。 这些项目一个特点：核心代码都不多，流程全在 prompt 里。 主打一个调模型就是在写作文，主旨要明确、逻辑得清楚、指令不能歧义、上下文还要铺垫得刚好。 这时候你会发现： 会说话、不等于会表达；会表达、不等于模型能听懂。 表达是门艺术，对现在的大部分程序员其实是一道坎，相关能力亟待加强，也很急迫。 未来的程序员，不能只会写代码， 还得能把脑子里的复杂意图，变成一段段模型能执行的自然语言。 看起来像开倒车，但其实是 AI 编程范式的升级。AI在帮助我们重新拾起语言的力量。 所以你看程序员卖课都在教coze，产品运营都在教cursor，一个道理。
https://x.com/frxiaobei/status/1925430457942122964
```



### Guidelines

1.`keyword`, not describe,
```
case: Docusaurus site, frequent blog updates, multi-language build. looking for:
1.Automation solutions to avoid the manual build/deploy cycle.  
2.recommendations beyond your current method.
```



## 1
### make
reformat this file, make it more visual, must be suit markdown grammer

reformat this file, make it more visual, must be suit markdown grammer, attention, only need work for content under `<start>`, 





### program

敢于尝试打破之前的设计

原则: 1.添加新功能时在多个关键节点添加日志输出, 方便遇到问题时定位当前状态  2.进行 edit 时不要未经允许删除注释内容 3.以最小的改动的方法添加feat