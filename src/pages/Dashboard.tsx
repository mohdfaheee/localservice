import { motion } from "framer-motion";
import { Calendar, Clock, DollarSign, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { bookings } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";

const statusConfig = {
  upcoming: { icon: AlertCircle, label: "Upcoming", className: "bg-primary/10 text-primary" },
  completed: { icon: CheckCircle, label: "Completed", className: "bg-success/10 text-success" },
  cancelled: { icon: XCircle, label: "Cancelled", className: "bg-destructive/10 text-destructive" },
};

const Dashboard = () => {
  const upcoming = bookings.filter((b) => b.status === "upcoming");
  const past = bookings.filter((b) => b.status !== "upcoming");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ChatWidget />

      <div className="container mx-auto pt-24 pb-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-8">Manage your bookings and activity</p>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Calendar, label: "Total Bookings", value: bookings.length, color: "text-primary" },
            { icon: Clock, label: "Upcoming", value: upcoming.length, color: "text-accent" },
            { icon: DollarSign, label: "Total Spent", value: `$${bookings.reduce((sum, b) => sum + b.price, 0)}`, color: "text-success" },
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
          <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming Bookings</h2>
          {upcoming.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <span className="text-4xl block mb-2">📅</span>
              <p className="text-muted-foreground text-sm">No upcoming bookings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((booking, i) => {
                const status = statusConfig[booking.status];
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground">{booking.serviceTitle}</h3>
                      <p className="text-sm text-muted-foreground">{booking.provider}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{booking.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{booking.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">${booking.price}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Past Bookings</h2>
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
                  <div>
                    <h3 className="font-semibold text-foreground">{booking.serviceTitle}</h3>
                    <p className="text-sm text-muted-foreground">{booking.provider} · {booking.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">${booking.price}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
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
