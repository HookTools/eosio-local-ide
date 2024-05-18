import { observer } from 'mobx-react-lite'
import React, { useState, useCallback, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Console from './components/console/console'
import Tabs from './components/tabs/tabs'
import { NavBar } from './components/ui/navBar'
import { TestModal } from './eosio-testify/ui/build-error'
import './index.css'
import { Build } from './pages/build/build'
import { Deploy } from './pages/deploy/deploy'
import { Explorer } from './pages/explorer/explorer'
import Home from './pages/home/home'
import { Search } from './pages/search/search'
import { Setting } from './pages/setting/setting'
import { Tests } from './pages/tests/tests'
import { openFolder } from './shared/fs'
import { useListener } from './shared/hooks/useListener'
import { BuildError } from './shared/modal/build-error'
import { DeployModal } from './shared/modal/deploy-modal'
import { SaveModal } from './shared/modal/save-modal'
import FoldersState from './store/store-folders'
import DragAndDrop from './ui/dragAndDrop'

const App = observer(() => {
  const { currentTab, closeTab } = FoldersState
  useListener()
  const navigate = useNavigate()
  const [drag, setDrag] = useState(false)
  const dragStartHandler = (e: any) => {
    if (e.dataTransfer.effectAllowed !== 'all') return

    e.preventDefault()
    setDrag(true)
  }

  const dragLeaveHandler = (e: any) => {
    e.preventDefault()
    setDrag(false)
  }

  const onDropHandler = (e: any) => {
    setDrag(false)
    e.preventDefault()
    const files = [...e.dataTransfer.files]
    openFolder(files[0].path)
  }

  const handleKeyPress = useCallback((event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'w') {
      event.preventDefault()
      const tab = currentTab().name
      if (tab) {
        closeTab(tab)
      }
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
      // event.preventDefault()
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      event.preventDefault()
    }
  }, [])

  useEffect(() => {
    addEventListener('keydown', handleKeyPress)
    navigate('/')
  }, [])

  return (
    <div
      className="app"
      onDragStart={(e) => dragStartHandler(e)}
      onDragLeave={(e) => dragLeaveHandler(e)}
      onDragOver={(e) => dragStartHandler(e)}
      onDrop={(e) => onDropHandler(e)}
    >
      <NavBar />
      <div className="flex w-full flex-col h-full">
        <Tabs />
        <div className="w-full h-full">
          <div className="w-full h-full flex">
            <Routes>
              <Route index element={<Home />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/build" element={<Build />} />
              <Route path="/search" element={<Search />} />
              <Route path="/deploy" element={<Deploy />} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/setting" element={<Setting />} />
            </Routes>
          </div>
        </div>
      </div>
      <Console />
      {drag && <DragAndDrop />}
      <BuildError />
      <DeployModal />
      <SaveModal />
      <TestModal />
      <div />
    </div>
  )
})

export default App
