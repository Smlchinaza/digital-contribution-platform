"use client";
import { Group } from "../../types/group";

interface CurrentGroupsProps {
  groups: Group[];
  loading: boolean;
  onJoinGroup: (groupId: string) => void;
}

export function CurrentGroups({ groups, loading, onJoinGroup }: CurrentGroupsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Groups</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">My Groups ({groups.length})</h2>
      
      {groups.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't joined any groups yet.</p>
          <p className="text-sm mt-2">Browse available groups to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => {
            const userMember = group.members?.find(m => m.userId);
            const isCurrentRecipient = userMember?.position === group.currentCycle;
            const hasReceived = userMember?.hasReceived || false;
            
            return (
              <div key={group.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{group.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isCurrentRecipient 
                      ? 'bg-green-100 text-green-800' 
                      : hasReceived 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isCurrentRecipient ? 'Current Recipient' : hasReceived ? 'Completed' : 'Active'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <p className="font-medium">₦{group.amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Plan:</span>
                    <p className="font-medium capitalize">{group.plan}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Position:</span>
                    <p className="font-medium">{userMember?.position || 'N/A'}/7</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Cycle:</span>
                    <p className="font-medium">{group.currentCycle}/7</p>
                  </div>
                </div>
                
                <div className="mt-3 text-sm">
                  <span className="text-gray-600">Members:</span>
                  <span className="ml-2 font-medium">{group.members?.length || 0}/7</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
