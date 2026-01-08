
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  ChevronRight, 
  Package, 
  History, 
  Send,
  MoreVertical,
  ArrowDownLeft,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { Warehouse, WarehouseStatus, MovementDirection, UserRole } from '../types';

interface WarehouseDetailProps {
  warehouse: Warehouse;
  onBack: () => void;
  userRole: UserRole;
  warehouses: Warehouse[]; // for destination selection
}

const WarehouseDetail: React.FC<WarehouseDetailProps> = ({ warehouse, onBack, userRole, warehouses }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'history' | 'request'>('inventory');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{warehouse.name}</h1>
              <div className="flex items-center gap-4 mt-1 text-slate-500 text-sm">
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {warehouse.location}</span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                <span className="font-medium text-slate-700">Manager: John Smith</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                warehouse.status === WarehouseStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' :
                warehouse.status === WarehouseStatus.FULL ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {warehouse.status}
              </span>
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                <MoreVertical size={20} />
              </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-100 mt-8">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-3 font-semibold text-sm transition-all relative ${
              activeTab === 'inventory' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Current Inventory
            {activeTab === 'inventory' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-semibold text-sm transition-all relative ${
              activeTab === 'history' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Movement History
            {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('request')}
            className={`px-6 py-3 font-semibold text-sm transition-all relative ${
              activeTab === 'request' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Transfer Request
            {activeTab === 'request' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {activeTab === 'inventory' && (
          <div className="animate-in fade-in duration-300">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {warehouse.items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-800">{item.name}</td>
                    <td className="px-6 py-4 text-slate-900 font-bold">{item.quantity.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500">{item.unit}</td>
                    <td className="px-6 py-4 text-slate-900 font-medium">${(item.quantity * item.pricePerUnit).toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{new Date(item.lastUpdated).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-300">
            {warehouse.history.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {warehouse.history.map(move => (
                    <tr key={move.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-500 text-sm">{new Date(move.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{move.itemName}</td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1.5 font-bold text-xs uppercase ${
                          move.direction === MovementDirection.IN ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {move.direction === MovementDirection.IN ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          {move.direction}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">{move.quantity}</td>
                      <td className="px-6 py-4 text-right text-slate-500 text-sm">{move.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <History size={48} className="mb-4 opacity-20" />
                <p>No movement records found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'request' && (
          <div className="p-8 max-w-2xl mx-auto animate-in slide-in-from-top-4 duration-300">
            <div className="mb-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-4">
              <Info className="text-indigo-600 flex-shrink-0" />
              <p className="text-sm text-indigo-700 leading-relaxed">
                Internal transfers require Super Admin approval for any movements exceeding 1,000 units. 
                Please ensure target warehouse has sufficient capacity.
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Item to Transfer</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer">
                    <option value="">Select Item</option>
                    {warehouse.items.map(item => (
                      <option key={item.id} value={item.id}>{item.name} ({item.quantity} {item.unit} available)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Destination Warehouse</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer">
                    <option value="">Select Warehouse</option>
                    {warehouses.filter(w => w.id !== warehouse.id).map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Quantity</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-slate-400 text-sm font-medium">units</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Reason / Internal Notes</label>
                <textarea 
                  rows={4}
                  placeholder="Explain why this transfer is needed..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                  <Send size={18} />
                  Submit Transfer Request
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseDetail;
