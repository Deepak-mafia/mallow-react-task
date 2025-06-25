import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import Button from '../../components/common/Button';
import { Input } from '@/components/ui/input';

const cardStyle = {
  minWidth: 340,
  maxWidth: 380,
  margin: '0 auto',
  marginTop: 80,
  padding: 32,
  borderRadius: 16,
  boxShadow: '0 2px 16px #e0e0e0',
  background: '#fff',
  display: 'flex',
  gap: 20,
  alignItems: 'center',
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(email, password);
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/', { replace: true });
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <h2 style={{ marginBottom: 8 }}>Login</h2>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} style={{ width: '100%', padding: '10px 0', fontSize: 16, borderRadius: 8, background: '#6c63ff', color: '#fff', border: 'none' }}>{loading ? 'Logging in...' : 'Login'}</Button>
        {error && <div style={{ color: 'red', width: '100%', textAlign: 'center' }}>{error}</div>}
        <div style={{ marginTop: 16, color: '#888', fontSize: 14, textAlign: 'center' }}>
          <div>Test credentials:</div>
          <div>eve.holt@reqres.in / cityslicka</div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 