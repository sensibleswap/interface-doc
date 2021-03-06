# stakeServer接口

## 接口地址

- 主网: https://api.tswap.io/stake
- 测试网: https://api.tswap.io/stake/test

## 接口介绍

## 1. 获取所有的stake对

### Request
- Method: **GET**
- URL: ```/allpairs?address=mzJR1zKcZCZvMJj87rVqmFFxmaVEe62BBW```
> * address: 用户地址。

### Response
```
{
    "code": 0,
    "data": {
        "tbsv-test": {
            "token": {
                "rabinApis": ["https://s1.satoplay.com", "https://satotx.showpay.top", "https://satotx.volt.id", "https://satotx.metasv.com", "https://satotx.tswap.io"],
                "symbol": "tbsv/test",
                "tokenID": "dbd8ac021f83dc16e363520171177e7fcc401de7",
                "genesisHash": "ac7ceab3809fb68b7dc9b40e1c6cacf6ccb68558",
                "codeHash": "777e4dd291059c9f7a0fd563f7204576dcceb791",
                "decimal": 8
            },
            "rewardToken": {
                "rabinApis": ["https://s1.satoplay.com", "https://satotx.showpay.top", "https://satotx.volt.id", "https://satotx.metasv.com", "https://satotx.tswap.io"],
                "symbol": "test",
                "tokenID": "e616a7e2367f640485e8f9148a0320e4a71ab83f",
                "genesisHash": "0a1387f738b73e844e9ea0c5b0ae7eb3cbdec575",
                "codeHash": "777e4dd291059c9f7a0fd563f7204576dcceb791",
                "decimal": 8
            },
            "rewardAmountFactor": "100000000",
            "rewardAmountPerBlock": "100000000",
            "lastRewardBlock": "699815",
            "poolTokenAmount": "18000",
            "accPoolPerShare": "102999999999999",
            "withdrawLockInterval": 14,
            "addressCount": 100, 
            "lockedTokenAmount": "10000",
            "rewardTokenAmount": "10000",
            "stakeCodeHash":"0d90001629d60c20fd9e95fcb99daaef12d063df",
            "stakeID":"ba2b070b68e43a2301aedde0557db91af662ad73"
    }
}
```

code为0时，表示正常返回data。code为1时，表示由错误。错误信息在msg中。
> * token: 需要进行质押的token信息。
> * rewardToken: 质押token后获得的奖励token信息。
> * rewardAmountFactor: 用于计算用户的奖励。
> * rewardAmountPerBlock是当前stake池每个区块所产生的奖励token数量。
> * lastRewardBlock: 上次更新操作时的block高度。
> * poolTokenAmount: 当前stake池质押的token数量。
> * accPoolPerShare: 累计的奖励，用于跟rewardAmountFactor一起计算用户可获得的奖励token。
> * withdrawLockInterval: 解锁token时需要等待的区块数。
> * addressCount: 参与质押的地址总数。
> * lockedTokenAmount: 请求地址的质押token数量。
> * rewardTokenAmount: 请求地址可以获得的奖励token数量。
> * stakeCodeHash: stake合约的contract code hash。
> * stakeID: stake合约的ID。

## 2. 获取stake信息


### Request
- Method: **GET**
- URL: ```/stakeinfo?symbol=tbsv-test```

> * symbol: stake池的符号，/allpairs接口获得。

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        "rewardAmountFactor": "100000000",
        "rewardAmountPerBlock": "100000000",
        "lastRewardBlock": "699815",
        "poolTokenAmount": "18000",
        "withdrawLockInterval": 14,
        "accPoolPerShare": "102999999999999",
        "addressCount": 100 
    }
}
```

> * rewardAmountFactor: 用于计算用户的奖励。
> * rewardAmountPerBlock是当前stake池每个区块所产生的奖励token数量。
> * lastRewardBlock: 上次更新操作时的block高度。
> * poolTokenAmount: 当前stake池质押的token数量。
> * accPoolPerShare: 累计的奖励，用于跟rewardAmountFactor一起计算用户可获得的奖励token。
> * withdrawLockInterval: 解锁token时需要等待的区块数。
> * addressCount: 参与质押的地址总数。

## 3. 获取用户信息

### Request
- Method: **GET**
- URL: ```/userinfo?symbol=tbsv-test&address=mzJR1zKcZCZvMJj87rVqmFFxmaVEe62BBW```
> * symbol: stake池的符号，/allpairs接口获得。
> * address: 用户地址。

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        "lockedTokenAmount": "18000",
        "rewardTokenAmount": "18539999999",
        "unlockingTokens": [{"expired":737212,"amount":"100000"}],
        "voteInfo": {
            "31d4d1d4bbdaecc04d8df4fc53860e48196d7b63":{

            },
            "47c48bcde4d982b7d0530ca41d68aba44ea2aa96":{
                "voteOption":2,
                "voteAmount":"110000"
            }
        }
    }
}
```
> * lockedTokenAmount: 用户当前质押的token数量。
> * rewardTokenAmount: 用户可以获得的奖励token数量。
> * unlockingTokens: 用户解锁的token信息。expired是到期的区块高度，amount是解锁的token数量。
> * voteInfo: 用户的投票信息。key是voteID，voteOption是投票的选择，voteAmount是投票的数量。

