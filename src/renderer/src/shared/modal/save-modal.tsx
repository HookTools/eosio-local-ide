import { observer } from 'mobx-react-lite'
import React from 'react'
import { createPortal } from 'react-dom'
import warningIcon from './assets/warning.png'
import { SaveButton } from './ui/save-button'

export const SaveModal = observer(() => {
  return null
  return (
    <>
      {createPortal(
        <div className="fixed left-0 top-0 z-10 w-full h-full bg-black/80 ">
          <div
            style={{ transform: 'translate(-50%,-50%)' }}
            className="fixed gap-2 p-8 pt-2 z-50 inset-y-1/2 inset-x-1/2 bg-white shadow-2xl shadow-white rounded-xl text-black w-80 h-fit flex flex-col items-center text-center"
          >
            <img width={70} src={warningIcon} alt="" />
            <p className="font-bold">
              Do you want to save the changes you made to build.cpp?
            </p>
            <p>Your changes will be lost if you don't save them.</p>
            <SaveButton choose>Save</SaveButton>
            <SaveButton>Don't Save</SaveButton>
            <SaveButton>Cancel</SaveButton>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
})
