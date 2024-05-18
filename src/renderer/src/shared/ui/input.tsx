import { forwardRef } from 'react'

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

