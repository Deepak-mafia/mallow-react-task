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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-[300px]">
        <h3 className="text-lg font-semibold mb-2">{initialData ? 'Edit User' : 'Create User'}</h3>
        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 mb-1"
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 mb-1"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 mb-1"
        />
        <input
          name="avatar"
          placeholder="Photo Link (optional)"
          value={form.avatar}
          onChange={handleChange}
          className="border rounded px-3 py-2 mb-1"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="mt-2 bg-indigo-500 text-white rounded px-4 py-2">{initialData ? 'Update' : 'Create'}</button>
      </form>
    </Modal>
  );
};

export default UserModal; 