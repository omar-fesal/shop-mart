export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Careers at A-Mart</h1>
      
      <p className="text-gray-600 mb-8">
        Join our team and help us shape the future of e-commerce!
      </p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Work With Us?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Competitive salary and benefits</li>
            <li>Flexible work environment</li>
            <li>Career growth opportunities</li>
            <li>Innovative and collaborative culture</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Open Positions</h2>
          <p className="text-gray-600">No open positions at the moment. Check back soon!</p>
        </section>
      </div>
    </div>
  )
}