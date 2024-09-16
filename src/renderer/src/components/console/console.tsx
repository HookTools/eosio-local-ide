import storeDeploy from '@renderer/store/store-deploy'
import storeTests from '@renderer/store/store-tests'
import { observer } from 'mobx-react-lite'
import  { useEffect, useState } from 'react'
import { ConnectSvg } from './assets/connect'
import waxLogo from './assets/wax-logo.png'
import { Terminaled } from './terminal'

const Console = observer(() => {
  const [isPush, setIsPush] = useState(false)
  const [version, setVersion] = useState(null)
  const {
    testsResponse,
    height,
    setHeight,
    tests,
    setTests,
  } = storeTests
  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getVersion')
      .then((data) => setVersion(data))
      .catch((e) => console.log(e?.message))
  }, [])
  const [isConnected, setIsConnected] = useState(false)
  useEffect(() => {
    const button = document.querySelector('#console-height')

    function handleMouseMove(event) {
      setHeight(
        window.innerHeight - event.clientY > 50
          ? window.innerHeight - event.clientY
          : 0,
      )
    }
    function handleMouseUp() {
      document.removeEventListener('mousemove', handleMouseMove)
      setIsPush(false)
    }

    function handleMouseDown() {
      setIsPush(true)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp, { once: true })
    }

    button!.addEventListener('mousedown', handleMouseDown)
  }, [])

  useEffect(() => {
    setInterval(() => {
      setIsConnected(navigator.onLine)
    }, 10000)
  }, [])

  const { build, setErrorIsVisible } = storeDeploy
  return (
    <div
      style={{ minHeight: '20px' }}
      className="fixed w-full bottom-0 left-0 w-full border-t border-border h-fit z-10"
    >
      <div className="absolute bg-console-blue bottom-0 left-0 z-10 min-w-full min-h-5 max-h-5 flex items-center">
        <div className="flex items-center p-1 justify-between	w-full">
          <button>
            <img width={15} src={waxLogo} alt="" />
          </button>
          <div className="flex items-center gap-2 text-bolder text-white">
            {build === 'errors' && (
              <button
                onClick={() => setErrorIsVisible(true)}
                className="w-4 h-4 text-xs rounded bg-red-600"
              >
                1
              </button>
            )}
            <p>v{version}</p>
            <ConnectSvg width={20} fill={isConnected ? 'green' : 'red'} />
          </div>
        </div>
      </div>
      <div
        style={{ height: `${height}px` }}
        className="min-w-full min-h-5 bg-console-background p-2 text-white text-bolder text-xl"
      >
        <div className="flex gap-2 items-center">
          <button
            style={!tests ? { opacity: 1 } : {}}
            onClick={() => setTests(false)}
            className="text-sm opacity-60 hover:opacity-100 mb-2"
          >
            Terminal:
          </button>
          <button
            style={tests ? { opacity: 1 } : {}}
            onClick={() => setTests(true)}
            className="text-sm opacity-60 hover:opacity-100 mb-2"
          >
            Tests:
          </button>
        </div>
        <div className="w-full h-full">
          {tests ? (
            <div className="overflow-x-auto h-4/5 w-full">
              {testsResponse?.map((data) => (
                <p
                  className="text-xs overflow-x-auto whitespace-pre"
                  key={Math.random()}
                >
                  {String(data)}
                </p>
              ))}
            </div>
          ) : (
            <Terminaled height={height} />
          )}
        </div>
      </div>
      <button
        style={isPush ? { background: '#0862B6' } : {}}
        id="console-height"
        className="absolute top-0 left-0 w-full h-1 cursor-ns-resize z-10"
      />
      <button
        onClick={() => setHeight(10)}
        className="absolute right-2 top-2 text-white"
      >
        x
      </button>
    </div>
  )
})

export default Console
