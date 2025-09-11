"use client";

interface PayoutInfo {
  groupId: string;
  groupTitle: string;
  amount: number;
  position: number;
  estimatedDate: string;
}

interface PayoutScheduleProps {
  nextPayouts: PayoutInfo[];
  loading: boolean;
}

export function PayoutSchedule({ nextPayouts, loading }: PayoutScheduleProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Payout Schedule</h2>
        <div className="animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilPayout = (dateString: string) => {
    const today = new Date();
    const payoutDate = new Date(dateString);
    const diffTime = payoutDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Payout Schedule</h2>
      
      {nextPayouts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No upcoming payouts</p>
          <p className="text-sm mt-2">Join groups to see your payout schedule</p>
        </div>
      ) : (
        <div className="space-y-3">
          {nextPayouts.map((payout, index) => {
            const daysUntil = getDaysUntilPayout(payout.estimatedDate);
            const isUpcoming = daysUntil <= 7 && daysUntil >= 0;
            const isOverdue = daysUntil < 0;
            
            return (
              <div 
                key={payout.groupId} 
                className={`flex justify-between items-center p-4 border rounded-lg transition-colors ${
                  isUpcoming ? 'bg-green-50 border-green-200' : 
                  isOverdue ? 'bg-red-50 border-red-200' : 
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{payout.groupTitle}</h3>
                  <p className="text-sm text-gray-600">Position #{payout.position}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    ₦{payout.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(payout.estimatedDate)}
                  </div>
                </div>
                
                <div className="ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isOverdue 
                      ? 'bg-red-100 text-red-800' 
                      : isUpcoming 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isOverdue 
                      ? `${Math.abs(daysUntil)} days overdue` 
                      : isUpcoming 
                        ? `${daysUntil} days` 
                        : `${daysUntil} days`
                    }
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {nextPayouts.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Payout dates are estimates based on group cycles. 
            Actual dates may vary depending on group activity.
          </p>
        </div>
      )}
    </div>
  );
}
