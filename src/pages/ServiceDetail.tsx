import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Shield, ArrowLeft, CheckCircle, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Service, Review } from "@/types/database";
import Navbar from "@/components/Navbar";
import BookingModal from "@/components/BookingModal";

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [dbReviews, setDbReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (id) {
      Promise.all([
        api.getServiceById(id),
        api.getServiceReviews(id)
      ])
        .then(([data, reviewsData]) => {
          setService(data);
          setDbReviews(reviewsData);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-background flex justify-center items-center">Loading...</div>;
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl block mb-4">😕</span>
          <h2 className="text-xl font-bold text-foreground mb-2">Service not found</h2>
          <Link to="/services" className="text-primary text-sm hover:underline">Browse all services</Link>
        </div>
      </div>
    );
  }

  const initials = service.provider.split(" ").map((n) => n[0]).join("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-24 pb-16 px-4">
        <Link to="/services" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to services
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Header image */}
              <div className="h-64 rounded-xl gradient-subtle flex items-center justify-center text-6xl mb-6">
                {service.category === "cleaning" && "🧹"}
                {service.category === "plumbing" && "🔧"}
                {service.category === "gardening" && "🌿"}
                {service.category === "painting" && "🎨"}
                {service.category === "electrical" && "⚡"}
                {service.category === "fitness" && "💪"}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {service.tags && service.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{service.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  {service.rating} ({service.review_count} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {service.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {service.availability}
                </span>
                {service.experience && (
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <Briefcase className="w-4 h-4" /> {service.experience} Experience
                  </span>
                )}
              </div>

              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed mb-8">
                {service.description}
              </div>

              {/* Features */}
              <div className="bg-card border border-border rounded-xl p-5 mb-8">
                <h3 className="font-semibold text-foreground mb-3">What's Included</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {["Professional equipment", "Eco-friendly products", "Satisfaction guarantee", "Licensed & insured"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Reviews</h3>
                {dbReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {dbReviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-card border border-border rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-foreground">{review.user_name}</span>
                          <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.text}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 sticky top-24 shadow-card"
            >
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{service.provider}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Verified Provider
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-foreground">₹{service.price}</span>
                  <span className="text-muted-foreground text-sm">/{service.price_unit}</span>
                </div>
                <p className="text-xs text-muted-foreground">All-inclusive pricing. No hidden fees.</p>
              </div>

              <Button
                onClick={() => setBookingOpen(true)}
                className="w-full gradient-primary text-primary-foreground border-0 shadow-glow mb-3"
                size="lg"
              >
                Book Now
              </Button>
              <Button variant="outline" className="w-full">
                Message Provider
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <BookingModal service={service} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
};

export default ServiceDetail;
