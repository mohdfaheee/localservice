export interface Service {
  id: string;
  title: string;
  category: string;
  provider: string;
  providerAvatar: string;
  rating: number;
  reviewCount: number;
  price: number;
  priceUnit: string;
  description: string;
  image: string;
  tags: string[];
  location: string;
  availability: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  provider: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  price: number;
}

export const categories = [
  { id: "cleaning", name: "Cleaning", icon: "🧹", count: 45 },
  { id: "plumbing", name: "Plumbing", icon: "🔧", count: 32 },
  { id: "electrical", name: "Electrical", icon: "⚡", count: 28 },
  { id: "gardening", name: "Gardening", icon: "🌿", count: 38 },
  { id: "painting", name: "Painting", icon: "🎨", count: 22 },
  { id: "moving", name: "Moving", icon: "📦", count: 18 },
  { id: "tutoring", name: "Tutoring", icon: "📚", count: 56 },
  { id: "fitness", name: "Fitness", icon: "💪", count: 41 },
];

export const services: Service[] = [
  {
    id: "1",
    title: "Deep Home Cleaning",
    category: "cleaning",
    provider: "Sarah Johnson",
    providerAvatar: "",
    rating: 4.9,
    reviewCount: 234,
    price: 85,
    priceUnit: "session",
    description: "Professional deep cleaning service for your entire home. Includes kitchen, bathrooms, bedrooms, and living areas. Eco-friendly products used.",
    image: "",
    tags: ["Top Rated", "Eco-Friendly"],
    location: "Downtown Area",
    availability: "Mon-Sat",
  },
  {
    id: "2",
    title: "Emergency Plumbing Repair",
    category: "plumbing",
    provider: "Mike Torres",
    providerAvatar: "",
    rating: 4.8,
    reviewCount: 189,
    price: 120,
    priceUnit: "hour",
    description: "Fast and reliable plumbing repairs. Available for emergencies 24/7. Licensed and insured professional plumber with 15+ years experience.",
    image: "",
    tags: ["24/7 Available", "Licensed"],
    location: "Citywide",
    availability: "24/7",
  },
  {
    id: "3",
    title: "Garden Design & Maintenance",
    category: "gardening",
    provider: "Elena Park",
    providerAvatar: "",
    rating: 4.7,
    reviewCount: 156,
    price: 65,
    priceUnit: "hour",
    description: "Transform your outdoor space with professional garden design and regular maintenance. Specializing in sustainable landscaping.",
    image: "",
    tags: ["Sustainable", "Design"],
    location: "Suburbs",
    availability: "Mon-Fri",
  },
  {
    id: "4",
    title: "Interior Painting",
    category: "painting",
    provider: "James Cooper",
    providerAvatar: "",
    rating: 4.9,
    reviewCount: 201,
    price: 150,
    priceUnit: "room",
    description: "Premium interior painting service. Color consultation included. We use top-quality paints and deliver flawless finishes every time.",
    image: "",
    tags: ["Premium", "Consultation"],
    location: "Metro Area",
    availability: "Mon-Sat",
  },
  {
    id: "5",
    title: "Home Electrical Wiring",
    category: "electrical",
    provider: "David Kim",
    providerAvatar: "",
    rating: 4.6,
    reviewCount: 143,
    price: 95,
    priceUnit: "hour",
    description: "Certified electrician for all your home wiring needs. From simple fixes to complete rewiring. Safety-first approach guaranteed.",
    image: "",
    tags: ["Certified", "Insured"],
    location: "Citywide",
    availability: "Mon-Fri",
  },
  {
    id: "6",
    title: "Personal Fitness Training",
    category: "fitness",
    provider: "Lisa Chen",
    providerAvatar: "",
    rating: 5.0,
    reviewCount: 312,
    price: 70,
    priceUnit: "session",
    description: "Customized fitness programs tailored to your goals. In-home or outdoor training available. First session includes free assessment.",
    image: "",
    tags: ["Top Rated", "Certified"],
    location: "Flexible",
    availability: "Daily",
  },
];

export const bookings: Booking[] = [
  {
    id: "b1",
    serviceId: "1",
    serviceTitle: "Deep Home Cleaning",
    provider: "Sarah Johnson",
    date: "2026-04-02",
    time: "10:00 AM",
    status: "upcoming",
    price: 85,
  },
  {
    id: "b2",
    serviceId: "6",
    serviceTitle: "Personal Fitness Training",
    provider: "Lisa Chen",
    date: "2026-04-05",
    time: "7:00 AM",
    status: "upcoming",
    price: 70,
  },
  {
    id: "b3",
    serviceId: "4",
    serviceTitle: "Interior Painting",
    provider: "James Cooper",
    date: "2026-03-20",
    time: "9:00 AM",
    status: "completed",
    price: 150,
  },
  {
    id: "b4",
    serviceId: "2",
    serviceTitle: "Emergency Plumbing Repair",
    provider: "Mike Torres",
    date: "2026-03-15",
    time: "2:00 PM",
    status: "completed",
    price: 120,
  },
];

export const reviews = [
  { id: "r1", user: "Alex M.", rating: 5, text: "Absolutely fantastic work! Sarah left my home sparkling clean. Will definitely book again.", date: "2 days ago" },
  { id: "r2", user: "Jordan K.", rating: 5, text: "Professional, punctual, and thorough. Best cleaning service I've ever used.", date: "1 week ago" },
  { id: "r3", user: "Taylor R.", rating: 4, text: "Great service overall. Minor scheduling hiccup but the quality was excellent.", date: "2 weeks ago" },
];

export const chatSuggestions = [
  "Find a plumber near me",
  "Book a cleaner for tomorrow",
  "Best rated electrician",
  "Compare gardening services",
];
