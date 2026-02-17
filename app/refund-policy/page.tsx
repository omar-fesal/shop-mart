export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Refund Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Refund Eligibility</h2>
          <p className="text-gray-600 mb-4">
            Items are eligible for refund within 30 days of purchase if they meet our return requirements.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Return item according to our returns policy</li>
            <li>We inspect the returned item</li>
            <li>Refund is processed within 5-7 business days</li>
            <li>Refund appears on your original payment method within 10 business days</li>
          </ol>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Non-Refundable Items</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Gift cards</li>
            <li>Downloadable software</li>
            <li>Items on final sale</li>
          </ul>
        </section>
      </div>
    </div>
  )
}