## 4. 请求stake操作

在进行stake操作的时候先去请求最新的数据，然后在进行具体的stake操作

### Request

- Method: **POST**

- URL: ```/reqstakeargs```

- Body:
```
{
    symbol: "tbsv-test",
    address: "msREe5jsynP65899v1KJCydf6Sc9pJPb8S",
    op: 1,
    source: 'tswap.io'
}
```
> * symbol: stake池的符号。
> * address: 操作者用于保存和接受token的地址。
> * op: stake操作。1 质押，2 解锁，3 提取，4 收获, 6 投票
> * source: 标记调用者的身份，方便查找错误

### Response
```
{
    "requestIndex": 1,
    "tokenToAddress": "",
    "bsvToAddress": "mnJjkrvrYZGRqvRJwQJdi4dDdmrxDtmCVi",
    "txFee": 74930,
    "op": 3
}
```

code为0时，表示正常返回data。code为1时，表示由错误。错误信息在msg中。**注意每次进行stake操作是都需要申请新的requestIndex，requestIndex不能重复使用。**

data格式如下：

> * requestIndex: 请求编号
> * tokenToAddress: 需要转入token到swap池中的地址
> * bsvToAddress: 需要转入的矿工费以及bsv到如下地址
> * txFee: 此操作需要到矿工费
> * op: stake操作类型

## 5. 质押

把token质押到stake池中

### Resuest
- Methos: **POST**
- URL: ```/deposit```
- Body: 
```
{
    data: compressedData
}
```

compressData是如下格式
```
data = {
    symbol: "tbsv-test",
    requestIndex: "1",
    tokenRawTx: "",
    tokenOutputIndex: 0,
    bsvRawTx: "",
    bsvOutputIndex: 0,
    amountCheckRawTx: "",
}
compressData = gzip(JSON.stringify(data))
```
> * symbol: stake池的符号。
> * requestIndex: 之前通过reqswapargs获取的编号。
> * tokenRawTx: token转账raw tx。
> * tokenOutputIndex: token转账tx的outputIndex。
> * bsvRawTx: bsv转账raw tx。
> * bsvOutputIndex: bsv转账tx的outputIndex。
> * amountCheckRawTx: token转账生成的amountCheck raw tx。

**注意：rawTx不要广播到bsv网络上，直接发给后端。同时，在发送前必须对data进行gzip压缩, 然后设置header {'Content-Type': 'application/json'} 参考下面的代码**
```
import { gzip } from 'node-gzip';
const request = require('superagent')
const reqData = {
    symbol,
    requestIndex: Number(data.requestIndex),
    tokenRawTx,
    tokenOutputIndex,
    bsvRawTx,
    bsvOutputIndex: 0,
    amountCheckRawTx,
}
const compressData = await gzip(JSON.stringify(reqData))
reqRes = await request.post(
    `${url}/deposit`
).send(compressData).set('Content-Type', 'application/json')
```

