"use client";
import { useState } from "react";
import { apiService } from "../services/api";
import { Group } from "../types/group";
import { CreatePaymentDto } from "../types/payment";

interface PaymentFormProps {
  group: Group;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ group, onSuccess, onCancel }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    amount: group.amount,
    userBankName: "",
    userAccountName: "",
    userAccountNumber: "",
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contribution account details (these would typically come from environment variables or admin settings)
  const contributionAccount = {
    accountName: "DIGITAL CONTRIBUTION PLATFORM",
    accountNumber: "1234567890",
    bankName: "ACCESS BANK PLC"
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPG, PNG, etc.)');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setReceiptFile(file);
      setError(null);
    }
  };

  const uploadReceipt = async (file: File): Promise<string> => {
    // For now, we'll simulate file upload by creating a data URL
    // In a real application, you would upload to a cloud storage service
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      let receiptUrl: string | undefined;

      if (receiptFile) {
        setUploading(true);
        receiptUrl = await uploadReceipt(receiptFile);
        setUploading(false);
      }

      const paymentData: CreatePaymentDto = {
        groupId: parseInt(group.id),
        amount: formData.amount,
        userBankName: formData.userBankName,
        userAccountName: formData.userAccountName,
        userAccountNumber: formData.userAccountNumber,
        receiptUrl,
      };

      await apiService.createPayment(paymentData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Make Payment</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Contribution Account Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm text-gray-900">
              <div className="flex justify-between">
                <span className="font-medium text-blue-800">Account Name:</span>
                <span className="text-blue-700">{contributionAccount.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-blue-800">Account Number:</span>
                <span className="text-blue-700 font-mono">{contributionAccount.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-blue-800">Bank Name:</span>
                <span className="text-blue-700">{contributionAccount.bankName}</span>
              </div>
            </div>
          </div>

          {/* Group Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Group Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-900">
              <div>
                <span className="font-medium text-gray-600">Group:</span>
                <p className="text-gray-900">{group.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Amount:</span>
                <p className="text-gray-900">₦{group.amount?.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Plan:</span>
                <p className="text-gray-900 capitalize">{group.plan}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Members:</span>
                <p className="text-gray-900">{group.members?.length || 0}/7</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Amount Paid (₦)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Enter amount paid"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Your Bank Name
              </label>
              <input
                type="text"
                name="userBankName"
                value={formData.userBankName}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="e.g., Access Bank, GTBank, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Your Account Name
              </label>
              <input
                type="text"
                name="userAccountName"
                value={formData.userAccountName}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Enter your account name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Your Account Number
              </label>
              <input
                type="text"
                name="userAccountNumber"
                value={formData.userAccountNumber}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Enter your account number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Payment Receipt (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
              {receiptFile && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {receiptFile.name}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? 'Uploading...' : submitting ? 'Submitting...' : "I've Paid"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
