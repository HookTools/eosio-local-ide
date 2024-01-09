import { VariantProps, cva } from 'class-variance-authority'
import React, { FC, ReactNode, useCallback, useEffect } from 'react'
import { cn } from '../../../shared/cn'
import { GetIcon } from '../../../shared/icons/icons'
import FoldersState from '../../../store/store-folders'
import closesvg from '../assets/close.svg'
import './tabs.scss'

const buttonVariants = cva(
  'px-4 h-full transition hover:bg-white/20 flex items-center gap-2 min-w-fit',
  {
    variants: {
      variant: {
        default: '',
        outline: '',
      },
      choose: {
        true: 'bg-white/10',
        false: '',
      },
      size: {
        default: 'h-full',
        sm: 'h-2',
      },
    },
    defaultVariants: {
      size: 'default',
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

const TabsButtons: FC<ButtonProps> = ({
  className,
  size,
  variant,
  data,
  children,
  choose,
  ...props
}) => {
  const { closeTab, chooseTab, saveFile } = FoldersState
  const handleKeyPress = useCallback((event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault()

      saveFile(data.path)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <button
      {...props}
      className={cn(buttonVariants({ variant, choose, size, className }))}
      onClick={() => chooseTab(data.name)}
    >
      <GetIcon file={children} className="w-4" />
      {children}
      <div className="flex items-center justify-center show-close ">
        {data.save && <p className="w-2 h-2 bg-slate-200 rounded-full" />}
        <img
          style={data.save ? { display: 'none' } : {}}
          className="hover:bg-white/30 p-1 rounded"
          onClick={(e) => {
            e.stopPropagation()
            closeTab(data.name)
          }}
          src={closesvg}
          alt=""
        />
      </div>
    </button>
  )
}

export { buttonVariants, TabsButtons }
