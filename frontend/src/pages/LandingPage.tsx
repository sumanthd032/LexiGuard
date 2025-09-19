import React from 'react';
import { Link } from 'react-router-dom'; 
import {  
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon, 
  LanguageIcon 
} from '@heroicons/react/24/solid';
import Header from '../components/Header';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'In-Depth Risk Analysis',
    description: 'Our AI reads through your legal documents, identifies key clauses, and assigns a risk level—Neutral, Attention, or Critical.',
    icon: DocumentTextIcon, // Changed to solid
  },
  {
    name: 'Persona-Tailored Explanations',
    description: 'Get explanations tailored to your specific situation, whether you\'re a student, a small business owner, or a senior citizen.',
    icon: ChatBubbleLeftRightIcon, // Changed to solid
  },
  {
    name: 'Multilingual Support',
    description: 'Understand your documents in your native language. Our AI translates its analysis into multiple languages, including Hindi, Spanish, and more.',
    icon: LanguageIcon, // Changed to solid
  },
];

const AnimatedShield = () => (
  <motion.svg
    viewBox="0 0 200 220"
    className="w-full h-auto"
    initial="initial"
    animate="animate"
    variants={{
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
    }}
  >
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <motion.path
      d="M100 0 L195 40 L195 140 C195 190 100 220 100 220 C100 220 5 190 5 140 L5 40 Z"
      fill="url(#shieldGradient)"
      stroke="#10B981"
      strokeWidth="2"
      variants={{ initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } } }}
    />
    <motion.path
      d="M70 110 L90 130 L130 90"
      stroke="white"
      strokeWidth="12"
      strokeLinecap="round"
      fill="none"
      variants={{ initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1, transition: { duration: 0.8, ease: "easeOut", delay: 1 } } }}
      style={{ filter: "url(#glow)" }}
    />
  </motion.svg>
);

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <main>
        <div className="relative pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
          <div className="mx-auto max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                <motion.div 
                  className="lg:py-24"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-brand-blue sm:mt-5 sm:text-5xl lg:mt-6 xl:text-6xl font-display">
                    <span className="block">Clarity in Every Clause.</span>
                    <span className="block text-brand-green">Confidence in Every Contract.</span>
                  </h1>
                  <p className="mt-3 text-base text-brand-text sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    LexiGuard is your personal contract guardian. Upload any legal document, and our generative AI will demystify the jargon, highlight risks, and answer your questions in plain language.
                  </p>
                  <div className="mt-10 sm:mt-12">
                    <Link
                      to="/dashboard"
                      className="inline-block px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-green hover:bg-opacity-90 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                    >
                      Get Started
                    </Link>
                  </div>
                </motion.div>
              </div>
              <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative flex items-center justify-center">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                  <AnimatedShield />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-16 bg-white sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-brand-green font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-brand-blue sm:text-4xl font-display">
                Everything you need to sign with confidence
              </p>
            </div>
            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                {features.map((feature, index) => (
                  <motion.div 
                    key={feature.name} 
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-brand-green text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-brand-blue">{feature.name}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-brand-text">{feature.description}</dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;