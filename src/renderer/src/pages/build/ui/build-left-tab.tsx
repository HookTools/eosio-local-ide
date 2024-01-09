import Checkbox from '@mui/joy/Checkbox'
import Option from '@mui/joy/Option/Option'
import Select from '@mui/joy/Select/Select'
import storeFolders from '@renderer/store/store-folders'
import React from 'react'
import { LeftTab } from '../../../components/ui/leftBar'
import { Button } from '../../../shared/ui/button'
import storeDeploy from '../../../store/store-deploy'

export const BuildLeftTab = () => {
  const { folders } = storeFolders
  const {
    autoCompile,
    hideWarning,
    setAutoCompile,
    setHideWarning,
    startBuild,
  } = storeDeploy
  return (
    <>
      <LeftTab>
        <div className="p-2 flex flex-col gap-2 bg-[#242424]">
          <p>Compiler</p>
          <p>
            <Select
              className="!rounded w-full !bg-[#404040] rounded-xl"
              color="neutral"
              variant="solid"
              placeholder="1.8.1"
              value="1.8.1"
              size="sm"
            >
              <Option value="1.8.1">1.8.1</Option>
            </Select>
          </p>
          <p>
            <Checkbox
              className="!text-white"
              label="Auto compile"
              variant="outlined"
              size="sm"
              color="primary"
              defaultChecked={autoCompile}
              onChange={(e) => setAutoCompile(e.target.checked)}
            />
          </p>
          <p>
            <Checkbox
              className="!text-white"
              label="Hide warnings"
              variant="outlined"
              size="sm"
              defaultChecked={hideWarning}
              onChange={(e) => setHideWarning(e.target.checked)}
            />
          </p>
        </div>
        <div className="p-2">
          <Button onClick={() => startBuild(folders.path)} className="w-full">
            Compile
          </Button>
        </div>
      </LeftTab>
    </>
  )
}
