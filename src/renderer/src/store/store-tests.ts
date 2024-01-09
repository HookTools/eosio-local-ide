import { makeAutoObservable } from 'mobx'
import storeFolders from './store-folders'

class testsStore {
  testsDivIsVisible = false
  path: string | null = null

  testsResponse: string[] = []
  testsData: null | 'success' | 'error' | 'pending' = null
  height = 10
  tests = false
  constructor() {
    makeAutoObservable(this)
  }

  setTests = (bool: boolean) => {
    this.tests = bool
  }

  setTestsDivIsVisible = (bool: boolean) => {
    this.testsDivIsVisible = bool
  }

  setHeight = (num: number) => {
    this.height = num
  }

  setPath = (path: string) => {
    this.path = path
  }

  changeTestsResponse = (data) => {
    this.testsResponse.push(data)
  }

  startTestsInFolder = async () => {
    this.testsData = 'pending'
    const { folders } = storeFolders
    try {
      this.setTests(true)
      this.setHeight(300)
      const execData = `ts-mocha ` + folders.path + '/tests/**/*.ts'
      const mochaProcess = window.api.exec(execData)

      mochaProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
        this.changeTestsResponse(data)
      })

      mochaProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
        this.changeTestsResponse(data)
      })

      mochaProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
        this.changeTestsResponse(code)
      })
      this.testsData = 'success'
    } catch (e) {
      this.changeTestsResponse(String(e))
      this.testsData = 'error'
    }
  }

  startTests = async (data: any[]) => {
    console.log(data)
    this.testsData = 'pending'
    try {
      this.setTests(true)
      this.setHeight(300)
      const execData = `ts-mocha ` + data.map((obj) => obj.path).join(' ')
      console.log(execData)
      const mochaProcess = window.api.exec(execData)

      mochaProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
        this.changeTestsResponse(data)
      })

      mochaProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
        this.changeTestsResponse(data)
      })

      mochaProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
        this.changeTestsResponse(code)
      })
      this.testsData = 'success'
    } catch (e) {
      this.testsData = 'error'
    }
  }
}
export default new testsStore()
