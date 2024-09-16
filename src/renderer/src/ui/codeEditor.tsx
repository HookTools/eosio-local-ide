// eslint-disable-next-line import/no-duplicates
import storeDeploy from '@renderer/store/store-deploy'
import ace, { Ace } from 'ace-builds'
// eslint-disable-next-line import/no-duplicates
import 'ace-builds/src-noconflict/ace'
import langTools from 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-searchbox'
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-jsx'
import 'ace-builds/src-noconflict/mode-tsx'
import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/theme-monokai'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import FolderState from '../store/store-folders'
import storeFolders from '../store/store-folders'
import reservedWords from './reserved-words.json'

interface Props {
  data: any
  choose: boolean | undefined
}
const CodeEditor = observer(({ data, choose }: Props) => {
  const { error } = storeDeploy
  const { folders } = storeFolders
  const path = data.path
  const id = data.path.replace(/[^\w\s]/gi, '')
  const [editor, setEditor] = useState<any>(null)

  const [markers, setMarkers] = useState([])
  const removeMarkers = () => {
    setMarkers([])
  }
  // Function to update markers
  const updateMarkers = () => {
    // Modify the markers data as needed
    const updatedMarkers = [
      {
        startRow: 1,
        startCol: 0,
        endRow: 2,
        endCol: 0,
        className: 'highlightError',
        type: 'text',
      },
      // Add more markers or update existing ones here
    ]

    setMarkers(updatedMarkers)
  }

  // Trigger marker update when needed, e.g., in response to an event
  useEffect(() => {
    updateMarkers()
  }, [])
  useEffect(() => {
    setEditor(ace.edit(id))
  }, [])
  useEffect(() => {
    removeMarkers()
    if (error === null) return
    const data = error.split('^')
    const pattern = /:rorre :([\s\S]*?)(edulcni|crs)/
    const matca = []
    for (const tests of data) {
      const test = tests.split('').reverse().join('')
      const match = test.match(pattern)
      try {
        const data = match[0]
          .split('')
          .reverse()
          .join('')
          .replace(/: error:/g, '')
          .split(':')

        if (match) {
          const path_ = data[0]
          const line = data[1]
          const lineRow = data[2]

          if (`${folders.path}/${path_}` === path) {
            const Range = ace.require('ace/range').Range
            const markerRange = {
              startRow: line - 1,
              startCol: lineRow - 1,
              endRow: line - 1,
              endCol: 9999,
              className: 'highlightError',
              type: 'text',
            }

            matca.push(markerRange)
          }
        } else {
          continue
        }
      } catch {}
    }
    setMarkers(matca)
  }, [error])
  const [mode, setMode] = useState('')
  const { changeFile } = FolderState
  const text = data.data
  const fileType = data.name.split('.').pop()
  const onChange = (value, _) => {
    changeFile(path, value)
  }
  useEffect(() => {
    switch (fileType) {
      case 'cpp':
        return setMode('c_cpp')
      case 'hpp':
        return setMode('c_cpp')
      case 'tsx':
        return setMode('tsx')
      case 'jsx':
        return setMode('jsx')
      case 'js':
        return setMode('javascript')
      case 'ts':
        return setMode('typescript')
      default:
    }
  }, [fileType])

  useEffect(() => {}, [])
  useEffect(() => {
    const sqlTablesCompleter = {
      getCompletions: (
        editor: Ace.Editor,
        session: Ace.EditSession,
        pos: Ace.Point,
        prefix: string,
        callback: Ace.CompleterCallback,
      ): void => {
        callback(
          null,
          reservedWords.map(
            (table) =>
              ({
                caption: `${table.name}: ${table.description}`,
                value: table.name,
                meta: 'EOSIO',
              }) as Ace.Completion,
          ),
        )
      },
    }
    langTools.addCompleter(sqlTablesCompleter)

    const editor = ace.edit(id)

    editor.commands.addCommand({
      name: 'showFind',
      bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
      exec(editor) {
        editor.execCommand('find')
      },
    })
  }, [])

  return (
    <div className="w-full" style={choose ? {} : { display: 'none' }}>
      <AceEditor
        height="100%"
        mode={mode}
        theme="monokai"
        onChange={onChange}
        markers={markers}
        value={text}
        name={id}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          vScrollBarAlwaysVisible: true,
        }}
      />
    </div>
  )
})

export default CodeEditor
