import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Service } from "@/data/mockData";

const ServiceCard = ({ service, index = 0 }: { service: Service; index?: number }) => {
  const initials = service.provider.split(" ").map(n => n[0]).join("");

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
              {service.category === "cleaning" && "🧹"}
              {service.category === "plumbing" && "🔧"}
              {service.category === "gardening" && "🌿"}
              {service.category === "painting" && "🎨"}
              {service.category === "electrical" && "⚡"}
              {service.category === "fitness" && "💪"}
            </div>
            <div className="absolute top-3 left-3 flex gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-card/80 backdrop-blur-sm text-foreground"
                >
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
              <span className="text-sm text-muted-foreground">{service.provider}</span>
            </div>

            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {service.title}
            </h3>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                {service.rating} ({service.reviewCount})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {service.location}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-foreground">${service.price}</span>
                <span className="text-sm text-muted-foreground">/{service.priceUnit}</span>
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
