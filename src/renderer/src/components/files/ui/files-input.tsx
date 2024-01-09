import React, { FC, useState, useEffect } from 'react'
import FolderState, { FoldersState } from '../../../store/store-folders'
import storeFolders from '../../../store/store-folders'

interface InputProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: FoldersState
  path: string
}
export const FilesInput: FC<InputProps> = ({ data, path, ...props }) => {
  const { cancelPreCreate, successPreCreateFile, saveEdit } = storeFolders
  const [value, setValue] = useState<string>(data.name)

  function getFolders(path: string, inputValue: string) {
    return new Promise((resolve, reject) => {
      window.api.fs.readdir(path, (error, resp) => {
        if (error) reject(error)
        for (const names of resp) {
          if (names === inputValue) {
            reject()
            return
          }
        }
        resolve({ path, value: inputValue })
      })
    })
  }

  useEffect(() => {
    const clickOutsideHandler = (e) => {
      const element = document.querySelector('input')

      if (e.target !== element) {
        getFolders(path, value)
          .then((datas: any) => {
            if (data.editFile) {
              saveEdit(datas.path, datas.value)
            } else {
              successPreCreateFile(datas.path, datas.value)
            }
          })
          .catch((error) => {
            cancelPreCreate(data.path)
          })
      }
    }

    setTimeout(() => document.addEventListener('click', clickOutsideHandler), 1)

    return () => {
      document.removeEventListener('click', clickOutsideHandler)
    }
  }, [value, path, data])

  return (
    <input
      id="#input"
      value={value}
      autoFocus
      defaultValue={data.name}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  )
}
