# Swap Interface 

## Interface Entrance 

- mainnet: https://api.tswap.io/v2
- testnet: https://api.tswap.io/v2/test

## Simple Swap Procedure

- 1. Call ```/swapinfo``` to get swap information.
- 2. When users need to oparate swap, they need to call ```/reqswapargs```.
- 3. when gets the response from step 2，count the amount of token1(bsv) and token2 using interface in [swapAlgo.js](https://github.com/sensibleswap/interface-doc/blob/master/swapAlgo.js), and create the transactions which transfer bsv to ```bsvToAddress``` and token to ```tokenToAddress```.
- 4. After generates transactions，call swap inteface ```/addliq```, ```/removeliq```, ```/token1totoken2```, ```/token2totoken1```.

## Interface Introduction

## 1. Get all listed token pairs

### Request
- Method: **GET**
- URL: ```/allpairs```

### Response
```
{
    "code":0,
    "msg": "",
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
            "rabinApis":["https://s1.satoplay.com","https://satotx.showpay.top","https://satotx.volt.id","https://satotx.metasv.com","https://satotx.tswap.io"],
            "swapCodeHash":"3af062db29f1e04faeb5e35531fad75410473e40",
            "swapID":"f09b244a3c5cc74a49d5695a32c33af4ef572d9d",
            "poolAmount":"10000",
        }
    }
}
```

When code is 0, it means success. Otherwise it means failed and there will be a msg which describes the specific information.

data format:
> * token1: token1 info.
> * token2: token2 info.
> * lptoken: lpToken info.
> * rabinApis: rabin oracle address.
> * swapCodeHash: swap script code hash.
> * swapID: a unique ID for swap contract.
> * poolAmount: a pool amount used for sorting token pairs.

**Note: The request header of this interface must include {Accept-Encoding: gzip}**

## 2. Get Swap Info

### Request
- Method: **GET**
- URL: ```/swapinfo?symbol=bsv-ssp```

> * symbol: swap pool symbol which got from ```/allpairs```.

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

data format:

> * swapToken1Amount: token1 amount in swap pool, whose type is string.
> * swapToken2Amount: token1 amount in swap pool, whose type is string.
> * swapLpAmount: lp token amount in swap pool, whose type is string.
> * swapFeeRate: swap fee rate.
> * projFeeRate: proj fee rate.

## 3. Requst swap arguments

Before doing swap operation, you need request swap args.

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

> * symbol: swap symbol.
> * address: the user's address used for accepting bsv and tokens.
> * op: swap operation: 1 add liquidity, 2 remove liquidity, 3 swap token1 to token2. 4 swap token2 to token1.
> * source: mark the identity of the caller to make it easier to find errors.

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

**Note: requestIndex can't be used repeatedly. Need call ```/reqswapargs``` before every swap operation.**

data format:

> * requestIndex: request id to idendify this request.
> * tokenToAddress: tokenAddress for swap to accept token transfer.
> * bsvToAddress: bsvAddress for swap to accept bsv transfer.
> * txFee: miner fee of this swap opeartion.
> * swapToken1Amount: token1 amount in swap pool, whose type is string.
> * swapToken2Amount: token1 amount in swap pool, whose type is string.
> * swapLpAmount: lp token amount in swap pool, whose type is string.
> * swapFeeRate: swap fee rate.
> * projFeeRate: proj fee rate.
> * op: swap operation.

## 4. Add Liquidity

### Request
- Methos: **POST**
- URL: ```/addliq```
- Body: 
```
{
    data: compressedData
}
```

compressData format:
```
data = {
    symbol: "ssp-bsv",
    requestIndex: "1",
    token1AddAmount: "100000",
    token2RawTx: "",
    token2OutputIndex: 0,
    bsvRawTx: "",
    bsvOutputIndex: 0,
    amountCheckRawTx: "",
}
compressData = gzip(JSON.stringify(data))
```

> * symbol: swap symbol.
> * requestIndex: returned in ```/reqswapargs```.
> * token1AddAmount: The token1 amount you want to add to pool.
> * token2RawTx: The raw transaction for transfering token2 to tokenAddress.
> * token2OutputIndex: the outputIndex of transation for token2 transfering.
> * bsvRawTx: The raw transaction for transfering bsv to bsvAddress.
> * bsvOutputIndex: The outputIndex of transaction for bsv transfering.
> * amountCheckRawTx: the unlockFromContract tx used in token transfering.

**Note: If the token1 is bsv, you need transfer sum of token1AddAmount and txFee. And the minimum token1AddAmount is 1000 satoshis.**

**Note2: Do not broadcast rawTx，just send to tswap api. And the data need to be compressed to compressedData with request header {'Content-Type': 'application/json'}. There is a reference code in typescript:**
```
import { gzip } from 'node-gzip';
const request = require('superagent')
const reqData = {
    symbol,
    requestIndex: Number(data.requestIndex),
    token1AddAmount,
    tokenRawTx,
    tokenOutputIndex,
    bsvRawTx,
    bsvOutputIndex: 0,
    amountCheckRawTx,
}
const compressData = await gzip(JSON.stringify(reqData))
reqRes = await request.post(
    `${url}/addliq`
).send(compressData).set('Content-Type', 'application/json')
```
**Note3: When you generate the raw transactions, you need to avoid double spending. A feasible way is first create a bsv transaction，and use change bsv utxo of this transaction as input utxos to send to sensible-sdk which could avoid to double spending. The transaction construction code can be referenced at [buildBsvAndTokenTx](https://github.com/sensibleswap/bsv-web-wallet/blob/master/src/App.js#:~:text=const-,buildBsvAndTokenTx,-%3D%20async%20()%20%3D%3E%20%7B).**

The transaction dependency:

![image](tx.png)

A feasible way to construct:
> * 1 The wallet gets bsv utxos with sum amount greater than txFee + 50000 satoshis (token transfer usually cost about 20000 satoshis).
> * 2 Create bsv raw transtion.
> * 3 Use change bsv utxo of step 2 to pass to sensible-sdk to create token transfer transation.
> * 4 If step 3 fails for insufficient bsv amount, back to sept 1 to get more bsv amount utxo like txFee + 50000 * 2, and continue util success.

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

data format:

> * txid: the swap transaction id.
> * lpAddAmount: the lp token amount user got.

## 5. Remove Liquidity

### Request
- Methos: **POST**
- URL: ```/removeliq```
- Body: 
```
{
    symbol: "bsv-ssp",
    requestIndex: "1",
    lpTokenRawTx,
    lpTokenOutputIndex,
    bsvRawTx,
    bsvOutputIndex: 0,
    amountCheckRawTx,
}
```
> * symbol: swap symbol.
> * requestIndex: returned in ```/reqswapargs```.
> * lpTokenRawRawTx: The raw transaction for transfering lp token to tokenAddress.
> * lpTokenOutputIndex: the outputIndex of transation for lp Token transfering.
> * bsvRawTx: The raw transaction for transfering bsv to bsvAddress.
> * bsvOutputIndex: The outputIndex of transaction for bsv transfering.
> * amountCheckRawTx: the unlockFromContract tx used in token transfering.

**Note: the bsv transfer amount should be txFee**

**Note2: Donot broadcast rawTx, compress data and set header like addliq**

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

Data format:

> * txid: the swap transaction id.
> * token1Amount: the token1 amount user got.
> * token2Amount: the token2 amount user got.

## 6. Swap token1 to token2

### Request
- Method: **POST**
- URL: ```/token1totoken2```
- Body: 
```
{
    symbol: "bsv-ssp",
    requestIndex: "1"
    bsvRawTx,
    bsvOutputIndex: 0,
}
```

> * symbol: swap symbol.
> * requestIndex: returned in ```/reqswapargs```.
> * bsvRawTx: The raw transaction for transfering bsv to bsvAddress.
> * bsvOutputIndex: The outputIndex of transaction for bsv transfering.

**Note: the bsv transfer amount should be the sum of txFee and bsv amount you want to swap**

**Note2: Do not broadcast rawTx, compress data and set header like addliq**

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        txid: '88e64bcf3517c864bb4c224b52084d3b3261a57814dceb19f2b8af07934f9cf8',
        token2Amount: '715070265'
    }
}
```

> * txid: the swap transaction id.
> * token2Amount: the token2 amount user got.

## 7. Swap token2 to token1

### Request
- Method: **POST**
- URL: ```/token2totoken1```
- Body:
```
{
    symbol: "bsv-ssp",
    requestIndex: "1"
    token2RawTx,
    token2OutputIndex,
    bsvRawTx,
    bsvOutputIndex: 0,
    amountCheckRawTx,
}
```

> * symbol: swap symbol.
> * requestIndex: returned in ```/reqswapargs```.
> * token2RawTx: The raw transaction for transfering token2 to tokenAddress.
> * token2OutputIndex: the outputIndex of transation for token2 transfering.
> * bsvRawTx: The raw transaction for transfering bsv to bsvAddress.
> * bsvOutputIndex: The outputIndex of transaction for bsv transfering.
> * amountCheckRawTx: the unlockFromContract tx used in token transfering.

**Note: the bsv transfer amount should be txFee**

**Note2: Do not broadcast rawTx, compress data and set header like addliq**

### Response
```
{
    "code": 0,
    "msg": "",
    "data": {
        txid: '88e64bcf3517c864bb4c224b52084d3b3261a57814dceb19f2b8af07934f9cf8',
        token1Amount: '715070265'
    }
}
```

> * txid: the swap transaction id.
> * token2Amount: the token2 amount user got.