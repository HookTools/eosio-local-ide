import Option from '@mui/joy/Option'
import Select from '@mui/joy/Select'
import React from 'react'

export const SettingConfig = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-[#262626] p-8 rounded-2xl w-3/4 h-fit text-white flex flex-col gap-2">
        <p className="text-2xl text-bolder">Setting</p>
        <div>
          <p>NETWORK config:</p>
          <Select
            className="!rounded w-full !bg-[#404040] rounded-xl"
            color="neutral"
            variant="solid"
            placeholder="WAX"
            size="md"
          >
            <Option value="WAX">WAX</Option>
            <Option value="testnet">TESTNET WAX</Option>
          </Select>
          <div className="mt-4">
            <p>RPC</p>
            <input
              className="bg-input-background p-2 text-white rounded w-full"
              placeholder="hooktools.gm"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  )
}
