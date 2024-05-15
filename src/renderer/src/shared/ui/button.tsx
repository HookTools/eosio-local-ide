import { cn } from '@renderer/shared/cn'
import storeDeploy from '@renderer/store/store-deploy'
import { VariantProps, cva } from 'class-variance-authority'
import { observer } from 'mobx-react-lite'
import React, { FC, ReactNode } from 'react'
import './style.css'

const buttonVariants = cva(
  'px-4 h-full transition bg-button-blue  rounded-xl px-16 border border-black text-xl flex items-center justify-center gap-2 text-stroke hover:bg-[#056DCD] transition cursor-pointer',
  {
    variants: {
      variant: {
        default: '',
        outline: '',
      },
      choose: {
        true: '',
        false: '',
      },
      size: {
        default: 'h-10',
        sm: 'h-2',
      },
      disabled: {
        true: 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
      disabled: false,
    },
  },
)
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode
}

const Button: FC<ButtonProps> = observer(
  ({ className, size, variant, children, choose, disabled, ...props }) => {
    const { build } = storeDeploy
    return (
      <button
        {...props}
        disabled={build === 'loading' || disabled}
        style={build === 'loading' ? { background: 'gray' } : {}}
        className={cn(
          buttonVariants({ variant, choose, size, disabled, className }),
        )}
      >
        {children}
      </button>
    )
  },
)

export { Button }
