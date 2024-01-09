import { Button } from '@renderer/shared/ui/button'
import storeWallets, { Wallets as _wallet } from '@renderer/store/store-wallets'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export const Wallets = observer(() => {
  const {
    anchor,
    setAnchor,
    wallets,
    addPrivate,
    network,
    removePrivate,
    link,
  } = storeWallets
  const { register, handleSubmit, reset } = useForm()
  const validationRules = {
    wallet: {
      required: 'Wallet is required',
      minLength: {
        value: 3,
        message: 'Min length - 3',
      },
      maxLength: {
        value: 12,
        message: 'Max length - 12',
      },
    },
  }

  const logout = () => {
    link.restoreSession('mydapp').then((session: any) => {
      if (session) {
        session.remove()
        setAnchor(null)
      }
    })
  }

  useEffect(() => {
    link.restoreSession('mydapp').then((session: any) => {
      if (session) {
        setAnchor(String(session.auth.actor))
      }
    })
  }, [])

  return (
    <div>
      <div className="flex items-center gap-5 mt-3">
        <input
          className="bg-input-background p-2 text-white rounded w-full"
          placeholder="hooktools.gm"
          disabled
          value={anchor || ''}
        />
        {anchor ? (
          <Button onClick={logout} className="w-fit bg-red-600">
            Logout
          </Button>
        ) : (
          <Button
            onClick={() =>
              link.login('mydapp').then((data) => setAnchor(data.payload.sa))
            }
            className="w-fit"
          >
            Connect
          </Button>
        )}
      </div>
      {wallets.map((post) => (
        <>
          <div className="flex w-full gap-2 mt-2">
            <div className="w-2/4">
              <input
                className="bg-input-background p-2 text-white rounded w-full"
                placeholder="Private Key"
                disabled
                value={post.privateKey}
              />
            </div>
            <div className="flex">
              <input
                className="bg-input-background p-2 text-white rounded w-full"
                placeholder="Wallet"
                disabled
                value={post.wallet}
              />
            </div>
            <div className="flex w-1/4">
              <input
                className="bg-input-background p-2 text-white rounded w-full"
                placeholder="Permission"
                disabled
                value={post.permission}
              />
            </div>
            <Button
              onClick={() => removePrivate(post.privateKey)}
              className="w-20 bg-red-600"
            >
              Remove
            </Button>
          </div>
        </>
      ))}
      <form
        onSubmit={handleSubmit((e: wallet) => {
          addPrivate({
            privateKey: e.privateKey,
            network,
            wallet: e.wallet,
            permission: e.permission,
          })
          reset()
        })}
      >
        <>
          <div className="flex w-full gap-2 mt-2">
            <div className="w-2/4">
              <input
                className="bg-input-background p-2 text-white rounded w-full"
                placeholder="Private Key"
                {...register('privateKey', { required: true })}
              />
            </div>
            <div className="flex">
              <input
                className="bg-input-background p-2 text-white rounded w-full"
                placeholder="Wallet"
                {...register('wallet', {
                  required: true,
                  minLength: 3,
                  maxLength: 12,
                })}
              />
            </div>
            <div className="flex w-1/4">
              <input
                className="bg-input-background p-2 text-white rounded w-full"
                placeholder="Permission"
                {...register('permission', { required: true })}
              />
            </div>
            <Button className="w-20">Add</Button>
          </div>
        </>
      </form>
    </div>
  )
})
