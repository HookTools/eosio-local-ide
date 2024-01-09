import storeDeploy from '@renderer/store/store-deploy'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { createPortal } from 'react-dom'

export const BuildError = observer(() => {
  const { error, errorIsVisible, setErrorIsVisible } = storeDeploy
  if (!errorIsVisible) return null
  return (
    <>
      {createPortal(
        <div className="absolute left-0 top-0 z-10 w-full h-full bg-black/80">
          <button
            className="w-full h-full absolute top-0 left-0 cursor-poiner"
            onClick={() => setErrorIsVisible(false)}
          />
          <div
            style={{ transform: 'translate(-50%,-50%)' }}
            className="relative z-50 inset-y-1/2 inset-x-1/2 w-3/4 h-3/4 bg-[#5B5B5B] shadow-xl rounded-xl text-white "
          >
            <button
              className="fixed right-3 top-2"
              onClick={() => setErrorIsVisible(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                  fill="#CE0000"
                />
              </svg>
            </button>
            <div className="absolute top-0 left-0 w-full h-full overflow-auto break-all">
              <p className="text-bolder text-xl mb-2 p-2">Compile Error:</p>
              <p className="text-base text-bolder p-4 whitespace-break-spaces">
                {error}
              </p>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
})
