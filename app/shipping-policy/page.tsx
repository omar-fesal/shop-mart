export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Shipping Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Methods</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Standard Shipping: 5-7 business days - Free on orders over $50</li>
            <li>Express Shipping: 2-3 business days - $15</li>
            <li>Next Day Delivery: 1 business day - $25</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
          <p className="text-gray-600">We currently ship to select international destinations. Shipping times and costs vary by location.</p>
        </section>
      </div>
    </div>
  )
}