'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { footerlinks } from '@/app/types/footerlinks'

const footer = () => {
  // fetch data

  const [footerlinks, setFooterLinks] = useState<footerlinks[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setFooterLinks(data.FooterLinksData)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className='bg-black' id='first-section'>
      <div className='container mx-auto max-w-2xl pt-18 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
        <div className='grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8'>
          {/* COLUMN-1 */}
          <div className='col-span-4 mx-auto max-w'>
            <h4 className='text-white text-3xl leading-9 mb-4 lg:mb-20'>
              AWAL GPT
            </h4>
            <div className='mx-auto flex items-center gap-3'>
              <div className='footer-icons mx-auto'>
                <Link href='#'>
                  <Image
                    src={'/images/facebook.svg'}
                    alt='twitter'
                    width={15}
                    height={10}
                  />
                </Link>
              </div>
              <div className='footer-icons mx-auto'>
                <Link href='#'>
                  <Image
                    src={'/images/twitter.svg'}
                    alt='twitter'
                    width={25}
                    height={20}
                  />
                </Link>
              </div>
              <div className='footer-icons mx-auto'>
                <Link href='#'>
                  <Image
                    src={'/images/instagram.svg'}
                    alt='instagram'
                    width={25}
                    height={20}
                  />
                </Link>
              </div>
            </div>
          </div>
          {/* CLOUMN-2/3 */}
          {footerlinks.map((item, i) => (
            <div key={i} className='group relative col-span-4 mx-auto max-w'>
              <p className='text-white text-xl font-extrabold mb-9 mx-auto'>
                {item.section}
              </p>
              <ul>
                {item.links.map((item, i) => (
                  <li key={i} className='mb-5 mx-auto'>
                    <Link
                      href={`${item.href}`}
                      className='mx-auto text-white text-lg font-normal mb-6 space-links hover:text-white/60 hover:underline'>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* All Rights Reserved */}
      <div className='mx-auto max-w-2xl lg:max-w-7xl'>
        <div className='pt-5 pb-5 px-4 sm:px-6 lg:px-4 border-t border-white/30'>
          <div className='mt-4 grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 xl:gap-x-8'>
            <div>
              <p className='text-center md:text-start text-white text-lg'>
                @2026 - All Rights Reserved 
              </p>
            </div>
            <div className='flex justify-center md:justify-end'>
              <Link href='/'>
                <p className='text-base text-white pr-6 hover:text-white/60 hover:underline'>
                  Privacy policy
                </p>
              </Link>
              <Link href='/'>
                <p className='text-base text-white pl-6 border-solid border-l border-footer hover:text-white/60 hover:underline'>
                  Terms & conditions
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default footer
