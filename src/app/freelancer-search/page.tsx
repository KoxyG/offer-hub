"use client"

import { useState, useEffect } from "react"
import SearchBar from "@/components/freelancer-search/search-bar"
import FiltersSection from "@/components/freelancer-search/filters-section"
import FreelancerCard from "@/components/freelancer-search/freelancer-card"
import SortingOptions from "@/components/freelancer-search/sorting-options"
import { Header } from "@/components/freelancer-search/header"

export interface Freelancer {
  id: number
  name: string
  title: string
  rating: number
  reviewCount: number
  location: string
  hourlyRate: number
  description: string
  skills: string[]
  projectsCompleted: number
  responseTime: string
  category: string
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [ratingFilters, setRatingFilters] = useState({
    fiveStars: false,
    fourStars: false,
    threeStars: false,
    twoStars: false,
    oneStar: false,
  })
  const [hourlyRate, setHourlyRate] = useState(50)
  const [selectedLocation, setSelectedLocation] = useState("Any location")

  const [sortBy, setSortBy] = useState("Recommended")
  const [viewType, setViewType] = useState("grid")

  const [matchingCount, setMatchingCount] = useState(12)

  const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancer[]>([])

  const freelancers: Freelancer[] = [
    {
      id: 1,
      name: "Alex Morgan",
      title: "UI/UX Designer",
      rating: 4,
      reviewCount: 127,
      location: "New York, USA",
      hourlyRate: 45,
      description:
        "Experienced UI/UX designer with a passion for creating intuitive and visually appealing interfaces. I specialize in user-centered design and have worked with clients across various industries.",
      skills: ["UI Design", "UX Research", "Figma", "Adobe XD", "Prototyping"],
      projectsCompleted: 78,
      responseTime: "Under 1 hour",
      category: "design",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      title: "Full Stack Developer",
      rating: 4,
      reviewCount: 89,
      location: "London, UK",
      hourlyRate: 65,
      description:
        "Full stack developer with 6+ years of experience building scalable web applications. I'm proficient in both frontend and backend technologies and can help with your entire development process.",
      skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript", "AWS"],
      projectsCompleted: 56,
      responseTime: "1-2 hours",
      category: "development",
    },
    {
      id: 3,
      name: "Michael Chen",
      title: "Digital Marketing Specialist",
      rating: 4,
      reviewCount: 64,
      location: "San Francisco, USA",
      hourlyRate: 55,
      description:
        "Results-driven digital marketing specialist with expertise in SEO, content marketing, and social media strategies. I help businesses increase their online visibility and drive conversions.",
      skills: ["SEO", "SEM", "Content Marketing", "Social Media", "Google Analytics"],
      projectsCompleted: 42,
      responseTime: "Under 3 hours",
      category: "marketing",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      title: "Brand Strategist",
      rating: 5,
      reviewCount: 103,
      location: "Miami, USA",
      hourlyRate: 70,
      description:
        "Strategic brand consultant with a background in marketing and design. I help businesses define their brand identity, messaging, and positioning to stand out in competitive markets.",
      skills: ["Brand Strategy", "Market Research", "Brand Identity", "Positioning", "Competitive Analysis"],
      projectsCompleted: 62,
      responseTime: "Same day",
      category: "marketing",
    },
    {
      id: 5,
      name: "David Kim",
      title: "Mobile App Developer",
      rating: 4,
      reviewCount: 76,
      location: "Toronto, Canada",
      hourlyRate: 60,
      description:
        "Experienced mobile app developer specializing in iOS and Android applications. I create user-friendly, high-performance apps that deliver exceptional user experiences.",
      skills: ["Swift", "Kotlin", "React Native", "Flutter", "Firebase", "App Store Optimization"],
      projectsCompleted: 35,
      responseTime: "2-3 hours",
      category: "development",
    },
    {
      id: 6,
      name: "Jessica Lee",
      title: "Product Designer",
      rating: 5,
      reviewCount: 91,
      location: "Berlin, Germany",
      hourlyRate: 50,
      description:
        "Product designer with expertise in creating user-centered digital products. I combine UX research, visual design, and prototyping to create products that users love.",
      skills: ["Product Design", "User Research", "Wireframing", "Prototyping", "Design Systems"],
      projectsCompleted: 47,
      responseTime: "Under 1 hour",
      category: "design",
    },
    {
      id: 7,
      name: "Robert Wilson",
      title: "Financial Consultant",
      rating: 4,
      reviewCount: 58,
      location: "Chicago, USA",
      hourlyRate: 85,
      description:
        "Financial consultant with expertise in business planning, financial analysis, and investment strategies. I help businesses optimize their financial operations and make informed decisions.",
      skills: [
        "Financial Analysis",
        "Business Planning",
        "Investment Strategy",
        "Risk Management",
        "Financial Modeling",
      ],
      projectsCompleted: 31,
      responseTime: "Same day",
      category: "business",
    },
    {
      id: 8,
      name: "Elena Petrova",
      title: "Smart Contract Developer",
      rating: 5,
      reviewCount: 112,
      location: "Moscow, Russia",
      hourlyRate: 75,
      description:
        "Blockchain specialist with 4+ years of experience developing secure smart contracts. Expert in Solidity, Cairo, and Soroban development with a focus on DeFi applications.",
      skills: ["Solidity", "Cairo", "Soroban", "DeFi", "Web3.js", "Smart Contracts"],
      projectsCompleted: 43,
      responseTime: "Under 2 hours",
      category: "development",
    },
    {
      id: 9,
      name: "Carlos Mendoza",
      title: "Blockchain Architect",
      rating: 4,
      reviewCount: 87,
      location: "Buenos Aires, Argentina",
      hourlyRate: 90,
      description:
        "Blockchain architect specializing in designing robust and scalable decentralized applications. I help startups and enterprises implement secure blockchain solutions tailored to their needs.",
      skills: ["Blockchain Architecture", "Rust", "Stellar", "StarkNet", "System Design", "Security Auditing"],
      projectsCompleted: 39,
      responseTime: "Same day",
      category: "development",
    },
    {
      id: 10,
      name: "Aisha Khan",
      title: "Data Scientist",
      rating: 5,
      reviewCount: 79,
      location: "Dubai, UAE",
      hourlyRate: 65,
      description:
        "Data scientist with expertise in machine learning and predictive analytics. I transform complex data into actionable insights that drive business decisions and innovation.",
      skills: ["Machine Learning", "Python", "Data Visualization", "Statistical Analysis", "NLP"],
      projectsCompleted: 28,
      responseTime: "Under 3 hours",
      category: "data",
    },
    {
      id: 11,
      name: "Hiroshi Tanaka",
      title: "Cryptography Expert",
      rating: 5,
      reviewCount: 94,
      location: "Tokyo, Japan",
      hourlyRate: 95,
      description:
        "Cryptography specialist with a background in mathematics and computer science. I develop secure cryptographic protocols and systems for blockchain platforms and financial institutions.",
      skills: ["Cryptography", "Zero-Knowledge Proofs", "Rust", "C++", "Security Analysis"],
      projectsCompleted: 51,
      responseTime: "1-2 hours",
      category: "security",
    },
    {
      id: 12,
      name: "Sophia Garcia",
      title: "Web3 UX Designer",
      rating: 4,
      reviewCount: 68,
      location: "Barcelona, Spain",
      hourlyRate: 55,
      description:
        "UX designer specializing in web3 applications. I create intuitive user experiences for decentralized applications, focusing on reducing complexity while maintaining functionality.",
      skills: ["Web3 UX", "Blockchain UI", "User Research", "Design Systems", "Figma", "DApp Design"],
      projectsCompleted: 33,
      responseTime: "Under 1 hour",
      category: "design",
    },
  ]

