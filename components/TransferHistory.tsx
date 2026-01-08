
import React, { useState } from 'react';
import { TransferRequest, TransferStatus } from '../types';
import { Search, Filter, Calendar, FileText, Download } from 'lucide-react';

interface TransferHistoryProps {
  transfers: TransferRequest[];
}

const TransferHistory: React.FC<TransferHistoryProps> = ({ transfers }) => {
  const [filter, setFilter] = useState<string>('all');

  const filtered = transfers.filter(t => filter === 'all' || t.status === filter);

  const getStatusStyle = (status: TransferStatus) => {
    switch (status) {
      case TransferStatus.PENDING: return 'bg-amber-100 text-amber-700';
      case TransferStatus.APPROVED: return 'bg-emerald-100 text-emerald-700';
      case TransferStatus.COMPLETED: return 'bg-blue-100 text-blue-700';
      case TransferStatus.REJECTED: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transfer Logs</h1>
          <p className="text-slate-500">Audit trail of all stock movements between facilities</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <Download size={16} /> Export
          </button>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value={TransferStatus.PENDING}>Pending</option>
            <option value={TransferStatus.APPROVED}>Approved</option>
            <option value={TransferStatus.COMPLETED}>Completed</option>
            <option value={TransferStatus.REJECTED}>Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested By</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Approver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(transfer => (
                <tr key={transfer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Calendar size={14} />
                      {new Date(transfer.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{transfer.itemName}</span>
                      <span className="text-[10px] text-slate-400 font-bold">#{transfer.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-bold">{transfer.quantity}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600">
                      <p className="font-medium text-indigo-600">{transfer.fromWarehouseName}</p>
                      <p className="text-[10px] text-slate-400 font-bold px-4">to</p>
                      <p className="font-medium text-emerald-600">{transfer.toWarehouseName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(transfer.status)}`}>
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium text-sm">{transfer.requestedBy}</td>
                  <td className="px-6 py-4 text-right text-slate-500 text-sm">{transfer.approvedBy || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>No historical records match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferHistory;
