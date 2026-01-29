'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js'

const Hero = () => {
  return (
    <section className='relative overflow-hidden z-1 bg-gradient-to-br from-[#f9f5f0] to-white'>
      <div className='container mx-auto pt-24 max-w-7xl px-4'>
        <div className='grid grid-cols-12 justify-center items-center'>
          <div className='col-span-12 xl:col-span-6 lg:col-span-7 md:col-span-12 sm:col-span-12'>
            <div className='py-2 px-5 bg-primary/15 rounded-full w-fit mb-6'>
              <p className='text-primary text-lg font-bold flex items-center gap-2'>
                <span className='text-2xl'>ⵣ</span> AWAL GPT - CHATBOT AMAZIGH
              </p>
            </div>
            <h1 className='mb-4'>
              <span className='text-primary'>ⵉⵙⵎⵍⵉ ⵎⴰ</span> - Parlez avec l'IA en Tamazight
            </h1>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl'>
              Notre chatbot intelligent comprend et répond en Tamazight.
              Préservez votre langue, explorez votre culture, connectez-vous avec votre héritage.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link href={'chat'}>
                <button className='bg-primary text-white text-xl font-semibold py-5 px-12 rounded-full hover:bg-accent hover:shadow-xl transition-all duration-300 mt-4 flex items-center gap-3'>
                  <Icon icon="mdi:robot-happy" width="24" height="24" />
                  Essayer Gratuitement
                </button>
              </Link>
              <Link href={'#About'}>
                <button className='bg-transparent text-primary border-2 border-primary text-xl font-semibold py-5 px-12 rounded-full hover:bg-primary/10 transition-all duration-300 mt-4'>
                  En savoir plus
                </button>
              </Link>
            </div>

          </div>
          <div className='xl:col-span-6 lg:col-span-5 lg:block hidden relative'>
            <div className='relative'>
              <Image
                src='/images/chatboot.png' // À remplacer par votre image
                alt='Chatbot Amazigh AWAL GPT'
                width={600}
                height={600}
                className='w-full animate-float'
              />
              <div className='absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full'></div>
              <div className='absolute -top-6 -left-6 w-24 h-24 bg-secondary/20 rounded-full'></div>
            </div>
          </div>
        </div>
      </div>

      {/* Éléments décoratifs Amazigh */}
      <div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32'></div>
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full translate-y-48 -translate-x-48'></div>
    </section>
  )
}

export default Hero