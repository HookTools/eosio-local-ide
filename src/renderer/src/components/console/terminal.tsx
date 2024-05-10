// 一定要记得引入css
import React, { useEffect, useMemo, useRef } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import 'xterm/css/xterm.css'

export const Terminaled = ({ height }, props) => {
  const ipc = window.electron.ipcRenderer

  const divRef = useRef(null)
  const fitAddon = useMemo(() => {
    return new FitAddon()
  }, [])

  const initTerminal = () => {
    const term = new Terminal({
      rendererType: 'canvas', 
      convertEol: true,
      cursorBlink: true, 
      cursorStyle: 'block',
      background: 'none',
    })

    const webLinksAddon = new WebLinksAddon()
    term.loadAddon(webLinksAddon)
    term.loadAddon(fitAddon)
    fitAddon.fit()
    term.open(divRef.current)
    term.resize(term.cols, 40) // Пример фиксированной высоты 40 строк
    term.element.classList.add('transparent-background')

    fitAddon.fit()

    ipc.on('terminal.incomingData', (event, data) => {
      term.write(data)
    })
    window.addEventListener('resize', () => {
      fitAddon.fit()
    })
    term.onData((e) => {
      ipc.send('terminal.keystroke', e)
    })
  }

  useEffect(() => {
    initTerminal()
  }, [])
  useEffect(() => {
    fitAddon.fit()
  }, [height])
  return (
    <div
      className="h-full"
      id="bottomConsole"
      style={{ width: '100%', height: `${height - 100}px` }}
      ref={divRef}
    />
  )
}