**注意: 构造tx时，需要避免双花问题。一个解决方法是直接本地构造一个bsv的转账tx，将找零utxo和其他的utxo一起传入到sensible-sdk（sensible-sdk转账ft支持传入utxos），这样能避免双花问题。构造代码可以参考[buildBsvAndTokenTx函数](https://github.com/sensibleswap/bsv-web-wallet/blob/master/src/App.js#:~:text=const-,buildBsvAndTokenTx,-%3D%20async%20()%20%3D%3E%20%7B)。**

交易构造可以参考下图:

![image](tx.png)

可行的交易构造方法：
> * 1 钱包一开始获取txFee + 50000sats数量的utxo（一般的token转账耗费大概20000sats的矿工费）。
> * 2 构造bsv的转账交易
> * 3 使用bsv转账的找零传入sensible-sdk，构造token的转账交易。
> * 4 如果手续费不够失败，重新执行步骤1，获取txFee + 50000 * 2 sats的utxo，继续执行2，3，如此反复，直到成功。

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        "txid": "88e64bcf3517c864bb4c224b52084d3b3261a57814dceb19f2b8af07934f9cf8",
        "blockHeight": 70159
    }
}
```
code为0时，表示正常返回data, txid为stake操作的交易id。code为1时，表示由错误。错误信息在msg中。

## 6. 解锁

解锁质押在stake pool里面的token。提取操作需要进行两次网络请求，unlock和unlock2。解锁后的token需要等待withdrawLockInterval个区块后才能继续提取。

### Request
- Methos: **POST**
- URL: ```/unlock```
- Body: 
```
{
    symbol: "tbsv-test",
    requestIndex: "1",
    tokenRemoveAmount: "1000",
    bsvRawTx: "",
    bsvOutputIndex: 0,
}
```
> * symbol: stake池的符号。
> * requestIndex: 之前通过reqstakeargs获取的编号。
> * tokenRemoveAmount: 需要提取的token数量，BitInt.toString()。
> * bsvRawTx: bsv转账raw tx。
> * bsvOutputIndex: bsv转账tx的outputIndex。

**注意：rawTx不要广播到bsv网络上，直接发给后端。同时，在发送前必须对data进行gzip压缩, 设置header，参考deposit**

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        "txHex": "",
        "scriptHex": "",
        "satoshis": "100",
        "inputIndex": 0,
    }
}
```

获取到unlock接口的返回参数后，需要使用之前reqstakeargs传入的address对应的私钥对tx进行签名。签名参考代码
```
const tx = bsv.Transaction(data.txHex)
const script = bsv.Script.fromBuffer(Buffer.from(data.scriptHex, 'hex'))
const pubKey = toHex(this.privateKey.publicKey)
const sig = toHex(signTx(tx, this.privateKey, script.toASM(), Number(data.satoshis), data.inputIndex))
```

在计算出pubKey和sig之后，继续调用unlock2接口

**注意：由于此接口返回的txHex和scriptHex较大，请求的header里面必须加上{Accept-Encoding: gzip}**

### Request
- Methos: **POST**
- URL: ```/unlock2```
- Body: 
```
{
    symbol: "tbsv-test",
    requestIndex: "1",
    pubKey: "",
    sig: ""
}
```
> * symbol: stake池的符号。
> * requestIndex: 之前通过reqstakeargs获取的编号。
> * pubKey: address对应的公钥。
> * sig: address对应的私钥对tx的签名。

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        "txid": "88e64bcf3517c864bb4c224b52084d3b3261a57814dceb19f2b8af07934f9cf8",
        "blockHeight": 70159
    }
}
```
code为0时，表示正常返回data, txid为stake操作的交易id。code为1时，表示由错误。错误信息在msg中。

如果code返回99999，表示交易与其他用户产生冲突，可以进行重试。将data.other进行解压后，得到新的data，格式与unlock接口返回的data格式一样。进行重新签名后，再次调用unlock2接口。参考代码如下:

```
if (response.body.code === 99999) {
    const raw = await ungzip(Buffer.from(response.body.data.other))
    data = JSON.parse(raw.toString())
    const tx = bsv.Transaction(data.txHex)
    const script = bsv.Script.fromBuffer(Buffer.from(data.scriptHex, 'hex'))
    const pubKey = toHex(this.privateKey.publicKey)
    const sig = toHex(signTx(tx, this.privateKey, script.toASM(), Number(data.satoshis), data.inputIndex))

    response = await request.post(
        `${url}/withdraw2`,
        {
            symbol,
            requestIndex: Number(requestIndex),
            pubKey,
            sig,
        }
    ).http2(USE_HTTP2)
} else {
    throw Error('failed')
}
```

## 7. 提取

提取已过解锁期的token。提取操作需要进行两次网络请求，withdraw和withdraw2.

### Request
- Methos: **POST**
- URL: ```/withdraw```
- Body: 
```
{
    symbol: "tbsv-test",
    requestIndex: "1",
    bsvRawTx: "",
    bsvOutputIndex: 0,
}
```
> * symbol: stake池的符号。
> * requestIndex: 之前通过reqstakeargs获取的编号。
> * bsvRawTx: bsv转账raw tx。
> * bsvOutputIndex: bsv转账tx的outputIndex。

**注意：rawTx不要广播到bsv网络上，直接发给后端。同时，在发送前必须对data进行gzip压缩, 设置header，参考deposit**

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        "txHex": "",
        "scriptHex": "",
        "satoshis": "100",
        "inputIndex": 0,
    }
}
```

