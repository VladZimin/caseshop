import {ReactNode} from 'react'
import {cn} from '@/lib/utils'

type Props = {
    classname?: string
    children: ReactNode
}
const MaxWidthWrapper = ({classname, children}: Props) => {
    return (
        <div className={cn('h-full mx-auto max-w-screen-xl px-2.5 md:px-20', classname)}>
            {children}
        </div>
    )

}

export default MaxWidthWrapper