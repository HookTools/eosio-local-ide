import Option from '@mui/joy/Option'
import Select from '@mui/joy/Select'
import { Button } from '@renderer/shared/ui/button'
import storeExplorer from '@renderer/store/store-explorer'
import { observer } from 'mobx-react-lite'
import React, { useRef, useState } from 'react'
import { Parameters } from './ui/accordion'
import { SearchForm } from './ui/search-form'
import { Tables } from './ui/tables'

interface Abi {
  actions: any[]
  struct: any[]
  tables: any[]
}
export const Explorer = observer(() => {
  const { abi, getActionData } = storeExplorer
  const [chooseFunction, setChooseFunction] = useState<null | string>(null)
  const ref = useRef(null)

  if (!abi)
    return (
      <div className="w-full p-2">
        <SearchForm />
      </div>
    )

  return (
    <div className="w-full p-2">
      <SearchForm />
      <div className="flex h-full">
        <div className="flex w-1/4 flex-col border-r h-full overflow-x-auto	">
          <Select
            ref={ref}
            className="!rounded-none h-14 w-full !bg-input-background "
            color="neutral"
            variant="solid"
            value={chooseFunction}
            placeholder="Function"
            onChange={(e, newValue) => setChooseFunction(newValue)}
          >
            {abi?.actions?.map((post) => (
              <Option value={post.name}>{post.name}</Option>
            ))}
          </Select>
          {chooseFunction && (
            <Parameters parametrs={getActionData(chooseFunction)} />
          )}
        </div>
        <Tables />
      </div>
    </div>
  )
})
