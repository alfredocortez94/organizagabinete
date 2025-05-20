
import React from "react";

const ContactHero = () => {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900 dark:text-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-3 mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text dark:from-blue-400 dark:to-indigo-400">
              Entre em Contato
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl">
            Estamos à disposição para ajudar seu gabinete a ter uma gestão mais eficiente
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
