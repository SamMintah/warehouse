
import React from 'react';
import { TransferRequest, TransferStatus } from '../types';
import { CheckCircle2, XCircle, Clock, ArrowRight, User } from 'lucide-react';

interface ApprovalsProps {
  transfers: TransferRequest[];
}

const Approvals: React.FC<ApprovalsProps> = ({ transfers }) => {
  const pendingTransfers = transfers.filter(t => t.status === TransferStatus.PENDING);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Transfer Approvals</h1>
        <p className="text-slate-500">Review and authorize stock movements across warehouses</p>
      </div>

      <div className="space-y-4">
        {pendingTransfers.length > 0 ? (
          pendingTransfers.map(request => (
            <div key={request.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">#{request.id}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={14} /> {new Date(request.date).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <User size={14} />
                    <span className="font-medium">{request.requestedBy}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{request.itemName}</h3>
                    <div className="flex items-center gap-4 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-center min-w-[80px]">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Quantity</p>
                        <p className="text-slate-900 font-bold">{request.quantity}</p>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Route</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 truncate">
                          <span>{request.fromWarehouseName}</span>
                          <ArrowRight size={14} className="text-indigo-400" />
                          <span>{request.toWarehouseName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Requester Note</p>
                    <p className="text-slate-600 text-sm italic leading-relaxed">
                      "{request.notes || 'No notes provided'}"
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-row md:flex-col gap-3 justify-center min-w-[180px]">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                  <CheckCircle2 size={18} />
                  Approve
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-all">
                  <XCircle size={18} />
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-emerald-500" size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Clear queue!</h2>
            <p className="text-slate-500">No pending transfer requests at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;
