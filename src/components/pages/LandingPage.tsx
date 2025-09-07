'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { 
  Brain, 
  BookOpen, 
  Award, 
  Lightbulb, 
  Sparkles, 
  TrendingUp,
  Users,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LandingPage() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'MathPet - Make Math Fun';
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Adaptive questions that match your skill level and learning pace.',
    },
    {
      icon: Target,
      title: 'Gamified Experience',
      description: 'Level up your virtual pet as you master math concepts.',
    },
    {
      icon: BookOpen,
      title: 'Singapore Curriculum',
      description: 'Aligned with MOE primary school math syllabus.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Detailed analytics to monitor learning progress.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Active Students' },
    { number: '50,000+', label: 'Questions Solved' },
    { number: '95%', label: 'Improvement Rate' },
    { number: '500+', label: 'Schools Using' },
  ];

  const testimonials = [
    {
      quote: "My daughter loves practicing math with MathPet. Her grades improved significantly!",
      author: "Sarah Lim",
      role: "Parent"
    },
    {
      quote: "The gamification makes learning fun. Students are more engaged than ever.",
      author: "Teacher Chen",
      role: "Primary 4 Math Teacher"
    },
    {
      quote: "I look forward to math practice every day now. My pet is already level 5!",
      author: "Marcus Tan",
      role: "Primary 5 Student"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Modern Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-600 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-600/20 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            {/* Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                Trusted by 10,000+ students across Singapore
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Making Math
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Fun & Easy
                </span>
                for Primary Students
              </h1>
              
              <p className="text-teal-100 text-lg lg:text-xl mb-8 max-w-2xl">
                Transform math learning with our AI-powered platform that combines interactive problems 
                with virtual pets. Watch your child's confidence soar as they master mathematical concepts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <>
                    <Link
                      href="/practice"
                      className="group px-8 py-4 bg-white text-teal-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start Practicing
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/home"
                      className="px-8 py-4 bg-teal-800/50 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-teal-800/70 transition-all duration-200 flex items-center justify-center"
                    >
                      My Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth"
                      className="group px-8 py-4 bg-white text-teal-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center"
                    >
                      Get Started Free
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/auth"
                      className="px-8 py-4 bg-teal-800/50 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-teal-800/70 transition-all duration-200 flex items-center justify-center"
                    >
                      Teacher Login
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl">
                  <Brain className="h-48 w-48 text-white opacity-90" />
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-teal-900 rounded-full px-4 py-2 font-bold text-sm transform rotate-12 shadow-lg animate-bounce">
                    Level Up!
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-orange-400 text-white rounded-full px-4 py-2 font-bold text-sm transform -rotate-12 shadow-lg animate-pulse">
                    +100 XP
                  </div>
                  <div className="absolute top-10 -left-6 bg-purple-400 text-white rounded-full px-3 py-1 font-bold text-xs transform rotate-45 shadow-lg">
                    🎯
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Students Love MathPet
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our platform combines proven educational techniques with modern gamification 
              to create an engaging learning experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 group">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-200 transition-colors">
                  <feature.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How MathPet Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Simple steps to start your math learning journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choose Your Pet",
                description: "Select and customize your virtual math companion",
                icon: "🐱"
              },
              {
                step: "2", 
                title: "Solve Problems",
                description: "Practice math questions aligned with Singapore curriculum",
                icon: "📝"
              },
              {
                step: "3",
                title: "Watch Growth",
                description: "Your pet levels up as you master new concepts",
                icon: "📈"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                  {item.icon}
                </div>
                <div className="text-sm font-semibold text-teal-600 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Parents & Teachers Say
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Real feedback from our MathPet community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-600 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-20">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-pattern opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Lightbulb className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Math Learning?
          </h2>
          <p className="text-teal-100 text-lg lg:text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of Singapore primary school students who are improving their math skills 
            while having fun with their virtual pets. Start your mathematical adventure today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link
                  href="/auth"
                  className="group px-8 py-4 bg-white text-teal-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center"
                >
                  Start Your Math Adventure
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth"
                  className="px-8 py-4 bg-teal-800/50 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-teal-800/70 transition-all duration-200 flex items-center justify-center"
                >
                  Teachers: Join Free
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/practice"
                  className="group px-8 py-4 bg-white text-teal-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center"
                >
                  Continue Learning
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/home"
                  className="px-8 py-4 bg-teal-800/50 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-teal-800/70 transition-all duration-200 flex items-center justify-center"
                >
                  View Progress
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pet Showcase for Logged-in Users */}
      {user && (
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
                  Meet Your <span className="text-teal-600">Math Buddy</span>
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Your virtual pet grows stronger and evolves as you practice math. 
                  Feed it with knowledge, unlock new abilities, and watch it transform!
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Level up system</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Unlock new pets</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Earn rewards</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Share progress</span>
                  </div>
                </div>
                
                <Link
                  href="/pet"
                  className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl shadow hover:bg-teal-700 transform hover:-translate-y-1 transition-all duration-200"
                >
                  <Award className="mr-2 h-5 w-5" />
                  Visit My Pet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              
              {/* Pet Visual Placeholder */}
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center shadow-xl">
                    <div className="text-6xl">🐾</div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-green-400 text-white rounded-full px-3 py-1 font-bold text-sm shadow-lg">
                    Level {user.petLevel || 1}
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-blue-400 text-white rounded-full px-3 py-1 font-bold text-sm shadow-lg">
                    {user.stars || 0} ⭐
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Trusted by Singapore's Best Schools
            </h3>
            <p className="text-gray-600">
              Educational institutions across Singapore trust MathPet for math excellence
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {[
              "Primary School A",
              "International School B", 
              "Methodist School C",
              "Catholic School D"
            ].map((school, index) => (
              <div key={index} className="text-gray-500 font-medium text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-3 mx-auto flex items-center justify-center">
                  <BookOpen className="h-8 w-8" />
                </div>
                {school}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}