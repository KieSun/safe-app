import React, { useCallback, useEffect, useState } from 'react'
import { Container, Button, Grid, Typography } from '@mui/material'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import { ConnectWallet } from '@thirdweb-dev/react'
import { useAddress } from '@thirdweb-dev/react'
import { fetchData } from './services/project'

const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const address = useAddress()
  const [data, setData] = useState<any>(null)

  const submitTx = useCallback(async () => {
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: safe.safeAddress,
            value: '0',
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
  }, [safe, sdk])

  useEffect(() => {
    if (address) {
      fetchData(address).then((res) => setData(res))
    }
  }, [address])

  return (
    <Container>
      <Grid container direction="column" rowSpacing={2} alignItems="center">
        <Grid item>
          <Typography variant="h3">Safe: {safe.safeAddress}</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={submitTx}>
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
