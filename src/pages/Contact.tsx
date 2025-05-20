
import React from "react";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactFooter from "@/components/contact/ContactFooter";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <ContactHeader />
      <ContactHero />
      
      {/* Conteúdo Principal */}
      <section className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informações de Contato */}
          <div className="md:col-span-1">
            <ContactInfo />
          </div>

          {/* Formulário de Contato */}
          <div className="md:col-span-2">
            <ContactForm />
          </div>
        </div>
      </section>
      
      <ContactFooter />
    </div>
  );
};

export default Contact;
