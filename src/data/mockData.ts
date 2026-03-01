export type Category = {
  id: string;
  name: string;
  emoji: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  tags?: string[];
};

export type OrderStatus = "received" | "preparing" | "ready" | "served";

export type OrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  image: string;
};

export type Order = {
  id: string;
  tableNumber: number;
  customerName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: Date;
  estimatedMinutes: number;
};

export type FranchiseApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  adminNotes?: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  visitCount: number;
  totalSpent: number;
  lastVisit: Date;
  favoriteItem?: string;
};
