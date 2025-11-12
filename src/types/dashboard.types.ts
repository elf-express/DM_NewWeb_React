// Dashboard 相關類型定義

export interface Shipment {
  id: string;
  origin: string;
  items: number;
  weight: number;
  status: string;
  eta: string;
}

export interface Order {
  id: string;
  channel: string;
  amount: number;
  created: string;
  status: string;
}

export interface TrendData {
  name: string;
  qty: number;
}

export interface OverviewItemProps {
  icon: any;
  title: string;
  value: number;
  tip?: string;
  prefix?: string;
}
