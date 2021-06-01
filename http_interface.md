# swapServer接口

## 1. 获取目前支持的所有swap交易对

### Request
- Method: **GET**
- URL: ```/allpairs```

### Response
```
{
    "code":0,
    "msg": "",
    "data":[
        {"symbol":"bsv-ssp","token1":"bsv","token2":"ssp"}
        ]
}
```

code为0时，表示正常返回data。code为1时，表示由错误。错误信息在msg中。

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
        swapLpAmount: "100000"
    }
}
```

code为0时，表示正常返回data。code为1时，表示由错误。错误信息在msg中。

data格式如下：

> * swapToken1Amount: swap池中token1即bsv的总数量, 类型为BigInt.toString()
> * swapToken2Amount: swap池中token2即ssp的总数量，类型为BigInt.toString()
> * swapLpAmount: swap池中lp token的总数量, 类型为BigInt.toString()

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
}
```

> * symbol: swap池的符号，由swap池中两个代币符号链接而成，token2-token1。
> * address: 操作者用于接受token和bsv的地址
> * op: 操作：1 增加流动性，2 提取流动性，3 使用token1换取token2，4 使用token2换取token1

### Response
```
{
    'code': 0,
    'msg': '',
    'data': {
        requestIndex: 1, 
        tokenToAddress: 'msREe5jsynP65899v1KJCydf6Sc9pJPb8S', 
        bsvToAddress: 'mzJR1zKcZCZvMJj87rVqmFFxmaVEe62BBW', 
        txFee: 10000, 
        swapToken1Amount: '100000', 
        swapToken2Amount: '1000000', 
        swapLpAmount: '1000000',
        op: 1
    },
}
```
code为0时，表示正常返回data。code为1时，表示由错误。错误信息在msg中。

data格式如下：

> * requestIndex: 请求编号
> * tokenToAddress: 需要转入token到swap池中的地址
> * bsvToAddress: 需要转入的矿工费以及bsv到如下地址
> * txFee: 此操作需要到矿工费
> * swapToken1Amount: swap池中token1即bsv的总数量, 类型为BigInt.toString()
> * swapToken2Amount: swap池中token2即ssp的总数量，类型为BigInt.toString()
> * swapLpAmount: swap池中lp token的总数量, 类型为BigInt.toString()
> * op: 操作类型

## 3. 增加流动性

### Request
- Methos: **POST**
- URL: ```/addliq```
- Body: 
```
{
    symbol: "ssp-bsv",
    requestIndex: 1,
    tokenTxID: "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3",
    tokenOutputIndex: 1,
    bsvAddAmount: "100000",
}
```

> * symbol: swap池的符号，由swap池中两个代币符号链接而成，token2-token1。
> * requestIndex: 之前通过reqswapargs获取的编号。
> * tokenTxID: token转账tx的id。
> * tokenOutputIndex: token转账tx的outputIndex。
> * token1AddAmount: 往swap池中添加的token1的数量, 类型为BigInt.toString()

### Response
```
{
    'code': 0,
    'msg': "",
    'data': "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3"
}
```
code为0时，表示正常返回data, 其值为swap操作的txid。code为1时，表示由错误。错误信息在msg中。

## 4. 提取流动性

### Request
- Methos: **POST**
- URL: ```/addliq```
- Body: 
```
{
    symbol: "bsv-ssp",
    requestIndex: 1,
    tokenTxID: "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3",
    tokenOutputIndex: 1,
    token1AddAmount: "10000",
}
```

> * symbol: swap池的符号，由swap池中两个代币符号链接而成，token2-token1。
> * requestIndex: 之前通过reqswapargs获取的编号。
> * tokenTxID: token转账tx的id。
> * tokenOutputIndex: token转账tx的outputIndex。
> * token1AddAmount: 往swap池中添加的token1的数量, 类型为BigInt.toString()

### Response
```
{
    'code': 0,
    'msg': '',
    'data': "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3"
}
```
code为0时，表示正常返回data, 其值为swap操作的txid。code为1时，表示由错误。错误信息在msg中。

## 5. 交换token1到token2

## 6. 交换token2到token1