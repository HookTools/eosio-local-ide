import List from '@mui/joy/List'
import ListDivider from '@mui/joy/ListDivider'
import Sheet from '@mui/joy/Sheet'
import { CssVarsProvider } from '@mui/joy/styles'
import * as Accordion from '@radix-ui/react-accordion'
import { Button } from '@renderer/shared/ui/button'
import { ipcRenderer } from 'electron'
import React, { useEffect, useState } from 'react'
import { Network } from '../ui/network'
import { Wallets } from '../ui/wallets'
import { AccordionHeader, AccordionContent } from './JoyAccordion'

export default function Parameters({ parametrs }) {
  const [version, setVersion] = useState(null)
  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getVersion')
      .then((data) => setVersion(data))
      .catch((error) => console.log(error))
  }, [])
  console.log(parametrs)
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
            <Accordion.Item className="" value="item-0">
              <AccordionHeader className="!text-white hover:!bg-black" isFirst>
                Netwok
              </AccordionHeader>
              <AccordionContent>
                <Network />
              </AccordionContent>
            </Accordion.Item>

            <ListDivider component="div" />

            <Accordion.Item value="item-2">
              <AccordionHeader className="!text-white hover:!bg-black">
                Wallets
              </AccordionHeader>
              <AccordionContent>
                <Wallets />
              </AccordionContent>
            </Accordion.Item>

            <Accordion.Item value="item-4">
              <AccordionHeader className="!text-white hover:!bg-black">
                version
              </AccordionHeader>
              <AccordionContent className="text-white">
                {version}
              </AccordionContent>
            </Accordion.Item>
          </List>
        </Sheet>
      </CssVarsProvider>
    </div>
  )
}
