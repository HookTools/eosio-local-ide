import { Folder } from '@renderer/components/files/folder'
import React, { useState } from 'react'
import wretch from 'wretch'
import uploadImage from '../../components/assets/deploy-icon.svg'
import waxImage from '../../components/console/assets/wax-logo.png'
import { LeftTab } from '../../components/ui/leftBar'
import { getFolderPath, openFolder } from '../../shared/fs'

interface Contracts {
  name: string
  title: string
  buildCode: string
}

export const Search = () => {
  const contracts: Contracts[] = [
    {
      name: 'eosio.token',
      title: `eosio.token contract is a standard contract for creating and
  managing tokens on the WAX blockchain.`,
      buildCode: '',
    },
    {
      name: 'eosio.msig',
      title: `
      The eosio.msig contract is a smart contract that enables multi-signature functionality.`,
      buildCode: '',
    },
    {
      name: 'helloworld',
      title: `The "helloworld" contract is a basic smart contract on blockchain platforms like EOSIO.`,
      buildCode: '',
    },
    {
      name: 'eosio.wrap',
      title: `The eosio.wrap contract is a smart contract designed to facilitate the interaction between other blockchains.`,
      buildCode: '',
    },
    {
      name: 'dao',
      title: `A DAO is a blockchain-based organization with automated rules for decentralized decision-making.`,
      buildCode: '',
    },
  ]
  return (
    <>
      <LeftTab>
        <Folder />
      </LeftTab>
      <div className="w-full p-4">
        <p className="text-white text-bolder text-2xl">Public templates</p>
        <div className="flex justify-center gap-10 flex-wrap mt-10">
          <div
            onClick={() => getFolderPath().then((path) => openFolder(path))}
            className="flex flex-col items-center w-2/5 bg-[#373737] hover:bg-[#525252] p-5 hover:scale-110 transition cursor-pointer"
          >
            <img width={100} src={uploadImage} alt="" />
            <p className="text-white text-bold mt-2">Import Project</p>
          </div>

          {contracts.map((post: Contracts) => (
            <div
              key={post.name}
              onClick={() =>
                getFolderPath().then((resp) =>
                  window.electron.ipcRenderer
                    .invoke('getFile', post.name, `${resp}/${post.name}`)
                    .then(() => openFolder(`${resp}/${post.name}`)),
                )
              }
              className="flex px-10 flex-col items-start w-2/5 bg-[#373737] hover:bg-[#525252] p-5 hover:scale-110 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img width={20} src={waxImage} alt="" />
                <p className="text-white text-bold text-2xl">
                  {post.name} template
                </p>
              </div>
              <p className="text-bolder text-[#949494]">{post.title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
