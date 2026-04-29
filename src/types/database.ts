// ─── Database Types ───────────────────────────────────────────────
// These types mirror the Supabase (PostgreSQL) tables.

export interface Profile {
  id: string; // UUID – same as auth.users.id
  full_name: string;
  avatar_url: string | null;
  role: "client" | "provider";
  phone: string | null;
  created_at: string;
}

export interface Service {
  id: string; // UUID
  name: string;
  category: string;
  provider_id: string; // Updated to be required as per schema
  provider: string; // display name
  rating: number;
  review_count: number;
  price: number;
  price_unit: string;
  description: string;
  experience: string | null; // Added experience field
  image_url: string | null;
  tags: string[];
  location: string;
  availability: string;
  created_at: string;
}

export interface Booking {
  id: string; // UUID
  user_id: string; // FK → profiles.id
  service_id: string; // FK → services.id
  service_title: string;
  provider: string;
  date: string;
  time: string;
  status: "pending" | "upcoming" | "completed" | "cancelled" | "paid";
  price: number;
  notes: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  service_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  text: string;
  created_at: string;
}
