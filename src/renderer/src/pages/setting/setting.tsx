import React from 'react'
import { Folder } from '../../components/files/folder'
import { LeftTab } from '../../components/ui/leftBar'
import Parameters from './accordion/accordion'

export const Setting = () => {
  const test = [
    {
      name: 'lol',
    },
  ]
  return (
    <>
      <LeftTab>
        <Folder />
      </LeftTab>
      <div className="w-full">
        <Parameters parametrs={test} />
      </div>
    </>
  )
}
