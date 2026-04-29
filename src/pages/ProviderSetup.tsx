import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowLeft, 
  Save, 
  Image as ImageIcon,
  IndianRupee,
  MapPin,
  Clock,
  Briefcase
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Service } from "@/types/database";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const categories = [
  "cleaning", "plumbing", "gardening", "painting", "electrical", "fitness", "moving", "tutoring"
];

const ProviderSetup = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    category: "cleaning",
    description: "",
    experience: "",
    location: "",
    price: 0,
    price_unit: "hour",
    availability: "Mon-Fri, 9am-5pm",
    image_url: "",
    tags: []
  });

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "provider")) {
      navigate("/");
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (user && profile?.role === "provider") {
      api.getProviderService(user.id)
        .then(s => {
          if (s) {
            setFormData(s);
          }
        })
        .finally(() => setFetching(false));
    }
  }, [user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      // Create a clean object for the database
      const serviceData: Partial<Service> = {
        provider_id: user.id,
        provider: profile?.full_name || "Provider",
        name: formData.name,
        category: formData.category,
        description: formData.description,
        experience: formData.experience,
        location: formData.location,
        price: formData.price,
        price_unit: formData.price_unit,
        availability: formData.availability,
        image_url: formData.image_url,
        tags: formData.tags || []
      };

      // If we have an existing ID, include it to ensure we UPDATE instead of INSERTing a duplicate
      if (formData.id) {
        serviceData.id = formData.id;
      }

      await api.createOrUpdateService(serviceData);
      toast.success("Service profile updated successfully!");
      navigate("/provider-dashboard");
    } catch (error) {
      toast.error("Failed to save service profile");
      console.error("DEBUG - Save error detail:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || fetching) {
    return <div className="min-h-screen bg-background flex justify-center items-center">Loading Setup...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-24 pb-16 px-4 max-w-3xl">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Service Profile</h1>
              <p className="text-muted-foreground text-sm">Details that clients will see when browsing</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Service Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Professional House Cleaning"
                  className="w-full h-11 px-4 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Experience</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={formData.experience || ""}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="e.g. 5+ years"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell clients about your expertise, tools, and what makes your service special..."
                  className="w-full p-4 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Price</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Per</label>
                  <select
                    value={formData.price_unit}
                    onChange={(e) => setFormData({ ...formData, price_unit: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="hour">Hour</option>
                    <option value="service">Service (Fixed)</option>
                    <option value="room">Room</option>
                    <option value="sqft">Sq Ft</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. New York, NY"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Availability</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      required
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      placeholder="e.g. Mon-Fri, 9am-6pm"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Service Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={formData.image_url || ""}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full h-12 gradient-primary text-primary-foreground border-0 shadow-glow text-base font-semibold"
            >
              {saving ? "Saving..." : <span className="flex items-center gap-2"><Save className="w-5 h-5" /> Save Changes</span>}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProviderSetup;
