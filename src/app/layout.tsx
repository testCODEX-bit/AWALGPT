'use client'
import { Manrope } from 'next/font/google'
import './globals.css'
import Header from '@/app/components/Layout/Header'
import Footer from '@/app/components/Layout/Footer'
import Aoscompo from '@/utils/aos'
import { usePathname } from 'next/navigation'

const font = Manrope({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${font.className}`}>
        <Aoscompo>
          <LayoutContent>{children}</LayoutContent>
        </Aoscompo>
      </body>
    </html>
  )
}

// Composant séparé pour la logique conditionnelle
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Si on est sur la page /chat, ne pas afficher header/footer
  if (pathname?.startsWith('/chat')) {
    return <>{children}</>
  }

  // Pour toutes les autres pages
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}