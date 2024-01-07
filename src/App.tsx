import React, { useCallback, useEffect, useState } from 'react'
import { Container, Button, Grid, Typography } from '@mui/material'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { ConnectWallet } from '@thirdweb-dev/react'
import { useAddress } from '@thirdweb-dev/react'
import { fetchData } from './services/project'
import { ethers } from 'ethers'
// import abiCoder from 'web3-eth-abi'
import { ERC_20_ABI } from './abis/erc20'
const abiCoder = require('web3-eth-abi')

function encodeTxData(method: any, recipient: string, amount: string): string {
  const coder = abiCoder as any
  return coder.encodeFunctionCall(method, [recipient, amount])
}

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const address = useAddress()
  const [data, setData] = useState<any>(null)

  const handleTransfer = useCallback(async () => {
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          // usdc transfer
          {
            // get from fetchBalance tokeninfo address
            to: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
            value: '0',
            data: encodeTxData(
              ERC_20_ABI.transfer,
              '0x31aB1A1F559e0A025f8523C64c9988d5850B83aC',
              // parse units with token decimals
              ethers.utils.parseUnits('0.1', 6).toString(),
            ),
          },
          // eth transfer
          {
            to: '0x31aB1A1F559e0A025f8523C64c9988d5850B83aC',
            // parse units with eth decimals
            value: ethers.utils.parseEther('0.1').toString(),
            data: '0x',
          },
        ],
      })
      console.log({ safeTxHash })
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })
    } catch (e) {
      console.error(e)
    }
  }, [sdk.txs])

  const fetchBalance = useCallback(async () => {
    const data = await sdk.safe.experimental_getBalances()
    console.log(data)
  }, [sdk.safe])

  useEffect(() => {
    if (address) {
      fetchData(address).then((res) => setData(res))
      fetchBalance()
      // 0x0013c41da98f5daa0eed756d059757205dd1238ee8fc76c8c227e8d539abbc8a
    }
  }, [address, fetchBalance])

  return (
    <Container>
      <Grid container direction="column" rowSpacing={2} alignItems="center">
        <Grid item>
          <Typography variant="h3">Safe: {safe.safeAddress}</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleTransfer}>
            Click to send a test transaction
          </Button>
        </Grid>
        <Grid item>
          <ConnectWallet />
        </Grid>
        <Grid item>
          <ul>{data && data.map((item: any) => <li key={item.id}>{item.name}</li>)}</ul>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SafeApp
