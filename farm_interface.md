# farmServer接口

## 接口地址

- 主网: https://api.tswap.io/farm
- 测试网: https://api.tswap.io/farm/test

## 接口介绍

## 1. 获取所有的farm对

### Request
- Method: **GET**
- URL: ```/allpairs```

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
			}
		}
	}
}
```

code为0时，表示正常返回data。code为1时，表示由错误。错误信息在msg中。token是需要进行质押的token信息。rewardToken是质押token后获得的奖励token信息。

## 2. 获取farm信息


### Request
- Method: **GET**
- URL: ```/farminfo?symbol=tbsv-test```

> * symbol: farm池的符号，/allpairs接口获得。

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
		"accPoolPerShare": "102999999999999"
	}
}
```

> * rewardAmountFactor: 用于计算用户的奖励。
> * rewardAmountPerBlock是当前farm池每个区块所产生的奖励token数量。
> * lastRewardBlock是上次更新操作时的block高度。
> * poolTokenAmount是当前farm池质押的token数量。
> * accPoolPerShare是累计的奖励，用于更rewardAmountFactor一起计算用户可获得的奖励token。

## 3. 获取用户信息

### Request
- Method: **GET**
- URL: ```/userinfo?symbol=tbsv-test&address=mzJR1zKcZCZvMJj87rVqmFFxmaVEe62BBW```
> * symbol: farm池的符号，/allpairs接口获得。
> * address: 用户地址。

### Response
```
{
	"code": 0,
	"msg": "",
	"data": {
		"tokenAmount": "18000",
		"rewardDebt": "18539999999"
	}
}
```
> * tokenAmount: 用户当前质押的token数量。
> * rewardDebt: 用户可以获得的奖励token数量。

## 4. 请求farm操作

在进行farm操作的时候先去请求最新的数据，然后在进行具体的farm操作

### Request

- Method: **POST**

- URL: ```/reqfarmargs```

- Body:
```
{
    symbol: "tbsv-test",
    address: "msREe5jsynP65899v1KJCydf6Sc9pJPb8S",
    op: 1,
    source: 'tswap.io'
}
```
> * symbol: farm池的符号。
> * address: 操作者用于保存和接受token的地址。
> * op: farm操作。1 质押，2 提取，3 收获
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

code为0时，表示正常返回data。code为1时，表示由错误。错误信息在msg中。**注意每次进行farm操作是都需要申请新的requestIndex，requestIndex不能重复使用。**

data格式如下：

> * requestIndex: 请求编号
> * tokenToAddress: 需要转入token到swap池中的地址
> * bsvToAddress: 需要转入的矿工费以及bsv到如下地址
> * txFee: 此操作需要到矿工费
> * op: farm操作类型

## 5. 质押

把token只要到farm池中

### Resuest
- Methos: **POST**
- URL: ```/deposit```
- Body: 
```
{
    symbol: "tbsv-test",
    requestIndex: "1",
    tokenTxID: "ea3ddf0825481df5b0c8cac56c2ffd5d8919397eaf169b8204d4e4ead82735b3",
    tokenOutputIndex: 1,
}
```
> * symbol: farm池的符号。
> * requestIndex: 之前通过reqswapargs获取的编号。
> * tokenTxID: token转账tx的id。
> * tokenOutputIndex: token转账tx的outputIndex。

**注意: 碰到需要同时转一笔bsv和一笔token的接口，必须先转bsv然后再转token，这样farm过程中断了才能退回来。之前有碰到过一个错误，就是转了bsv后，紧接着马上转token，由于bsv utxo更新延迟，会导致mempool conflic的问题，一个解决方法是直接本地构造一个bsv的转账tx，将找零utxo和其他的utxo一起传入到sensible-sdk（sensible-sdk转账ft支持传入utxos），这样能避免双花问题**

### Response
```
{
	"code": 0,
	"msg": "",
	"data": {
		"txid": "88e64bcf3517c864bb4c224b52084d3b3261a57814dceb19f2b8af07934f9cf8"
	}
}
```
code为0时，表示正常返回data, txid为farm操作的交易id。code为1时，表示由错误。错误信息在msg中。

## 6. 提取

把质押在farm池中的token提取出来。提取操作需要进行两次网络请求，withdraw和withdraw2.

### Request
- Methos: **POST**
- URL: ```/withdraw```
- Body: 
```
{
    symbol: "tbsv-test",
    requestIndex: "1",
    tokenRemoveAmount: "1000",
}
```
> * symbol: farm池的符号。
> * requestIndex: 之前通过reqfarmargs获取的编号。
> * tokenRemoveAmount: 需要提取的token数量，BitInt.toString()。

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

获取到withdraw接口的返回参数后，需要使用之前reqfarmargs传入的address对应的私钥对tx进行签名。签名参考代码
```
const tx = bsv.Transaction(data.txHex)
const script = bsv.Script.fromBuffer(Buffer.from(data.scriptHex, 'hex'))
const pubKey = toHex(this.privateKey.publicKey)
const sig = toHex(signTx(tx, this.privateKey, script.toASM(), Number(data.satoshis), data.inputIndex))
```

在计算出pubKey和sig之后，继续调用withdraw2接口

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
> * symbol: farm池的符号。
> * requestIndex: 之前通过reqfarmargs获取的编号。
> * pubKey: address对应的公钥。
> * sig: address对应的私钥对tx的签名。

### Response
```
{
	"code": 0,
	"msg": "",
	"data": {
		"txid": "88e64bcf3517c864bb4c224b52084d3b3261a57814dceb19f2b8af07934f9cf8"
	}
}
```
code为0时，表示正常返回data, txid为farm操作的交易id。code为1时，表示由错误。错误信息在msg中。

## 7. 收获

提取质押token后获得的奖励token。收获操作需要进行两次网络请求，harvest和harvest2。

### Request
- Methos: **POST**
- URL: ```/harvest```
- Body: 
```
{
    symbol: "tbsv-test",
    requestIndex: "1",
}
```
> * symbol: farm池的符号。
> * requestIndex: 之前通过reqfarmargs获取的编号。

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

获取到harvest接口的返回参数后，需要使用之前reqfarmargs传入的address对应的私钥对tx进行签名。签名代码参考withdraw。

在计算出pubKey和sig之后，继续调用harvest2接口

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
> * symbol: farm池的符号。
> * requestIndex: 之前通过reqfarmargs获取的编号。
> * pubKey: address对应的公钥。
> * sig: address对应的私钥对tx的签名。

### Response
```
{
	"code": 0,
	"msg": "",
	"data": {
		"txid": "88e64bcf3517c864bb4c224b52084d3b3261a57814dceb19f2b8af07934f9cf8"
	}
}
```
code为0时，表示正常返回data, txid为farm操作的交易id。code为1时，表示由错误。错误信息在msg中。