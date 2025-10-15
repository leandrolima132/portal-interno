'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ServiceSearchFilterProps {
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
}

export function ServiceSearchFilter({ 
  onSearchChange, 
  placeholder = "Buscar serviços..." 
}: ServiceSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
