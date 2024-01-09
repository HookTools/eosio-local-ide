import storeFolders from '@renderer/store/store-folders'
import { observer } from 'mobx-react-lite'
import React, { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import widthStore from '../../store/width-store'
import { ReactComponent as FileAddVSG } from './assets/file-add.svg'
import { ReactComponent as FolderAddVSG } from './assets/folder-add.svg'
import { ReactComponent as Reload } from './assets/reload.svg'
import { Config } from './config'
import './style.scss'

interface Props {
  children: React.ReactNode
}

// eslint-disable-next-line no-extend-native
const firstLetterToUppercase = (data: string) => {
  return data[0].toUpperCase() + data.slice(1)
}

export const LeftTab = observer(({ children }: Props) => {
  const { preCreateFolder, preCreateFile, chooseFolderPath } = storeFolders
  const { width, setWidth } = widthStore
  const [isPush, setIsPush] = useState(false)
  const [isConfigVisibile, setIsConfigVisible] = useState(false)

  const location = useLocation().pathname.split('/')[1]
  useEffect(() => {
    const handleMouseMove = (event) => {
      setWidth(event.clientX - 60 > 60 ? event.clientX - 60 : 0)
      setIsPush(true)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      setIsPush(false)
    }

    const handleMouseDown = () => {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp, { once: true })
    }
    const button = document.querySelector('#myButton')

    button.addEventListener('mousedown', handleMouseDown)
  }, [])

  const clickOutsideHandler = useCallback((e) => {
    const element = document.querySelector('config')

    if (e.target !== element) {
      setIsConfigVisible(false)
      document.removeEventListener('click', clickOutsideHandler)
    }
  }, [])

  return (
    <div
      style={{
        minWidth: `${width}px`,
        maxWidth: `${width}px`,
        background: '#1E1F1C',
      }}
      className="text-white relative h-full"
    >
      <div
        className="h-full"
        style={{ display: width < 60 ? 'none' : 'block', borderColor: 'blue' }}
      >
        <div className="flex text-xl p-2 items-center justify-between relative">
          <p>{location ? firstLetterToUppercase(location) : 'Explorer'}</p>
          <div className="flex items-center">
            <button onClick={() => preCreateFolder(chooseFolderPath)}>
              <FolderAddVSG className="fill-gray-400 hover:fill-white transition" />
            </button>
            <button onClick={() => preCreateFile(undefined)}>
              <FileAddVSG className="fill-gray-400 hover:fill-white transition" />
            </button>
            <button>
              <Reload className="fill-gray-400 hover:fill-white transition" />
            </button>
            <button
              className="ml-4"
              onClick={async () => {
                setIsConfigVisible(true)
                setTimeout(
                  () => document.addEventListener('click', clickOutsideHandler),
                  100,
                )
              }}
            >
              ···
            </button>
          </div>
          {isConfigVisibile && <Config />}
        </div>
        {children}
      </div>
      <button
        id="myButton"
        style={isPush ? { background: '#0862B6' } : {}}
        className="absolute top-0 right-0 h-full w-1"
      />
    </div>
  )
})
