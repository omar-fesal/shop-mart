export default function SustainabilityPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Sustainability</h1>
      
      <div className="space-y-6">
        <p className="text-gray-600 text-lg">
          At A-Mart, we're committed to sustainable business practices and reducing our environmental impact.
        </p>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Initiatives</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Eco-friendly packaging materials</li>
            <li>Carbon-neutral shipping options</li>
            <li>Partnership with sustainable brands</li>
            <li>Waste reduction programs</li>
          </ul>
        </section>
      </div>
    </div>
  )
}