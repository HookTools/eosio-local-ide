import React from 'react'
import { Loader } from '../../shared/ui/loader'

interface Props {
  data: {
    build?: 'success' | 'errors' | 'warnings' | 'loading' | null
    errors?: number
  }
}

export const DeployData = ({ data }: Props) => {
  switch (data.build) {
    case 'success':
      return (
        <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 flex items-center justify-center bg-green-700 text-xs w-5 h-5 rounded text-white text-bolder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="12"
            viewBox="0 0 15 12"
            fill="none"
          >
            <path
              d="M13.3433 0.843262L14.9883 2.49993L5.65495 11.8333L0.988281 7.17826L2.64495 5.53326L5.65495 8.53159L13.3433 0.843262Z"
              fill="white"
            />
          </svg>
        </div>
      )
    case 'errors':
      return (
        <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 flex items-center justify-center bg-red-600 text-xs w-5 h-5 rounded text-white text-bolder">
          {data.errors}
        </div>
      )
    case 'warnings':
      return (
        <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 flex items-center justify-center bg-yellow-600 text-xs w-5 h-5 rounded text-white text-bolder">
          {data.errors}
        </div>
      )
    case 'loading':
      return (
        <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1">
          <Loader />
        </div>
      )
    default:
      return null
  }
}
