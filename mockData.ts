
import { Warehouse, WarehouseStatus, MovementDirection, TransferRequest, TransferStatus, UserRole } from './types';

export const WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-1',
    name: 'North Central Hub',
    location: 'Chicago, IL',
    status: WarehouseStatus.ACTIVE,
    managerId: 'mgr-1',
    items: [
      { id: 'item-1', name: 'Premium Semiconductors', quantity: 1250, unit: 'pcs', pricePerUnit: 45, lastUpdated: '2024-05-15T10:30:00Z' },
      { id: 'item-2', name: 'Industrial Fans', quantity: 450, unit: 'units', pricePerUnit: 120, lastUpdated: '2024-05-14T08:15:00Z' },
      { id: 'item-3', name: 'Copper Wiring', quantity: 8000, unit: 'meters', pricePerUnit: 8.5, lastUpdated: '2024-05-15T14:45:00Z' }
    ],
    history: [
      { id: 'm-1', itemId: 'item-1', itemName: 'Premium Semiconductors', quantity: 200, direction: MovementDirection.IN, user: 'John Smith', timestamp: '2024-05-15T10:30:00Z' },
      { id: 'm-2', itemId: 'item-2', itemName: 'Industrial Fans', quantity: 50, direction: MovementDirection.OUT, user: 'Jane Doe', timestamp: '2024-05-14T16:20:00Z' }
    ]
  },
  {
    id: 'wh-2',
    name: 'Pacific Coastal Depot',
    location: 'Long Beach, CA',
    status: WarehouseStatus.FULL,
    managerId: 'mgr-2',
    items: [
      { id: 'item-4', name: 'Steel Beams', quantity: 300, unit: 'tons', pricePerUnit: 800, lastUpdated: '2024-05-12T09:00:00Z' },
      { id: 'item-5', name: 'Glass Panes', quantity: 1500, unit: 'units', pricePerUnit: 35, lastUpdated: '2024-05-13T11:20:00Z' }
    ],
    history: []
  },
  {
    id: 'wh-3',
    name: 'Eastern Logistics Base',
    location: 'Newark, NJ',
    status: WarehouseStatus.MAINTENANCE,
    managerId: 'mgr-1',
    items: [
      { id: 'item-6', name: 'Lithium Batteries', quantity: 5000, unit: 'cells', pricePerUnit: 12, lastUpdated: '2024-05-15T12:00:00Z' }
    ],
    history: []
  },
  {
    id: 'wh-4',
    name: 'Gulf Port Storage',
    location: 'Houston, TX',
    status: WarehouseStatus.ACTIVE,
    managerId: 'mgr-3',
    items: [
      { id: 'item-7', name: 'Solar Panels', quantity: 600, unit: 'units', pricePerUnit: 180, lastUpdated: '2024-05-14T15:30:00Z' }
    ],
    history: []
  }
];

export const TRANSFER_REQUESTS: TransferRequest[] = [
  {
    id: 'TR-1001',
    itemId: 'item-1',
    itemName: 'Premium Semiconductors',
    quantity: 150,
    fromWarehouseId: 'wh-1',
    fromWarehouseName: 'North Central Hub',
    toWarehouseId: 'wh-2',
    toWarehouseName: 'Pacific Coastal Depot',
    requestedBy: 'Michael Chen',
    date: '2024-05-16T09:15:00Z',
    status: TransferStatus.PENDING,
    notes: 'Urgent restock for client order #8892'
  },
  {
    id: 'TR-1002',
    itemId: 'item-3',
    itemName: 'Copper Wiring',
    quantity: 500,
    fromWarehouseId: 'wh-1',
    fromWarehouseName: 'North Central Hub',
    toWarehouseId: 'wh-4',
    toWarehouseName: 'Gulf Port Storage',
    requestedBy: 'Sarah Jenkins',
    date: '2024-05-16T11:45:00Z',
    status: TransferStatus.APPROVED,
    approvedBy: 'Super Admin',
    notes: 'Regular replenishment'
  },
  {
    id: 'TR-1003',
    itemId: 'item-6',
    itemName: 'Lithium Batteries',
    quantity: 1000,
    fromWarehouseId: 'wh-3',
    fromWarehouseName: 'Eastern Logistics Base',
    toWarehouseId: 'wh-2',
    toWarehouseName: 'Pacific Coastal Depot',
    requestedBy: 'Michael Chen',
    date: '2024-05-15T14:20:00Z',
    status: TransferStatus.COMPLETED,
    approvedBy: 'Super Admin',
    notes: 'Batch movement for Q3 production'
  },
  {
    id: 'TR-1004',
    itemId: 'item-4',
    itemName: 'Steel Beams',
    quantity: 20,
    fromWarehouseId: 'wh-2',
    fromWarehouseName: 'Pacific Coastal Depot',
    toWarehouseId: 'wh-1',
    toWarehouseName: 'North Central Hub',
    requestedBy: 'James Wilson',
    date: '2024-05-14T10:00:00Z',
    status: TransferStatus.REJECTED,
    approvedBy: 'Super Admin',
    comment: 'Exceeds transport weight limit for current carrier contract'
  }
];
