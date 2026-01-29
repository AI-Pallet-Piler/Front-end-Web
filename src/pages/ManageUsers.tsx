import { useState, useEffect } from "react";

// API Configuration
//const API_BASE_URL = "http://localhost:8080/api"; // Default to local for dev

// Interface to define the shape of user data
interface UserData {
  id: number;
  email: string;
  role: 'Admin' | 'Manager' | 'picker';
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

const ViewUsers = () => {
  // State management
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        /* API Call - Uncomment in real app
        const res = await fetch(`${API_BASE_URL}/users`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setUsers(data);
        */
        
        // Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 600));

        // Mock Data
        const mockUsers: UserData[] = [
          {
            id: 101, email: 'dave@warehouse.com', role: 'Admin',
            last_login: '2026-01-29 08:30', created_at: "", updated_at: ""
          },
          {
            id: 102, email: 'sarah@warehouse.com', role: 'picker',
            last_login: '2026-01-28 16:45', created_at: "", updated_at: ""
          },
          {
            id: 103, email: 'mike@warehouse.com', role: 'Manager',
            last_login: '2025-12-20 09:00', created_at: "", updated_at: ""
          },
          {
            id: 104, email: 'intern@warehouse.com', role: 'picker',
            last_login: '2026-01-29 10:15', created_at: "", updated_at: ""
          },
        ];

        setUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete User Handler
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this user?");
    if (!confirmDelete) return;

    try {
      /* API Call - Uncomment in real app
      const res = await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      */

      // Update UI: Remove the user with this ID from the state
      setUsers((prev) => prev.filter((user) => user.id !== id));
      
    } catch {
      alert("Failed to delete user");
    }
  };

  // 1. Open the modal with the user's data
  const handleEditClick = (user: UserData) => {
    setEditingUser({ ...user }); // Create a copy so we don't edit the table directly yet
  };

  // 2. Handle input changes inside the modal
  const handleEditChange = (field: keyof UserData, value: string) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [field]: value });
    }
  };

  // 3. Save changes
  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      /* API Call - Uncomment in real app
      const res = await fetch(`${API_BASE_URL}/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });

      if (!res.ok) throw new Error("Failed to update");
      const updatedUser = await res.json(); // Use server response
      setUsers(prev => prev.map(u => (u.id === editingUser.id ? updatedUser : u)));
      */
      
      // Update local state: Find the user by ID and replace with new data
      setUsers(prev => prev.map(u => (u.id === editingUser.id ? editingUser : u)));
      
      setEditingUser(null); // Close modal
      alert("User updated successfully!");
    } catch {
      alert("Failed to update user");
    }
  };

  // Search filter
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200 my-10">
    
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-500 text-sm">View and manage system access.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search Name or Email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
          />
          <span className="absolute right-3 top-2.5 text-slate-400"></span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400 animate-pulse">
          Loading users...
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold border-b">User Info</th>
                <th className="p-4 font-semibold border-b">Role</th>
                <th className="p-4 font-semibold border-b">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* 1. User Info (Avatar + Name) */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm uppercase">
                          {/* Logic to grab first 2 letters of email for avatar */}
                          {user.email.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Role Badge */}
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border capitalize ${
                        user.role === 'Admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                        user.role === 'Manager' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* 4. Last Login */}
                    <td className="p-4 text-sm text-slate-500 font-mono">
                      {user.last_login || "Never"}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {/* EDIT BUTTON */}
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="text-slate-400 hover:text-blue-600 font-medium text-sm px-3 py-1 rounded hover:bg-blue-50 transition-all"
                      >
                        Edit
                      </button>
                      {/* DELETE BUTTON */}
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-slate-400 hover:text-red-600 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400 italic">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- EDIT MODAL (Popup) --- */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Edit User</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={editingUser.email}
                  onChange={(e) => handleEditChange('email', e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select 
                  value={editingUser.role}
                  onChange={(e) => handleEditChange('role', e.target.value as 'Admin' | 'Manager' | 'picker')}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="picker">picker</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-slate-400 text-right">
        Total Users: {filteredUsers.length}
      </div>
    </div>
  );
};

  

export default ViewUsers;