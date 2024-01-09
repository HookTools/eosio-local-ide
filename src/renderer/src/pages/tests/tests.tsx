import { observer } from 'mobx-react-lite'
import React from 'react'
import { Folder } from '../../components/files/folder'
import { LeftTab } from '../../components/ui/leftBar'
import './home.scss'
import { TestsConfig } from './ui/tests-config'

export const Tests = observer(() => {
  return (
    <>
      <LeftTab>
        <Folder />
      </LeftTab>
      <TestsConfig />
    </>
  )
})
