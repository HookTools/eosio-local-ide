import { observer } from 'mobx-react-lite'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../shared/ui/button'
import storeDeploy from '../../../store/store-deploy'

export const BuildConfig = observer(() => {
  const { register, handleSubmit, setValue, watch, getValues, getFieldState } =
    useForm({
      defaultValues: {
        mainFile: '',
        include: '',
        contractName: '',
        output: '',
        custom: localStorage.getItem('buildCode'),
      },
    })
  const { setBuildCode } = storeDeploy

  const buildCodeCreator = () => {
    const data = getValues()
    setValue(
      'custom',
      `eosio-cpp -abigen -I ${data.include} -contract ${data.contractName} -o ${data.output}`,
      {},
    )
  }
  const buildCodeReader = (data) => {
    setBuildCode(data.custom)
  }
  return (
    <div className="flex items-center justify-center w-full h-full">
      <form
        onSubmit={handleSubmit(buildCodeReader)}
        className="bg-[#262626] p-8 rounded-2xl w-3/4 h-fit text-white flex flex-col gap-2"
      >
        <p className="text-2xl text-bolder">Project Setting</p>
        <div>
          <p>Main File</p>
          <input
            className="bg-input-background p-2 text-white rounded-xl w-full mt-2"
            placeholder="newcontract.cpp"
            {...register('mainFile')}
            onChange={buildCodeCreator}
          />
        </div>
        <div>
          <p>Contract name -contract:</p>
          <input
            className="bg-input-background p-2 text-white rounded-xl w-full mt-2"
            placeholder="newcontract"
            {...register('contractName')}
            onChange={buildCodeCreator}
          />
        </div>
        <div>
          <p>Add directory to include search path -I:</p>
          <input
            className="bg-input-background p-2 text-white rounded-xl w-full mt-2"
            placeholder="Default: ./include"
            {...register('include')}
            onChange={buildCodeCreator}
          />
        </div>
        <div>
          <p>Write output -O:</p>
          <input
            className="bg-input-background p-2 text-white rounded-xl w-full mt-2"
            placeholder="Default: newcontract.wasm"
            {...register('output')}
            onChange={buildCodeCreator}
          />
        </div>
        <div>
          <p>Custom build command</p>
          <input
            className="bg-input-background p-2 text-white rounded-xl w-full mt-2"
            placeholder="Default: eosio-cpp -abigen -I ./include -contract newcontract -o newcontract.wasm"
            {...register('custom')}
          />
        </div>
        <Button className="w-full mt-5">Save</Button>
      </form>
    </div>
  )
})
