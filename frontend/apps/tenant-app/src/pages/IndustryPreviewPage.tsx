/**
 * Industry Preview Page
 * 
 * Shows a preview of a tenant site using default industry data
 * This is for demonstration purposes - shows what each industry template looks like
 */

interface IndustryPreviewPageProps {
  industry: string;
}

export function IndustryPreviewPage({ industry = 'mobile-detailing' }: IndustryPreviewPageProps) {

  const industryDisplayName = industry
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Preview Banner */}
      <div className="bg-blue-600 text-white text-center py-3 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>
            📱 <strong>Preview Mode:</strong> {industryDisplayName} Template
          </span>
          <a 
            href="http://localhost:8080" 
            className="underline hover:text-blue-200 font-medium"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
      
      {/* Simple content */}
      <div className="max-w-4xl mx-auto p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">🚗 {industryDisplayName}</h1>
        <p className="text-xl mb-4">Preview page is working!</p>
        <p className="text-gray-400">Industry slug: <code className="bg-gray-800 px-2 py-1 rounded">{industry}</code></p>
        <p className="text-gray-400 mt-2">Current path: <code className="bg-gray-800 px-2 py-1 rounded">{location.pathname}</code></p>
        
        <div className="mt-8 p-4 bg-green-900/50 border border-green-500 rounded">
          ✅ If you see this, the preview route is working!
        </div>
      </div>
    </div>
  );
}

