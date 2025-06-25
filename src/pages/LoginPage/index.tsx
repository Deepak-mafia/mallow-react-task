import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import Button from '../../components/common/Button';
import { Input } from '@/components/ui/input';

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
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 min-w-[340px] max-w-[380px] w-full mx-auto mt-20 p-8 rounded-2xl shadow-lg bg-white"
      >
        <h2 className="mb-2 text-2xl font-semibold text-center">Login</h2>
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
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 text-base rounded-lg bg-indigo-500 text-white border-none"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        {error && (
          <div className="text-red-500 w-full text-center">{error}</div>
        )}
        <div className="mt-4 text-gray-500 text-sm text-center">
          <div>Test credentials:</div>
          <div>eve.holt@reqres.in / cityslicka</div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 