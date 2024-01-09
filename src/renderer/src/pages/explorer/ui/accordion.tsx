import List from '@mui/joy/List'
import ListDivider from '@mui/joy/ListDivider'
import Sheet from '@mui/joy/Sheet'
import { CssVarsProvider } from '@mui/joy/styles'
import * as Accordion from '@radix-ui/react-accordion'
import { Button } from '@renderer/shared/ui/button'
import storeExplorer from '@renderer/store/store-explorer'
import storeWallets from '@renderer/store/store-wallets'
import { Api, JsonRpc, RpcError, Serialize } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { observer } from 'mobx-react-lite'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AccordionHeader, AccordionContent } from './JoyAccordion'
import { Authorisation } from './authorisation'

export const Parameters = observer(({ parametrs }: any) => {
  const [result, setResult] = useState<any>(null)
  const { register, handleSubmit } = useForm()
  const { wallet, link, RPC, anchor } = storeWallets
  const formRef = useRef()
  const contractWallet = storeExplorer.wallet
  const hadleAction = async (e) => {
    await link.restoreSession('mydapp').then(async (session: any) => {
      const actions: any = [
        {
          account: contractWallet,
          name: parametrs.name,
          authorization: [session.auth],
          data: { ...e },
        },
      ]

      console.log(actions)
      try {
        const result = await session.transact({ actions })
        console.log(result)
        setResult(String(result.processed.id))
      } catch (error) {
        setResult(String(error))
      }
    })
  }
  const submitForm = handleSubmit((e) => {
    window.api
      .pushTransactionPrivate(
        JSON.stringify(e),
        JSON.stringify(wallet),
        RPC,
        parametrs.name,
        contractWallet,
      )
      .then((result) => setResult(String(result)))
      .catch((error) => setResult(String(error)))
  })

  if (!parametrs) return null

  return (
    <div>
      <CssVarsProvider>
        <Sheet>
          <List
            variant="solid"
            component={Accordion.Root}
            type="multiple"
            defaultValue={['item-1']}
            sx={{
              '--ListDivider-gap': '0px',
              '--focus-outline-offset': '-2px',
              ':hover': 'none',
              'background': '#262626',
            }}
          >
            <Accordion.Item className="" value="item-1">
              <AccordionHeader className="!text-white hover:!bg-black" isFirst>
                Parameters
              </AccordionHeader>
              <AccordionContent>
                <form
                  onSubmit={handleSubmit((e) => submitForm(e))}
                  className="flex text-white flex-col gap-4"
                  ref={formRef}
                >
                  {parametrs?.fields.map((post) => (
                    <div key={post.name}>
                      <p>{post.name}</p>
                      <p>
                        <input
                          {...register(post.name)}
                          placeholder={post.type}
                          className="bg-input-background p-2 text-white rounded-xl w-full mt-2"
                        />
                      </p>
                    </div>
                  ))}
                  <button className="display-none" />
                </form>
              </AccordionContent>
            </Accordion.Item>

            <ListDivider component="div" />

            <Accordion.Item value="item-2">
              <AccordionHeader className="!text-white hover:!bg-black">
                Authorisation
              </AccordionHeader>
              <AccordionContent>
                <Authorisation />
              </AccordionContent>
            </Accordion.Item>

            <Accordion.Item value="item-3">
              <AccordionHeader className="!text-white hover:!bg-black">
                Result
              </AccordionHeader>
              <AccordionContent className="!text-white">
                <p className="text-gray-200 break-all">{result}</p>
              </AccordionContent>
            </Accordion.Item>
          </List>
        </Sheet>
      </CssVarsProvider>
      <Button
        disabled={!wallet}
        onClick={handleSubmit((e) =>
          wallet?.privateKey ? submitForm(e) : hadleAction(e),
        )}
        className="w-full mt-2"
      >
        Push
      </Button>
    </div>
  )
})
