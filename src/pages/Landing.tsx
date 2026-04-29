import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Sparkles, Star, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/mockData";
import ServiceCard from "@/components/ServiceCard";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import type { Service } from "@/types/database";

const Landing = () => {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices().then(data => {
      setFeaturedServices(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 20% 30%, var(--primary) 0%, transparent 50%), radial-gradient(circle at 80% 70%, var(--accent) 0%, transparent 50%)",
              filter: "blur(80px)"
            }}
          />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]"
          >
            Find Trusted Local Services Near You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Discover, compare, and book trusted local service providers in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/services">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 shadow-glow px-8">
                Find Services <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/provider/register">
              <Button size="lg" variant="outline" className="px-8 shadow-sm">
                Become a Provider
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-8 md:gap-12 text-sm text-muted-foreground"
          >
            <div><span className="text-2xl font-bold text-foreground block">2,400+</span>Service Providers</div>
            <div className="w-px h-10 bg-border" />
            <div><span className="text-2xl font-bold text-foreground block">50K+</span>Happy Customers</div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="hidden sm:block"><span className="text-2xl font-bold text-foreground block">4.9★</span>Average Rating</div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Browse by Category</h2>
            <p className="text-muted-foreground">Find the perfect service for your needs</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/services?category=${cat.id}`}
                  className="block relative overflow-hidden h-40 rounded-2xl group shadow-soft hover:shadow-glow transition-all"
                >
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 backdrop-blur-[2px]">
                    <span className="text-2xl block mb-1 drop-shadow-md">{cat.icon}</span>
                    <span className="font-bold text-white block drop-shadow-md">{cat.name}</span>
                    <span className="block text-xs text-white/80 font-medium">{cat.count} providers</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 px-4 gradient-subtle">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Featured Services</h2>
              <p className="text-muted-foreground">Top-rated providers in your area</p>
            </div>
            <Link to="/services">
              <Button variant="outline" className="hidden sm:flex">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-card animate-pulse shadow-sm" />
              ))
            ) : featuredServices.length > 0 ? (
              featuredServices.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))
            ) : (
              <p className="text-center col-span-full text-muted-foreground">No services available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Why LocalServe?</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: "Smart Matching", desc: "Our platform finds the perfect service provider based on your needs, schedule, and budget." },
              { icon: Shield, title: "Verified Providers", desc: "Every provider is background-checked, licensed, and insured for your peace of mind." },
              { icon: Zap, title: "Instant Booking", desc: "Book services in seconds. No phone calls, no waiting. Confirm and you're set." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center shadow-card"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-primary rounded-2xl p-10 md:p-16 text-center shadow-glow"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to get started?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join thousands of happy customers who found their perfect local service provider through LocalServe.
            </p>
            <Link to="/services">
              <Button size="lg" className="bg-card text-foreground hover:bg-card/90 border-0 shadow-soft">
                <Star className="w-4 h-4 mr-2" /> Explore Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="LocalServe" className="w-6 h-6 rounded-md object-cover" />
            <span className="font-semibold text-foreground">LocalServe</span>
          </div>
          <p>© 2026 LocalServe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
