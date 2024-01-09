import React from 'react'
import { getFolderPath, openFolder } from '../shared/fs'

export const Help = () => {
  return (
    <div className="p-2">
      <p className="text-xs">
        To start working on smart contracts, open the repository.
      </p>
      <button
        onClick={() => getFolderPath().then((path) => openFolder(path))}
        className="w-full py-1 my-2 bg-blue-500"
      >
        Open Repository
      </button>
      <p className="text-xs">
        You can get detailed information about WAX blockchain development at
        <a className="text-blue-600" href="https://developer.wax.io/">
          &nbsp; https://developer.wax.io/
        </a>{' '}
        or
        <a className="text-blue-600" href="https://developers.eos.io/">
          &nbsp; https://developers.eos.io/
        </a>
        . To familiarize yourself with the IDE's functionality, click here.
      </p>
    </div>
  )
}
