import { makeAutoObservable } from 'mobx'

class WidthStore {
  width: number

  constructor() {
    makeAutoObservable(this)
    const width = localStorage.getItem('width')
    this.width = Number(width) || 300
  }

  setWidth = (data: number) => {
    localStorage.setItem('width', String(data))
    this.width = data
  }
}
export default new WidthStore()
