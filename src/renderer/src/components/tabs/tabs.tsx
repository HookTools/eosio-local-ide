import storeDeploy from '@renderer/store/store-deploy'
import { observer } from 'mobx-react-lite'
import React from 'react'
import FolderState from '../../store/store-folders'
import playImg from '../assets/play.svg'
import { TabsButtons } from './ui/tabs-button'

const Tabs = observer(() => {
  const { folders } = FolderState
  const { startBuild } = storeDeploy
  const { tabs } = FolderState
  return (
    <div
      style={{ borderBottom: '0.5px #FFF solid' }}
      className="flex w-full h-8 text-white items-center px-2 border-b !border-border	overflow-auto"
    >
      <button
        onClick={() => startBuild(folders.path)}
        className="px-2 rounded-sm opacity-80	hover:opacity-100"
      >
        <img width={15} src={playImg} alt="" />
      </button>
      {tabs.map((post) => (
        <TabsButtons choose={post.choose} data={post} key={post.name}>
          {post.name}
        </TabsButtons>
      ))}
    </div>
  )
})

export default Tabs
