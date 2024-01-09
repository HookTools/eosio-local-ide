import Option from '@mui/joy/Option/Option'
import Select from '@mui/joy/Select/Select'
import { Button } from '@renderer/shared/ui/button'
import storeExplorer from '@renderer/store/store-explorer'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useForm } from 'react-hook-form'

export const Tables = observer(() => {
  const { getTables, abi, tableData } = storeExplorer
  const { register, handleSubmit } = useForm()
  return (
    <div className="w-3/4">
      <div className="bg-input-background h-14 w-full" />
      <Select
        className="!rounded-none !bg-explorer-inputs w-full bg-input-background "
        color="neutral"
        variant="solid"
        defaultValue="Query"
        placeholder="Query"
      >
        {abi?.tables?.map((post) => (
          <Option value={post.name}>{post.name}</Option>
        ))}
      </Select>
      <form
        onSubmit={handleSubmit((data) =>
          getTables('bags', data.scope, data.lower_bound, null, data.limit),
        )}
        className="flex items-center justify-between text-white text-bold p-2"
      >
        <div>
          <p>Scope</p>
          <input
            {...register('scope')}
            minLength={4}
            maxLength={12}
            className="bg-input-background p-2 text-white rounded-xl w-3/4"
            placeholder="scope"
          />
        </div>
        <div>
          <p>Lower_bound</p>
          <input
            type="text"
            {...register('lower_bound')}
            className="bg-input-background p-2 text-white rounded-xl w-3/4"
            placeholder="0"
          />
        </div>
        <div>
          <p>Limit</p>
          <input
            defaultValue={10}
            {...register('limit')}
            type="number"
            className="bg-input-background p-2 text-white rounded-xl w-3/4"
            placeholder="10"
          />
        </div>
        <Button className="w-1/4">Load</Button>
      </form>
      <div className="w-full overflow-auto bg-explorer-inputs max-h-full h-full">
        <div className="flex text-white gap-5 w-full p-2 text-bold">
          <p className="min-w-5">#</p>
          {tableData.length &&
            Object.keys(tableData[0]).map((post) => (
              <p key={post} className="w-40">
                {post}
              </p>
            ))}
        </div>
        {tableData.map((post: any, i) => (
          <div
            className="flex text-white gap-5 w-full p-2 bg-explorer-inputs"
            key={i}
          >
            <p className="">#{i + 1}</p>
            {Object.values(post).map((value: any) => (
              <p className="w-40" key={Math.random()}>
                {value}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
})
