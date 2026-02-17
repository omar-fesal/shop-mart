export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>
      
      <div className="space-y-6 text-gray-600">
        <p>We use cookies to improve your browsing experience and analyze site traffic.</p>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit our website.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">How We Use Cookies</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Remember your preferences</li>
            <li>Analyze site performance</li>
            <li>Personalize content</li>
            <li>Enable shopping cart functionality</li>
          </ul>
        </section>
      </div>
    </div>
  )
}