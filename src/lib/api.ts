import { supabase } from "./supabase";
import type { Service, Booking, Profile, Review } from "@/types/database";

export const api = {
  // Services
  async getServices() {
    const { data, error } = await supabase.from("services").select("*");
    if (error) throw error;
    return data as Service[];
  },

  async getServiceById(id: string) {
    const { data, error } = await supabase.from("services").select("*").eq("id", id).single();
    if (error) throw error;
    return data as Service;
  },

  // Bookings
  async getUserBookings(userId: string) {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Booking[];
  },

  async getProviderBookings(providerId: string) {
    // We filter services by provider_id and then find bookings for those services
    // Or simpler: query bookings where service_id is in provider's services
    const { data: services } = await supabase.from("services").select("id").eq("provider_id", providerId);
    if (!services || services.length === 0) return [];
    
    const serviceIds = services.map(s => s.id);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .in("service_id", serviceIds)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Booking[];
  },

  async createBooking(booking: Omit<Booking, "id" | "created_at">) {
    const { data, error } = await supabase.from("bookings").insert(booking).select("*").single();
    if (error) throw error;
    return data as Booking;
  },

  async updateBookingStatus(bookingId: string, status: Booking["status"]) {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId)
      .select("*")
      .single();
    if (error) throw error;
    return data as Booking;
  },

  // Services
  async getProviderService(providerId: string) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("provider_id", providerId)
      .maybeSingle();
    if (error) throw error;
    return data as Service | null;
  },

  async createOrUpdateService(service: Partial<Service>) {
    const { data, error } = await supabase
      .from("services")
      .upsert(service)
      .select("*")
      .single();
    if (error) throw error;
    return data as Service;
  },

  // Reviews
  async getServiceReviews(serviceId: string) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("service_id", serviceId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Review[];
  },

  // Profiles
  async getProfile(userId: string) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error) throw error;
    return data as Profile;
  },
};
