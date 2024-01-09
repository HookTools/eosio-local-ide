import Option from '@mui/joy/Option'
import Select from '@mui/joy/Select'
import { Button } from '@renderer/shared/ui/button'
import storeWallets from '@renderer/store/store-wallets'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'

export const Network = observer(() => {
  const { network, changeNetWork, setWaxMainnetRPC, setWaxTestnnetRPC, RPC } =
    storeWallets
  return (
    <div className="text-white">
      <p>ENVIRONMENT:</p>
      <Select
        className="!rounded w-full !bg-[#404040] rounded-xl"
        color="neutral"
        variant="solid"
        placeholder="WAX"
        size="md"
        value={network}
        onChange={(e, newValue) => changeNetWork(newValue)}
      >
        <Option value="mainnet">WAX</Option>
        <Option value="testnet">TESTNET WAX</Option>
      </Select>
      <div className="flex items-center gap-5 mt-3">
        <input
          className="bg-input-background p-2 text-white rounded w-full"
          placeholder="RPC URL"
          value={RPC}
          onChange={(e) =>
            network === 'mainnet'
              ? setWaxMainnetRPC(e.target.value)
              : setWaxTestnnetRPC(e.target.value)
          }
        />
        <Button>Save</Button>
      </div>
    </div>
  )
})
