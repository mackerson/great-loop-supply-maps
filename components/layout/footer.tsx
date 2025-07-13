import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/20 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-medium">Great Loop Supply Co.</h3>
            <p className="text-sm text-muted-foreground">
              Distinctive products for Great Loop Boaters. Create beautiful maps of your journey around America&apos;s Great Loop.
            </p>
          </div>
          
          {/* Product */}
          <div className="space-y-3">
            <h4 className="font-medium">Products</h4>
            <div className="space-y-2">
              <Link href="/create" className="block text-sm text-muted-foreground hover:text-foreground">
                Journey Maps
              </Link>
              <Link href="/products" className="block text-sm text-muted-foreground hover:text-foreground">
                All Products
              </Link>
              <Link href="/examples" className="block text-sm text-muted-foreground hover:text-foreground">
                Examples
              </Link>
            </div>
          </div>
          
          {/* Company */}
          <div className="space-y-3">
            <h4 className="font-medium">Company</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
              <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
            </div>
          </div>
          
          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-medium">Support</h4>
            <div className="space-y-2">
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-foreground">
                Help Center
              </Link>
              <Link href="/faq" className="block text-sm text-muted-foreground hover:text-foreground">
                FAQ
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2024 Great Loop Supply Company. All rights reserved.
        </div>
      </div>
    </footer>
  )
} 