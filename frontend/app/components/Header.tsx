/**
 * Header Component
 * Displays the app name and navigation for BharatVote
 */
export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <span className="inline-block w-12 h-12">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                 </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">BharatVote</h1>
              <p className="text-sm opacity-90">Secure Blockchain Voting</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-6">
            <a href="#vote" className="hover:text-accent transition-colors">
              Vote
            </a>
            <a href="#results" className="hover:text-accent transition-colors">
              Results
            </a>
            <a href="#about" className="hover:text-accent transition-colors">
              About
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
