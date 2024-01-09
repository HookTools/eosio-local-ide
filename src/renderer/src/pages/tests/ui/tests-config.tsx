import { Button } from '@renderer/shared/ui/button'
import { Input } from '@renderer/shared/ui/input'
import storeTests from '@renderer/store/store-tests'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'

interface Files {
  name: string
  path: string
}

export const TestsConfig = observer(() => {
  const { startTests } = storeTests
  const [files, setFiles] = useState<Files[]>([])
  const delFile = (name) => {
    setFiles(files.filter((data) => data.name !== name))
  }
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-[#262626] p-8 rounded-2xl w-3/4 h-fit text-white flex flex-col gap-2">
        <p className="text-2xl text-bolder">Start testing:</p>
        <p>Files:</p>
        <div className="flex gap-2 items-center justify-between">
          <p className="bg-input-background p-2 text-white w-3/4">
            Files: {files.length}
          </p>
          <label
            htmlFor="fileInput"
            className="px-4 h-10 transition bg-button-blue  rounded-xl px-20 border border-black text-xl flex items-center justify-center gap-2 text-stroke hover:bg-[#056DCD] transition cursor-pointer"
          >
            Open
          </label>
          <input
            className="hidden"
            type="file"
            id="fileInput"
            multiple
            onChange={(e) => setFiles(Object.values(e.target.files))}
          />
        </div>
        {files.map((data, index) => {
          return (
            <div key={data.path} className="flex items-center justify-between">
              <p>
                {index + 1}. {data.name}
              </p>
              <button onClick={() => delFile(data.name)}>Delete</button>
            </div>
          )
        })}
        <Button
          onClick={() => startTests(files)}
          disabled={files.length < 1}
          className="w-full"
        >
          Start
        </Button>
      </div>
    </div>
  )
})
