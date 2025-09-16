import React from 'react';
import { ShieldCheckIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, LanguageIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header'; 

const features = [
  {
    name: 'In-Depth Risk Analysis',
    description: 'Our AI reads through your legal documents, identifies key clauses, and assigns a risk level—Neutral, Attention, or Critical.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Persona-Tailored Explanations',
    description: 'Get explanations tailored to your specific situation, whether you\'re a student, a small business owner, or a senior citizen.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Multilingual Support',
    description: 'Understand your documents in your native language. Our AI translates its analysis into multiple languages, including Hindi, Spanish, and more.',
    icon: LanguageIcon,
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="bg-brand-gray min-h-screen">
      <Header />
      <main>
        <div className="pt-10 bg-brand-gray sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
          <div className="mx-auto max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                <div className="lg:py-24">
                  <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-brand-blue sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl font-display">
                    <span className="block">Clarity in Every Clause.</span>
                    <span className="block text-brand-green">Confidence in Every Contract.</span>
                  </h1>
                  <p className="mt-3 text-base text-brand-text sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    LexiGuard is your personal contract guardian. Upload any legal document, and our generative AI will demystify the jargon, highlight risks, and answer your questions in plain language.
                  </p>
                  <div className="mt-10 sm:mt-12">
                    {/* This button would link to your AuthPage or App */}
                    <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-green hover:bg-opacity-90 md:py-4 md:text-lg md:px-10">
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                  {/* You can add a decorative image here */}
                  <ShieldCheckIcon className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none text-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-brand-green font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-brand-blue sm:text-4xl font-display">
                Everything you need to sign with confidence
              </p>
            </div>
            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                {features.map((feature) => (
                  <div key={feature.name} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-brand-green text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-brand-blue">{feature.name}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-brand-text">{feature.description}</dd>
                  </div>
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