import storeDeploy from '@renderer/store/store-deploy'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { createPortal } from 'react-dom'
import './loader.css'

export const DeployModal = observer(() => {
  const { deployModalData, closeModalData } = storeDeploy
  function createArrayFromNumber(number) {
    if (typeof number !== 'number' || number <= 0) {
      return []
    }

    const result = []
    for (let i = 1; i <= number; i++) {
      result.push(i)
    }
    return result
  }

  if (!deployModalData) return null

  return (
    <>
      {createPortal(
        <div className="absolute left-0 top-0 z-10 w-full h-full bg-black/80">
          <button
            onClick={closeModalData}
            className="w-full h-full absolute top-0 left-0 cursor-poiner"
          />
          <div
            style={{ transform: 'translate(-50%,-50%)' }}
            className="relative z-50 inset-y-1/2 inset-x-1/2 w-80 h-40 bg-blue-900 shadow-xl rounded-xl text-white "
          >
            <div className="flex w-full items-center justify-center gap-2 p-5">
              {createArrayFromNumber(deployModalData.amount).map((post) => (
                <div
                  key={post}
                  className="w-10 h-10 rounded-full flex text-center items-center justify-center border"
                  style={deployModalData.current > post ? { opacity: 0.3 } : {}}
                >
                  {post === deployModalData.current ? <Loader /> : post}
                </div>
              ))}
            </div>

            <div className="w-full flex items-center justify-center text-xl">
              {deployModalData.title}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
})

export const Loader = () => {
  return (
    <div className="lds-ring !w-10 !h-10">
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}
