import React from 'react';
import { Input } from '@/components/ui/input';

const SearchInput = ({ value, onChange, placeholder }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) => (
  <Input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    type="text"
    className="mb-2"
  />
);

export default SearchInput; 