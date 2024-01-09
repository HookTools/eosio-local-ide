import { VariantProps, cva } from 'class-variance-authority'
import React, { ReactNode } from 'react'
import { cn } from '../../cn'

const buttonVariants = cva(
  'p-1 w-32 font-semibold text-[#575455] bg-[#D7CFD1] rounded-md hover:text-white hover:bg-[#2C82D1] transition',
  {
    variants: {
      variant: {
        default: '',
        outline: '',
      },
      choose: {
        true: 'bg-[#056DCD]',
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
}

export const SaveButton: React.FC<ButtonProps> = ({
  className,
  size,
  variant,
  data,
  children,
  choose,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(buttonVariants({ variant, choose, size, className }))}
    >
      {children}
    </button>
  )
}
