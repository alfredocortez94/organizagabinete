
import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeatureCards from "@/components/landing/FeatureCards";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const PublicHome = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeatureCards />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default PublicHome;
