import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal';

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState<UserFormData>({
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ first_name: '', last_name: '', email: '', avatar: '' });
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email) {
      setError('All fields except photo are required');
      return;
    }
    setError('');
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
        <h3>{initialData ? 'Edit User' : 'Create User'}</h3>
        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="avatar"
          placeholder="Photo Link (optional)"
          value={form.avatar}
          onChange={handleChange}
        />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">{initialData ? 'Update' : 'Create'}</button>
      </form>
    </Modal>
  );
};

export default UserModal; 