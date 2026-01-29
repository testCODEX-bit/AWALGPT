import React from 'react'
import Hero from '@/app/components/Home/Hero'
import Aboutus from '@/app/components/Home/AboutUs'
import Dedicated from '@/app/components/Home/Dedicated'
import Manage from '@/app/components/Home/Manage'
import FAQ from '@/app/components/Home/FAQ'
import Join from '@/app/components/Home/Joinus'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AWAL GPT - Chatbot Amazigh',
  description: 'Chatbot intelligent pour la préservation et la promotion de la langue et culture Amazighe',
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Aboutus />
      <Dedicated />
      <FAQ />
      <Manage />
      <Join />
    </main>
    
  )
}