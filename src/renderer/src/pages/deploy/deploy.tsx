import { Folder } from '@renderer/components/files/folder'
import { LeftTab } from '@renderer/components/ui/leftBar'
import React from 'react'
import { DeployConfig } from './ui/deploy-config'

export const Deploy = () => {
  return (
    <>
      <LeftTab>
        <Folder />
      </LeftTab>
      <DeployConfig />
    </>
  )
}
