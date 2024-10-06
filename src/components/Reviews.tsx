'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import {CSSProperties, HTMLAttributes, useEffect, useRef, useState} from 'react'
import {useInView} from 'framer-motion'
import {cn} from '@/lib/utils'
import Phone from '@/components/Phone'

const PHONES = [
  '/testimonials/1.jpg',
  '/testimonials/2.jpg',
  '/testimonials/3.jpg',
  '/testimonials/4.jpg',
  '/testimonials/5.jpg',
  '/testimonials/6.jpg'
]

function splitArray<T>(array: Array<T>, numParts: number) {
  const result: Array<Array<T>> = []
  for (let i = 0; i < array.length; i++) {
    const index = i % numParts
    if (!result[index]) {
      result[index] = []
    }
    result[index].push(array[i])
  }
  return result
}

type ReviewColumnProps = {
  reviews: string[]
  className?: string
  reviewClassName?: (reviewIndex: number) => string
  msPerPixel?: number
}

interface ReviewProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string
}

const Review = (props: ReviewProps) => {
  const {
    imgSrc,
    className,
    ...restProps
  } = props
  const POSSIBLE_ANIMATION_DELAY = [
    '0s',
    '0.1s',
    '0.2s',
    '0.3s',
    '0.4s',
    '0.5s',
  ]
  const animationDelay = POSSIBLE_ANIMATION_DELAY[
    Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAY.length)
    ]

  return <div
    className={cn(
      'animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5',
      className
    )}
    style={{animationDelay}}
    {...restProps}
  >
    <Phone imgSrc={imgSrc}/>
  </div>
}

const ReviewColumn = (props: ReviewColumnProps) => {
  const {
    msPerPixel = 0,
    reviews,
    reviewClassName,
    className
  } = props
  const columnsRef = useRef<HTMLDivElement | null>(null)
  const [columnHeight, setColumnHeight] = useState(0)
  const duration = `${columnHeight * msPerPixel}ms`

  useEffect(() => {
    if (!columnsRef.current) {
      return
    }
    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnsRef.current?.offsetHeight ?? 0)
    })
    resizeObserver.observe(columnsRef.current)

    return () => {
      resizeObserver.disconnect()
    }

  }, [])

  return (
    <div
      ref={columnsRef}
      className={cn('animate-marquee space-y-8 py-4', className)}
      style={{'--marquee-duration': duration} as CSSProperties}
    >
      {
        reviews.concat(reviews).map((imgSrc, reviewIndex) => (
            <Review
              key={imgSrc}
              imgSrc={imgSrc}
              className={reviewClassName?.(reviewIndex % reviews.length)}
            />
          )
        )
      }
    </div>
  )
}

const ReviewGrid = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(containerRef, {once: true, amount: 0.4})
  const columns = splitArray(PHONES, 3)
  const column1 = columns[0]
  const column2 = columns[1]
  const column3 = splitArray(columns[2], 2)

  return (
    <div ref={containerRef} className={'relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1' +
      'items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3'}>
      {isInView ? (
        <>
          <ReviewColumn
            reviews={[...column1, ...column3.flat(), ...column2]}
            msPerPixel={10}
            reviewClassName={(reviewIndex) => {
              return cn({
                'md:hidden': reviewIndex >= column1.length + column3[0].length,
                'lg:hidden': reviewIndex >= column1.length
              })
            }}
          />
          <ReviewColumn
            reviews={[...column2, ...column3[1]]}
            msPerPixel={15}
            className={'hidden md:block'}
            reviewClassName={(reviewIndex) => reviewIndex >= column2.length ? 'lg:hidden' : ''}
          />
          <ReviewColumn
            reviews={column3.flat()}
            msPerPixel={10}
            className={'hidden md:block'}
          />
        </>
      ) : null}
      <div className={'pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100'}/>
      <div className={'pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100'}/>
    </div>
  )
}

export const Reviews = () => {
  return (
    <MaxWidthWrapper classname={'relative max-w-5xl'}>
      <img
        aria-hidden={true}
        src="/what-people-are-buying.png"
        alt="what people are buying"
        className={'absolute select-none hidden xl:block -left-52 top-1/3'}
      />
      <ReviewGrid/>
    </MaxWidthWrapper>
  )
}