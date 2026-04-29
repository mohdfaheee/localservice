import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, IndianRupee, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Booking } from "@/types/database";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statusConfig = {
  pending: { icon: AlertCircle, label: "Pending Approval", className: "bg-amber-500/10 text-amber-500" },
  upcoming: { icon: Clock, label: "Upcoming", className: "bg-primary/10 text-primary" },
  completed: { icon: CheckCircle, label: "Completed", className: "bg-success/10 text-success" },
  cancelled: { icon: XCircle, label: "Cancelled", className: "bg-destructive/10 text-destructive" },
  paid: { icon: IndianRupee, label: "Paid", className: "bg-green-500/10 text-green-500" },
};

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (!loading && profile?.role === "provider") {
      navigate("/provider-dashboard");
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (user && profile?.role === "client") {
      const fetchBookings = async () => {
        try {
          const bs = await api.getUserBookings(user.id);
          setBookings(bs);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setFetching(false);
        }
      };
      fetchBookings();
    }
  }, [user, profile]);

  const handlePayment = async (bookingId: string) => {
    try {
      await api.updateBookingStatus(bookingId, "paid");
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: "paid" } : b));
      toast.success("Payment successful!");
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  if (loading || fetching) {
    return <div className="min-h-screen bg-background flex justify-center items-center">Loading Dashboard...</div>;
  }

  const upcoming = bookings.filter((b) => b.status === "upcoming" || b.status === "pending");
  const past = bookings.filter((b) => b.status !== "upcoming" && b.status !== "pending");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-24 pb-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground mb-8">Hello, {profile?.full_name}. Manage your appointments and payments.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Calendar, label: "Total Bookings", value: bookings.length, color: "text-primary" },
            { icon: Clock, label: "Pending/Confirmed", value: upcoming.length, color: "text-accent" },
            { icon: IndianRupee, label: "Total Spent", value: `₹${bookings.filter(b => b.status === 'paid' || b.status === 'completed').reduce((sum, b) => sum + b.price, 0)}`, color: "text-success" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-5 shadow-card"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Upcoming */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Active Bookings</h2>
          {upcoming.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <span className="text-4xl block mb-2">📅</span>
              <p className="text-muted-foreground text-sm">No active bookings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((booking, i) => {
                const status = statusConfig[booking.status];
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-card"
                  >
                    <div className="flex items-start gap-4">
                       <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                          {booking.service_title[0]}
                       </div>
                       <div>
                          <h3 className="font-bold text-lg text-foreground">{booking.service_title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">Provider: <span className="text-foreground font-medium">{booking.provider}</span></p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{booking.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{booking.time}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                       <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">₹{booking.price}</p>
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${status.className}`}>
                            {status.label}
                          </span>
                       </div>
                       {booking.status === "upcoming" && (
                          <Button 
                             onClick={() => handlePayment(booking.id)}
                             className="gradient-primary border-0 shadow-glow"
                          >
                             <IndianRupee className="w-4 h-4 mr-2" /> Pay Now
                          </Button>
                       )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">History</h2>
          <div className="space-y-3">
            {past.map((booking, i) => {
              const status = statusConfig[booking.status];
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-muted-foreground">{booking.date}</div>
                    <div>
                      <h3 className="font-semibold text-foreground">{booking.service_title}</h3>
                      <p className="text-xs text-muted-foreground">{booking.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">₹{booking.price}</span>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

