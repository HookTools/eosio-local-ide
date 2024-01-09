import React, { FC, InputHTMLAttributes, forwardRef } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>
export const Input = forwardRef((props, ref: any) => {
  const { ...props_ } = props
  return (
    <input
      ref={ref}
      {...props_}
      className="bg-input-background p-2 text-white w-3/4"
    />
  )
})
// export const Input: FC<InputProps> = ({ ...props }) => {
//   return (
//     <input {...props} className="bg-input-background p-2 text-white w-3/4" />
//   )
// }
