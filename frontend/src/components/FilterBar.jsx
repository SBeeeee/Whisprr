// FilterBar.jsx
"use client";

export default function FilterBar({ filters, setFilters }) {
  const handleFilterChange = (key, value) => {
    console.log(`🔧 Filter changed: ${key} = ${value}`);
    
    const newFilters = { ...filters, [key]: value };
    
    // Clear conflicting filters
    if (key === 'range' && value) {
      delete newFilters.date;
    } else if (key === 'date' && value) {
      delete newFilters.range;
    }
    
    console.log("📋 New filters:", newFilters);
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({ range: "today" });
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filters.range || ""}
          onChange={(e) => handleFilterChange('range', e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="today">Today</option>
          <option value="future">Upcoming</option>
          <option value="past">Past</option>
          <option value="all">All</option>
        </select>

        <input
          type="date"
          value={filters.date || ""}
          onChange={(e) => handleFilterChange('date', e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Select date"
        />

        <input
          type="text"
          placeholder="Search events..."
          value={filters.search || ""}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex-1 min-w-0"
        />

        <select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filters.priority || ""}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          onClick={clearAllFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
      
      {/* Active filters display */}
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, value]) => {
          if (!value || key === 'range' && value === 'today') return null;
          return (
            <span key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm">
              <span className="font-medium">{key}:</span>
              <span>{value}</span>
              <button
                onClick={() => handleFilterChange(key, '')}
                className="ml-1 text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}