获取到withdraw接口的返回参数后，需要使用之前reqstakeargs传入的address对应的私钥对tx进行签名。签名参考代码
```
const tx = bsv.Transaction(data.txHex)
const script = bsv.Script.fromBuffer(Buffer.from(data.scriptHex, 'hex'))
const pubKey = toHex(this.privateKey.publicKey)
const sig = toHex(signTx(tx, this.privateKey, script.toASM(), Number(data.satoshis), data.inputIndex))
```

在计算出pubKey和sig之后，继续调用withdraw2接口

**注意：由于此接口返回的txHex和scriptHex较大，请求的header里面必须加上{Accept-Encoding: gzip}**

### Request
- Methos: **POST**
- URL: ```/withdraw2```
- Body: 
```
{
    symbol: "tbsv-test",
    requestIndex: "1",
    pubKey: "",
    sig: ""
}
```
> * symbol: stake池的符号。
> * requestIndex: 之前通过reqstakeargs获取的编号。
> * pubKey: address对应的公钥。
> * sig: address对应的私钥对tx的签名。

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        "txid": "88e64bcf3517c864bb4c224b52084d3b3261a57814dceb19f2b8af07934f9cf8",
        "blockHeight": 70159
    }
}
```
code为0时，表示正常返回data, txid为stake操作的交易id。code为1时，表示由错误。错误信息在msg中。

如果code返回99999，表示交易与其他用户产生冲突，可以进行重试。将data.other进行解压后，得到新的data，格式与withdraw接口返回的data格式一样。进行重新签名后，再次调用withdraw2接口。参考代码如下:

```
if (response.body.code === 99999) {
    const raw = await ungzip(Buffer.from(response.body.data.other))
    data = JSON.parse(raw.toString())
    const tx = bsv.Transaction(data.txHex)
    const script = bsv.Script.fromBuffer(Buffer.from(data.scriptHex, 'hex'))
    const pubKey = toHex(this.privateKey.publicKey)
    const sig = toHex(signTx(tx, this.privateKey, script.toASM(), Number(data.satoshis), data.inputIndex))

    response = await request.post(
        `${url}/withdraw2`,
        {
            symbol,
            requestIndex: Number(requestIndex),
            pubKey,
            sig,
        }
    ).http2(USE_HTTP2)
} else {
    throw Error('failed')
}
```

## 8. 收获

提取质押token后获得的奖励token。收获操作需要进行两次网络请求，harvest和harvest2。

### Request
- Methos: **POST**
- URL: ```/harvest```
- Body: 
```
{
    symbol: "tbsv-test",
    requestIndex: "1",
    bsvRawTx: "",
    bsvOutputIndex: 0,
}
```
> * symbol: stake池的符号。
> * requestIndex: 之前通过reqstakeargs获取的编号。
> * bsvRawTx: bsv转账raw tx。
> * bsvOutputIndex: bsv转账tx的outputIndex。

**注意：rawTx不要广播到bsv网络上，直接发给后端。同时，在发送前必须对data进行gzip压缩, 设置header，参考deposit**

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        "txHex": "",
        "scriptHex": "",
        "satoshis": "100",
        "inputIndex": 0,
    }
}
```

获取到harvest接口的返回参数后，需要使用之前reqstakeargs传入的address对应的私钥对tx进行签名。签名代码参考withdraw。

在计算出pubKey和sig之后，继续调用harvest2接口

**注意：由于此接口返回的txHex和scriptHex较大，请求的header里面必须加上{Accept-Encoding: gzip}**

