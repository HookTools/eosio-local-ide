import Option from '@mui/joy/Option/Option'
import Select from '@mui/joy/Select/Select'
import storeWallets from '@renderer/store/store-wallets'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Button } from '../../../shared/ui/button'

export const Authorisation = observer(() => {
  const {
    wallets,
    link,
    wallet,
    setWallet,
    anchor,
    setAnchor,
    connect,
    setConnect,
  } = storeWallets
  const logout = () => {
    link.restoreSession('mydapp').then((session: any) => {
      if (session) {
        session.remove()
        setWallet(null)
        setAnchor(null)
      }
    })
  }

  useEffect(() => {
    link.restoreSession('mydapp').then((session: any) => {
      if (session) {
        setWallet({ wallet: String(session.auth.actor) })
        setAnchor(String(session.auth.actor))
      }
    })
  }, [])
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-[#262626] rounded-2xl w-full h-fit text-white flex flex-col gap-2">
        <div>
          <p>Connect:</p>
          <Select
            className="!rounded w-full !bg-[#404040] rounded-xl"
            color="neutral"
            variant="solid"
            placeholder="Anchor"
            size="md"
            value={connect}
            onChange={(e, newValue) => setConnect(newValue)}
          >
            <Option value="anchor">Anchor</Option>
            <Option value="key">Private Key</Option>
          </Select>
        </div>
        {connect === 'anchor' ? (
          <div className="flex items-center gap-5 mt-3">
            <input
              className="bg-input-background p-2 text-white rounded w-full"
              placeholder="hooktools.gm"
              disabled
              value={anchor}
            />
            {anchor !== null ? (
              <Button onClick={logout} className="w-1/4 bg-red-600">
                Logout
              </Button>
            ) : (
              <Button
                onClick={() =>
                  link.login('mydapp').then((data) => {
                    setWallet({ wallet: data.payload.sa })
                    setAnchor(data.payload.sa)
                  })
                }
                className="w-1/4"
              >
                Connect
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mt-2 flex">
              <Select
                className="!rounded w-full !bg-[#404040] rounded-xl"
                color="neutral"
                variant="solid"
                placeholder="Wallets"
                size="md"
                onChange={(e, newValue) => setWallet(JSON.parse(newValue))}
                defaultValue={wallet}
              >
                {wallets.map((data) => (
                  <Option value={JSON.stringify(data)}>
                    {data.wallet}@{data.permission}
                  </Option>
                ))}
              </Select>
            </div>
          </>
        )}
      </div>
    </div>
  )
})
