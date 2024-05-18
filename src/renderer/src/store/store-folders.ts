import { fsSaveFile, openFolder, renameAll } from '@renderer/shared/fs'
import { makeAutoObservable } from 'mobx'

interface Tabs {
  name: string
  path: string
  data: string
  save?: boolean
  choose?: boolean
}
export interface FoldersState {
  name: string | null
  value: FoldersState[]
  path: string
  isOpen?: boolean
  isChoose?: boolean
  isSaved?: boolean
  isFolder?: boolean
  data?: string
  tabs?: Tabs[]
  input?: boolean
  editName?: boolean
  lastName?: string
  editFile?: boolean
}

const initialState: FoldersState = {
  name: null,
  value: [],
  path: '',
  tabs: [],
}

class FolderState {
  folders: FoldersState
  tabs: Tabs[]
  chooseFolderPath: string | null
  constructor() {
    makeAutoObservable(this)
    this.folders = initialState
    this.tabs = []
    this.chooseFolderPath = null
  }

  changeChooseFolderPath = (path: string) => {
    this.chooseFolderPath = path
  }

  clearTabsChoose = () => {
    this.tabs = this.tabs.map((post) => {
      return { ...post, choose: false }
    })
  }

  clearTabs = () => {
    this.tabs = []
  }

  currentTab = () => {
    const resp = this.tabs.find((post) => post.choose)
    return resp
  }

  deleteAll = async (path: string) => {
    await window.api.deleteAll(path)
    const clone = Object.assign({}, this.folders)
    function searchFind(_folders: FoldersState) {
      for (let i = 0; i < _folders.value.length; i++) {
        if (_folders.value[i].path === path) {
          _folders.value.splice(i, 1)
          return
        }
        searchFind(_folders.value[i])
      }
    }
    searchFind(clone)
    this.folders = clone
  }

