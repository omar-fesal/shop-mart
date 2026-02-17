export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        We're here to help! Reach out to us through any of the following channels:
      </p>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Email</h2>
          <p className="text-gray-600">support@a-mart.com</p>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Phone</h2>
          <p className="text-gray-600">+1 (555) 123-4567</p>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
          <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
          <p className="text-gray-600">Saturday - Sunday: Closed</p>
        </div>
      </div>
    </div>
  )
}