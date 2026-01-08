
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER'
}

export enum WarehouseStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  FULL = 'FULL'
}

export enum TransferStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export enum MovementDirection {
  IN = 'IN',
  OUT = 'OUT'
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  lastUpdated: string;
}

export interface MovementRecord {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  direction: MovementDirection;
  user: string;
  timestamp: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  status: WarehouseStatus;
  items: InventoryItem[];
  history: MovementRecord[];
  managerId: string;
}

export interface TransferRequest {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  fromWarehouseId: string;
  toWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseName: string;
  requestedBy: string;
  date: string;
  status: TransferStatus;
  notes?: string;
  approvedBy?: string;
  comment?: string;
}

export type WarehouseTab = 'overview' | 'inventory' | 'transfers' | 'history';

export interface AppState {
  userRole: UserRole;
  currentView: 'dashboard' | 'warehouses';
  activeWarehouseTab: WarehouseTab;
  selectedWarehouseId: string | null;
}
