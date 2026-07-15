export const defaultSettings = {
  id: 1,
  studio_name: 'Creatify Studios',
  logo_url: '',
  eyebrow: 'Creative Design Studio',
  hero_line_1: 'CRAFTING',
  hero_line_2: 'DIGITAL ICONS',
  hero_description: 'A South African creative studio shaping memorable brands, digital experiences and visual systems for ambitious businesses.',
  intro_title: 'DESIGN THAT SPEAKS VOLUMES',
  intro_body: 'We are a collective of passionate designers, strategists and creators dedicated to crafting exceptional brand experiences. From startups to enterprises, we partner with visionary clients to create designs that captivate, communicate and convert.',
  about_title: 'WHERE CREATIVITY MEETS STRATEGY',
  about_body: 'Our studio is a hub of innovation where designers, strategists and technologists come together to create extraordinary work. Every project connects bold creativity with clear business objectives.',
  location: 'Based in South Africa. Available worldwide.',
  email: 'hello@creatifystudios.co.za',
  phone: '',
  instagram: '#',
  linkedin: '#',
  behance: '#',
  primary_cta_label: 'Start a Project',
  primary_cta_url: '#contact',
  secondary_cta_label: 'View Projects',
  secondary_cta_url: '#work',
  footer_blurb: 'Elevating brands through strategic thinking, expressive design and digital excellence.'
}

export const defaultProjects = [
  {
    id: 'demo-lumin', slug: 'lumin-dental', title: 'Lumin Dental', category: 'Brand Identity & Graphics', year: '2026',
    excerpt: 'Brand reveal concepts and promotional materials tailored for a modern dental clinic.',
    description: 'A warm, contemporary visual language developed to help Lumin Dental communicate clinical confidence without losing its human touch.',
    image_url: '/projects/lumin.svg', featured: true, published: true, sort_order: 1
  },
  {
    id: 'demo-laomai', slug: 'laomai-dental', title: 'Laomai Dental', category: 'Print & Digital Layout', year: '2026',
    excerpt: 'Custom flyers, posters and clinic branding created to elevate the patient experience.',
    description: 'A practical and polished campaign system designed for consistent use across social posts, print and in-clinic communication.',
    image_url: '/projects/laomai.svg', featured: true, published: true, sort_order: 2
  },
  {
    id: 'demo-creatify', slug: 'creatify-collective', title: 'Creatify Collective', category: 'Web Design', year: '2026',
    excerpt: 'The flagship digital home for our creative collective, featuring seamless motion and UX.',
    description: 'A flexible portfolio platform balancing confident typography, playful studio personality and a powerful content management system.',
    image_url: '/projects/creatify.svg', featured: true, published: true, sort_order: 3
  },
  {
    id: 'demo-imperial', slug: 'imperial-ac', title: 'Imperial AC', category: 'Sports Branding', year: '2026',
    excerpt: 'A complete visual system giving an ambitious community football club a professional edge.',
    description: 'From matchday graphics and player profiles to kit concepts and a live website, the identity positions Imperial AC for its next stage of growth.',
    image_url: '/projects/imperial.svg', featured: true, published: true, sort_order: 4
  },
  {
    id: 'demo-elevate', slug: 'elevate-wellness', title: 'Elevate Wellness', category: 'Web Design', year: '2024',
    excerpt: 'Holistic wellness platform featuring immersive visuals and a seamless user journey.',
    description: 'A calming editorial website system designed to make wellness services easier to understand and explore.',
    image_url: '/projects/elevate.svg', featured: false, published: true, sort_order: 5
  },
  {
    id: 'demo-lumina', slug: 'lumina-tech', title: 'Lumina Tech Rebrand', category: 'Brand Identity', year: '2024',
    excerpt: 'Complete brand transformation for a growing SaaS company.',
    description: 'A modern identity system with a sharper voice, flexible digital assets and scalable guidelines.',
    image_url: '/projects/lumina.svg', featured: false, published: true, sort_order: 6
  },
  {
    id: 'demo-artisan', slug: 'artisan-coffee', title: 'Artisan Coffee Co.', category: 'Packaging Design', year: '2024',
    excerpt: 'Premium packaging balancing artisanal craft with modern shelf presence.',
    description: 'A tactile packaging family built around provenance, ritual and contemporary specialty coffee culture.',
    image_url: '/projects/artisan.svg', featured: false, published: true, sort_order: 7
  },
  {
    id: 'demo-nova', slug: 'nova-finance', title: 'Nova Finance App', category: 'UI/UX Design', year: '2023',
    excerpt: 'An intuitive mobile banking experience for a new generation of customers.',
    description: 'A simplified product experience turning everyday financial tasks into clear, approachable journeys.',
    image_url: '/projects/nova.svg', featured: false, published: true, sort_order: 8
  }
]