  useEffect(() => {
    const initialSorted = sortFreelancers([...freelancers], "Recommended")
    setFilteredFreelancers(initialSorted)
    setMatchingCount(initialSorted.length)
  }, [])

  const sortFreelancers = (freelancers: Freelancer[], sortOption: string) => {
    const sorted = [...freelancers]
    
    switch (sortOption) {
      case "Most Recent":
        return sorted.sort((a, b) => b.id - a.id)
      case "Highest Rated":
        return sorted.sort((a, b) => {
            if (b.rating === a.rating) {
            return b.reviewCount - a.reviewCount
          }
          return b.rating - a.rating
        })
      case "Lowest Rate":
        return sorted.sort((a, b) => a.hourlyRate - b.hourlyRate)
      case "Highest Rate":
        return sorted.sort((a, b) => b.hourlyRate - a.hourlyRate)
      default:
        return sorted.sort((a, b) => {
          const scoreA = a.rating * Math.log10(a.reviewCount + 1)
          const scoreB = b.rating * Math.log10(b.reviewCount + 1)
          return scoreB - scoreA
        })
    }
  }

  const resetAllFilters = () => {
    setSelectedCategory("")
    setRatingFilters({
      fiveStars: false,
      fourStars: false,
      threeStars: false,
      twoStars: false,
      oneStar: false,
    })
    setHourlyRate(50)
    setSelectedLocation("Any location")
  }

