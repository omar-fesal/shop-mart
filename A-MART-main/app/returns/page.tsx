export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Returns & Exchanges</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
          <p className="text-gray-600 mb-4">
            We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 30 days of delivery.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Return Requirements</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Items must be unused and in original condition</li>
            <li>Original packaging and tags must be intact</li>
            <li>Proof of purchase required</li>
            <li>Return shipping costs are the responsibility of the customer</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Contact our customer service team</li>
            <li>Receive your return authorization number</li>
            <li>Pack items securely in original packaging</li>
            <li>Ship to the provided return address</li>
            <li>Refund will be processed within 5-7 business days</li>
          </ol>
        </section>
      </div>
    </div>
  )
}