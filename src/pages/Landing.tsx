import { motion } from "framer-motion";
import { Search, ArrowRight, Sparkles, Star, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { categories, services } from "@/data/mockData";
import ServiceCard from "@/components/ServiceCard";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ChatWidget />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered Service Discovery
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]"
          >
            Find Local Services
            <br />
            <span className="gradient-text">Powered by AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Discover, compare, and book trusted local service providers in seconds.
            Our AI assistant helps you find exactly what you need.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                placeholder="What service do you need?"
                className="w-full h-13 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
            </div>
            <Link to="/services">
              <Button className="gradient-primary text-primary-foreground border-0 shadow-glow h-13 px-6">
                Explore Services <ArrowRight className="w-4 h-4 ml-2" />
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
                  className="block bg-card border border-border rounded-xl p-4 text-center hover:shadow-card hover:border-primary/20 transition-all group"
                >
                  <span className="text-3xl block mb-2">{cat.icon}</span>
                  <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
                  <span className="block text-xs text-muted-foreground mt-1">{cat.count} providers</span>
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
            {services.slice(0, 3).map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
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
              { icon: Sparkles, title: "AI-Powered Matching", desc: "Our AI finds the perfect service provider based on your needs, schedule, and budget." },
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
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">LocalServe</span>
          </div>
          <p>© 2026 LocalServe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
