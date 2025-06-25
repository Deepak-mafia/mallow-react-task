import  { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../services/userService';
import Loader from '../../components/common/Loader';
import UserModal from '../../components/user/UserModal';
import Pagination from '../../components/common/Pagination';
import SearchInput from '../../components/common/SearchInput';

interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string;
}

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [view, setView] = useState<'card' | 'list'>('card');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const loadUsers = (pageNum = 1) => {
    setLoading(true);
    fetchUsers(pageNum)
      .then(res => {
        setUsers(res.data.data);
        setPage(res.data.page);
        setTotalPages(res.data.total_pages);
      })
      .catch(() => setError('Failed to fetch users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers(page);
    // eslint-disable-next-line
  }, [page]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const handleCreate = async (data: { first_name: string; last_name: string; email: string; avatar: string }) => {
    setLoading(true);
    try {
      await createUser(data);
      setModalOpen(false);
      loadUsers(page);
    } catch {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: { first_name: string; last_name: string; email: string; avatar: string }) => {
    if (!editUser) return;
    setLoading(true);
    try {
      await updateUser(String(editUser.id), data);
      setEditUser(null);
      setModalOpen(false);
      loadUsers(page);
    } catch {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Delete user ${user.first_name || ''} ${user.last_name || ''}?`)) return;
    setLoading(true);
    try {
      await deleteUser(String(user.id));
      loadUsers(page);
    } catch {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditUser(null);
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setModalOpen(true);
  };

  const getUserName = (user: User) => `${user.first_name || ''} ${user.last_name || ''}`.trim();

  // Filter users by search
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.trim().toLowerCase();
    return users.filter(
      u =>
        getUserName(u).toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q))
    );
  }, [users, search]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between p-5 bg-white shadow-md mb-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <h2 className="m-0 font-semibold text-2xl">Users</h2>
          <SearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
          />
        </div>
        {/* Right: Heading, Search, Create, Toggle */}
        <div className="flex items-center gap-4">
          <button onClick={openCreateModal} className="px-4 py-2 bg-indigo-500 text-white border-none rounded-lg font-medium text-base">Create User</button>
          <button onClick={handleLogout} className="text-red-500 bg-transparent border-none font-medium text-base cursor-pointer">Logout</button>
        </div>
      </div>
      {/* Logout button */}
      <div className="flex justify-between px-5 pb-2.5">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('card')} className={`font-bold ${view === 'card' ? 'bg-[#f5f6fa]' : 'bg-white'} border border-gray-200 rounded-md px-3.5 py-2`}>Card</button>
          <button onClick={() => setView('list')} className={`font-bold ${view === 'list' ? 'bg-[#f5f6fa]' : 'bg-white'} border border-gray-200 rounded-md px-3.5 py-2`}>Table</button>
        </div>
      </div>
      {/* Main Content */}
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : view === 'card' ? (
        <>
          <div className="flex flex-wrap gap-8 justify-center p-6">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className="shadow-md rounded-xl p-8 min-w-[260px] text-center bg-white relative"
              >
                <img src={user.avatar} alt={getUserName(user)} className="w-[90px] h-[90px] rounded-full object-cover mb-4 mx-auto" />
                <div className="font-semibold text-2xl mb-2">{getUserName(user)}</div>
                <div className="text-gray-700 text-lg mb-4">{user.email}</div>
                <div className="flex justify-center gap-3">
                  <button onClick={() => openEditModal(user)} className="bg-indigo-500 text-white rounded-full w-9 h-9 border-none text-lg flex items-center justify-center">✏️</button>
                  <button onClick={() => handleDelete(user)} className="bg-red-500 text-white rounded-full w-9 h-9 border-none text-lg flex items-center justify-center">🗑️</button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center my-6">
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </div>
        </>
      ) : (
        <>
          <div className="bg-white rounded-xl mx-auto max-w-[900px] p-6 shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">First Name</th>
                  <th className="p-3 text-left">Last Name</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-gray-200">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={user.avatar} alt={getUserName(user)} className="w-9 h-9 rounded-full object-cover" />
                        <span className="text-blue-600 font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-3">{user.first_name}</td>
                    <td className="p-3">{user.last_name}</td>
                    <td className="p-3">
                      <button onClick={() => openEditModal(user)} className="bg-indigo-500 text-white rounded px-4 py-1.5 border-none mr-2">Edit</button>
                      <button onClick={() => handleDelete(user)} className="bg-red-500 text-white rounded px-4 py-1.5 border-none">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center my-6">
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </div>
        </>
      )}
      <UserModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditUser(null); }}
        onSubmit={editUser ? handleEdit : handleCreate}
        initialData={editUser ? {
          first_name: editUser.first_name || '',
          last_name: editUser.last_name || '',
          email: editUser.email || '',
          avatar: editUser.avatar || '',
        } : undefined}
      />
    </div>
  );
};

export default UsersPage; 
