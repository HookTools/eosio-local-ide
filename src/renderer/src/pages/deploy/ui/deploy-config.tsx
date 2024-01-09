import Checkbox from '@mui/joy/Checkbox/Checkbox'
import Option from '@mui/joy/Option/Option'
import Select from '@mui/joy/Select/Select'
import storeTests from '@renderer/store/store-tests'
import storeWallets from '@renderer/store/store-wallets'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Button } from '../../../shared/ui/button'
import storeDeploy from '../../../store/store-deploy'
import storeFolders from '../../../store/store-folders'

export const DeployConfig = observer(() => {
  const { startTestsInFolder } = storeTests
  const {
    network,
    changeNetWork,
    wallets,
    waxMainnetRPC,
    waxTestnetRPC,
    link,
    wallet,
    setWallet,
    anchor,
    setAnchor,
    connect,
    setConnect,
    cleanContract,
  } = storeWallets
  console.log(connect)
  const { deploy, deployConfig, setDeployConfig } = storeDeploy
  const { folders } = storeFolders
  const { deployContract } = storeWallets
  const logout = () => {
    link.restoreSession('mydapp').then((session: any) => {
      if (session) {
        session.remove()
        setWallet(null)
        setAnchor(null)
      }
    })
  }
  console.log(!wallet || !folders.name)
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
      <div className="bg-[#262626] p-8 rounded-2xl w-3/4 h-fit text-white flex flex-col gap-2">
        <p className="text-2xl text-bolder">Deploy Setting</p>
        <div>
          <p>ENVIRONMENT:</p>
          <Select
            className="!rounded w-full !bg-[#404040] rounded-xl"
            color="neutral"
            variant="solid"
            placeholder="WAX"
            size="md"
            value={network}
            onChange={(e, newValue: any) => changeNetWork(newValue)}
          >
            <Option value="mainnet">WAX</Option>
            <Option value="testnet">TESTNET WAX</Option>
          </Select>
        </div>
        <div>
          <p>Connect:</p>
          <Select
            className="!rounded w-full !bg-[#404040] rounded-xl"
            color="neutral"
            variant="solid"
            placeholder="Anchor"
            size="md"
            value={connect}
            onChange={(e, newValue: any) => setConnect(newValue)}
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
              <Button onClick={logout} className="w-fit bg-red-600">
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
                className="w-fit"
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
                onChange={(e, newValue: any) => setWallet(JSON.parse(newValue))}
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
        <div className="flex gap-5 items-center">
          <p>
            <Checkbox
              className="!text-white"
              label="Clean"
              variant="outlined"
              size="sm"
              checked={deployConfig === 'clean'}
              onChange={(e) =>
                setDeployConfig(e.target.checked ? 'clean' : 'default')
              }
            />
          </p>
          <p>
            <Checkbox
              className="!text-white"
              label="Migrate"
              variant="outlined"
              size="sm"
              checked={deployConfig === 'migrate'}
              onChange={(e) =>
                setDeployConfig(e.target.checked ? 'migrate' : 'default')
              }
            />
          </p>
          <p>
            <Checkbox
              className="!text-white"
              label="Tests"
              variant="outlined"
              size="sm"
              checked={deployConfig === 'tests'}
              onChange={(e) =>
                setDeployConfig(e.target.checked ? 'tests' : 'default')
              }
            />
          </p>
        </div>

        <Button
          disabled={!wallet || !folders.name}
          onClick={async () => {
            const contractData = await window.api.getDeployData(folders.path)
            deployContract(contractData.abi, contractData.wasm).then(() => {
              if (deployConfig === 'tests') startTestsInFolder()
            })
          }}
          className="w-full mt-5"
        >
          Deploy
        </Button>
      </div>
    </div>
  )
})
