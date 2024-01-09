import { observer } from 'mobx-react-lite'
import React from 'react'
import { Folder } from '../../components/files/folder'
import { LeftTab } from '../../components/ui/leftBar'
import storeFolders from '../../store/store-folders'
import { ReactComponent as Waxback } from '../../ui/assets/WAX.svg'
import CodeEditor from '../../ui/codeEditor'
import './home.scss'

const Home = observer(() => {
  const { tabs } = storeFolders
  return (
    <>
      <LeftTab>
        <Folder />
      </LeftTab>
      {tabs.map((post) => (
        <CodeEditor key={post.name} choose={post.choose} data={post} />
      ))}
      {tabs.length === 0 && (
        <div className="bg-void w-full relative flex flex-col items-center justify-center	gap-4">
          <Waxback />
        </div>
      )}
    </>
  )
})

export default Home
