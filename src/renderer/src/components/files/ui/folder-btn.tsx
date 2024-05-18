import { cn } from '@renderer/shared/cn'
import { readFileFS } from '@renderer/shared/fs'
import { VariantProps, cva } from 'class-variance-authority'
import React, { FC, ReactNode, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import FolderState, { FoldersState } from '../../../store/store-folders'

const buttonVariants = cva(
  'hover:bg-folders-hover w-full text-start flex items-center gap-1 text-xs',
  {
    variants: {
      variant: {
        default: '',
        outline: '',
      },
      choose: {
        true: 'bg-[#42494969]',
        false: '',
      },
      isOpen: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode
  data: any
}
export const FolderButton: FC<ButtonProps> = ({
  className,
  choose,
  isOpen,
  variant,
  data,
  children,
  ...props
}) => {
  const {
    handlerFolderTab,
    deleteAll,
    editFile,
    changeChooseFolderPath,
  } = FolderState
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const clickOutsideHandler = (e) => {
    setIsVisible(false)
    document.removeEventListener('click', clickOutsideHandler)
  }

  useEffect(() => {
    return () => {
      document.removeEventListener('click', clickOutsideHandler)
    }
  }, [])

  return (
    <>
      <button
        className={cn(buttonVariants({ variant, choose, isOpen, className }))}
        onContextMenu={(e) => {
          setTimeout(
            () => document.addEventListener('click', clickOutsideHandler),
            100,
          )
          setTop(e.pageY)
          setLeft(e.pageX)
          setIsVisible(true)
        }}
        onClick={(e) => {
          e.stopPropagation()
          changeChooseFolderPath(data.path)
          handlerFolderTab(data.path)
        }}
        {...props}
      >
        <svg
          color="inline"
          className="transition"
          style={!data.isOpen ? { rotate: '-90deg' } : {}}
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="7"
          viewBox="0 0 10 7"
          fill="none"
        >
          <path d="M1 0.5L5 5.5L9 0.499999" stroke="white" />
        </svg>
        {children}
      </button>
      {isVisible &&
        createPortal(
          <div
            style={{ left, top }}
            className="absolute bg-explorer-inputs border p-2 rounded text-white flex flex-col items-start text-xs "
          >
            <button
              onClick={() => deleteAll(data.path)}
              className="hover:text-console-blue transition"
            >
              Delete
            </button>
            <button
              onClick={() => editFile(data.path)}
              className="hover:text-console-blue transition"
            >
              Edit
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}
