"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useMapCreationStore } from '@/stores/map-creation'

export default function Header() {
  const pathname = usePathname()
  const { isDraft, lastSaved } = useMapCreationStore()
  
  const isWorkflowPage = pathname.startsWith('/create')
  
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-light tracking-tight">
            Great Loop Supply Co.
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Products
            </Link>
            <Link href="/create" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Create Maps
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
          
          {/* Draft Status & CTA */}
          <div className="flex items-center space-x-4">
            {isDraft && isWorkflowPage && (
              <div className="text-xs text-muted-foreground">
                Draft saved {lastSaved ? new Date(lastSaved).toLocaleTimeString() : 'locally'}
              </div>
            )}
            
            {!isWorkflowPage && (
              <Button asChild size="sm">
                <Link href="/create">Create Map</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 