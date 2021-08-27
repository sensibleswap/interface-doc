# swapServer接口(此接口未来可能废弃，请使用v2接口)

## 接口地址

- 主网: https://api.tswap.io
- 测试网: https://api.tswap.io/test

## swap请求流程

- 1. 初始化调用```/swapinfo```，获取swap合约的信息
- 2. 用户需要进行swap操作: 调用```/reqswapargs```，服务器会根据用户传入的```address```，动态生成的需要转入token的合约地址```tokenToAddress```，以及随机生成bsv的转入地址```bsvToAddress```。
- 3. 收到响应后根据返回的参数，计算要转账的token1(bsv)和token2数量，然后将token1转入返回参数```bsvToAddress```，将token2转入返回参数```tokenToAddress```
- 4. 转账完成后，根据不同的操作，请求swap操作接口```/addliq```, ```/removeliq```, ```/token1totoken2```, ```/token2totoken1```

## 接口介绍

## 1. 获取目前支持的所有swap交易对

### Request
- Method: **GET**
- URL: ```/allpairs```

### Response
```
{
    "code":0,
    "data":{
        "bsv-ssp": {
            "token1": {
                "symbol":"bsv",
                "tokenID":"",
                "genesisHash":"",
                "codeHash":"",
                "decimal": 8,
                "rabinApis":[]
            },
            "token2": {
                "symbol":"sspt",
                "tokenID":"2b5c37d535cc7f822022b2bc8ce502c480563de08ec7e7130777cab55337be2100000000",
                "genesisHash":"5de90b9c12d2975a79b67a5f7a2b037f1aad16b0",
                "codeHash":"c9c23794ad9a1899e96482780065c74cf78c3060",
                "decimal": 8,
            },
            "lptoken":{
                "symbol":"bsv-sspt",
                "tokenID":"3aacf8a31dfe2f96a4d5d5e12073db6650a9213c04441ec8bebb49d67b367cf800000000",
                "genesisHash":"02d3ca4f58e216a96a71d43f5af897694ad5fe26",
                "codeHash":"4d4e59d05d38948e12d8015cac9055ba3e41a5bd",
                "decimal":8,
                "rabinApis":["https://s1.satoplay.com","https://satotx.showpay.top","https://satotx.volt.id","https://satotx.metasv.com","https://satotx.tswap.io"]
            },
            "rabinApis":["https://s1.satoplay.com","https://satotx.showpay.top","https://satotx.volt.id","https://satotx.metasv.com","https://satotx.tswap.io"]
        }
    }
}
```

code为0时，表示正常返回data。code为1时，表示由错误。错误信息在msg中。lptoken是在添加流动性时获得的token。在提取流动性时需要将此流动性token返回。rabinApis是签名请求的api地址。

## 2. 获取swap信息

### Request
- Method: **GET**
- URL: ```/swapinfo?symbol=bsv-ssp```

> * symbol: swap池的符号，/allpairs接口获得。

### Response
```
{
    code: 0,
    message: "",
    data: {
        swapToken1Amount: "100000",
        swapToken2Amount: "100000",
        swapLpAmount: "100000",
        swapFeeRate: 25,
        projFeeRate: 5,
    }
}
```

code为0时，表示正常返回data。code为1时，表示由错误。错误信息在msg中。

data格式如下：

> * swapToken1Amount: swap池中token1即bsv的总数量, 类型为BigInt.toString()
> * swapToken2Amount: swap池中token2即ssp的总数量，类型为BigInt.toString()
> * swapLpAmount: swap池中lp token的总数量, 类型为BigInt.toString()
> * swapFeeRate: swap池进行交换时的收取的总费率
> * projFeeRate: swap池进行交换时收取的项目费率

## 3. 请求swap操作

在进行swap的时候先去请求最新的数据，然后在进行具体的swap操作

### Request

- Method: **POST**

- URL: ```/reqswapargs```

- Body:
```
{
    symbol: "bsv-ssp",
    address: "msREe5jsynP65899v1KJCydf6Sc9pJPb8S",
    op: 1,
    source: 'tswap.io'
}
```

> * symbol: swap池的符号，由swap池中两个代币符号链接而成，token1-token2。
> * address: 操作者用于接受token和bsv的地址
> * op: swap操作。1 增加流动性，2 提取流动性，3 使用token1换取token2，4 使用token2换取token1
> * source: 标记调用者的身份，方便查找错误

### Response
```
{
    code: 0,
    msg: "",
    data: {
        requestIndex: "1", 
        tokenToAddress: "msREe5jsynP65899v1KJCydf6Sc9pJPb8S", 
        bsvToAddress: "mzJR1zKcZCZvMJj87rVqmFFxmaVEe62BBW", 
        txFee: 10000, 
        swapToken1Amount: "100000", 
        swapToken2Amount: "1000000", 
        swapLpAmount: "1000000",
        swapFeeRate: 25,
        projFeeRate: 5,
        op: 1
    },
}
```
code为0时，表示正常返回data。code为1时，表示由错误。错误信息在msg中。**注意每次进行swap操作是都需要申请新的requestIndex，requestIndex不能重复使用。**

data格式如下：

