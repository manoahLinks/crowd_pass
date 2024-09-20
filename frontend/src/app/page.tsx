"use client"

import Footer from "@/components/landing-page/footer";
import AboutSection from "@/components/landing-page/sections/about-section";
import FaqSection from "@/components/landing-page/sections/faq-section";
import FeaturesSection from "@/components/landing-page/sections/features-section";
import HeroSection from "@/components/landing-page/sections/hero-section";
import HiwSection from "@/components/landing-page/sections/hiw-section";
import TestimonialsSection from "@/components/landing-page/sections/testimonials-section";
import UpdateSection from "@/components/landing-page/sections/update-section";

export default function Home() {
  return (
    <div className='overflow-x-hidden'>
    <HeroSection />
    <UpdateSection />
    <AboutSection />
    <FeaturesSection />
    <HiwSection />
    <FaqSection />
    <TestimonialsSection />
    <Footer />
</div>
  );
}