  const handleSearch = (query: string) => {
    console.log("Searching for:", query)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const filtered = freelancers.filter((freelancer) => {
      if (selectedCategory && freelancer.category !== selectedCategory) {
        return false
      }

      if (selectedLocation !== "Any location") {
        const normalizedLocation = freelancer.location.toLowerCase();
        const normalizedSelection = selectedLocation.toLowerCase()
          .replace("united kingdom", "uk")
          .replace("united states", "usa");
          
        if (!normalizedLocation.includes(normalizedSelection) && 
            !(normalizedSelection === "usa" && normalizedLocation.includes("us")) &&
            !(normalizedSelection === "europe" && 
              ["germany", "spain", "france", "italy", "russia", "uk"].some(country => 
                normalizedLocation.includes(country)
              ))
           ) {
          return false;
        }
      }

      const maxRateValue = 20 + (hourlyRate / 100) * (80 - 20)
      if (freelancer.hourlyRate > maxRateValue) {
        return false
      }
      
      const anyRatingFilterSelected = Object.values(ratingFilters).some((value) => value)
      if (anyRatingFilterSelected) {
        if (ratingFilters.fiveStars && freelancer.rating === 5) return true
        if (ratingFilters.fourStars && freelancer.rating === 4) return true
        if (ratingFilters.threeStars && freelancer.rating === 3) return true
        if (ratingFilters.twoStars && freelancer.rating === 2) return true
        if (ratingFilters.oneStar && freelancer.rating === 1) return true
        return false
      }

      return true
    })

    const sortedAndFiltered = sortFreelancers(filtered, sortBy)
    setFilteredFreelancers(sortedAndFiltered)
    setMatchingCount(sortedAndFiltered.length)
  }, [selectedCategory, ratingFilters, hourlyRate, selectedLocation, sortBy])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-gradient-to-r from-slate-900 to-teal-700 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-left">Find Talented Freelancers</h1>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gray-50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 shrink-0">
              <FiltersSection
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                ratingFilters={ratingFilters}
                setRatingFilters={setRatingFilters}
                hourlyRate={hourlyRate}
                setHourlyRate={setHourlyRate}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                resetAllFilters={resetAllFilters}
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">{matchingCount} freelancers available</h2>
                <SortingOptions
                  sortOption={sortBy}
                  setSortOption={setSortBy}
                />
              </div>

              <div className="space-y-6">
                {filteredFreelancers.map((freelancer) => (
                  <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

