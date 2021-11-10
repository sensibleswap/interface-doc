# customServer 接口

## 接口地址

- 主网: https://api.tswap.io/custom
- 测试网: https://api.tswap.io/custom/test

## 接口介绍

## 1. 请求创建swap参数

在进行swap的时候先去请求最新的数据，然后在进行具体的swap操作

### Request

- Method: **POST**

- URL: ```/reqcreateswap```

- Body:
```
{
    address: "msREe5jsynP65899v1KJCydf6Sc9pJPb8S",
    source: 'tswap.io'
}
```

> * address: 操作者用于接受token和bsv的地址
> * source: 标记调用者的身份，方便查找错误

### Response
```
{
    code: 0,
    msg: "",
    data: {
      requestIndex: 1,
      tokenToAddress: 'mpuHJBBbxknPXGNtVYLDJ1PNBEDXihUqCm',
      bsvToAddress: 'mpuHJBBbxknPXGNtVYLDJ1PNBEDXihUqCm',
      txFee: 50000,
      op: 1,
      requiredTscAmount: '1000000000'
    }
}
```
code为0时，表示正常返回data。code为1时，表示由错误。错误信息在msg中。**注意每次操作是都需要申请新的requestIndex，requestIndex不能重复使用。**

data格式如下：

> * requestIndex: 请求编号
> * tokenToAddress: 需要转入token到swap池中的地址
> * bsvToAddress: 需要转入的矿工费以及bsv到如下地址
> * txFee: 此操作需要到矿工费
> * op: swap操作类型
> * requiredTscAmount: 需要转账的tsc token数量

## 2. 创建swap交易对

### Request
- Methos: **POST**
- URL: ```/createswap```
- Body: 
```
{
    data: compressedData
}
```

compressData是如下格式
```
data = {
    requestIndex: "1",
    tokenRawTx: "",
    tokenOutputIndex: 0,
    bsvRawTx: "",
    bsvOutputIndex: 0,
    amountCheckRawTx: "",
    token1ID: "",
    token2ID: "",
}
compressData = gzip(JSON.stringify(data))
```

> * symbol: swap池的符号，由swap池中两个代币符号链接而成，token1-token2。
> * requestIndex: 之前通过reqswapargs获取的编号。
> * tokenRawTx: tsc转账raw tx。
> * tokenOutputIndex: tsc转账tx的outputIndex。
> * bsvRawTx: bsv转账raw tx。
> * bsvOutputIndex: bsv转账tx的outputIndex。
> * amountCheckRawTx: token2转账生成的amountCheck raw tx。
> * token1ID: 想要创建交易对的token1ID(即genesis，在token1不为bsv时才需要)。
> * token2ID: 想要创建交易对的token2ID(genesis)

**注意：具体交易的压缩和构造方法参考swap_interface的addliq接口**

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        swapTxId: '1649c55319187fc7047f0bb372e89b5d2e2c716ce7e387470e3c0460d19065a6',
    }
}
```
code为0时，表示正常返回data, swapTxId表示创建的swap交易id。code为1时，表示由错误。错误信息在msg中。

## 3. 查找swap交易对信息

### Request
- Method: **GET**
- URL: ```/pairinfo?symbol=52e6021649be1d0621c52c9f61a54ef58c6d8dbe```

> * symbol: 需要交易token的tokenID(genesis)或者tokenSymbol, tokenSymbol不区分大小写。

### Response

```
{
    "code":0,
    "data": [{
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
        "rabinApis":["https://s1.satoplay.com","https://satotx.showpay.top","https://satotx.volt.id","https://satotx.metasv.com","https://satotx.tswap.io"],
        "swapCodeHash":"3af062db29f1e04faeb5e35531fad75410473e40",
        "swapID":"f09b244a3c5cc74a49d5695a32c33af4ef572d9d"
    }]
}
```

code为0时，表示正常返回data。code为1时，表示由错误。错误信息在msg中。当symbol为tokenID时，返回0个或1个交易对信息。当symbol为tokenSymbol时，可能会返回多个交易对结果。

data数据：
> * token1：交易对中的token信息。
> * token2: 交易对中的另一个token信息。
> * lptoken是在添加流动性时获得的token。在提取流动性时需要将此流动性token返回。
> * rabinApis是签名请求的api地址。
> * swapCodeHash: swap合约的contract code hash。
> * swapID: swap合约的ID，对应于sensiblequery的genesis。

## 3. 获取目前支持的所有swap交易对

同swap_interface

## 4. 获取swap信息

同swap_interface，symbol填tokenID。

## 5. 增加流动性

同swap_interface，symbol填tokenID。

## 6. 提取流动性

同swap_interface，symbol填tokenID。

## 7. 交换token1到token2

同swap_interface，symbol填tokenID。

## 8. 交换token2到token1

同swap_interface，symbol填tokenID。