'use client'
import { useEffect, useState } from 'react'
import { aboutdata } from '@/app/types/aboutdata'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import AboutSkeleton from '../../Skeleton/AboutUs'

const Aboutus = () => {
  const [about, setAbout] = useState<aboutdata[]>([
    {
      heading: "Traduction Intelligente",
      paragraph: "Traduisez instantanément entre le Français et le Tamazight avec précision contextuelle",
      link: "Essayer la traduction"
    },
    {
      heading: "Apprentissage Interactif",
      paragraph: "Apprenez le Tamazight grâce à des leçons interactives adaptées à votre niveau",
      link: "Commencer à apprendre"
    },
    {
      heading: "Assistant Culturel",
      paragraph: "Découvrez la riche culture Amazighe, traditions, histoire et patrimoine",
      link: "Explorer la culture",
    }
  ])
  const [loading, setLoading] = useState(false)

  return (
    <section id='About' className='bg-cover bg-center overflow-hidden bg-amazigh-pattern'>
      <div className='container mx-auto max-w-7xl px-4 relative z-1'>
        <div className='p-12 bg-white rounded-3xl shadow-lg border border-gray-100'>
          <Image
            src='/images/tifinagh.png'
            width={100}
            height={100}
            alt='pattern-tifinagh'
            className='absolute bottom-1 -left-20'
          />
          <p className='text-center text-primary text-lg tracking-widest uppercase mt-10 flex items-center justify-center gap-2'>
            <Icon icon="mdi:information" width="20" height="20" />
            ⵙⵙⵏ ⵜⵉⵙⵎⵉⵜ
          </p>
          <h2 className='text-center pb-6'>À propos d'AWAL GPT</h2>
          <p className='text-center text-gray-600 max-w-3xl mx-auto mb-12 text-lg'>
            AWAL GPT est bien plus qu'un simple chatbot. C'est un pont entre les générations,
            un gardien de la langue Tamazight et un ambassadeur de la culture Amazighe à l'ère numérique.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10'>
            {about.map((item, i) => (
              <div
                key={i}
                className='hover:bg-gradient-to-br from-primary/5 to-secondary/5 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 group transition-all duration-300 hover:scale-[1.02]'>
                <h5 className='group-hover:text-primary mb-5'>{item.heading}</h5>
                <p className='text-lg font-normal text-gray-600 group-hover:text-gray-800 mb-5'>
                  {item.paragraph}  
                </p>
                <Link
                  href='/chat'
                  className='text-18 font-semibold text-primary hover-underline flex items-center group/link'>
                  {item.link}

                </Link>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className='mt-16 pt-12 border-t border-gray-200'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
              <div className='text-center'>
                <p className='text-5xl font-bold text-primary'>10+</p>
                <p className='text-gray-600'>Utilisateurs actifs</p>
              </div>
              <div className='text-center'>
                <p className='text-5xl font-bold text-primary'>50+</p>
                <p className='text-gray-600'>Mots traduits/jour</p>
              </div>
              <div className='text-center'>
                <p className='text-5xl font-bold text-primary'>24/7</p>
                <p className='text-gray-600'>Disponibilité</p>
              </div>
              <div className='text-center'>
                <p className='text-5xl font-bold text-primary'>70%</p>
                <p className='text-gray-600'>Précision linguistique</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Aboutus