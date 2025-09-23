"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import { apiService } from "../../../services/api";
import { Payment } from "../../../types/payment";

export default function AdminPaymentsPage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadPayments() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await apiService.getAllPayments();
        setPayments(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, [token]);

  const handleApprove = async (payment: Payment) => {
    setSelectedPayment(payment);
    setAdminNotes("");
    setShowApprovalModal(true);
  };

  const handleReject = async (payment: Payment) => {
    setSelectedPayment(payment);
    setAdminNotes("");
    setShowApprovalModal(true);
  };

  const processPayment = async (status: 'approved' | 'rejected') => {
    if (!selectedPayment) return;
    
    setProcessing(true);
    try {
      const updated = await apiService.updatePaymentStatus(selectedPayment.id, {
        status,
        adminNotes: adminNotes.trim() || undefined,
      });
      
      setPayments(prev => prev.map(p => p.id === updated.id ? updated : p));
      setShowApprovalModal(false);
      setSelectedPayment(null);
      setAdminNotes("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <div className="text-sm text-gray-600">
          Total Payments: {payments.length} | Pending: {payments.filter(p => p.status === 'pending').length}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.user?.fullName || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.user?.email || 'No email'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.group?.title || 'Unknown Group'}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₦{payment.group?.amount?.toLocaleString()} • {payment.group?.plan}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.userBankName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.userAccountName}
                    </div>
                    <div className="text-sm text-gray-500 font-mono">
                      {payment.userAccountNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {payment.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(payment)}
                          className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(payment)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No payments found.</p>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedPayment.status === 'pending' ? 'Process Payment' : 'Payment Details'}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.user?.fullName} ({selectedPayment.user?.email})
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.group?.title} - ₦{selectedPayment.amount.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Details
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.userBankName}<br/>
                    {selectedPayment.userAccountName}<br/>
                    {selectedPayment.userAccountNumber}
                  </p>
                </div>

                {selectedPayment.receiptUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Receipt
                    </label>
                    <img 
                      src={selectedPayment.receiptUrl} 
                      alt="Payment receipt" 
                      className="max-w-full h-32 object-contain border rounded"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Add any notes about this payment..."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedPayment(null);
                    setAdminNotes("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                {selectedPayment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => processPayment('approved')}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {processing ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => processPayment('rejected')}
                      disabled={processing}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {processing ? 'Processing...' : 'Reject'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