export const defaultServices = [
  { id: 'service-1', title: 'Brand Identity', icon: 'Sparkles', description: 'Strategic brand development including logo design, visual systems, positioning and comprehensive brand guidelines.', sort_order: 1, published: true },
  { id: 'service-2', title: 'Web Design', icon: 'Monitor', description: 'Responsive websites that combine compelling aesthetics, clear structure and exceptional user experience.', sort_order: 2, published: true },
  { id: 'service-3', title: 'UI/UX Design', icon: 'PanelsTopLeft', description: 'User-centred interface design creating intuitive, engaging digital experiences across platforms.', sort_order: 3, published: true },
  { id: 'service-4', title: 'Digital Marketing', icon: 'Megaphone', description: 'Campaign systems and creative assets that capture attention and drive engagement across digital channels.', sort_order: 4, published: true },
  { id: 'service-5', title: 'Motion Design', icon: 'Play', description: 'Expressive animated content, title systems and social media motion that give brands energy and personality.', sort_order: 5, published: true },
  { id: 'service-6', title: 'Print & Packaging', icon: 'Package', description: 'Editorial, packaging and physical brand applications designed to feel considered in every detail.', sort_order: 6, published: true }
]

export const defaultClients = [
  { id: 'client-1', name: 'Lumin Dental', logo_url: '', website_url: '#', sort_order: 1, published: true },
  { id: 'client-2', name: 'Laomai Dental', logo_url: '', website_url: '#', sort_order: 2, published: true },
  { id: 'client-3', name: 'Imperial AC', logo_url: '', website_url: '#', sort_order: 3, published: true },
  { id: 'client-4', name: 'HeadsUp', logo_url: '', website_url: '#', sort_order: 4, published: true },
  { id: 'client-5', name: 'Melora', logo_url: '', website_url: '#', sort_order: 5, published: true },
  { id: 'client-6', name: 'MiMi', logo_url: '', website_url: '#', sort_order: 6, published: true },
  { id: 'client-7', name: 'Significance', logo_url: '', website_url: '#', sort_order: 7, published: true },
  { id: 'client-8', name: 'Africa Change Lab', logo_url: '', website_url: '#', sort_order: 8, published: true }
]

export const defaultTestimonials = [
  { id: 'test-1', quote: 'Our beauty brand needed a fresh, elegant look. Creatify elevated our entire visual identity to match the quality of our products.', client_name: 'Melora', client_role: 'Beauty Brand', sort_order: 1, published: true },
  { id: 'test-2', quote: 'Working with Creatify was a dream. They designed a beautiful, soft and modern brand aesthetic that our mommy demographic absolutely loves.', client_name: 'MiMi', client_role: 'Baby & Mommy Clothing', sort_order: 2, published: true },
  { id: 'test-3', quote: 'The attention to detail Creatify brought to our jewellery brand was unmatched. Everything looks premium, luxurious and highly professional.', client_name: 'Significance', client_role: 'Jewellery', sort_order: 3, published: true },
  { id: 'test-4', quote: 'Creatify gave our Sunday league squad a professional edge. The graphics and branding make us look like a top-tier team on and off the pitch.', client_name: 'Imperial AC', client_role: 'Community Football Club', sort_order: 4, published: true },
  { id: 'test-5', quote: 'Creatify perfectly captured our mission to provide safe hubs for students in South Africa. The design is approachable, friendly and exactly what we needed.', client_name: 'HeadsUp', client_role: 'Student Safety Hub', sort_order: 5, published: true }
]

export const defaultFaqs = [
  { id: 'faq-1', question: 'What services does Creatify offer?', answer: 'We specialise in brand identity, website design, UI/UX, digital campaigns, print communication, packaging, motion design and creative direction.', sort_order: 1, published: true },
  { id: 'faq-2', question: 'How long does a typical project take?', answer: 'Timelines depend on scope. Smaller design projects may take several working days, while full identities and websites usually take between four and twelve weeks.', sort_order: 2, published: true },
  { id: 'faq-3', question: 'What is your design process?', answer: 'Our process generally includes discovery, research, creative direction, design development, refinement and final delivery. Each stage is adapted to the project.', sort_order: 3, published: true },
  { id: 'faq-4', question: 'Do you work with clients internationally?', answer: 'Yes. Creatify is based in South Africa and works remotely with clients locally and internationally.', sort_order: 4, published: true },
  { id: 'faq-5', question: 'What are your pricing structures?', answer: 'Projects are quoted according to scope, complexity, timing and deliverables. After a discovery conversation, we provide a clear proposal before work begins.', sort_order: 5, published: true }
]

export const defaultStats = [
  { id: 'stat-1', value: '150+', label: 'Projects Delivered', sort_order: 1, published: true },
  { id: 'stat-2', value: '5+', label: 'Years Combined Experience', sort_order: 2, published: true },
  { id: 'stat-3', value: '30+', label: 'Brands Supported', sort_order: 3, published: true },
  { id: 'stat-4', value: '8+', label: 'Design Fields Covered', sort_order: 4, published: true }
]
