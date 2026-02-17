export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-600">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Information We Collect</h2>
          <p>We collect information you provide directly to us, including name, email address, shipping address, and payment information.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and updates</li>
            <li>Respond to customer service requests</li>
            <li>Improve our products and services</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information.</p>
        </section>
      </div>
    </div>
  )
}