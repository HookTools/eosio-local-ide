export const sleep = (sec: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), sec * 1000)
  })
}
