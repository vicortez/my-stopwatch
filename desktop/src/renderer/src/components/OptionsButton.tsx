import { cn } from '@renderer/lib/utils'
import { ReactElement } from 'react'

interface IProps {
  onClick: () => void
}
export const OptionsButton = ({ onClick }: IProps): ReactElement => {
  return (
    <>
      <button
        onClick={onClick}
        className={cn(
          `px-3 py-1 text-xs rounded-md border-white transition-colors left-auto right-auto flex items-center bg-[#1a1a1a]`
        )}
      >
        ☰
      </button>
    </>
  )
}
