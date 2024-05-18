import { readFileFS } from '@renderer/shared/fs'
import storeFolders, { FoldersState } from '@renderer/store/store-folders'
import React, { FC, ReactNode, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  data: FoldersState
}
export const FilesButton: FC<ButtonProps> = ({ data, children, ...props }) => {
  const { deleteAll, editFile, changeChooseFolderPath } =
    storeFolders

  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const clickOutsideHandler = (e) => {
    setIsVisible(false)
    document.removeEventListener('click', clickOutsideHandler)
  }

  useEffect(() => {
    return () => {
      document.removeEventListener('click', clickOutsideHandler)
    }
  }, [])

  return (
    <>
      <button
        onContextMenu={(e) => {
          setTimeout(
            () => document.addEventListener('click', clickOutsideHandler),
            100,
          )
          setTop(e.pageY)
          setLeft(e.pageX)
          setIsVisible(true)
        }}
        onClick={(e) => {
          e.stopPropagation()
          changeChooseFolderPath(data.path.split('/').slice(0, -1).join('/'))

          readFileFS(data.path, data.name)
        }}
        {...props}
      >
        {children}
      </button>
      {isVisible &&
        createPortal(
          <div
            style={{ left, top }}
            className="absolute bg-explorer-inputs border p-2 rounded text-white flex flex-col items-start text-xs "
          >
            <button
              onClick={() => deleteAll(data.path)}
              className="hover:text-console-blue transition"
            >
              Delete
            </button>
            <button
              onClick={() => editFile(data.path)}
              className="hover:text-console-blue transition"
            >
              Edit
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}
