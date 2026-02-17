export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Size Guide</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Clothing Sizes</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Size</th>
                  <th className="border p-3 text-left">Chest (inches)</th>
                  <th className="border p-3 text-left">Waist (inches)</th>
                  <th className="border p-3 text-left">Hips (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">XS</td>
                  <td className="border p-3">32-34</td>
                  <td className="border p-3">24-26</td>
                  <td className="border p-3">34-36</td>
                </tr>
                <tr>
                  <td className="border p-3">S</td>
                  <td className="border p-3">34-36</td>
                  <td className="border p-3">26-28</td>
                  <td className="border p-3">36-38</td>
                </tr>
                <tr>
                  <td className="border p-3">M</td>
                  <td className="border p-3">36-38</td>
                  <td className="border p-3">28-30</td>
                  <td className="border p-3">38-40</td>
                </tr>
                <tr>
                  <td className="border p-3">L</td>
                  <td className="border p-3">38-40</td>
                  <td className="border p-3">30-32</td>
                  <td className="border p-3">40-42</td>
                </tr>
                <tr>
                  <td className="border p-3">XL</td>
                  <td className="border p-3">40-42</td>
                  <td className="border p-3">32-34</td>
                  <td className="border p-3">42-44</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}