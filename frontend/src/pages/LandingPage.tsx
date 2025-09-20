// frontend/src/pages/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentArrowUpIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  LanguageIcon
} from '@heroicons/react/24/solid';
import Header from '../components/Header';
// Import the 'Variants' type from framer-motion
import { motion, type Variants } from 'framer-motion';

// --- Re-usable Animation Variants ---
// Apply the 'Variants' type to your constants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    // The error was here: TypeScript inferred `type` as `string`
    // but by using the 'Variants' type, it's now correctly checked.
    transition: { type: 'spring', stiffness: 100 },
  },
};

const features = [
  {
    name: 'In-Depth Risk Analysis',
    description: 'Our AI reads, segments, and assigns a risk level to every clause in your document, creating a clear visual heatmap.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Persona-Tailored Explanations',
    description: 'Get explanations tailored to your specific situation, whether you\'re a student, small business, or senior citizen.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Multilingual & Accessible',
    description: 'Understand your documents in your native language with AI-powered translation and audio narration.',
    icon: LanguageIcon,
  },
];

const testimonials = [
  {
    quote: "LexiGuard turned a 40-page rental agreement into something I could understand in 5 minutes. The risk heatmap is a game-changer.",
    name: "Sanath Shetty",
    title: "Student Renter",
  },
  {
    quote: "As a freelancer, I deal with contracts constantly. This tool gives me the confidence to sign, knowing I haven't missed a critical clause.",
    name: "Varun Kumar",
    title: "Small Business Owner",
  },
  {
    quote: "The 'What If?' chat feature is incredible. I could ask specific questions about my loan document and get instant, clear answers.",
    name: "Thilak Shastri",
    title: "First-time Homebuyer",
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-gray overflow-x-hidden">
      <Header />
      <main>
        {/* --- Hero Section --- */}
        <section className="relative bg-white pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="absolute inset-0 bg-grid-gray-200 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.h1 variants={itemVariants} className="text-4xl font-extrabold text-brand-blue sm:text-5xl md:text-6xl font-display tracking-tight">
                Clarity in Every Clause.
              </motion.h1>
              <motion.h1 variants={itemVariants} className="text-4xl font-extrabold text-brand-green sm:text-5xl md:text-6xl font-display tracking-tight mt-2">
                Confidence in Every Contract.
              </motion.h1>
              <motion.p variants={itemVariants} className="mt-6 max-w-2xl mx-auto text-lg text-brand-text sm:text-xl">
                Stop signing documents you don't understand. LexiGuard is your AI-powered guardian, transforming dense legal jargon into simple, actionable advice.
              </motion.p>
              <motion.div variants={itemVariants} className="mt-8 flex justify-center gap-x-4">
                <Link
                  to="/dashboard"
                  className="inline-block px-8 py-4 text-base font-semibold rounded-lg text-white bg-brand-green hover:bg-opacity-90 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Analyze a Document Now
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <section className="py-16 bg-brand-gray sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-brand-blue font-display tracking-tight">
                A Simple Path to Legal Clarity
              </h2>
              <p className="mt-4 text-lg text-brand-text">In three simple steps, gain complete understanding and confidence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { icon: DocumentArrowUpIcon, title: "1. Upload Your Document", desc: "Securely upload any legal file—PDF, image, or text. Our AI gets to work instantly." },
                { icon: SparklesIcon, title: "2. Get AI-Powered Insights", desc: "Receive a color-coded risk report, plain-language summaries, and a wellness score." },
                { icon: ShieldCheckIcon, title: "3. Act with Confidence", desc: "Use the 'What If?' chat to resolve your doubts and sign your document with peace of mind." },
              ].map((step, index) => (
                <motion.div 
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-green text-white mx-auto shadow-lg">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-brand-blue font-display">{step.title}</h3>
                  <p className="mt-2 text-brand-text">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Features Section with Glassmorphism --- */}
        <section className="py-16 bg-white sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
               <h2 className="text-base text-brand-green font-semibold tracking-wide uppercase">Core Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-brand-blue sm:text-4xl font-display">
                An Assistant That Understands You
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div 
                    key={feature.name} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-200/50"
                  >
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-brand-green text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 text-lg font-bold text-brand-blue">{feature.name}</h3>
                    <p className="mt-2 text-base text-brand-text">{feature.description}</p>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
        
        {/* --- Testimonials Section --- */}
        <section className="py-16 bg-brand-gray sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-brand-blue font-display tracking-tight">Trusted by Users Like You</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="bg-white p-8 rounded-2xl shadow-lg"
                        >
                            <p className="text-brand-text italic">"{testimonial.quote}"</p>
                            <div className="mt-4">
                                <p className="font-bold text-brand-blue">{testimonial.name}</p>
                                <p className="text-sm text-brand-green">{testimonial.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* --- Final CTA Section --- */}
        <section className="bg-white">
            <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-brand-blue sm:text-4xl font-display">
                    <span className="block">Ready to demystify your documents?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-brand-text">
                    Take control of your legal agreements today. Get started for free and experience true peace of mind.
                </p>
                <Link
                    to="/dashboard"
                    className="mt-8 w-full inline-flex items-center justify-center px-8 py-4 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-brand-green hover:bg-opacity-90 sm:w-auto transform hover:-translate-y-1 transition-all duration-300"
                >
                    Get Started with LexiGuard
                </Link>
            </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;