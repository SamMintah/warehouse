
import React from 'react';
import { 
  LayoutDashboard, 
  Warehouse, 
  Bell, 
  Search, 
  LogOut,
  UserCircle,
  Settings
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  currentView: string;
  setView: (view: any) => void;
  setUserRole: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, currentView, setView, setUserRole }) => {
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;

  const NavItem = ({ id, icon: Icon, label, disabled = false }: any) => (
    <button
      onClick={() => !disabled && setView(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        currentView === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-600 hover:bg-slate-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              L
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">LogiTrack</span>
          </div>

          <nav className="space-y-2">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Main Dashboard" />
            <NavItem id="warehouses" icon={Warehouse} label="Warehouses" />
            <NavItem id="settings" icon={Settings} label="Settings" disabled />
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4 border-t border-slate-100">
           <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                <UserCircle size={28} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 truncate">Alex Thompson</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{userRole.replace('_', ' ')}</p>
              </div>
           </div>
           <button 
             onClick={() => setUserRole(isSuperAdmin ? UserRole.WAREHOUSE_MANAGER : UserRole.SUPER_ADMIN)}
             className="w-full text-xs text-indigo-600 font-semibold hover:underline"
           >
             Switch to {isSuperAdmin ? 'Manager' : 'Admin'} Role
           </button>
           <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors px-2">
             <LogOut size={18} />
             <span className="text-sm font-medium">Log out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-full max-w-md">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search across modules..." 
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                isSuperAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {userRole.replace('_', ' ')}
              </span>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