> * requestIndex: 请求编号
> * tokenToAddress: 需要转入token到swap池中的地址
> * bsvToAddress: 需要转入的矿工费以及bsv到如下地址
> * txFee: 此操作需要到矿工费
> * swapToken1Amount: swap池中token1即bsv的总数量, 类型为BigInt.toString()
> * swapToken2Amount: swap池中token2即ssp的总数量，类型为BigInt.toString()
> * swapLpAmount: swap池中lp token的总数量, 类型为BigInt.toString()
> * swapFeeRate: swap池进行交换时的收取的总费率
> * projFeeRate: swap池进行交换时收取的项目费率
> * op: swap操作类型

## 4. 增加流动性

### Request
- Methos: **POST**
- URL: ```/addliq```
- Body: 
```
{
    symbol: "ssp-bsv",
    requestIndex: "1",
    token1TxID: "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3",
    token1OutputIndex: 1,
    token2TxID: "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3",
    token2OutputIndex: 1,
    token1AddAmount: "100000",
}
```

> * symbol: swap池的符号，由swap池中两个代币符号链接而成，token1-token2。
> * requestIndex: 之前通过reqswapargs获取的编号。
> * token1TxID: bsv转账tx的id。
> * token1OutputIndex: bsv转账tx的outputIndex。
> * token2TxID: token转账tx的id。
> * token2OutputIndex: token转账tx的outputIndex。
> * token1AddAmount: 往swap池中添加的token1的数量, 类型为BigInt.toString()

**注意：这里转账的bsv数量为txFee + token1AddAmount, token1为bsv时， token1AddAmount不能小于1000 satoshi.**
**注意2: 碰到需要同时转一笔bsv和一笔token的接口，必须先转bsv然后再转token，这样swap过程中断了才能退回来。之前有碰到过一个错误，就是转了bsv后，紧接着马上转token，由于bsv utxo更新延迟，会导致mempool conflic的问题，一个解决方法是直接本地构造一个bsv的转账tx，将找零utxo和其他的utxo一起传入到sensible-sdk（sensible-sdk转账ft支持传入utxos），这样能避免双花问题**

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        txid: '1649c55319187fc7047f0bb372e89b5d2e2c716ce7e387470e3c0460d19065a6',
        lpAddAmount: '7144'
    }
}
```
code为0时，表示正常返回data, txid表示swap的交易id，lpAddAmount是用户获得的流动性token。code为1时，表示由错误。错误信息在msg中。

## 5. 提取流动性

### Request
- Methos: **POST**
- URL: ```/removeliq```
- Body: 
```
{
    symbol: "bsv-ssp",
    requestIndex: "1",
    lpTokenTxID: "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3",
    lpTokenOutputIndex: 1,
    minerFeeTxID: "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3",
    minerFeeTxOutputIndex: 0,
}
```

> * symbol: swap池的符号，由swap池中两个代币符号链接而成，token1-token2。
> * requestIndex: 之前通过reqswapargs获取的编号。
> * lpTokenTxID: lpToken转账tx的id。
> * lpTokenOutputIndex: lpToken转账tx的outputIndex。
> * minerFeeTxID: 矿工费转账tx的id。
> * minerFeeTxOutputIndex: 矿工费转账tx的outputIndex。

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        txid: '88e64bcf3517c864bb4c224b52084d3b3261a57814dceb19f2b8af07934f9cf8',
        token1Amount: '13997',
        token2Amount: '715070265'
    }
}
```
code为0时，表示正常返回data, 其中txid为swap交易id，token1Amount和token2Amount分别为用户获得的bsv和token数量。code为1时，表示由错误。错误信息在msg中。

## 6. 交换token1到token2

把token1交换为token2

### Request
- Method: **POST**
- URL: ```/token1totoken2```
- Body: 
```
{
    symbol: "bsv-ssp",
    requestIndex: "1"
    token1TxID: "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3",
    token1OutputIndex: 1,
    token1AddAmount: "100000",
}
```
> * symbol: swap池的符号，由swap池中两个代币符号链接而成，token1-token2。
> * requestIndex: 之前通过reqswapargs获取的编号。
> * token1TxID: bsv转账tx的id。
> * token1OutputIndex: bsv转账tx的outputIndex。
> * token1AddAmount: 需要交换的token1(bsv)的数量, 类型为BigInt.toString()

注意：这里转账的bsv数量为txFee + token1AddAmount

### Response
```
{
    "code": 0,
    "msg": "",
    "data": "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3"
}
```
code为0时，表示正常返回data, 其值为swap操作的txid。code为1时，表示由错误。错误信息在msg中。

## 7. 交换token2到token1

把token2交换为token1

### Request
- Method: **POST**
- URL: ```/token2totoken1```
- Body:
```
{
    symbol: "bsv-ssp",
    requestIndex: "1"
    token2TxID: "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3",
    token2OutputIndex: 1,
    minerFeeTxID: "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3",
    minerFeeTxOutputIndex: 0,
}
```
> * symbol: swap池的符号，由swap池中两个代币符号链接而成，token1-token2。
> * requestIndex: 之前通过reqswapargs获取的编号。
> * token2TxID: token2转账tx的id。
> * token2OutputIndex: token2转账tx的outputIndex。
> * minerFeeTxID: 矿工费转账tx的id。
> * minerFeeTxOutputIndex: 矿工费转账tx的outputIndex。

### Response
```
{
    "code": 0,
    "msg": "",
    "data": "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3"
}
```
code为0时，表示正常返回data, 其值为swap操作的txid。code为1时，表示由错误。错误信息在msg中。
