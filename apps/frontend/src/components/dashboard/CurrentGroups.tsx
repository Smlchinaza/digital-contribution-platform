"use client";
import { Group } from "../../types/group";

interface CurrentGroupsProps {
  groups: Group[];
  loading: boolean;
  onJoinGroup: (groupId: number) => void;
}

export function CurrentGroups({ groups, loading, onJoinGroup }: CurrentGroupsProps) {
  if (loading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-3xl backdrop-blur-sm border border-slate-600/20"></div>
        <div className="relative p-8">
          <div className="text-center mb-8">
            <div className="h-8 bg-slate-700/50 rounded w-32 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-slate-700/50 rounded w-24 mx-auto animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-slate-700/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-3xl backdrop-blur-sm border border-slate-600/20"></div>
      <div className="relative p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            My Groups ({groups.length})
          </h2>
          <p className="text-slate-400">Your active contribution groups</p>
        </div>
        
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg">You haven't joined any groups yet.</p>
            <p className="text-slate-500 text-sm mt-2">Browse available groups to get started!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => {
              const userMember = group.members?.find(m => m.userId);
              const isCurrentRecipient = userMember?.position === group.currentCycle;
              const hasReceived = userMember?.hasReceived || false;
              
              return (
                <div key={group.id} className="group relative">
                  <div className={`absolute inset-0 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 ${
                    isCurrentRecipient 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' 
                      : hasReceived 
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20'
                        : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20'
                  }`}></div>
                  <div className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-opacity-50 transition-all duration-300 ${
                    isCurrentRecipient 
                      ? 'border-green-500/30 hover:border-green-400/50' 
                      : hasReceived 
                        ? 'border-blue-500/30 hover:border-blue-400/50'
                        : 'border-yellow-500/30 hover:border-yellow-400/50'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-white">{group.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isCurrentRecipient 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : hasReceived 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {isCurrentRecipient ? 'Current Recipient' : hasReceived ? 'Completed' : 'Active'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-slate-400">Amount:</span>
                        <p className="font-semibold text-cyan-400">₦{group.amount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Plan:</span>
                        <p className="font-semibold text-white capitalize">{group.plan}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Position:</span>
                        <p className="font-semibold text-white">{userMember?.position || 'N/A'}/7</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Cycle:</span>
                        <p className="font-semibold text-white">{group.currentCycle}/7</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-slate-400">Members:</span>
                        <span className="ml-2 font-semibold text-white">{group.members?.length || 0}/7</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isCurrentRecipient 
                            ? 'bg-green-400 animate-pulse' 
                            : hasReceived 
                              ? 'bg-blue-400'
                              : 'bg-yellow-400 animate-pulse'
                        }`}></div>
                        <span className="text-xs text-slate-400">
                          {isCurrentRecipient ? 'Your turn!' : hasReceived ? 'Completed' : 'Waiting'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
