"use client";
import { useState } from "react";

interface Transaction {
  id: string;
  type: 'contribution' | 'payout';
  amount: number;
  groupTitle: string;
  date: string;
  status: 'completed' | 'pending';
}

interface BalanceHistoryProps {
  transactions: Transaction[];
  loading: boolean;
}

export function BalanceHistory({ transactions, loading }: BalanceHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'contributions' | 'payouts'>('all');

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
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

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'contributions') return transaction.type === 'contribution';
    if (filter === 'payouts') return transaction.type === 'payout';
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'contribution') {
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('contributions')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'contributions' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Contributions
          </button>
          <button
            onClick={() => setFilter('payouts')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'payouts' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Payouts
          </button>
        </div>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions found</p>
          <p className="text-sm mt-2">
            {filter === 'all' 
              ? 'Your transaction history will appear here' 
              : `No ${filter} found`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                {getTransactionIcon(transaction.type)}
                <div>
                  <h3 className="font-medium text-gray-900 capitalize">
                    {transaction.type} - {transaction.groupTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-semibold ${
                  transaction.type === 'contribution' 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  {transaction.type === 'contribution' ? '-' : '+'}₦{transaction.amount.toLocaleString()}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
