


哈希 + 随机字符 = 完全随机值
1.无效的重复计算哈希, 计算出低于主网给出的哈希值




```

bc1qarzte0uww052tw9y4gudtngat0yvdcvfwujec2


miner -o stratum+tcp://solo.ckpool.org:3333 -u bc1qarzte0uww052tw9y4gudtngat0yvdcvfwujec2 -p x -T 1 -B 

./minerd -a sha256d -o stratum+tcp://solo.ckpool.org:3333 -u bc1qarzte0uww052tw9y4gudtngat0yvdcvfwujec2 -p x -t 1 -B


./minerd -a sha256d -o stratum+tcp://public-pool.io:21496 -u bc1qarzte0uww052tw9y4gudtngat0yvdcvfwujec2 -p x -t 1 -B
```



### record

https://bulianglin.com/archives/miner.html
```
youtube播放地址：[https://youtu.be/a41DMDfJjsU](https://bulianglin.com/g/aHR0cHM6Ly95b3V0dS5iZS9hNDFETURmSmpzVQ)

**专线机场推荐（支持挖矿）：** [https://b.m123.org](https://bulianglin.com/g/aHR0cHM6Ly9iLm0xMjMub3Jn)  
**美国家宽住宅VPS推荐：** [https://v.m123.org](https://bulianglin.com/g/aHR0cHM6Ly92Lm0xMjMub3Jn)  
**GIA高速VPS推荐：** [https://d.m123.org](https://bulianglin.com/g/aHR0cHM6Ly9kLm0xMjMub3Jn)

**Bitcoin Core**：[https://bitcoin.org/zh_CN/download](https://bulianglin.com/g/aHR0cHM6Ly9iaXRjb2luLm9yZy96aF9DTi9kb3dubG9hZA)  
**SPV钱包客户端**：[https://electrum.org/#download](https://bulianglin.com/g/aHR0cHM6Ly9lbGVjdHJ1bS5vcmcvI2Rvd25sb2Fk)  
**比特币测试网区块浏览器**：[https://mempool.space/zh/testnet4](https://bulianglin.com/g/aHR0cHM6Ly9tZW1wb29sLnNwYWNlL3poL3Rlc3RuZXQ0)  
**cpuminer挖矿工具**：[https://github.com/pooler/cpuminer/releases/tag/v2.5.1](https://bulianglin.com/g/aHR0cHM6Ly9naXRodWIuY29tL3Bvb2xlci9jcHVtaW5lci9yZWxlYXNlcy90YWcvdjIuNS4x)


**挖矿指令**：`minerd.exe -a sha256d -D -o http://127.0.0.1:18442 -u user1 -p pass1 --coinbase-addr btcaddress`

**RPC挖矿劫持脚本**