### Request
- Methos: **POST**
- URL: ```/harvest2```
- Body: 
```
{
    symbol: "tbsv-test",
    requestIndex: "1",
    pubKey: "",
    sig: ""
}
```
> * symbol: stake池的符号。
> * requestIndex: 之前通过reqstakeargs获取的编号。
> * pubKey: address对应的公钥。
> * sig: address对应的私钥对tx的签名。

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        "txid": "88e64bcf3517c864bb4c224b52084d3b3261a57814dceb19f2b8af07934f9cf8",
        "rewardTokenAmount": "10000",
        "blockHeight": 70159
    }
}
```
code为0时，表示正常返回data, txid为stake操作的交易id, rewardTokenAmount表示获得的奖励token数量。code为1时，表示由错误。错误信息在msg中。

如果code返回99999，表示交易与其他用户产生冲突，可以进行重试。将data.other进行解压后，得到新的data，格式与withdraw接口返回的data格式一样。进行重新签名后，再次调用withdraw2接口。参考代码如下:
```
if (response.body.code === 99999) {
    const raw = await ungzip(Buffer.from(response.body.data.other))
    data = JSON.parse(raw.toString())
    const tx = bsv.Transaction(data.txHex)
    const script = bsv.Script.fromBuffer(Buffer.from(data.scriptHex, 'hex'))
    const pubKey = toHex(this.privateKey.publicKey)
    const sig = toHex(signTx(tx, this.privateKey, script.toASM(), Number(data.satoshis), data.inputIndex))

    response = await request.post(
        `${url}/harvest2`,
        {
            symbol,
            requestIndex: Number(requestIndex),
            pubKey,
            sig,
        }
    ).http2(USE_HTTP2)
} else {
    throw Error('failed')
}
```

## 9. 获取投票信息

获取某个token的质押合约的投票信息

### Request
- Method: **GET**
- URL: ```/voteinfo?symbol=tbsv-test```
> * symbol: stake池的符号，/allpairs接口获得。

### Response
```
{
    "code":0,
    "msg":"",
    "data":{
        "47c48bcde4d982b7d0530ca41d68aba44ea2aa96":{
            "title":"Test Liquidity Farm Vote",
            "desc":"vote to decide the distribution of farm rewards",
            "options":[
                "TSC/BSV",
                "USDT/BSV",
                "TSC/USDT"
            ],
            "voteSumData":[
                "0",
                "0",
                "110000"
            ],
            "beginBlockNum":739700,
            "endBlockNum":741140,
            "minVoteAmount": "10000000",
        }
    }
}
```

data是一个map，其中key是voteID，value是此投票的具体信息。可以同时具有多个投票。
> * title: 投票的标题。
> * desc: 投票的具体描述。
> * options: 投票具体选项。按顺序列出。
> * voteSumData: 目前的投票信息，对应于options中的每个选择已有的投票数。
> * beginBlockNum: 投票开始的区块高度。
> * endBlockNum: 投票结束的区块高度。
> * minVoteAmount: 投票结果有效所需要的最低的投票数。


## 10. 投票

用户进行投票。投票操作需要进行两次网络请求，vote和vote2。用户可以多次投票，最新一次的投票结果覆盖之前的投票。

### Request
- Methos: **POST**
- URL: ```/vote```
- Body:
```
{
    symbol: "tbsv-test",
    requestIndex: "1",
    bsvRawTx: "",
    bsvOutputIndex: 0,
    voteID: "47c48bcde4d982b7d0530ca41d68aba44ea2aa96",
    voteOption: 0,
    confirmVote: true
}
```

> * symbol: stake池的符号。
> * requestIndex: 之前通过reqstakeargs获取的编号。
> * bsvRawTx: bsv转账raw tx。
> * bsvOutputIndex: bsv转账tx的outputIndex。
> * voteID: 从voteinfo中获取的voteID。
> * voteOption: 投票的的选择。
> * confirmVote: true: 用户投票。false：取消之前的投票。当confirmVote为false时，voteOption不起作用。

### response
```
{
    "code": 0,
    "msg": "",
    "data": {
        "txHex": "",
        "scriptHex": "",
        "satoshis": "100",
        "inputIndex": 0,
    }
}
```
获取到vote接口的返回参数后，需要使用之前reqstakeargs传入的address对应的私钥对tx进行签名。签名流程参考unlock。

**注意：由于此接口返回的txHex和scriptHex较大，请求的header里面必须加上{Accept-Encoding: gzip}**

### Request
- Methos: **POST**
- URL: ```/vote2```
- Body: 
```
{
    symbol: "tbsv-test",
    requestIndex: "1",
    pubKey: "",
    sig: ""
}
```
> * symbol: stake池的符号。
> * requestIndex: 之前通过reqstakeargs获取的编号。
> * pubKey: address对应的公钥。
> * sig: address对应的私钥对tx的签名。

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        "txid": "88e64bcf3517c864bb4c224b52084d3b3261a57814dceb19f2b8af07934f9cf8",
        "blockHeight": 70159
    }
}
```
code为0时，表示正常返回data, txid为stake操作的交易id。code为1时，表示由错误。错误信息在msg中。

如果code返回99999，表示交易与其他用户产生冲突，可以进行重试。将data.other进行解压后，得到新的data，格式与vote接口返回的data格式一样。进行重新签名后，再次调用vote2接口。参考unlock接口。