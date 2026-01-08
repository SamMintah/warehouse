
import React, { useState } from 'react';
import { Search, Filter, MapPin, Package, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { Warehouse, WarehouseStatus } from '../types';

interface WarehouseListProps {
  warehouses: Warehouse[];
  onSelect: (id: string) => void;
}

const WarehouseList: React.FC<WarehouseListProps> = ({ warehouses, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredWarehouses = warehouses.filter(wh => {
    const matchesSearch = wh.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          wh.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || wh.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Warehouse Network</h1>
          <p className="text-slate-500">Manage and monitor all storage facilities</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search warehouses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm w-full min-w-[240px]"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm appearance-none pr-8 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value={WarehouseStatus.ACTIVE}>Active</option>
            <option value={WarehouseStatus.FULL}>Full</option>
            <option value={WarehouseStatus.MAINTENANCE}>Maintenance</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarehouses.map(wh => (
          <div 
            key={wh.id} 
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform">
                  <MapPin size={24} />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  wh.status === WarehouseStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' :
                  wh.status === WarehouseStatus.FULL ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {wh.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{wh.name}</h3>
              <p className="text-slate-500 text-sm mb-6 flex items-center gap-1.5">
                <MapPin size={14} /> {wh.location}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Items</p>
                  <p className="text-slate-900 font-bold flex items-center gap-1.5">
                    <Package size={14} className="text-slate-400" />
                    {wh.items.length} SKUs
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Activity</p>
                  <p className="text-slate-900 font-bold flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400" />
                    12h ago
                  </p>
                </div>
              </div>

              <button 
                onClick={() => onSelect(wh.id)}
                className="w-full py-2.5 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                View Details
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredWarehouses.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-300" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No warehouses found</h2>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default WarehouseList;
