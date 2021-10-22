let swapAlgo = module.exports

swapAlgo.FEE_FACTOR = 10000
swapAlgo.MIN_TOKEN1_FEE = 500n

// count token2 and lp token amount with fixed token1 amount when add liquidity
swapAlgo.countLpAddAmount = function(token1AddAmount, swapToken1Amount, swapToken2Amount, swapLpTokenAmount) {
  token1AddAmount = BigInt(token1AddAmount)
  swapToken1Amount = BigInt(swapToken1Amount)
  swapToken2Amount = BigInt(swapToken2Amount)
  swapLpTokenAmount = BigInt(swapLpTokenAmount)
  let lpMinted = BigInt(0)
  let token2AddAmount = BigInt(0)
  if (swapLpTokenAmount > BigInt(0)) {
    lpMinted = token1AddAmount * swapLpTokenAmount / swapToken1Amount
    token2AddAmount = token1AddAmount * swapToken2Amount / swapToken1Amount
  } else {
    lpMinted = token1AddAmount
  }
  return [lpMinted, token2AddAmount]
}

// count token1 and lp token amount with fixed token2 amount when add liquidity 
swapAlgo.countLpAddAmountWithToken2 = function(token2AddAmount, swapToken1Amount, swapToken2Amount, swapLpTokenAmount) {
  token2AddAmount = BigInt(token2AddAmount)
  swapToken1Amount = BigInt(swapToken1Amount)
  swapToken2Amount = BigInt(swapToken2Amount)
  swapLpTokenAmount = BigInt(swapLpTokenAmount)
  let lpMinted = 0n
  let token1AddAmount = 0n
  if (swapLpTokenAmount > 0n) {
    token1AddAmount = token2AddAmount * swapToken1Amount / swapToken2Amount
    lpMinted = token1AddAmount * swapLpTokenAmount / swapToken1Amount
  } else {
    lpMinted = 0
  }
  return [lpMinted, token1AddAmount]
}

// count token1 and token2 amount when remove liquidity
swapAlgo.countLpRemoveAmount = function(lpTokenRemoveAmount, swapToken1Amount, swapToken2Amount, swapLpTokenAmount) {
  lpTokenRemoveAmount = BigInt(lpTokenRemoveAmount)
  swapToken1Amount = BigInt(swapToken1Amount)
  swapToken2Amount = BigInt(swapToken2Amount)
  swapLpTokenAmount = BigInt(swapLpTokenAmount)
  const token1RemoveAmount = lpTokenRemoveAmount * swapToken1Amount / swapLpTokenAmount
  const token2RemoveAmount = lpTokenRemoveAmount * swapToken2Amount / swapLpTokenAmount
  return [token1RemoveAmount, token2RemoveAmount]
}

// count token2 amount when swap token1 to token2
swapAlgo.swapToken1ToToken2 = function(token1AddAmount, swapToken1Amount, swapToken2Amount, swapFeeRate, projFeeRate, minProjFee=swapAlgo.MIN_TOKEN1_FEE) {
  token1AddAmount = BigInt(token1AddAmount)
  swapToken1Amount = BigInt(swapToken1Amount)
  swapToken2Amount = BigInt(swapToken2Amount)

  const token2RemoveAmount = token1AddAmount * BigInt(swapAlgo.FEE_FACTOR - swapFeeRate) * swapToken2Amount / ((swapToken1Amount + token1AddAmount) * BigInt(swapAlgo.FEE_FACTOR))

  let projFee = token1AddAmount * BigInt(projFeeRate) / BigInt(swapAlgo.FEE_FACTOR)
  if (projFee < minProjFee) {
    projFee = 0n
  }
  return [token2RemoveAmount, projFee]
}

// count token1 amount with expected token2 amount when swap token1 to token2
swapAlgo.swapToken1ToToken2ByToken2 = function(token2RemoveAmount, swapToken1Amount, swapToken2Amount, swapFeeRate, projFeeRate, minProjFee=swapAlgo.MIN_TOKEN1_FEE) {
  token2RemoveAmount = BigInt(token2RemoveAmount)
  swapToken1Amount = BigInt(swapToken1Amount)
  swapToken2Amount = BigInt(swapToken2Amount)

  const token1AddAmount = token2RemoveAmount * BigInt(swapAlgo.FEE_FACTOR) * swapToken1Amount / (BigInt(swapAlgo.FEE_FACTOR - swapFeeRate) * swapToken2Amount - token2RemoveAmount * BigInt(swapAlgo.FEE_FACTOR))

  let projFee = token1AddAmount * BigInt(projFeeRate) / BigInt(swapAlgo.FEE_FACTOR)
  if (projFee < minProjFee) {
    projFee = 0n
  }
  return [token1AddAmount, projFee]
}

// count token1 amount when swap token2 to token1
swapAlgo.swapToken2ToToken1 = function(token2AddAmount, swapToken1Amount, swapToken2Amount, swapFeeRate, projFeeRate, minProjFee=swapAlgo.MIN_TOKEN1_FEE) {
  token2AddAmount = BigInt(token2AddAmount)
  swapToken1Amount = BigInt(swapToken1Amount)
  swapToken2Amount = BigInt(swapToken2Amount)
  const token1RemoveAmount = token2AddAmount * BigInt(swapAlgo.FEE_FACTOR - swapFeeRate) * swapToken1Amount / ((swapToken2Amount + token2AddAmount) * BigInt(swapAlgo.FEE_FACTOR))
  let projFee = token2AddAmount * swapToken1Amount * BigInt(projFeeRate) / ((swapToken2Amount + token2AddAmount) * BigInt(swapAlgo.FEE_FACTOR))
  if (projFee < minProjFee) {
    projFee = 0n
  }
  return [token1RemoveAmount, projFee]
}

// count token2 amount with expected token1 amount when swap token2 to token1
swapAlgo.swapToken2ToToken1ByToken1 = function(token1RemoveAmount, swapToken1Amount, swapToken2Amount, swapFeeRate, projFeeRate, minProjFee=swapAlgo.MIN_TOKEN1_FEE) {
  token1RemoveAmount = BigInt(token1RemoveAmount)
  swapToken1Amount = BigInt(swapToken1Amount)
  swapToken2Amount = BigInt(swapToken2Amount)

  const token2AddAmount = token1RemoveAmount * BigInt(swapAlgo.FEE_FACTOR) * swapToken2Amount / (BigInt(swapAlgo.FEE_FACTOR - swapFeeRate) * swapToken1Amount - token1RemoveAmount * BigInt(swapAlgo.FEE_FACTOR))

  let projFee = token2AddAmount * swapToken1Amount * BigInt(projFeeRate) / ((swapToken2Amount + token2AddAmount) * BigInt(swapAlgo.FEE_FACTOR))
  if (projFee < minProjFee) {
    projFee = 0n
  }
  return [token2AddAmount, projFee]
}