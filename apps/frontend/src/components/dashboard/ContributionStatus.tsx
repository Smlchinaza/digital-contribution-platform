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
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-3xl backdrop-blur-sm border border-slate-600/20"></div>
        <div className="relative p-8">
          <div className="text-center mb-8">
            <div className="h-8 bg-slate-700/50 rounded w-48 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-slate-700/50 rounded w-32 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-12 bg-slate-700/50 rounded w-24 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-slate-700/50 rounded w-20 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const netBalance = totalReceived - totalContributed;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-3xl backdrop-blur-sm border border-slate-600/20"></div>
      <div className="relative p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Contribution Status
          </h2>
          <p className="text-slate-400">Your financial journey overview</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300">
              <div className="text-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl w-fit mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  ₦{totalContributed.toLocaleString()}
                </div>
                <p className="text-slate-400">Total Contributed</p>
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300">
              <div className="text-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl w-fit mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  ₦{totalReceived.toLocaleString()}
                </div>
                <p className="text-slate-400">Total Received</p>
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className={`absolute inset-0 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 ${
              netBalance >= 0 ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-red-500/20 to-pink-500/20'
            }`}></div>
            <div className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-opacity-50 transition-all duration-300 ${
              netBalance >= 0 ? 'border-green-500/30 hover:border-green-400/50' : 'border-red-500/30 hover:border-red-400/50'
            }`}>
              <div className="text-center">
                <div className={`p-3 rounded-xl w-fit mx-auto mb-4 ${
                  netBalance >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className={`text-3xl font-bold mb-2 ${
                  netBalance >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ₦{Math.abs(netBalance).toLocaleString()}
                </div>
                <p className="text-slate-400">
                  {netBalance >= 0 ? 'Net Gain' : 'Net Contribution'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl"></div>
          <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-yellow-400 text-lg">Pending Contributions</p>
                <p className="text-slate-300">₦{pendingContributions.toLocaleString()} due</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
