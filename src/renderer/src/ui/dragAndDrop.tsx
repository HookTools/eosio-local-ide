import React from 'react'
import upload from './assets/upload.png'
import './styles/drag-and-drop.scss'

const DragAndDrop = () => {
  return (
    <div className="drag-and-drop-back">
      <div className="drag-and-drop">
        <img src={upload} alt="" />
        <p className="text-center">Drop your file here</p>
      </div>
    </div>
  )
}

export default DragAndDrop
