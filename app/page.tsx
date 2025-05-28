'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { ArrowRight, Shield, Menu, X } from 'lucide-react';

// Lazy load feature sections
const FeaturesSection = dynamic(() => import('@/components/landing/features-section'), {
  loading: () => <div className="py-20 bg-white"><div className="container mx-auto px-4 animate-pulse"><div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-12"></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><div className="h-48 bg-gray-100 rounded-lg"></div><div className="h-48 bg-gray-100 rounded-lg"></div><div className="h-48 bg-gray-100 rounded-lg"></div></div></div></div>
});

const CTASection = dynamic(() => import('@/components/landing/cta-section'));
const FooterSection = dynamic(() => import('@/components/landing/footer-section'));

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900 sm:inline hidden">HateSpeech Guard(FE21A316)</span>
            <span className="text-xl font-semibold text-gray-900 sm:hidden inline">HS Guard</span>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/data-input">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="container mx-auto px-4 py-2 flex flex-col gap-2">
              <Link href="/dashboard" className="w-full">
                <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
              </Link>
              <Link href="/data-input" className="w-full">
                <Button className="w-full justify-start">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Detect and Prevent Hate Speech with
            <span className="text-blue-600"> AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Advanced machine learning algorithms to identify and analyze harmful content,
            helping create safer online spaces.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/data-input">
              <Button size="lg" className="gap-2">
                Try it Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Suspense fallback={
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="h-48 bg-gray-100 rounded-lg"></div>
              <div className="h-48 bg-gray-100 rounded-lg"></div>
              <div className="h-48 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      }>
        <FeaturesSection />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={
        <div className="py-20 bg-blue-600">
          <div className="container mx-auto px-4 animate-pulse">
            <div className="h-8 bg-blue-500 rounded w-96 mx-auto mb-6"></div>
            <div className="h-4 bg-blue-500 rounded w-64 mx-auto"></div>
          </div>
        </div>
      }>
        <CTASection />
      </Suspense>

      {/* Footer */}
      <Suspense fallback={
        <div className="bg-gray-900 py-12">
          <div className="container mx-auto px-4 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="h-32 bg-gray-800 rounded"></div>
              <div className="h-32 bg-gray-800 rounded"></div>
              <div className="h-32 bg-gray-800 rounded"></div>
              <div className="h-32 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      }>
        <FooterSection />
      </Suspense>
    </div>
  );
}


