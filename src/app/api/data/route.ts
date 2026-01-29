import { NextResponse } from 'next/server'

import { HeaderItem } from '@/app/types/menu'
import { aboutdata } from '@/app/types/aboutdata'
import { footerlinks } from '@/app/types/footerlinks'

// header nav-links data
const headerData: HeaderItem[] = [
  { label: 'About Us', href: '#About' },
  { label: 'Statistiques', href: '#Dedicated' },
  { label: 'FAQ', href: '#FAQ' },
  { label: 'Plans', href: '#services-section' },
  { label: 'Join', href: '#join' }
  
]

// about data
const Aboutdata: aboutdata[] = [
  {
    heading: 'About us.',
    paragraph:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem',
    link: 'Learn more',
  },
  {
    heading: 'Services.',
    paragraph:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem',
    link: 'Learn more',
  }
]


// plans data
const PlansData = [
  {
    heading: 'Startup',
    price: {
      monthly: 1,
      yearly: 10,
    },
    user: 'per user',
    features: {
      profiles: '5 Social Profiles',
      posts: '5 Scheduled Posts Per Profile',
      templates: '400+ Templated',
      view: 'Calendar View',
      support: '24/7 Support',
    },
  },
  {
    heading: 'Business',
    price: {
      monthly: 2,
      yearly: 20,
    },
    user: 'per user',
    features: {
      profiles: '10 Social Profiles',
      posts: '5 Scheduled Posts Per Profile',
      templates: '600+ Templated',
      view: 'Calendar View',
      support: '24/7 VIP Support',
    },
  }
]

// footer links data
const FooterLinksData: footerlinks[] = [
  {
    section: 'Menu',
    links: [
      { label: 'About Us', href: '#About' },
      { label: 'Team', href: '#Team' },
      { label: 'FAQ', href: '#FAQ' }
    ],
  },
    {
    section: 'Menu',
     links: [
      { label: 'Statistiques', href: '#Dedicated' },
      { label: 'Plans', href: '#services-section' },
      { label: 'Join', href: '#join' }
    ],
  }
]

export const GET = () => {
  return NextResponse.json({
    headerData,
    Aboutdata,
    PlansData,
    FooterLinksData,
  })
}
