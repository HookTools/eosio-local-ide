import React from 'react'
import { BuildConfig } from './ui/build-config'
import { BuildLeftTab } from './ui/build-left-tab'

export const Build = () => {
  return (
    <>
      <BuildLeftTab />
      <BuildConfig />
    </>
  )
}
