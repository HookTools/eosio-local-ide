/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'
import { ReactComponent as Cpp } from './c-plus-plus.svg'
import { ReactComponent as File } from './file-icon.svg'
import { ReactComponent as Js } from './javascript.svg'
import { ReactComponent as Ts } from './typescript.svg'

interface Props extends React.SVGAttributes<SVGAElement> {
  file: string
}

export const GetIcon: React.FC<Props> = (props: Props) => {
  switch (props.file.split('.').pop()) {
    case 'cpp':
      return <Cpp {...props} />
    case 'hpp':
      return <Cpp {...props} />
    case 'js':
      return <Js {...props} />
    case 'ts':
      return <Ts {...props} />
    case 'tsx':
      return <Ts {...props} />
    case 'Jsx':
      return <Js {...props} />
    default:
      return <File {...props} fill="#FFF" />
  }
}
