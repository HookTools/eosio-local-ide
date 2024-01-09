import { Button } from '@renderer/shared/ui/button'
import storeExplorer from '@renderer/store/store-explorer'
import storeWallets from '@renderer/store/store-wallets'
import React from 'react'
import { useForm } from 'react-hook-form'

export const SearchForm = () => {
  const { register, handleSubmit } = useForm()
  const { getContract } = storeExplorer
  const { RPC } = storeWallets
  return (
    <div className="w-full mb-2">
      <div>
        <form
          className="flex items-center gap-2 w-full"
          onSubmit={handleSubmit((data) => {
            getContract(data.wallet, RPC)
          })}
        >
          <input
            className="bg-input-background p-2 text-white rounded-xl w-3/4"
            {...register('wallet')}
            required={true}
            minLength={4}
            maxLength={12}
            placeholder="Smart contract"
          />
          <Button className="w-1/4">Load</Button>
        </form>
      </div>
    </div>
  )
}
