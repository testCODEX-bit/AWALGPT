'use client'
import React from 'react'
import Link from 'next/link'

const Join = () => {
  return (
    <section id="join" className='overflow-hidden bg-gradient-to-br from-white to-[#f9f5f0]'>
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='text-center'>
          <p className='text-primary text-lg font-normal tracking-widest uppercase flex items-center justify-center gap-2'>
            <span className='text-2xl'>ⵔ</span> ⵔⵏⵓ
          </p>
          <h2 className='my-6'>Rejoignez la révolution Tamazight numérique.</h2>
          <p className='text-gray-600 text-base font-normal max-w-3xl mx-auto'>
            Inscrivez-vous pour être parmi les premiers à découvrir les nouvelles fonctionnalités, 
            participer à l'enrichissement de la base linguistique et contribuer à la préservation 
            de notre héritage culturel.
          </p>
        </div>

        <div className='mx-auto max-w-4xl pt-5'>
          <div className='sm:flex items-center mx-5 p-5 sm:p-0 rounded-xl justify-between bg-white shadow-lg sm:rounded-full border border-gray-200'>
            <div className='flex-1'>
              <input
                type='text'
                className='w-full my-4 py-4 sm:pl-6 lg:text-xl text-black sm:rounded-full bg-transparent pl-1 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-gray-400'
                placeholder='Votre nom'
                autoComplete='off'
              />
            </div>
            <div className='flex-1 sm:border-l border-gray-300'>
              <input
                type='email'
                className='w-full my-4 py-4 sm:pl-6 lg:text-xl text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-gray-400'
                placeholder='Votre email'
                autoComplete='off'
              />
            </div>
            <div className='sm:mr-3'>
              <Link
                href='#'
                className='w-full sm:w-auto text-xl text-white font-semibold text-center rounded-xl sm:rounded-full bg-gradient-to-r from-primary to-accent py-5 px-12 hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-3'>
                <span>S'inscrire</span>
                <span className='text-xl'>→</span>
              </Link>
            </div>
          </div>
          
          <div className='text-center mt-8'>
            <p className='text-gray-500 text-sm'>
              Déjà <span className='text-primary font-semibold'>5,000+</span> membres de la communauté Amazighe nous ont rejoints
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Join