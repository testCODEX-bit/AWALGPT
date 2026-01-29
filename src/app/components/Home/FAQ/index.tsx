'use client'
import React from 'react'
import { Icon } from '@iconify/react'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'

const FAQ = () => {
  const faqs = [
    {
      question: "Comment fonctionne la traduction en Tamazight ?",
      answer: "Notre IA utilise des modèles linguistiques avancés spécifiquement entraînés sur le corpus Tamazight. Elle comprend le contexte, les dialectes régionaux et fournit des traductions naturelles et précises."
    },
    {
      question: "Est-ce que le chatbot comprend tous les dialectes Amazighs ?",
      answer: "Nous supportons actuellement les principaux dialectes (Tamazight du Maroc central, Tashelhit, Tarifit) et étendons progressivement notre base de données à d'autres variantes régionales."
    },
    {
      question: "Puis-je utiliser AWAL GPT pour apprendre le Tamazight ?",
      answer: "Absolument ! Notre chatbot propose des modules d'apprentissage interactifs, des exercices de vocabulaire, et s'adapte à votre niveau de progression."
    },
    {
      question: "Comment contribuer à l'enrichissement de la base de données ?",
      answer: "Vous pouvez soumettre des mots, expressions ou corrections via notre plateforme communautaire. Chaque contribution est vérifiée par nos linguistes experts."
    },
    {
      question: "Le service est-il gratuit ?",
      answer: "Oui, l'accès de base est gratuit. Des fonctionnalités avancées (traduction de documents, API pour développeurs) sont disponibles via nos formules premium."
    }
  ]

  return (
    <section
      id='FAQ'
      className='relative py-1 bg-cover bg-center overflow-hidden'>
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='relative rounded-2xl py-24 bg-gradient-to-r from-primary to-accent overflow-hidden'>
          <div className='absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32'></div>
          <div className='absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48'></div>
          
          <div className='relative z-10'>
            <p className='text-lg font-normal text-white text-center mb-6 flex items-center justify-center gap-2'>
              <Icon icon="mdi:chat-question" width="24" height="24" />
              ⵜⵉⵙⵡⵉⵙⵜⵉⵏ ⵜⵉⴳ ⵓⵔ ⵜⵜⵓⵙⵙⴰⵏ
            </p>
            <h2 className='text-white text-center max-w-3xl mx-auto'>
              Questions fréquentes sur AWAL GPT.
            </h2>
            
            <div className='w-full px-4 pt-16'>
              {faqs.map((faq, index) => (
                <div key={index} className='mx-auto w-full max-w-5xl rounded-2xl p-8 bg-white mb-5 shadow-lg'>
                  <Disclosure>
                    {({ open }) => (
                      <div>
                        <DisclosureButton className='flex w-full justify-between items-center text-left text-xl font-medium focus:outline-hidden hover:cursor-pointer hover:text-primary transition-colors'>
                          <span className='text-black pr-4'>
                            {faq.question}
                          </span>
                          <div
                            className={`h-6 w-6 transform transition-transform duration-300 flex-shrink-0 ${
                              open ? 'rotate-180' : ''
                            }`}>
                            <Icon 
                              icon={open ? 'lucide:chevron-up' : 'lucide:chevron-down'} 
                              width='24' 
                              height='24'
                              className='text-primary'
                            />
                          </div>
                        </DisclosureButton>
                        <DisclosurePanel className='text-base text-gray-600 font-normal text-left pt-4 mt-6 border-t border-gray-200'>
                          <div className='lg:max-w-70% leading-relaxed'>
                            {faq.answer}
                          </div>
                        </DisclosurePanel>
                      </div>
                    )}
                  </Disclosure>
                </div>
              ))}
            </div>
            
            <div className='text-center mt-12'>
              <p className='text-white/80 mb-6'>
                Vous avez d'autres questions ?
              </p>
              <a 
                href='mailto:support@AWALbot.com' 
                className='inline-flex items-center gap-3 text-xl py-4 px-12 font-semibold text-primary bg-white rounded-full hover:bg-gray-100 hover:shadow-xl transition-all duration-300'>
                <Icon icon="mdi:email" width="24" height="24" />
                Contactez notre équipe
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default FAQ