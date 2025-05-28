import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Start Protecting Your Community Today
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join organizations worldwide using our platform to create safer online spaces.
        </p>
        <Link href="/data-input">
          <Button size="lg" variant="secondary" className="gap-2">
            Get Started Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
