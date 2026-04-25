import {
  Camera,
  Clapperboard,
  Globe,
  Megaphone,
  Palette,
  Search,
  Video,
  WandSparkles
} from 'lucide-react';

export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' }
];

export const digitalServices = [
  {
    title: 'Website Development',
    description: 'High-performance business websites engineered to convert traffic into qualified leads.',
    icon: Globe
  },
  {
    title: 'Landing Pages',
    description: 'Campaign-driven landing pages with optimized UX and conversion-focused structure.',
    icon: WandSparkles
  },
  {
    title: 'SEO',
    description: 'Technical and local SEO strategies to rank your brand for intent-rich searches in São Paulo.',
    icon: Search
  },
  {
    title: 'Paid Traffic',
    description: 'Google Ads and Meta Ads operations built for measurable ROI and scale.',
    icon: Megaphone
  },
  {
    title: 'Branding & Identity',
    description: 'Positioning, visual systems, and messaging designed for market differentiation.',
    icon: Palette
  }
];

export const productionServices = [
  {
    title: 'Video Production',
    description: 'Cinematic brand videos and campaign content tailored for digital performance.',
    icon: Video
  },
  {
    title: 'Commercial Photography',
    description: 'Premium still photography for campaigns, product showcases, and brand storytelling.',
    icon: Camera
  },
  {
    title: 'Audiovisual Production',
    description: 'End-to-end creative production from concept and scripting to on-set execution.',
    icon: Clapperboard
  },
  {
    title: 'Editing & Post',
    description: 'Fast-paced post-production, color grading, sound design, and versioning for every channel.',
    icon: WandSparkles
  }
];

export const processSteps = [
  { step: '01', title: 'Discovery', description: 'We map your goals, market, and growth bottlenecks.' },
  { step: '02', title: 'Strategy', description: 'A tailored growth blueprint connecting creative and performance.' },
  { step: '03', title: 'Production', description: 'Design, content, code, and media production executed at speed.' },
  { step: '04', title: 'Delivery', description: 'We launch, integrate, and QA every customer touchpoint.' },
  { step: '05', title: 'Growth', description: 'Continuous optimization driven by analytics and live campaign data.' }
];

export const caseStudies = [
  {
    brand: 'Fintech SP',
    result: '+420% Leads in 90 days',
    details: 'Full-funnel strategy combining landing pages, Google Ads, and Meta remarketing for a fintech startup.'
  },
  {
    brand: 'Fashion Franchise',
    result: '6.8x ROAS on Meta Ads',
    details: 'Creative production + paid traffic operation scaling a fashion brand across São Paulo.'
  },
  {
    brand: 'Clinica Vitta',
    result: '#1 Local SEO ranking',
    details: 'Technical SEO and content strategy that captured high-intent local search for a medical clinic.'
  }
];

export const trustItems = [
  '150+ websites delivered',
  'Google Partner certified',
  '1.2K+ video assets produced',
  'São Paulo headquartered'
];

export const faqs = [
  {
    question: 'How long does a typical project take?',
    answer: 'Website projects typically launch within 3–4 weeks. Campaign strategy and paid media go live within 7–10 business days after onboarding.'
  },
  {
    question: 'Do you work with companies outside São Paulo?',
    answer: 'Yes. While we are based in São Paulo, we serve clients across Brazil and internationally for digital and production services.'
  },
  {
    question: 'What makes HSB Company different from other agencies?',
    answer: 'We combine performance marketing and premium audiovisual production under one roof — no handoffs, no miscommunication, just one team executing end-to-end.'
  },
  {
    question: 'How do you measure campaign success?',
    answer: 'We track pipeline metrics: qualified leads, cost-per-acquisition, ROAS, and revenue attributed — not vanity metrics.'
  }
];
