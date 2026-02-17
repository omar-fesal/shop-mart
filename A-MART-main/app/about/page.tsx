export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">About A-Mart</h1>
      
      <div className="space-y-6">
        <p className="text-gray-600 text-lg">
          Welcome to A-Mart, your one-stop destination for the latest technology, fashion, and lifestyle products. Quality guaranteed with fast shipping and excellent customer service.
        </p>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            To provide customers with high-quality products at competitive prices while delivering exceptional shopping experiences.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Customer satisfaction is our top priority</li>
            <li>Quality products at affordable prices</li>
            <li>Fast and reliable shipping</li>
            <li>Sustainable and ethical business practices</li>
          </ul>
        </section>
      </div>
    </div>
  )
}