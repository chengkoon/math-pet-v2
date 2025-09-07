'use client';

import Link from 'next/link';
import { Heart, Shield, BookOpen, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-teal-400 mr-2" />
              <h3 className="text-xl font-bold">MathPet</h3>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Making math learning fun and engaging for primary school students 
              across Singapore through gamification and interactive experiences.
            </p>
            <div className="flex items-center text-gray-300 text-sm">
              <MapPin className="h-4 w-4 mr-2 text-teal-400" />
              Singapore
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-teal-400 text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/practice"
                  className="text-gray-300 hover:text-teal-400 text-sm transition-colors"
                >
                  Practice
                </Link>
              </li>
              <li>
                <Link
                  href="/home"
                  className="text-gray-300 hover:text-teal-400 text-sm transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/pet"
                  className="text-gray-300 hover:text-teal-400 text-sm transition-colors"
                >
                  My Pet
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Learning</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/topics"
                  className="text-gray-300 hover:text-teal-400 text-sm transition-colors"
                >
                  Math Topics
                </Link>
              </li>
              <li>
                <Link
                  href="/levels"
                  className="text-gray-300 hover:text-teal-400 text-sm transition-colors"
                >
                  Grade Levels
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-gray-300 hover:text-teal-400 text-sm transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-gray-300 hover:text-teal-400 text-sm transition-colors"
                >
                  Parent Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="mr-2 h-5 w-5 text-teal-400" />
              Support
            </h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="h-4 w-4 mr-2 text-teal-400" />
                <a
                  href="mailto:support@mathpet.sg"
                  className="hover:text-teal-400 transition-colors"
                >
                  support@mathpet.sg
                </a>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="h-4 w-4 mr-2 text-teal-400" />
                <span>+65 1234 5678</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-teal-400 text-sm transition-colors block mb-2"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-teal-400 text-sm transition-colors block"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 MathPet. All rights reserved.
            </p>
            
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-400 text-sm flex items-center">
                Made with{' '}
                <Heart className="mx-1 h-4 w-4 text-red-500 fill-current" />{' '}
                in Singapore
              </span>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              MathPet is aligned with Singapore's Ministry of Education (MOE) Primary Mathematics syllabus. 
              All content is reviewed by certified math educators.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};