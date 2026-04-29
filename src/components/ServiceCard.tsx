import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Service } from "@/types/database";

const ServiceCard = ({ service, index = 0 }: { service: Partial<Service>; index?: number }) => {
  // Fallback for provider name since it might be empty in your DB
  const providerName = service.provider || "Local Pro";
  const initials = providerName.split(" ").map(n => n[0]).join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/services/${service.id}`}>
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-glow transition-all duration-300">
          
          {/* Image placeholder */}
          <div className="h-44 gradient-subtle relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
              {service.category?.toLowerCase() === "cleaning" && "🧹"}
              {service.category?.toLowerCase() === "plumbing" && "🔧"}
              {service.category?.toLowerCase() === "gardening" && "🌿"}
              {service.category?.toLowerCase() === "painting" &&  "🎨"}
              {service.category?.toLowerCase() === "electrical" && "⚡"}
              {service.category?.toLowerCase() === "fitness" && "💪"}
              {/* Add more emojis based on your categories */}
            </div>
            <div className="absolute top-3 left-3 flex gap-2">
              {/* service.tags might be undefined, so we add a check */}
              {service.tags?.map((tag: string) => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-card/80 backdrop-blur-sm text-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                {initials}
              </div>
              <span className="text-sm text-muted-foreground">{providerName}</span>
            </div>

            {/* 🔥 CHANGED THIS: service.title -> service.name */}
            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {service.name}
            </h3>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                {service.rating || "5.0"} ({service.reviewCount || "0"})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {service.location || "Remote"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-foreground">₹{service.price}</span>
                <span className="text-sm text-muted-foreground">/{service.priceUnit || "hr"}</span>
              </div>
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                Book Now
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;