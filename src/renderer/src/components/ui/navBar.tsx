import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import storeDeploy from '../../store/store-deploy'
import buildIcon from '../assets/build-icon.svg'
import deployIcon from '../assets/deploy-icon.svg'
import explorerIcon from '../assets/explorer-icon.svg'
import folderIcon from '../assets/folder-icon.svg'
import logo from '../assets/logo.svg'
import searchIcon from '../assets/search-icon.svg'
import setting from '../assets/setting.png'
import testIcon from '../assets/tests-icon.svg'
import '../styles/left-bar.scss'
import { DeployData } from './deploy-data'

interface Icons {
  to: string
  img: string
  build?: any
  errors?: number
}
interface Props {
  children: React.FC
}
export const NavBar = observer(() => {
  const { getCompileSuccses } = storeDeploy
  const icons: Icons[] = [
    {
      to: '/',
      img: folderIcon,
    },
    {
      to: '/search',
      img: searchIcon,
    },
    {
      to: '/build',
      img: buildIcon,
      build: getCompileSuccses().build,
      errors: getCompileSuccses().errors,
    },
    {
      to: '/deploy',
      img: deployIcon,
    },
    {
      to: '/tests',
      img: testIcon,
    },
    {
      to: '/explorer',
      img: explorerIcon,
    },
  ]
  return (
    <div
      style={{
        borderRight: '0.5px rgba(255, 255, 255, 0.60) solid',
      }}
      className="flex items-center justify-between min-w-leftBar max-w-[50px] flex-col py-4 pb-12 px-2 gap-5 bg-leftbar-dark"
    >
      <div>
        <img src={logo} width={50} alt="" />

        <div className="flex mt-5 flex-col gap-5 items-center">
          {icons.map((post: Icons) => (
            <NavLink
              style={{ position: 'relative' }}
              className={({ isActive }: any) => {
                return isActive || 'navbar-bar-icons'
              }}
              key={post.to}
              to={post.to}
            >
              <img src={post.img} alt="" />
              <DeployData data={post} />
            </NavLink>
          ))}
        </div>
      </div>
      <NavLink
        className={({ isActive }: any) => {
          return isActive || 'navbar-bar-icons '
        }}
        style={{ position: 'absolute', bottom: '32px' }}
        to="/setting"
      >
        <img width={20} src={setting} alt="" />
      </NavLink>
    </div>
  )
})
