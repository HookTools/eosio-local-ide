export const sleep = (sec: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(null), sec * 1000)
  })
}
