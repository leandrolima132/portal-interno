interface ServiceFiltersProps {
  filter: 'all' | 'active' | 'inactive';
  onFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
}

export  function ServiceFilters({ 
  filter, 
  onFilterChange, 
  totalCount, 
  activeCount, 
  inactiveCount 
}: ServiceFiltersProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex flex-wrap gap-2 sm:gap-4">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium ${
            filter === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Todos ({totalCount})
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium ${
            filter === 'active'
              ? 'bg-green-100 text-green-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Ativos ({activeCount})
        </button>
        <button
          onClick={() => onFilterChange('inactive')}
          className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium ${
            filter === 'inactive'
              ? 'bg-red-100 text-red-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Inativos ({inactiveCount})
        </button>
      </div>
    </div>
  );
}
