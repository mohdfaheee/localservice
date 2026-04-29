import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  IndianRupee,
  Settings, 
  Briefcase,
  Star,
  Users,
  AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Booking, Service } from "@/types/database";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statusConfig = {
  pending: { icon: AlertCircle, label: "Requested", className: "bg-amber-500/10 text-amber-500" },
  upcoming: { icon: Clock, label: "Upcoming", className: "bg-primary/10 text-primary" },
  completed: { icon: CheckCircle, label: "Completed", className: "bg-success/10 text-success" },
  cancelled: { icon: XCircle, label: "Cancelled", className: "bg-destructive/10 text-destructive" },
  paid: { icon: IndianRupee, label: "Paid", className: "bg-green-500/10 text-green-500" },
};

const ProviderDashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "provider")) {
      navigate("/");
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (user && profile?.role === "provider") {
      const fetchData = async () => {
        try {
          const [bs, s] = await Promise.all([
            api.getProviderBookings(user.id),
            api.getProviderService(user.id)
          ]);
          setBookings(bs);
          setService(s);
        } catch (error) {
          console.error("Error fetching provider data:", error);
        } finally {
          setFetching(false);
        }
      };
      fetchData();
    }
  }, [user, profile]);

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking["status"]) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      toast.success(`Booking ${newStatus === 'upcoming' ? 'accepted' : newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading || fetching) {
    return <div className="min-h-screen bg-background flex justify-center items-center">Loading Provider Dashboard...</div>;
  }

  const pending = bookings.filter((b) => b.status === "pending");
  const upcoming = bookings.filter((b) => b.status === "upcoming");
  const history = bookings.filter((b) => b.status === "completed" || b.status === "cancelled" || b.status === "paid");
  const totalEarnings = bookings
    .filter(b => b.status === 'paid' || b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-24 pb-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Provider Dashboard</h1>
            <p className="text-muted-foreground">Manage your service and booking requests</p>
          </div>
          <Link to="/provider/setup">
            <Button className="gradient-primary border-0 shadow-glow">
              <Settings className="w-4 h-4 mr-2" /> {service ? "Manage Service" : "Setup Service"}
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Briefcase, label: "Requests", value: pending.length, color: "text-amber-500" },
            { icon: Calendar, label: "Upcoming", value: upcoming.length, color: "text-primary" },
            { icon: IndianRupee, label: "Total Earnings", value: `₹${totalEarnings}`, color: "text-green-500" },
            { icon: Users, label: "Total Clients", value: new Set(bookings.map(b => b.user_id)).size, color: "text-accent" },
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

        {/* Pending Requests */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Pending Requests</h2>
          {pending.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <span className="text-4xl block mb-2">📥</span>
              <p className="text-muted-foreground text-sm">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                       {booking.provider[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{booking.service_title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{booking.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{booking.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      Decline
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate(booking.id, "upcoming")}
                      className="gradient-primary border-0"
                    >
                      Accept
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming Schedule</h2>
          {upcoming.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
              Your schedule is clear
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {upcoming.map((booking) => (
                <div key={booking.id} className="bg-card border border-border rounded-xl p-5 flex justify-between items-center shadow-soft">
                   <div>
                      <p className="font-bold text-foreground">{booking.date}</p>
                      <p className="text-sm text-muted-foreground">{booking.time} · {booking.service_title}</p>
                   </div>
                   <div className="flex flex-col items-end gap-2">
                      <p className="font-bold text-foreground">₹{booking.price}</p>
                      <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(booking.id, "completed")} className="h-7 text-[10px] uppercase font-bold">
                        Mark Done
                      </Button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Job History</h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
            {history.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No history yet</div>
            ) : (
              history.map((booking) => (
                <div key={booking.id} className="p-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{booking.date}</span>
                    <span className="font-medium">{booking.service_title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-foreground">₹{booking.price}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusConfig[booking.status].className}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
