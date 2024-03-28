import CommonIcons from '@components/assets/CommonIcons'
import { useRouter } from 'next/router'
import React from 'react'

const Guides: React.FC = () => {
  const { push } = useRouter()
  return (
    <div
      className="mt-6 bg-rgb-5 border border-rgb-5 py-2 px-2.5 !rounded-md flex items-center w-full justify-between cursor-pointer"
      role="presentation"
      onClick={() => push('/guides')}
    >
      <div className="flex items-center gap-2">
        <div>{CommonIcons.backpack}</div>
        <div className="text-rgb-14 text-xs font-semibold">Check out our other guides.</div>
      </div>

      <div>{CommonIcons.smallArrowRight}</div>
    </div>
  )
}
export default Guides
