
概念:
PR 
分支(branch): 切换分支用作不同 feat, 或用以分离原始修改和自身修改, 方便合并到 master 同时保留两者. 比如: main, master, dev , alpha 等常用分支 name


### 操作端常用

#### 初始化

```
# 初始化文件夹(新家 .git 到执行目录)
git init
```



```
  
# 提交一笔新的, 完全与 HEAD 相反的提交, 来恢复修改  
git revert --no-edit HEAD  
```


### 合并分支


git merge origin/main

### 部署端常用


```
# 放弃一切并更新  
# 1. 从远程拉取所有最新数据  
git fetch origin  
  
# 2. 强制将本地分支重置为远程分支的状态  
git reset --hard origin/main

```



```
# 拉取最新提交, 将当前本地修改作为 HEAD
git pull --rebase
```


### 删除提交历史(敏感信息被提交情况)
```
  # 替换 FILE_PATH 为你要删除的文件路径
  FILE_PATH="要删除的文件路径"

  # 1. 备份当前更改
  git add -A && git commit -m "Backup before removing $FILE_PATH from history"

  # 2. 删除文件历史
  FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force --index-filter "git rm --cached --ignore-unmatch $FILE_PATH" --prune-empty --tag-name-filter cat -- --all

  # 3. 清理
  rm -rf .git/refs/original/ && git reflog expire --expire=now --all && git gc --prune=now --aggressive

  # 4. 验证
  git log --oneline --follow -- "$FILE_PATH"

  # 5. 推送到远程
  git fetch origin
  git push --force-with-lease --all

  核心命令就是这一条：
  FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch 文件路径' --prune-empty --tag-name-filter cat -- --all
```


保留README 删除提交记录--直接替换文件名

```
  # 1. 备份 README.md 文件内容
  cp README.md README.md.backup

  # 2. 提交当前更改（如果有的话）
  git add -A && git commit -m "Backup before removing README.md history"

  # 3. 删除 README.md 的提交历史
  FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch README.md' --prune-empty --tag-name-filter cat -- --all

  # 4. 清理 Git 引用和垃圾回收
  rm -rf .git/refs/original/ && git reflog expire --expire=now --all && git gc --prune=now --aggressive

  # 5. 恢复 README.md 文件到工作目录
  cp README.md.backup README.md

  # 6. 重新添加文件（作为新文件，没有历史记录）
  git add README.md
  git commit -m "Re-add README.md without history"

  # 7. 清理备份文件
  rm README.md.backup

  # 8. 验证历史已删除（应该只显示刚才的提交）
  git log --oneline -- README.md

  # 9. 推送到远程仓库
  git fetch origin
  git push --force-with-lease --all
```