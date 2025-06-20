
import React, { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeatureCards from "@/components/landing/FeatureCards";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const PublicHome = () => {
  // Adiciona classes de animação ao scroll
  useEffect(() => {
    const handleScrollAnimation = () => {
      const animateElements = document.querySelectorAll('.feature-card, section h2, section p, .animate-on-scroll');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            if (entry.target.classList.contains('feature-card')) {
              entry.target.classList.add('opacity-100');
            }
            // Parar de observar depois que a animação é aplicada
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      });
      
      animateElements.forEach(element => {
        observer.observe(element);
      });
      
      // Limpar o observer quando o componente for desmontado
      return () => {
        animateElements.forEach(element => {
          observer.unobserve(element);
        });
      };
    };
    
    // Iniciar as animações após um pequeno delay para garantir que o DOM está pronto
    setTimeout(handleScrollAnimation, 100);
    
    // Adicionar efeitos de hover nos elementos
    const addHoverEffects = () => {
      const cards = document.querySelectorAll('.apple-card, .feature-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.classList.add('scale-[1.02]');
        });
        card.addEventListener('mouseleave', () => {
          card.classList.remove('scale-[1.02]');
        });
      });
    };
    
    addHoverEffects();
    
    // Limpar os event listeners quando o componente for desmontado
    return () => {
      const cards = document.querySelectorAll('.apple-card, .feature-card');
      cards.forEach(card => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <div className="mt-[-120px] md:mt-[-100px] lg:mt-[-80px]"> {/* Margem negativa responsiva */}
        <FeaturesSection />
        <FeatureCards />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default PublicHome;
