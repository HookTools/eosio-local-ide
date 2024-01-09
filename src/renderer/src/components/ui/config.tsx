import { getFolderPath, openFolder } from '@renderer/shared/fs'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Config = () => {
  const navigate = useNavigate()
  return (
    <div
      id="#config"
      className="absolute right-2 translate-y-2/4 translate-x-full bg-console-background p-2 rounded-xl flex flex-col border align-start text-start z-10"
    >
      <button
        className="text-start hover:text-console-blue text-xs transition"
        onClick={() => getFolderPath().then((resp) => openFolder(resp))}
      >
        Browse folder...
      </button>
      <button
        className="text-start hover:text-console-blue text-xs transition"
        onClick={() => navigate('/search')}
      >
        Create project...
      </button>
      <button
        className="text-start hover:text-console-blue text-xs transition"
        onClick={() => getFolderPath().then((resp) => openFolder(resp))}
      >
        Rename
      </button>
      <button
        className="text-start hover:text-console-blue text-xs transition"
        onClick={() => getFolderPath().then((resp) => openFolder(resp))}
      >
        Delete
      </button>
    </div>
  )
}
