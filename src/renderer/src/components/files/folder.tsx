import { GetIcon } from '@renderer/shared/icons/icons'
import { Help } from '@renderer/ui/help'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import FolderState, { FoldersState } from '../../store/store-folders'
import { FilesButton } from './ui/files-btn'
import { FilesInput } from './ui/files-input'
import { FolderButton } from './ui/folder-btn'
import { FolderInput } from './ui/folder-input'

interface Props {
  files: FoldersState
  padding: number
}

export const Folder = observer(() => {
  const { folders, addTab, changeChooseFolderPath } = FolderState
  const folderName = folders.name
  return (
    <div
      className="flex flex-col items-start w-full h-full"
      onClick={() => changeChooseFolderPath(folders.path)}
    >
      <p className="text-xxl text-bolder ml-1 text-bolder">{folderName}</p>
      {!folders.name && <Help />}
      <div className="w-full overflow-y-auto">
        <Folders padding={2} files={folders} />
      </div>
    </div>
  )
})

export const Folders = observer(({ files, padding }: Props) => {
  const { changeChooseFolderPath, chooseFolderPath } = FolderState
  return (
    <div
      className={
        chooseFolderPath === files.path ? ' w-full bg-[#42494969]' : 'w-full'
      }
      onClick={(e) => {
        e.stopPropagation()
        changeChooseFolderPath(files.path.split('/').slice(0, -1).join('/'))
      }}
    >
      {files.value.map((post) => (
        <div key={post.name}>
          {post.isFolder ? (
            post.editName ? (
              <FolderInput
                path={files.path}
                style={{ paddingLeft: `${padding + 8}px` }}
                className="hover:bg-folders-hover bg-gray-800 w-full text-start flex items-center gap-1 text-xs"
                data={post}
              />
            ) : (
              <div>
                <FolderButton
                  choose={post.path === chooseFolderPath}
                  isOpen={post.isOpen && post.path === chooseFolderPath}
                  style={{ paddingLeft: `${padding + 8}px` }}
                  data={post}
                >
                  {post.name}
                </FolderButton>
              </div>
            )
          ) : post.editName ? (
            <FilesInput
              path={files.path}
              style={{ paddingLeft: `${padding + 8}px` }}
              className="hover:bg-folders-hover bg-gray-800 w-full text-start flex items-center gap-1 text-xs"
              data={post}
            />
          ) : (
            <FilesButton
              style={{ paddingLeft: `${padding + 8}px` }}
              className="hover:bg-folders-hover w-full text-start flex items-center gap-1 text-xs"
              data={post}
            >
              <GetIcon file={post.name} className="w-2" />
              {post.name}
            </FilesButton>
          )}
          {post.isOpen && <Folders files={post} padding={padding + 8} />}
        </div>
      ))}
    </div>
  )
})
