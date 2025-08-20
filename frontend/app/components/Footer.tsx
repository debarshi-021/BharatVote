/**
 * Footer Component
 * Simple footer with app information and links
 */
export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3">BharatVote</h3>
            <p className="text-sm leading-relaxed">
              Secure, transparent, and decentralized voting platform powered by blockchain technology.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Features</h4>
            <ul className="text-sm space-y-1">
              <li>• Blockchain Security</li>
              <li>• Transparent Results</li>
              <li>• Real-time Voting</li>
              <li>• Mobile Responsive</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Support</h4>
            <ul className="text-sm space-y-1">
              <li>• Help Center</li>
              <li>• Contact Us</li>
              <li>• Privacy Policy</li>
              <li>• Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm">© 2024 BharatVote. All rights reserved. | Powered by Blockchain Technology</p>
        </div>
      </div>
    </footer>
  )
}
