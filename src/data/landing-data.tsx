import { Briefcase, TrendingUp, Users, MessageSquare } from "lucide-react";
import type { ReactNode } from "react";

// Interfaces for data types
export interface Category {
  name: string;
  description: string;
  icon: ReactNode;
  link: string;
}

export interface Freelancer {
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  verified: boolean;
}

export interface Step {
  title: string;
  description: string;
}

export interface Testimonial {
  text: string;
  name: string;
  role: string;
  avatar: string;
}

// Data for categories section
export const categories: Category[] = [
  {
    name: "Web & Mobile Design",
    description: "UI/UX design for websites and mobile applications",
    icon: <Briefcase className="h-6 w-6 text-[#15949C]" />,
    link: "/categories/web-design",
  },
  {
    name: "Development & IT",
    description: "Web, mobile, and software development services",
    icon: <TrendingUp className="h-6 w-6 text-[#15949C]" />,
    link: "/categories/development",
  },
  {
    name: "Marketing",
    description: "Digital marketing, SEO, and social media services",
    icon: <Users className="h-6 w-6 text-[#15949C]" />,
    link: "/categories/marketing",
  },
  {
    name: "Writing & Translation",
    description: "Content creation and language translation",
    icon: <MessageSquare className="h-6 w-6 text-[#15949C]" />,
    link: "/categories/writing",
  },
];

// Data for freelancers section
export const freelancers: Freelancer[] = [
  {
    name: "Alex Morgan",
    title: "UI/UX Designer",
    avatar: "/person1.png",
    rating: 5,
    reviews: 127,
    hourlyRate: 45,
    verified: true,
  },
  {
    name: "Sarah Johnson",
    title: "Full Stack Developer",
    avatar: "/person2.png",
    rating: 4,
    reviews: 89,
    hourlyRate: 65,
    verified: true,
  },
  {
    name: "Michael Chen",
    title: "Digital Marketing Specialist",
    avatar: "/person3.png",
    rating: 5,
    reviews: 56,
    hourlyRate: 40,
    verified: false,
  },
];

// Data for how it works section
export const steps: Step[] = [
  {
    title: "Post a Project",
    description:
      "Describe your project and the skills you're looking for to find the perfect match.",
  },
  {
    title: "Review Proposals",
    description:
      "Browse through proposals from talented freelancers and select the best fit.",
  },
  {
    title: "Collaborate & Pay",
    description:
      "Work together seamlessly and release payment when you're satisfied with the results.",
  },
];

// Data for testimonials section
export const testimonials: Testimonial[] = [
  {
    text: "Offer Hub helped me find the perfect designer for my brand. The process was smooth and the results exceeded my expectations!",
    name: "Emma Wilson",
    role: "Business Owner",
    avatar: "/person5.png",
  },
  {
    text: "As a freelancer, I've been able to connect with amazing clients and grow my business through this platform.",
    name: "David Rodriguez",
    role: "Web Developer",
    avatar: "/person6.png",
  },
  {
    text: "The quality of talent on this platform is outstanding. I've completed multiple projects and will definitely be back for more.",
    name: "Jennifer Lee",
    role: "Marketing Director",
    avatar: "/person4.png",
  },
];

// Data for popular tags in hero section
export const popularTags = [
  "Web Design",
  "Logo Design",
  "Content Writing",
  "App Development",
  "Marketing",
];
