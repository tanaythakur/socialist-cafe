import foodCoffee from "@/assets/food-coffee.jpg";
import foodAvocadoToast from "@/assets/food-avocado-toast.jpg";
import foodCroissant from "@/assets/food-croissant.jpg";
import foodSmoothieBowl from "@/assets/food-smoothie-bowl.jpg";
import foodSalad from "@/assets/food-salad.jpg";
import foodMatcha from "@/assets/food-matcha.jpg";
import foodEggsBenedict from "@/assets/food-eggs-benedict.jpg";
import foodPistachioTart from "@/assets/food-pistachio-tart.jpg";

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

export const CATEGORIES: Category[] = [
  { id: "all", name: "All Items", emoji: "🍽️" },
  { id: "breakfast", name: "Breakfast", emoji: "🌅" },
  { id: "mains", name: "Mains", emoji: "🥗" },
  { id: "beverages", name: "Beverages", emoji: "☕" },
  { id: "desserts", name: "Desserts", emoji: "🍰" },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "m1",
    categoryId: "breakfast",
    name: "Avocado Toast",
    description: "Sourdough toast with smashed avocado, poached eggs, chili flakes & microgreens",
    price: 14.5,
    image: foodAvocadoToast,
    available: true,
    tags: ["vegetarian"],
  },
  {
    id: "m2",
    categoryId: "breakfast",
    name: "Eggs Benedict",
    description: "English muffin with smoked salmon, poached eggs & house hollandaise",
    price: 16.9,
    image: foodEggsBenedict,
    available: true,
  },
  {
    id: "m3",
    categoryId: "breakfast",
    name: "Butter Croissant",
    description: "Freshly baked all-butter croissant, served warm with jam & cultured butter",
    price: 5.5,
    image: foodCroissant,
    available: true,
    tags: ["vegetarian"],
  },
  {
    id: "m4",
    categoryId: "breakfast",
    name: "Green Smoothie Bowl",
    description: "Spirulina & spinach base, granola, fresh berries, coconut flakes & chia seeds",
    price: 12.0,
    image: foodSmoothieBowl,
    available: true,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "m5",
    categoryId: "mains",
    name: "Harvest Grain Bowl",
    description: "Roasted seasonal vegetables, feta, olives, fresh herbs & lemon tahini dressing",
    price: 18.5,
    image: foodSalad,
    available: true,
    tags: ["vegetarian"],
  },
  {
    id: "m6",
    categoryId: "beverages",
    name: "Flat White",
    description: "Double ristretto with velvety micro-foam steamed milk, served in ceramic",
    price: 5.0,
    image: foodCoffee,
    available: true,
  },
  {
    id: "m7",
    categoryId: "beverages",
    name: "Iced Matcha Latte",
    description: "Ceremonial grade matcha, oat milk, served over ice. Sweetened or unsweetened",
    price: 6.5,
    image: foodMatcha,
    available: true,
    tags: ["vegan"],
  },
  {
    id: "m8",
    categoryId: "desserts",
    name: "Pistachio Tart",
    description: "House-made pistachio cream in a buttery pastry shell, dusted with icing sugar",
    price: 8.0,
    image: foodPistachioTart,
    available: false,
    tags: ["vegetarian"],
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "TSC-001",
    tableNumber: 4,
    customerName: "Amara Nwosu",
    phone: "0712 345 678",
    items: [
      { menuItemId: "m1", name: "Avocado Toast", price: 14.5, quantity: 2, image: foodAvocadoToast },
      { menuItemId: "m6", name: "Flat White", price: 5.0, quantity: 2, image: foodCoffee },
    ],
    total: 39.0,
    status: "preparing",
    createdAt: new Date(Date.now() - 8 * 60000),
    estimatedMinutes: 12,
  },
  {
    id: "TSC-002",
    tableNumber: 7,
    customerName: "Lars Eriksson",
    phone: "0722 987 654",
    items: [
      { menuItemId: "m5", name: "Harvest Grain Bowl", price: 18.5, quantity: 1, image: foodSalad },
      { menuItemId: "m7", name: "Iced Matcha Latte", price: 6.5, quantity: 1, image: foodMatcha },
    ],
    total: 25.0,
    status: "ready",
    createdAt: new Date(Date.now() - 22 * 60000),
    estimatedMinutes: 15,
  },
  {
    id: "TSC-003",
    tableNumber: 2,
    customerName: "Priya Sharma",
    phone: "0733 111 222",
    items: [
      { menuItemId: "m2", name: "Eggs Benedict", price: 16.9, quantity: 1, image: foodEggsBenedict },
      { menuItemId: "m3", name: "Butter Croissant", price: 5.5, quantity: 2, image: foodCroissant },
    ],
    total: 27.9,
    status: "received",
    createdAt: new Date(Date.now() - 2 * 60000),
    estimatedMinutes: 18,
  },
];

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

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "c1", name: "Amara Nwosu", phone: "0712 345 678", email: "amara@email.com", visitCount: 14, totalSpent: 312.5, lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60000), favoriteItem: "Avocado Toast" },
  { id: "c2", name: "Lars Eriksson", phone: "0722 987 654", email: "lars@email.se", visitCount: 8, totalSpent: 189.0, lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60000), favoriteItem: "Harvest Grain Bowl" },
  { id: "c3", name: "Priya Sharma", phone: "0733 111 222", email: "priya@email.in", visitCount: 22, totalSpent: 478.9, lastVisit: new Date(Date.now() - 0.5 * 24 * 60 * 60000), favoriteItem: "Iced Matcha Latte" },
  { id: "c4", name: "James Okafor", phone: "0744 555 999", visitCount: 5, totalSpent: 96.0, lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60000), favoriteItem: "Flat White" },
  { id: "c5", name: "Mei Lin", phone: "0755 321 654", email: "mei@email.cn", visitCount: 31, totalSpent: 720.0, lastVisit: new Date(Date.now() - 0.2 * 24 * 60 * 60000), favoriteItem: "Pistachio Tart" },
  { id: "c6", name: "Fatima Al-Rashid", phone: "0766 888 333", email: "fatima@email.ae", visitCount: 11, totalSpent: 255.5, lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60000), favoriteItem: "Butter Croissant" },
  { id: "c7", name: "Diego Reyes", phone: "0777 444 222", visitCount: 2, totalSpent: 38.5, lastVisit: new Date(Date.now() - 10 * 24 * 60 * 60000) },
  { id: "c8", name: "Anna Kowalski", phone: "0788 222 111", email: "anna@email.pl", visitCount: 17, totalSpent: 391.0, lastVisit: new Date(Date.now() - 1.5 * 24 * 60 * 60000), favoriteItem: "Eggs Benedict" },
];

export const MOCK_FRANCHISE_APPLICATIONS: FranchiseApplication[] = [
  {
    id: "FA-001",
    name: "Thomas Müller",
    email: "thomas@muller.de",
    phone: "+49 30 1234567",
    city: "Berlin, Germany",
    message: "I have 10 years in hospitality and a prime location in Prenzlauer Berg.",
    status: "pending",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60000),
  },
  {
    id: "FA-002",
    name: "Chioma Obi",
    email: "chioma@obicafe.ng",
    phone: "+234 801 234 5678",
    city: "Lagos, Nigeria",
    message: "Excited to bring The Socialist Café concept to Lagos Island.",
    status: "approved",
    submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60000),
    adminNotes: "Approved. Strong market, excellent financials.",
  },
  {
    id: "FA-003",
    name: "Sofia Andersson",
    email: "sofia@anderssongroup.se",
    phone: "+46 8 765 4321",
    city: "Stockholm, Sweden",
    message: "We operate 3 successful café concepts in Södermalm and Östermalm.",
    status: "rejected",
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60000),
    adminNotes: "Market too saturated. Revisit in 18 months.",
  },
];
