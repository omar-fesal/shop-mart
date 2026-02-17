export default function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-white shadow rounded-lg overflow-hidden">
    
      <div className="bg-gray-200 w-full aspect-square"></div>

     
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>

      
      <div className="p-4 flex gap-2">
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
        <div className="h-8 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  );
}