  successPreCreateFolder = async (path, value) => {
    const clone = Object.assign({}, this.folders)
    async function searchFind(_folders: FoldersState) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < _folders.value.length; i++) {
        if (
          _folders.value[i].path === `${path}/${_folders.value[i].lastName}`
        ) {
          await renameAll(
            `${path}/${_folders.value[i].lastName}`,
            `${path}/${value}`,
          )

          // eslint-disable-next-line require-atomic-updates
          _folders.value[i].editName = false
          // eslint-disable-next-line require-atomic-updates
          _folders.value[i].name = value
          // eslint-disable-next-line require-atomic-updates
          _folders.value[i].lastName = undefined

          return
        }
        if (_folders.value[i].path === `${path}/2@fafFn@famM9R$@!`) {
          _folders.value[i].editName = false
          _folders.value[i].name = value
          _folders.value[i].path = `${path}/${value}`

          window.api.fs.mkdir(
            `${path}/${value}`,
            { recursive: true },
            (error) => {
              if (error) {
                console.error('mkDIR create Error:', error)
              } else {
                console.log('mkDir succsessfull')
              }
            },
          )
          return
        }
        searchFind(_folders.value[i])
      }
    }
    await searchFind(clone)

    this.folders = clone
  }

  successPreCreateFile = (path: any, value: string) => {
    const clone = Object.assign({}, this.folders)
    async function searchFind(_folders: FoldersState) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < _folders.value.length; i++) {
        if (
          _folders.value[i].path === `${path}/${_folders.value[i].lastName}`
        ) {
          await renameAll(
            `${path}/${_folders.value[i].lastName}`,
            `${path}/${value}`,
          )

          // eslint-disable-next-line require-atomic-updates
          _folders.value[i].editName = false
          // eslint-disable-next-line require-atomic-updates
          _folders.value[i].name = value
          // eslint-disable-next-line require-atomic-updates
          _folders.value[i].lastName = undefined

          return
        }
        if (_folders.value[i].path === `${path}/2@fafFn@famM9R$@!`) {
          _folders.value[i].editName = false
          _folders.value[i].name = value
          _folders.value[i].path = `${path}/${value}`

          window.api.fs.writeFile(`${path}/${value}`, '', (error) => {
            if (error) {
              console.error('writeFile create Error:', error)
            } else {
              console.log('writeFile succsessfull')
            }
          })
          return
        }
        searchFind(_folders.value[i])
      }
    }
    searchFind(clone)

    this.folders = clone
  }

  cancelPreCreate = (path: string) => {
    const clone = Object.assign({}, this.folders)
    function searchFind(_folders: FoldersState) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < _folders.value.length; i++) {
        if (_folders.value[i].path === path) {
          if (_folders.value[i].lastName) {
            _folders.value[i].editName = false
            _folders.value[i].lastName = undefined
            return
          }
          _folders.value.splice(i, 1)
          return
        }
        searchFind(_folders.value[i])
      }
    }
    searchFind(clone)
    this.folders = clone
  }

  saveEdit = (path: string, name: string) => {
    const clone = Object.assign({}, this.folders)
    function searchFind(_folders: FoldersState) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < _folders.value.length; i++) {
        if (
          _folders.value[i].path === `${path}/${_folders.value[i].lastName}`
        ) {
          renameAll(`${path}/${_folders.value[i].lastName}`, `${path}/${name}`)
          _folders.value[i].name = name
          _folders.value[i].editName = false
          _folders.value[i].lastName = undefined
          _folders.value[i].editFile = false
          _folders.value[i].path = `${path}/${name}`
          return
        }
        searchFind(_folders.value[i])
      }
    }
    searchFind(clone)
    this.folders = clone
  }

  editFile = (path: string) => {
    const clone = Object.assign({}, this.folders)
    function searchFind(_folders: FoldersState) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < _folders.value.length; i++) {
        if (_folders.value[i].path === path) {
          _folders.value[i].editName = true
          _folders.value[i].lastName = _folders.value[i].name as string
          _folders.value[i].editFile = true
          return
        }
        searchFind(_folders.value[i])
      }
    }
    searchFind(clone)
    this.folders = clone
  }

  preCreateFolder = () => {
    const clone = Object.assign({}, this.folders)
    const path = this.chooseFolderPath

    if (this.folders.path === this.chooseFolderPath) {
      clone.value.push({
        name: 'newFolder',
        isFolder: true,
        input: true,
        value: [],
        tabs: [],
        path: `${path ? path : this.folders.path}/2@fafFn@famM9R$@!`,
        editName: true,
      })
      this.folders = clone
      return null
    }
    function searchFind(_folders: FoldersState) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < _folders.value.length; i++) {
        if (_folders.value[i].path === path) {
          _folders.value[i].value.push({
            name: 'newFolder',
            isFolder: true,
            input: true,
            value: [],
            tabs: [],
            path: `${path}/2@fafFn@famM9R$@!`,
            editName: true,
          })
          return
        }
        searchFind(_folders.value[i])
      }
    }
    searchFind(clone)
    this.folders = clone
  }

  preCreateFile = () => {
    const clone = Object.assign({}, this.folders)
    const path = this.chooseFolderPath

    if (this.folders.path === this.chooseFolderPath) {
      clone.value.push({
        name: 'newFile.txt',
        isFolder: false,
        input: true,
        value: [],
        tabs: [],
        path: `${path ? path : this.folders.path}/2@fafFn@famM9R$@!`,
        editName: true,
      })
      this.folders = clone
      return null
    }

    function searchFind(_folders: FoldersState) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < _folders.value.length; i++) {
        if (_folders.value[i].path === path) {
          _folders.value[i].value.push({
            name: 'newFile.txt',
            isFolder: false,
            input: true,
            value: [],
            tabs: [],
            path: `${path}/2@fafFn@famM9R$@!`,
            editName: true,
          })
          return
        }
        searchFind(_folders.value[i])
      }
    }
    searchFind(clone)
    this.folders = clone
  }

  chooseTab = (name: string) => {
    this.clearTabsChoose()
    this.tabs = this.tabs.map((post) => {
      if (post.name === name) {
        post.choose = true
      }
      return { ...post }
    })
  }

  startEditName = (name: string | undefined) => {
    this.tabs = this.tabs.map((post) => {
      if (post.name === name) {
        post.editName = true
      }
      return { ...post }
    })
  }

  addTab = (args: Tabs) => {
    this.clearTabsChoose()
    const tabs = this.tabs.slice()
    for (const tab of tabs) {
      if (tab.name === args.name) {
        tab.choose = true
        this.tabs = tabs
        return
      }
    }
    this.clearTabsChoose()
    this.tabs = [...this.tabs, args]
  }

  closeTab = (name: string) => {
    this.tabs = this.tabs.filter((data) => data.name !== name)
  }

  changeFile = (path: string, data: string) => {
    const tabs = this.tabs.slice()
    const file = tabs.find((post) => post.path === path)
    file.data = data
    file.save = true

    this.tabs = tabs
  }

  saveFile = (path: string) => {
    const tabs = this.tabs.slice()
    const file = tabs.find((post) => post.path === path)
    file!.save = false
    fsSaveFile(path, file!.data)
    this.tabs = tabs
  }

  addFolder = (args: FoldersState) => {
    if (this.folders.path !== args.path) {
      this.clearTabs()
    }
    this.folders = args
    this.chooseFolderPath = this.folders.path
  }

  handlerFolderTab = (path: string) => {
    const folders = { ...this.folders }
    checkValue(path, folders)
    this.folders = folders
  }
}
function checkValue(path: string, value: FoldersState) {
  if (value.path === path) {
    value.isOpen = !value.isOpen
    return
  }
  for (let i = 0; i < value.value.length; i++) {
    checkValue(path, value.value[i])
  }
}
export default new FolderState()
