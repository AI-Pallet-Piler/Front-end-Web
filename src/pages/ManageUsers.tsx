import { useState, useEffect } from "react";

// Interface to define the shape of user data
interface UserData {
  id: number;
  name: string;
  email: string;
  badge_number: string;
  role: "Admin" | "Manager" | "picker";
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

type CreateUserForm = {
  name: string;
  email: string;
  badge_number: string;
  role: "Admin" | "Manager" | "picker";
};

const ViewUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<CreateUserForm>({
    name: "",
    email: "",
    badge_number: "",
    role: "picker",
  });
  const [createError, setCreateError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));

        const mockUsers: UserData[] = [
          {
            id: 101,
            name: "Dave",
            email: "dave@warehouse.com",
            badge_number: "B-1001",
            role: "Admin",
            last_login: "2026-01-29 08:30",
            created_at: "",
            updated_at: "",
          },
          {
            id: 102,
            name: "Sarah",
            email: "sarah@warehouse.com",
            badge_number: "B-1002",
            role: "picker",
            last_login: "2026-01-28 16:45",
            created_at: "",
            updated_at: "",
          },
          {
            id: 103,
            name: "Mike",
            email: "mike@warehouse.com",
            badge_number: "B-1003",
            role: "Manager",
            last_login: "2025-12-20 09:00",
            created_at: "",
            updated_at: "",
          },
          {
            id: 104,
            name: "Intern",
            email: "intern@warehouse.com",
            badge_number: "B-1004",
            role: "picker",
            last_login: "2026-01-29 10:15",
            created_at: "",
            updated_at: "",
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
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  // Edit
  const handleEditClick = (user: UserData) => {
    setEditingUser({ ...user });
  };

  const handleEditChange = (field: keyof UserData, value: string) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [field]: value } as UserData);
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
      alert("User updated successfully!");
    } catch {
      alert("Failed to update user");
    }
  };

  // Open create modal
  const openCreateModal = () => {
    setCreateError("");
    setNewUser({ name: "", email: "", badge_number: "", role: "picker" });
    setIsCreateOpen(true);
  };

  // Create form change handler
  const handleCreateChange = (field: keyof CreateUserForm, value: string) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  // Create user (mock)
  const handleCreateUser = async () => {
    setCreateError("");

    // Basic validation (simple)
    if (!newUser.name.trim()) return setCreateError("Name is required.");
    if (!newUser.email.trim()) return setCreateError("Email is required.");
    if (!newUser.badge_number.trim()) return setCreateError("Badge number is required.");

    // Very light email check
    if (!newUser.email.includes("@")) return setCreateError("Please enter a valid email.");

    // Prevent duplicate email
    const emailExists = users.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (emailExists) return setCreateError("This email already exists.");

    try {
      // TODO: POST to API and use response ID
      const now = new Date().toISOString();
      const created: UserData = {
        id: Math.max(0, ...users.map((u) => u.id)) + 1,
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        badge_number: newUser.badge_number.trim(),
        role: newUser.role,
        last_login: null,
        created_at: now,
        updated_at: now,
      };

      setUsers((prev) => [created, ...prev]);
      setIsCreateOpen(false);
      alert("User created successfully!");
    } catch {
      setCreateError("Failed to create user.");
    }
  };

  // Search filter
  const filteredUsers = users.filter((user) => {
    const q = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(q) ||
      user.name.toLowerCase().includes(q) ||
      user.badge_number.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200 my-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-500 text-sm">View and manage system access.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search name, email, badge, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-72"
            />
          </div>

          {/* Add user button */}
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition whitespace-nowrap"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400 animate-pulse">Loading users...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold border-b">User</th>
                <th className="p-4 font-semibold border-b">Badge</th>
                <th className="p-4 font-semibold border-b">Role</th>
                <th className="p-4 font-semibold border-b">Last Login</th>
                <th className="p-4 font-semibold border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    {/* User */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm uppercase">
                          {user.email.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="p-4 text-sm text-slate-600 font-mono">{user.badge_number}</td>

                    {/* Role */}
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border capitalize ${
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : user.role === "Manager"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="p-4 text-sm text-slate-500 font-mono">
                      {user.last_login || "Never"}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-slate-400 hover:text-blue-600 font-medium text-sm px-3 py-1 rounded hover:bg-blue-50 transition-all"
                      >
                        Edit
                      </button>
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
                  {/* fix colspan to match 5 columns */}
                  <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Create User</h3>
            <p className="text-sm text-slate-500 mb-4">Add a new user with a role and badge number.</p>

            {createError && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                {createError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  value={newUser.name}
                  onChange={(e) => handleCreateChange("name", e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Sarah Johnson"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => handleCreateChange("email", e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., sarah@warehouse.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Badge Number</label>
                <input
                  value={newUser.badge_number}
                  onChange={(e) => handleCreateChange("badge_number", e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., B-1020"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => handleCreateChange("role", e.target.value as CreateUserForm["role"])}
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
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Edit User</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  value={editingUser.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => handleEditChange("email", e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Badge Number</label>
                <input
                  value={editingUser.badge_number}
                  onChange={(e) => handleEditChange("badge_number", e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    handleEditChange("role", e.target.value as "Admin" | "Manager" | "picker")
                  }
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

      <div className="mt-4 text-xs text-slate-400 text-right">Total Users: {filteredUsers.length}</div>
    </div>
  );
};

export default ViewUsers;
