export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      
      <div className="space-y-6 text-gray-600">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Acceptance of Terms</h2>
          <p>By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on A-Mart's website for personal, non-commercial transitory viewing only.</p>
        </section>
      </div>
    </div>
  )
}