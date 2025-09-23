"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import { apiService } from "../../../services/api";
import { Group } from "../../../types/group";
import { User } from "../../../types/user";

export default function AdminGroupsPage() {
  const { token } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showPayoutAssignment, setShowPayoutAssignment] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!token) return;
      setLoading(true);
      try {
        const [groupsData, usersData] = await Promise.all([
          apiService.getAdminGroups(),
          apiService.getAdminUsers()
        ]);
        setGroups(groupsData);
        setUsers(usersData);
      } catch (e: any) {
        console.error("Failed to load data:", e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  async function advance(id: number) {
    try {
      const updated = await apiService.advanceGroup(id);
      setGroups((gs) => gs.map((g) => g.id === id ? updated : g));
    } catch (e: any) {
      console.error("Failed to advance group:", e.message);
    }
  }

  async function addUserToGroup(groupId: number, userId: number | string, position?: number) {
    try {
      const updated = await apiService.addUserToGroup(groupId as any, typeof userId === 'string' ? parseInt(userId) as any : (userId as any), position);
      setGroups((gs) => gs.map((g) => g.id === groupId ? updated : g));
      alert('User added to group successfully!');
    } catch (e: any) {
      alert(`Failed to add user: ${e.message}`);
    }
  }

  async function removeUserFromGroup(groupId: number, userId: number | string) {
    try {
      const updated = await apiService.removeUserFromGroup(groupId as any, typeof userId === 'string' ? parseInt(userId) as any : (userId as any));
      setGroups((gs) => gs.map((g) => g.id === groupId ? updated : g));
      alert('User removed from group successfully!');
    } catch (e: any) {
      alert(`Failed to remove user: ${e.message}`);
    }
  }

  async function assignNextPayout(groupId: number, userId: number | string) {
    try {
      const updated = await apiService.assignNextPayout(groupId as any, typeof userId === 'string' ? parseInt(userId) as any : (userId as any));
      setGroups((gs) => gs.map((g) => g.id === groupId ? updated : g));
      alert('Payout assigned successfully!');
    } catch (e: any) {
      alert(`Failed to assign payout: ${e.message}`);
    }
  }

  function openUserManagement(group: Group) {
    setSelectedGroup(group);
    setShowUserManagement(true);
  }

  function openPayoutAssignment(group: Group) {
    setSelectedGroup(group);
    setShowPayoutAssignment(true);
  }

  function getAvailableUsers(group: Group) {
    const groupUserIds = group.members?.map(m => m.userId) || [];
    return users.filter(user => !groupUserIds.includes(user.id));
  }

  function getNextPayoutInfo(group: Group) {
    const nextRecipient = group.members?.find(m => m.position === group.currentCycle);
    return nextRecipient;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Group Management</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {groups.map((g) => {
          const nextPayout = getNextPayoutInfo(g);
          const nextPayoutUser = nextPayout ? users.find(u => u.id === nextPayout.userId) : null;
          
          return (
            <div key={g.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="font-semibold text-lg mb-2">{g.title}</div>
              <div className="text-sm text-gray-600 mb-2">
                Amount: ₦{g.amount?.toLocaleString?.() ?? g.amount} • Plan: {g.plan}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Members: {g.members?.length ?? 0}/7 • Current cycle: {g.currentCycle}/7
              </div>
              
              {/* Next Payout Info */}
              {nextPayoutUser && (
                <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
                  <div className="text-xs font-medium text-blue-800">Next Payout:</div>
                  <div className="text-sm text-blue-700">
                    {nextPayoutUser.fullName} (Position {nextPayout.position})
                  </div>
                </div>
              )}

              {/* Group Members */}
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-600 mb-1">Members:</div>
                <div className="text-xs text-gray-500">
                  {g.members?.length ? (
                    g.members.map(member => {
                      const user = users.find(u => u.id === member.userId);
                      return (
                        <div key={member.userId} className="flex justify-between">
                          <span>{user?.fullName || 'Unknown'}</span>
                          <span className="font-mono">#{member.position}</span>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-gray-400">No members</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  onClick={() => openUserManagement(g)}
                >
                  Manage Users
                </button>
                <button 
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  onClick={() => openPayoutAssignment(g)}
                >
                  Assign Payout
                </button>
                <button 
                  className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                  onClick={() => advance(g.id)}
                >
                  Advance Cycle
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Management Modal */}
      {showUserManagement && selectedGroup && (
        <UserManagementModal
          group={selectedGroup}
          users={users}
          availableUsers={getAvailableUsers(selectedGroup)}
          onAddUser={addUserToGroup}
          onRemoveUser={removeUserFromGroup}
          onClose={() => {
            setShowUserManagement(false);
            setSelectedGroup(null);
          }}
        />
      )}

      {/* Payout Assignment Modal */}
      {showPayoutAssignment && selectedGroup && (
        <PayoutAssignmentModal
          group={selectedGroup}
          users={users}
          onAssignPayout={assignNextPayout}
          onClose={() => {
            setShowPayoutAssignment(false);
            setSelectedGroup(null);
          }}
        />
      )}
    </div>
  );
}

// User Management Modal Component
function UserManagementModal({ 
  group, 
  users, 
  availableUsers, 
  onAddUser, 
  onRemoveUser, 
  onClose 
}: {
  group: Group;
  users: User[];
  availableUsers: User[];
  onAddUser: (groupId: number, userId: number, position?: number) => void;
  onRemoveUser: (groupId: number, userId: number) => void;
  onClose: () => void;
}) {
  const [selectedUser, setSelectedUser] = useState<number | ''>('');
  const [selectedPosition, setSelectedPosition] = useState<number | undefined>();

  const handleAddUser = () => {
    if (selectedUser !== '') {
      onAddUser(group.id, Number(selectedUser), selectedPosition);
      setSelectedUser('');
      setSelectedPosition(undefined);
    }
  };

  const getAvailablePositions = () => {
    const takenPositions = group.members?.map(m => m.position) || [];
    return [1, 2, 3, 4, 5, 6, 7].filter(pos => !takenPositions.includes(pos));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Manage Users - {group.title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          {/* Add User Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Add User to Group</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value ? Number(e.target.value) : '')}
                className="p-2 border rounded"
              >
                <option value="">Select user...</option>
                {availableUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} ({user.email})
                  </option>
                ))}
              </select>
              <select
                value={selectedPosition || ''}
                onChange={(e) => setSelectedPosition(e.target.value ? parseInt(e.target.value) : undefined)}
                className="p-2 border rounded"
              >
                <option value="">Auto position</option>
                {getAvailablePositions().map(pos => (
                  <option key={pos} value={pos}>Position {pos}</option>
                ))}
              </select>
              <button
                onClick={handleAddUser}
                disabled={!selectedUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Add User
              </button>
            </div>
          </div>

          {/* Current Members */}
          <div>
            <h4 className="font-medium mb-3">Current Members</h4>
            <div className="space-y-2">
              {group.members?.map(member => {
                const user = users.find(u => u.id === member.userId);
                return (
                  <div key={member.userId} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">{user?.fullName || 'Unknown User'}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        Position {member.position}
                      </span>
                      <button
                        onClick={() => onRemoveUser(group.id, member.userId)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Payout Assignment Modal Component
function PayoutAssignmentModal({ 
  group, 
  users, 
  onAssignPayout, 
  onClose 
}: {
  group: Group;
  users: User[];
  onAssignPayout: (groupId: number, userId: number) => void;
  onClose: () => void;
}) {
  const [selectedUser, setSelectedUser] = useState<number | ''>('');

  const handleAssignPayout = () => {
    if (selectedUser !== '') {
      onAssignPayout(group.id, Number(selectedUser));
      setSelectedUser('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Assign Next Payout - {group.title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              Select which member should receive the next payout. This will set the current cycle to their position.
            </p>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value ? Number(e.target.value) : '')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select member...</option>
              {group.members?.map(member => {
                const user = users.find(u => u.id === member.userId);
                return (
                  <option key={member.userId} value={member.userId}>
                    {user?.fullName} (Position {member.position})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignPayout}
              disabled={!selectedUser}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Assign Payout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



