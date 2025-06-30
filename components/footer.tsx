import Link from "next/link"
import { Utensils, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Utensils className="h-7 w-7 text-emerald-400" />
              <span className="text-2xl font-bold tracking-wide">SEA Catering</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Healthy Meals, Anytime, Anywhere. Indonesia's premier healthy meal delivery service, crafted for your lifestyle.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { label: "Home", href: "/" },
                { label: "Menu", href: "/menu" },
                { label: "Subscription", href: "/subscription" },
                { label: "Contact", href: "/contact" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Info</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span>0812-3456-789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-400" />
                <span>natasha.atmadja2@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span>Indonesia</span>
              </li>
            </ul>
          </div>

          {/* Optional: Newsletter or Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Connected</h3>
            <p className="text-sm text-gray-400 mb-4">
              Follow us for updates, promotions, and health tips!
            </p>
            {/* You could place social icons here if available */}
          </div>
        </div>

        {/* Divider & Bottom Text */}
        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SEA Catering. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
