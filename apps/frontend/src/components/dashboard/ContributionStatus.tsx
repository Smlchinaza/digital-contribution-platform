"use client";

interface ContributionStatusProps {
  totalContributed: number;
  totalReceived: number;
  pendingContributions: number;
  loading: boolean;
}

export function ContributionStatus({ 
  totalContributed, 
  totalReceived, 
  pendingContributions, 
  loading 
}: ContributionStatusProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Contribution Status</h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const netBalance = totalReceived - totalContributed;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Contribution Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            ₦{totalContributed.toLocaleString()}
          </div>
          <p className="text-gray-600">Total Contributed</p>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            ₦{totalReceived.toLocaleString()}
          </div>
          <p className="text-gray-600">Total Received</p>
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${
            netBalance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ₦{Math.abs(netBalance).toLocaleString()}
          </div>
          <p className="text-gray-600">
            {netBalance >= 0 ? 'Net Gain' : 'Net Contribution'}
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center">
          <div className="text-yellow-600 mr-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-yellow-800">Pending Contributions</p>
            <p className="text-yellow-700">₦{pendingContributions.toLocaleString()} due</p>
          </div>
        </div>
      </div>
    </div>
  );
}
