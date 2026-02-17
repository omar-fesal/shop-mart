export default function HelpCenterPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Help Center</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How do I track my order?</h3>
              <p className="text-gray-600">You can track your order by visiting the "Track Your Order" page and entering your order number.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">What is your return policy?</h3>
              <p className="text-gray-600">We accept returns within 30 days of purchase. Items must be unused and in original packaging.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">How long does shipping take?</h3>
              <p className="text-gray-600">Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}