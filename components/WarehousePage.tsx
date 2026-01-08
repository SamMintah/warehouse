
import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Warehouse as WarehouseIcon, 
  Clock, 
  DollarSign, 
  ArrowUpRight,
  Search,
  MapPin,
  ChevronRight,
  Send,
  Info,
  History,
  ArrowDownLeft,
  Calendar,
  Download,
  CheckCircle2,
  XCircle,
  ArrowRight,
  User,
  X,
  ClipboardCheck,
  Filter,
  Plus,
  Box
} from 'lucide-react';
import { 
  Warehouse, 
  WarehouseTab, 
  UserRole, 
  TransferRequest, 
  TransferStatus, 
  WarehouseStatus, 
  MovementDirection 
} from '../types';
import WarehouseDetail from './WarehouseDetail';

interface WarehousePageProps {
  warehouses: Warehouse[];
  transfers: TransferRequest[];
  userRole: UserRole;
  activeTab: WarehouseTab;
  onTabChange: (tab: WarehouseTab) => void;
}

const WarehousePage: React.FC<WarehousePageProps> = ({ 
  warehouses, 
  transfers, 
  userRole, 
  activeTab, 
  onTabChange 
}) => {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
  const [inventoryWhId, setInventoryWhId] = useState<string>(warehouses[0]?.id || '');
  const [historyWhId, setHistoryWhId] = useState<string>('all');
  const [transferSubTab, setTransferSubTab] = useState<'request' | 'my' | 'pending'>('request');
  const [searchTerms, setSearchTerms] = useState({ inventory: '', overview: '', history: '' });
  const [isAddingStock, setIsAddingStock] = useState(false);

  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;

  const stats = useMemo(() => {
    const totalItems = warehouses.reduce((acc, wh) => acc + wh.items.reduce((iAcc, item) => iAcc + item.quantity, 0), 0);
    const pendingTransfersCount = transfers.filter(t => t.status === TransferStatus.PENDING).length;
    const totalValue = warehouses.reduce((acc, wh) => acc + wh.items.reduce((iAcc, item) => iAcc + (item.quantity * item.pricePerUnit), 0), 0);
    return {
      warehouses: warehouses.length,
      items: totalItems,
      pending: pendingTransfersCount,
      value: totalValue
    };
  }, [warehouses, transfers]);

  const StatCard = ({ title, value, icon: Icon, colorClass, subText }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${colorClass}`}>
          <Icon size={24} />
        </div>
        <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={14} className="mr-0.5" />
          +2.4%
        </span>
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      {subText && <p className="text-slate-400 text-xs mt-2">{subText}</p>}
    </div>
  );

  const selectedWhForDetail = warehouses.find(w => w.id === selectedWarehouseId);

  return (
    <div className="space-y-6">
      {/* Horizontal Tab Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-2 overflow-hidden sticky top-0 z-20">
        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'inventory', label: 'Inventory' },
            { id: 'transfers', label: 'Transfers' },
            { id: 'history', label: 'History' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as WarehouseTab)}
              className={`px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[600px] animate-in fade-in duration-300">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Warehouses" value={stats.warehouses} icon={WarehouseIcon} colorClass="bg-indigo-50 text-indigo-600" subText="Across all active regions" />
              <StatCard title="Total Items in Stock" value={stats.items.toLocaleString()} icon={Package} colorClass="bg-blue-50 text-blue-600" subText="Updated 5 mins ago" />
              <StatCard title="Pending Transfers" value={stats.pending} icon={Clock} colorClass="bg-amber-50 text-amber-600" subText="Requires action" />
              <StatCard title="Total Stock Value" value={`$${(stats.value / 1000).toFixed(1)}k`} icon={DollarSign} colorClass="bg-emerald-50 text-emerald-600" subText="Current market valuation" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Storage Facilities</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by name or location..."
                    value={searchTerms.overview}
                    onChange={(e) => setSearchTerms({ ...searchTerms, overview: e.target.value })}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {warehouses.filter(w => w.name.toLowerCase().includes(searchTerms.overview.toLowerCase())).map(wh => (
                  <div 
                    key={wh.id}
                    onClick={() => setSelectedWarehouseId(wh.id)}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-indigo-600"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:scale-105 transition-transform">
                        <MapPin size={24} />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        wh.status === WarehouseStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {wh.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{wh.name}</h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1.5">
                      <MapPin size={14} /> {wh.location}
                    </p>
                    <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-50 pt-4 mt-6">
                      <span className="font-semibold text-slate-700">{wh.items.length} SKUs</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> Last activity: 2h ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-bold text-slate-800">Performance Snapshot</h2>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Warehouse</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU Count</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Health</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {warehouses.map(wh => (
                      <tr key={wh.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                              {wh.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-800">{wh.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{wh.location}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{wh.items.length}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${wh.status === WarehouseStatus.FULL ? 'bg-amber-500 w-full' : 'bg-emerald-500 w-[65%]'}`}></div>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">{wh.status === WarehouseStatus.FULL ? '100%' : '65%'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedWarehouseId(wh.id)}
                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <ArrowRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Select Warehouse</label>
                  <select 
                    value={inventoryWhId}
                    onChange={(e) => setInventoryWhId(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
                  >
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="relative w-full md:w-80 self-end">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search items..." 
                    value={searchTerms.inventory}
                    onChange={(e) => setSearchTerms({ ...searchTerms, inventory: e.target.value })}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full shadow-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 self-end">
                <button 
                  onClick={() => setIsAddingStock(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all"
                >
                  <Plus size={16} /> Add Stock
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4 text-center">Quantity</th>
                    <th className="px-6 py-4">Unit</th>
                    <th className="px-6 py-4 text-right">Unit Price</th>
                    <th className="px-6 py-4 text-right">Total Value</th>
                    <th className="px-6 py-4 text-right">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {warehouses.find(w => w.id === inventoryWhId)?.items
                    .filter(i => i.name.toLowerCase().includes(searchTerms.inventory.toLowerCase()))
                    .map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-semibold text-slate-800 group-hover:text-indigo-600">{item.name}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-900">{item.quantity.toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{item.unit}</td>
                      <td className="px-6 py-4 text-right text-slate-500 text-sm">${item.pricePerUnit.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">${(item.quantity * item.pricePerUnit).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-slate-400 text-xs font-medium">{new Date(item.lastUpdated).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRANSFERS TAB */}
        {activeTab === 'transfers' && (
          <div className="space-y-6">
            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit shadow-inner">
              <button 
                onClick={() => setTransferSubTab('request')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${transferSubTab === 'request' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Request Transfer
              </button>
              <button 
                onClick={() => setTransferSubTab('my')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${transferSubTab === 'my' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                My Requests
              </button>
              {isSuperAdmin && (
                <button 
                  onClick={() => setTransferSubTab('pending')}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${transferSubTab === 'pending' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Pending Approvals
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8">
              {transferSubTab === 'request' && (
                <div className="max-w-3xl mx-auto py-4">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                      <Send size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">New Transfer Request</h3>
                      <p className="text-sm text-slate-500">Initialize a stock movement between storage facilities</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Source Warehouse</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                          <option value="">Select source...</option>
                          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Destination Warehouse</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                          <option value="">Select destination...</option>
                          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Item Details</label>
                      <div className="flex flex-col md:flex-row gap-4">
                         <select className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none">
                            <option value="">Select item to transfer...</option>
                            <option value="item-1">Premium Semiconductors</option>
                            <option value="item-2">Industrial Fans</option>
                            <option value="item-3">Copper Wiring</option>
                         </select>
                         <div className="relative">
                           <input type="number" placeholder="Quantity" className="w-full md:w-36 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                           <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Units</span>
                         </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Transfer Reason</label>
                      <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all" placeholder="Provide a brief explanation for auditing purposes..."></textarea>
                    </div>
                    <div className="flex justify-end pt-6 gap-3">
                       <button className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                       <button className="bg-indigo-600 text-white font-bold px-10 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <Send size={18} /> Submit for Approval
                       </button>
                    </div>
                  </div>
                </div>
              )}

              {transferSubTab === 'my' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Personal Request Queue</h3>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing: Last 10 Transfers</div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-100">
                          <th className="px-4 py-4 uppercase tracking-wider">Requested On</th>
                          <th className="px-4 py-4 uppercase tracking-wider">Item Name</th>
                          <th className="px-4 py-4 uppercase tracking-wider">Logistics Route</th>
                          <th className="px-4 py-4 text-center uppercase tracking-wider">Status</th>
                          <th className="px-4 py-4 text-right uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {transfers.filter(t => t.requestedBy === 'Michael Chen').map(t => (
                          <tr key={t.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-5 text-slate-500 font-medium">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="px-4 py-5">
                              <span className="font-bold text-slate-800">{t.itemName}</span>
                              <span className="block text-[10px] text-slate-400 font-bold">{t.quantity} units</span>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <span className="text-indigo-600">{t.fromWarehouseName}</span>
                                <ArrowRight className="text-slate-300" size={12} />
                                <span className="text-emerald-600">{t.toWarehouseName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-5 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                t.status === TransferStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' :
                                t.status === TransferStatus.REJECTED ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="px-4 py-5 text-right">
                               <button className="text-slate-400 hover:text-slate-600 font-bold text-xs">Details</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {transferSubTab === 'pending' && isSuperAdmin && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ClipboardCheck className="text-indigo-600" />
                    <h3 className="text-xl font-bold text-slate-900">Authorization Queue</h3>
                  </div>
                  {transfers.filter(t => t.status === TransferStatus.PENDING).map(req => (
                    <div key={req.id} className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 flex flex-col lg:flex-row justify-between gap-8 group hover:bg-white hover:shadow-md transition-all border-l-4 hover:border-l-indigo-500">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                           <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">REQ-{req.id}</span>
                           <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider"><Calendar size={14}/> {new Date(req.date).toLocaleDateString()}</span>
                           <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider"><User size={14}/> By {req.requestedBy}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xl mb-3">{req.itemName}</h4>
                        <div className="flex flex-wrap items-center gap-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Quantity</span>
                            <span className="text-lg font-black text-slate-900">{req.quantity}</span>
                          </div>
                          <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block"></div>
                          <div className="flex flex-col flex-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Logistics Path</span>
                            <div className="flex items-center gap-2 text-sm font-bold truncate">
                              <span className="text-indigo-600">{req.fromWarehouseName}</span>
                              <ArrowRight size={14} className="text-slate-300" />
                              <span className="text-emerald-600">{req.toWarehouseName}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 p-4 bg-white/50 rounded-xl border border-dashed border-slate-200">
                           <p className="text-sm text-slate-600 italic">"<span className="font-medium">{req.notes}</span>"</p>
                        </div>
                      </div>
                      <div className="flex lg:flex-col gap-4 justify-center min-w-[180px]">
                        <button className="flex-1 bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-50 active:scale-95 transition-all">
                          <CheckCircle2 size={18} /> Approve Transfer
                        </button>
                        <button className="flex-1 bg-white border border-red-200 text-red-600 font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-red-50 active:scale-95 transition-all">
                          <XCircle size={18} /> Reject Request
                        </button>
                      </div>
                    </div>
                  ))}
                  {transfers.filter(t => t.status === TransferStatus.PENDING).length === 0 && (
                    <div className="text-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl">
                       <CheckCircle2 size={48} className="mx-auto text-emerald-400 mb-4 opacity-50" />
                       <h3 className="text-lg font-bold text-slate-800">Everything is Clear!</h3>
                       <p className="text-slate-500">There are no pending transfers requiring your attention.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right-2">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Scope</label>
                  <select 
                    value={historyWhId}
                    onChange={(e) => setHistoryWhId(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Warehouses</option>
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Timeline</label>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                     <Calendar size={18} className="text-indigo-500" />
                     Last 30 Days <ChevronRight size={14} className="text-slate-400 rotate-90" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 self-end w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search audit trail..." 
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full shadow-sm"
                  />
                </div>
                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors shadow-sm">
                  <Download size={18} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4">Transaction Date</th>
                    <th className="px-6 py-4">Facility</th>
                    <th className="px-6 py-4">Item Catalog</th>
                    <th className="px-6 py-4 text-center">Movement</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Authorized By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {warehouses
                    .filter(w => historyWhId === 'all' || w.id === historyWhId)
                    .flatMap(w => w.history.map(h => ({ ...h, whName: w.name })))
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map(move => (
                    <tr key={move.id} className="hover:bg-slate-50 transition-colors text-sm">
                      <td className="px-6 py-5 text-slate-500 font-medium">
                        {new Date(move.timestamp).toLocaleDateString()}
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">{new Date(move.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td className="px-6 py-5">
                         <span className="font-bold text-slate-800">{move.whName}</span>
                      </td>
                      <td className="px-6 py-5 font-semibold text-slate-800">
                        {move.itemName}
                        <span className="block text-[10px] text-slate-400 font-bold">SKU-{move.itemId.toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                         <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg font-bold text-[10px] uppercase border ${
                           move.direction === MovementDirection.IN ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-red-600 bg-red-50 border-red-100'
                         }`}>
                           {move.direction === MovementDirection.IN ? <ArrowDownLeft size={12}/> : <ArrowUpRight size={12}/>}
                           {move.direction}
                         </div>
                         <span className="block font-black text-slate-900 mt-0.5">{move.quantity}</span>
                      </td>
                      <td className="px-6 py-5">
                         <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">Verified</span>
                      </td>
                      <td className="px-6 py-5 text-right font-medium text-slate-500">
                        <div className="flex items-center justify-end gap-2">
                          {move.user}
                          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {move.user.charAt(0)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Warehouse Detail Slide-over Modal */}
      {selectedWarehouseId && selectedWhForDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-slate-50 h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto border-l border-slate-200">
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <WarehouseIcon size={20} />
                 </div>
                 <h2 className="text-lg font-bold text-slate-900">Facility Deep-Dive</h2>
               </div>
               <button 
                onClick={() => setSelectedWarehouseId(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all hover:rotate-90"
               >
                 <X size={24} />
               </button>
            </div>
            <div className="p-8">
              <WarehouseDetail 
                warehouse={selectedWhForDetail}
                onBack={() => setSelectedWarehouseId(null)}
                userRole={userRole}
                warehouses={warehouses}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {isAddingStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-2 text-indigo-600">
                 <Box size={20} />
                 <h2 className="font-bold text-slate-900">Add New Inventory</h2>
               </div>
               <button 
                onClick={() => setIsAddingStock(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
               >
                 <X size={20} />
               </button>
            </div>
            
            <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddingStock(false); }}>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Destination Facility</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={inventoryWhId}
                  onChange={(e) => setInventoryWhId(e.target.value)}
                >
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Item Label / SKU</label>
                  <input type="text" placeholder="e.g. Copper Wiring" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Measurement Unit</label>
                  <input type="text" placeholder="e.g. meters, units" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Incoming Quantity</label>
                  <input type="number" placeholder="0" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Valuation (Per Unit)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                    <input type="number" step="0.01" placeholder="0.00" className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Source / Batch Details</label>
                <textarea rows={2} placeholder="Optional batch number or supplier name..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                <button 
                  type="button"
                  onClick={() => setIsAddingStock(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-2 bg-indigo-600 text-white font-bold px-10 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Register Stock In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousePage;
