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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, background: '#fff', boxShadow: '0 2px 8px #eee', marginBottom: 24 }}>
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: 24 }}>Users</h2>
          <SearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
          />
        </div>
        {/* Right: Heading, Search, Create, Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
         
          <button onClick={openCreateModal} style={{ padding: '8px 18px', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 500, fontSize: 16 }}>Create User</button>
          {/* <button onClick={() => setView('card')} style={{ fontWeight: view === 'card' ? 'bold' : 'normal', background: view === 'card' ? '#f5f6fa' : '#fff', border: '1px solid #eee', borderRadius: 6, padding: '8px 14px' }}>Card</button> */}
          {/* <button onClick={() => setView('list')} style={{ fontWeight: view === 'list' ? 'bold' : 'normal', background: view === 'list' ? '#f5f6fa' : '#fff', border: '1px solid #eee', borderRadius: 6, padding: '8px 14px' }}>Table</button> */}
        <button onClick={handleLogout} style={{ color: '#ff4d4f', background: 'none', border: 'none', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>Logout</button>
        </div>
      </div>
      {/* Logout button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px 10px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setView('card')} style={{ fontWeight: view === 'card' ? 'bold' : 'normal', background: view === 'card' ? '#f5f6fa' : '#fff', border: '1px solid #eee', borderRadius: 6, padding: '8px 14px' }}>Card</button>
          <button onClick={() => setView('list')} style={{ fontWeight: view === 'list' ? 'bold' : 'normal', background: view === 'list' ? '#f5f6fa' : '#fff', border: '1px solid #eee', borderRadius: 6, padding: '8px 14px' }}>Table</button>
        </div>
      </div>
      {/* Main Content */}
      {loading ? (
        <Loader />
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
      ) : view === 'card' ? (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', padding: 24 }}>
            {filteredUsers.map(user => (
              <div
                key={user.id}
                style={{ boxShadow: '0 2px 8px #ccc', borderRadius: 12, padding: 32, minWidth: 260, textAlign: 'center', background: '#fff', position: 'relative' }}
              >
                <img src={user.avatar} alt={getUserName(user)} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }} />
                <div style={{ fontWeight: 600, fontSize: 24, marginBottom: 8 }}>{getUserName(user)}</div>
                <div style={{ color: '#555', fontSize: 18, marginBottom: 16 }}>{user.email}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                  <button onClick={() => openEditModal(user)} style={{ background: '#6c63ff', color: '#fff', borderRadius: '50%', width: 36, height: 36, border: 'none', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</button>
                  <button onClick={() => handleDelete(user)} style={{ background: '#ff4d4f', color: '#fff', borderRadius: '50%', width: 36, height: 36, border: 'none', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </div>
        </>
      ) : (
        <>
          <div style={{ background: '#fff', borderRadius: 12, margin: '0 auto', maxWidth: 900, padding: 24, boxShadow: '0 2px 8px #ccc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: 12, textAlign: 'left' }}>Email</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>First Name</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Last Name</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={user.avatar} alt={getUserName(user)} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ color: '#2d6cdf', fontWeight: 500 }}>{user.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>{user.first_name}</td>
                    <td style={{ padding: 12 }}>{user.last_name}</td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => openEditModal(user)} style={{ background: '#6c63ff', color: '#fff', borderRadius: 4, padding: '6px 16px', border: 'none', marginRight: 8 }}>Edit</button>
                      <button onClick={() => handleDelete(user)} style={{ background: '#ff4d4f', color: '#fff', borderRadius: 4, padding: '6px 16px', border: 'none' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
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
