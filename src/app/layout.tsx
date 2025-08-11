import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Shreyash Desai - Computer Engineering Portfolio',
  description: 'Final-year Computer Engineering student skilled in database-driven systems and UI/UX design. Proficient in PHP, MySQL, JavaScript, and Figma.',
  keywords: 'Shreyash Desai, Computer Engineering, UI/UX Designer, Web Developer, PHP, MySQL, JavaScript, Figma, NPTEL Certified',
  authors: [{ name: 'Shreyash Desai' }],
  openGraph: {
    title: 'Shreyash Desai - Computer Engineering Portfolio',
    description: 'Final-year Computer Engineering student skilled in database-driven systems and UI/UX design.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shreyash Desai - Computer Engineering Portfolio',
    description: 'Final-year Computer Engineering student skilled in database-driven systems and UI/UX design.',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white overflow-x-hidden`}>
        <div className="relative min-h-screen">
          {/* Background gradient */}
          <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-10" />
          
          {/* Subtle grid pattern */}
          <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 -z-10" />
          
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-blue-400">
                  Shreyash Desai
                </div>
                <div className="hidden md:flex space-x-8">
                  <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">About</a>
                  <a href="#education" className="text-gray-300 hover:text-blue-400 transition-colors">Education</a>
                  <a href="#skills" className="text-gray-300 hover:text-blue-400 transition-colors">Skills</a>
                  <a href="#internship" className="text-gray-300 hover:text-blue-400 transition-colors">Experience</a>
                  <a href="#projects" className="text-gray-300 hover:text-blue-400 transition-colors">Projects</a>
                  <a href="#certificates" className="text-gray-300 hover:text-blue-400 transition-colors">Certificates</a>
                  <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</a>
                </div>
                <div className="md:hidden">
                  <button className="text-gray-300 hover:text-blue-400 focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="relative z-10">
            {children}
          </main>

          {/* Footer */}
          <footer className="relative z-10 bg-black/50 border-t border-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
              <p>&copy; 2024 Shreyash Desai. All rights reserved.</p>
              <p className="mt-2">Built with Next.js, Three.js, and Tailwind CSS</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}