```python
from flask import Flask, request, jsonify
import requests
import threading
import time
import json
import logging
import hashlib
import os 
from datetime import datetime, timedelta,timezone

REAL_RPC_URL = 'http://127.0.0.1:18442'
REAL_RPC_USER = 'user1'
REAL_RPC_PASS = 'pass1'
LISTEN_PORT = 55555

latest_curtime = None
printed = False
submitted = False
delayed_blocks = []

app = Flask(__name__)
app.config['PROPAGATE_EXCEPTIONS'] = True

def real_rpc(method, params=[]):
    response = requests.post(
        REAL_RPC_URL,
        auth=(REAL_RPC_USER, REAL_RPC_PASS),
        json={"jsonrpc": "1.0", "id": "proxy", "method": method, "params": params}
    )
    response.raise_for_status()
    return response.json()['result']

@app.route('/', methods=['POST'])
def proxy_rpc():
    data = request.get_json()
    method = data.get("method")
    params = data.get("params", [])
    global latest_curtime
    global printed
    global submitted

    if method == "getblocktemplate":
        result = real_rpc("getblocktemplate", params)
        
        #如果不想打包内存池中的交易则取消下面两行注释
        #result["coinbasevalue"] = 50 * 100_000_000  # 50 BTC
        #result["transactions"] = [] 

        #设定区块时间，必须晚于上一区块20分钟，才能触发挖矿难度1
        prev_hash = result["previousblockhash"]
        prev_block = real_rpc("getblock", [prev_hash])
        prev_time = prev_block["time"]
        latest_curtime = result["curtime"] = prev_time + 1201  # 上一个区块时间 + 20 分钟 + 1秒
        
        #将挖矿难度设置为1
        result["bits"] = "1d00ffff"
        result["target"] = "00000000ffff0000000000000000000000000000000000000000000000000000"
        
        if not printed:
            print("上一区块哈希:", prev_hash)
            print("最大目标哈希：", result["target"])
            print("正在挖掘区块：", result["height"])
            printed = True

        return jsonify({
            "result": result,
            "error": None,
            "id": data.get("id")
        })

    elif method == "submitblock":
        if not submitted:
            block_hex = params[0]   
            block_bytes = bytes.fromhex(block_hex)
            block_hash = hashlib.sha256(hashlib.sha256(block_bytes[:80]).digest()).digest()[::-1].hex()
            
            nonce_bytes = block_bytes[76:80]
            nonce = (nonce_bytes[0] |
                (nonce_bytes[1] << 8) |
                (nonce_bytes[2] << 16) |
                (nonce_bytes[3] << 24))
            print(f"✅ 挖矿成功！新区块哈希: {block_hash}，Nonce随机数为: {nonce}")
            

            block_time = latest_curtime
            submit_time = block_time - 7200  # 2小时后再提交

            print(f"⏰ 新区块时间戳：{datetime.utcfromtimestamp(block_time)+timedelta(hours=8)}")
            print(f"⏰ 提交区块时间：{datetime.utcfromtimestamp(submit_time)+timedelta(hours=8)}")
            delayed_blocks.append((submit_time, block_hex, data.get("id")))
            submitted = True
        
        return jsonify({
            "result": None,
            "error": None,
            "id": data.get("id")
        })

    else:
        try:
            result = real_rpc(method, params)
            return jsonify({
                "result": result,
                "error": None,
                "id": data.get("id")
            })
        except Exception as e:
            print(f"Failed to call method '{method}':", str(e))
            return jsonify({
                "result": None,
                "error": str(e),
                "id": data.get("id")
            })



def submit_worker():
    while True:
        if not delayed_blocks:
            time.sleep(1)
            continue

        delayed_blocks.sort(key=lambda x: x[0])
        now = int(time.time())
        next_entry = delayed_blocks[0]
        target_time, block_hex, rpc_id = next_entry

        if now < target_time:
            sleep_time = target_time - now
            print(f"💤 等待 {sleep_time} 秒后提交区块...")
            time.sleep(sleep_time)
            continue

        # 已达到目标时间，提交符合条件的区块
        while delayed_blocks and delayed_blocks[0][0] <= int(time.time()):
            target_time, block_hex, rpc_id = delayed_blocks.pop(0)
            now_str = datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d %H:%M:%S")
            print(f"⏰ 到点提交区块: 当前时间 {now_str}")
            try:
                result = real_rpc("submitblock", [block_hex])
                print("✅ 提交结果:", result)
            except Exception as e:
                print("❌ 提交失败:", str(e))
        os._exit(0)

if __name__ == '__main__':
    threading.Thread(target=submit_worker, daemon=True).start()
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR) 
    print(f"RPC劫持端口：{LISTEN_PORT}")
    app.run(host='0.0.0.0', port=LISTEN_PORT, threaded=True, use_reloader=False)


## 矿池挖矿

**挖矿指令**：`minerd.exe -a sha256d -D -o stratum+tcp://pool -u user.0 -p x`

主要矿池：[https://mempool.space/zh/mining](https://bulianglin.com/g/aHR0cHM6Ly9tZW1wb29sLnNwYWNlL3poL21pbmluZw)

## solo矿池挖矿/solo乐透挖矿/彩票挖矿

**已挖到的区块**：[https://mempool.space/mining/pool/solock](https://bulianglin.com/g/aHR0cHM6Ly9tZW1wb29sLnNwYWNlL21pbmluZy9wb29sL3NvbG9jaw)  
ckpool矿池：[https://solo.ckpool.org/](https://bulianglin.com/g/aHR0cHM6Ly9zb2xvLmNrcG9vbC5vcmcv)  
public-pool矿池(难度0.1)：[https://web.public-pool.io/](https://bulianglin.com/g/aHR0cHM6Ly93ZWIucHVibGljLXBvb2wuaW8v)

Bitaxe项目：[https://github.com/bitaxeorg/bitaxeGamma](https://bulianglin.com/g/aHR0cHM6Ly9naXRodWIuY29tL2JpdGF4ZW9yZy9iaXRheGVHYW1tYQ)  
NerdMiner项目：[https://github.com/BitMaker-hub/NerdMiner_v2](https://bulianglin.com/g/aHR0cHM6Ly9naXRodWIuY29tL0JpdE1ha2VyLWh1Yi9OZXJkTWluZXJfdjI)

Linux挖矿指令：`./minerd -a sha256d -D -o stratum+tcp://pool -u user.0 -p x -t 1 -B`
```
