
import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/home/Footer';
import { motion } from 'framer-motion';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactForm from '@/components/contact/ContactForm';
import LocationMap from '@/components/contact/LocationMap';

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow pt-24 pb-16 px-4 md:px-6 lg:px-8">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Contactez-nous</h1>
          
          <div className="grid md:grid-cols-5 gap-8">
            <ContactInfo />
            <ContactForm />
          </div>
          
          <LocationMap />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
