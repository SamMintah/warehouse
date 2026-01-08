
import React, { useState } from 'react';
import Layout from './components/Layout';
import WarehousePage from './components/WarehousePage';
import { WAREHOUSES, TRANSFER_REQUESTS } from './mockData';
import { AppState, UserRole, WarehouseTab } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    userRole: UserRole.SUPER_ADMIN,
    currentView: 'warehouses', // Defaulting to warehouses as requested
    activeWarehouseTab: 'overview',
    selectedWarehouseId: null,
  });

  const setView = (view: 'dashboard' | 'warehouses') => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  const handleWarehouseTabChange = (tab: WarehouseTab) => {
    setState(prev => ({ ...prev, activeWarehouseTab: tab }));
  };

  const setUserRole = (role: UserRole) => {
    setState(prev => ({ ...prev, userRole: role }));
  };

  return (
    <Layout 
      userRole={state.userRole} 
      currentView={state.currentView} 
      setView={setView}
      setUserRole={setUserRole}
    >
      <WarehousePage 
        warehouses={WAREHOUSES}
        transfers={TRANSFER_REQUESTS}
        userRole={state.userRole}
        activeTab={state.activeWarehouseTab}
        onTabChange={handleWarehouseTabChange}
      />
    </Layout>
  );
};

export default App;
