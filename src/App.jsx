import React, { useEffect, useMemo, useState } from 'react'
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, BriefcaseBusiness,
  Check, ChevronDown, CircleHelp, ExternalLink, Eye, EyeOff, FileText, FolderKanban,
  Image as ImageIcon, LayoutDashboard, LogOut, Mail, Megaphone, Menu, Monitor,
  Package, PanelsTopLeft, Pencil, Play, Plus, Quote, Save, Settings, Sparkles,
  Trash2, Upload, Users, X, LoaderCircle
} from 'lucide-react'
import { supabase, isSupabaseConfigured, MEDIA_BUCKET } from './supabase'
import {
  defaultClients, defaultFaqs, defaultProjects, defaultServices,
  defaultSettings, defaultStats, defaultTestimonials
} from './data/defaultContent'

const iconMap = { Sparkles, Monitor, PanelsTopLeft, Megaphone, Play, Package }

const sortItems = (items = []) => [...items].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))

const defaults = {
  settings: defaultSettings,
  projects: defaultProjects,
  services: defaultServices,
  clients: defaultClients,
  testimonials: defaultTestimonials,
  faqs: defaultFaqs,
  stats: defaultStats
}

async function fetchTable(table, fallback, options = {}) {
  if (!supabase) return fallback
  let query = supabase.from(table).select('*')
  if (options.published) query = query.eq('published', true)
  if (options.order !== false) query = query.order('sort_order', { ascending: true })
  const { data, error } = await query
  if (error) {
    console.warn(`Could not load ${table}:`, error.message)
    return fallback
  }
  return data ?? fallback
}

function usePublicContent() {
  const [content, setContent] = useState(defaults)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    let active = true
    async function load() {
      if (!supabase) {
        setLoading(false)
        return
      }
      const [settingsRows, projects, services, clients, testimonials, faqs, stats] = await Promise.all([
        fetchTable('site_settings', [defaultSettings], { order: false }),
        fetchTable('projects', defaultProjects, { published: true }),
        fetchTable('services', defaultServices, { published: true }),
        fetchTable('clients', defaultClients, { published: true }),
        fetchTable('testimonials', defaultTestimonials, { published: true }),
        fetchTable('faqs', defaultFaqs, { published: true }),
        fetchTable('stats', defaultStats, { published: true })
      ])
      if (active) {
        setContent({
          settings: settingsRows?.[0] || defaultSettings,
          projects: sortItems(projects), services: sortItems(services), clients: sortItems(clients),
          testimonials: sortItems(testimonials), faqs: sortItems(faqs), stats: sortItems(stats)
        })
        setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  return { ...content, loading }
}

function BrandLogo({ light = false, compact = false, logoUrl = '' }) {
  return (
    <Link to="/" className={`brand-logo ${light ? 'brand-logo--light' : ''}`} aria-label="Creatify Studios home">
      {logoUrl ? <img className="brand-logo__image" src={logoUrl} alt="" /> : <>
        <span className="brand-mark" aria-hidden="true">
          <span className="brand-mark__cut brand-mark__cut--one" />
          <span className="brand-mark__cut brand-mark__cut--two" />
        </span>
        {!compact && <span>reatify</span>}
      </>}
    </Link>
  )
}

function SectionTitle({ eyebrow, children, light = false, action }) {
  return (
    <div className={`section-heading ${light ? 'section-heading--light' : ''}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{children}</h2>
      </div>
      {action}
    </div>
  )
}

function Header({ settings }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    fn()
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const close = () => setOpen(false)
  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="container nav-wrap">
        <BrandLogo logoUrl={settings.logo_url} />
        <nav className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Main navigation">
          <a href="#work" onClick={close}>Our Work</a>
          <a href="#services" onClick={close}>Services</a>
          <a href="#about" onClick={close}>About</a>
          <a href="#contact" onClick={close}>Contact</a>
          <a className="nav-admin" href="/admin" onClick={close}>Admin</a>
          <a className="button button--nav" href={settings.primary_cta_url || '#contact'} onClick={close}>
            {settings.primary_cta_label || 'Start a Project'} <ArrowUpRight size={17} />
          </a>
        </nav>
        <button className="menu-button" onClick={() => setOpen(v => !v)} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}

function Hero({ settings }) {
  return (
    <section className="hero" id="home">
      <div className="hero-orbit hero-orbit--one" />
      <div className="hero-orbit hero-orbit--two" />
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <p className="eyebrow"><span className="eyebrow-dot" /> {settings.eyebrow}</p>
          <h1>
            <span>{settings.hero_line_1}</span>
            <span className="gradient-text">{settings.hero_line_2}</span>
          </h1>
          <p className="hero-description">{settings.hero_description}</p>
          <div className="hero-actions">
            <a className="button" href={settings.primary_cta_url || '#contact'}>
              {settings.primary_cta_label || 'Get in Touch'} <ArrowUpRight size={18} />
            </a>
            <a className="button button--ghost" href={settings.secondary_cta_url || '#work'}>
              {settings.secondary_cta_label || 'View Projects'} <ArrowDownRight size={18} />
            </a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack">
              {['C', 'L', 'I', 'M'].map((letter, index) => <span key={letter} style={{ zIndex: 8 - index }}>{letter}</span>)}
            </div>
            <p><strong>Trusted by ambitious teams</strong><br />South Africa and beyond</p>
          </div>
        </div>
        <div className="hero-visual reveal reveal--delay">
          <div className="hero-card hero-card--main">
            <div className="hero-card__top"><span>CREATIVE SYSTEM 01</span><span>2026</span></div>
            <div className="hero-card__shape">
              <span className="shape-pill" />
              <span className="shape-ring" />
              <span className="shape-square" />
              <span className="shape-star">✦</span>
            </div>
            <div className="hero-card__bottom">
              <strong>Built to communicate.</strong>
              <span>Designed to be remembered.</span>
            </div>
          </div>
          <div className="hero-card hero-card--floating hero-card--orange">IDEAS<br />WITH<br />IMPACT</div>
          <div className="hero-card hero-card--floating hero-card--blue">
            <span className="mini-dot" />
            <span>Strategy</span><span>Identity</span><span>Digital</span>
          </div>
          <div className="hero-scroll-note">SCROLL TO EXPLORE <ArrowDownRight size={17} /></div>
        </div>
      </div>
    </section>
  )
}

function CapabilitiesMarquee() {
  const items = ['BRAND IDENTITY', 'WEB DESIGN', 'UI/UX DESIGN', 'DIGITAL CAMPAIGNS', 'MOTION DESIGN', 'PACKAGING']
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => <React.Fragment key={`${item}-${i}`}><span>{item}</span><b>✦</b></React.Fragment>)}
      </div>
    </div>
  )
}

function Intro({ settings }) {
  return (
    <section className="intro section-pad">
      <div className="container intro-grid">
        <div className="intro-kicker">
          <span>01</span>
          <p>DESIGN SHOULD DO MORE THAN LOOK GOOD.</p>
        </div>
        <div>
          <h2>{settings.intro_title}</h2>
          <p>{settings.intro_body}</p>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index, onOpen }) {
  return (
    <button className={`project-card ${index % 3 === 0 ? 'project-card--wide' : ''}`} onClick={() => onOpen(project)}>
      <div className="project-image-wrap">
        <img src={project.image_url || '/projects/creatify.svg'} alt={`${project.title} project`} loading="lazy" />
        <span className="project-open"><ArrowUpRight /></span>
      </div>
      <div className="project-meta">
        <div><h3>{project.title}</h3><p>{project.category}</p></div>
        <span>{project.year}</span>
      </div>
    </button>
  )
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return
    const handler = e => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [project, onClose])

  if (!project) return null
  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <article className="project-modal">
        <button className="modal-close" onClick={onClose}><X /></button>
        <img src={project.image_url || '/projects/creatify.svg'} alt="" />
        <div className="project-modal__body">
          <p className="eyebrow">{project.category} · {project.year}</p>
          <h2>{project.title}</h2>
          <p>{project.description || project.excerpt}</p>
          {project.project_url && <a className="button" href={project.project_url} target="_blank" rel="noreferrer">Visit Project <ExternalLink size={17} /></a>}
        </div>
      </article>
    </div>
  )
}

function Work({ projects }) {
  const [showAll, setShowAll] = useState(false)
  const [active, setActive] = useState(null)
  const shown = showAll ? projects : projects.filter(p => p.featured).slice(0, 4)
  const fallbackShown = shown.length ? shown : projects.slice(0, 4)
  return (
    <section className="work section-pad" id="work">
      <div className="container">
        <SectionTitle eyebrow="Featured Work" action={
          <button className="text-link" onClick={() => setShowAll(v => !v)}>
            {showAll ? 'Show Featured' : 'View All Projects'} <ArrowRight size={18} />
          </button>
        }>SELECTED PROJECTS</SectionTitle>
        <div className="projects-grid">
          {fallbackShown.map((project, i) => <ProjectCard key={project.id} project={project} index={i} onOpen={setActive} />)}
        </div>
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}

function Services({ services }) {
  return (
    <section className="services section-pad" id="services">
      <div className="container">
        <SectionTitle eyebrow="What We Offer" light>SERVICES BUILT FOR<br />YOUR SUCCESS</SectionTitle>
        <p className="services-intro">From concept to completion, we create comprehensive design solutions tailored to strengthen your brand and move your business forward.</p>
        <div className="services-list">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Sparkles
            return (
              <article className="service-row" key={service.id}>
                <span className="service-number">0{i + 1}</span>
                <span className="service-icon"><Icon /></span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ArrowUpRight className="service-arrow" />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Difference() {
  const points = [
    { number: '01', title: 'Collaborative Approach', text: 'We work as an extension of your team, making sure every decision aligns with your vision and goals.' },
    { number: '02', title: 'Strategic Thinking', text: 'Every pixel serves a purpose. Our work is backed by research, clear positioning and audience understanding.' },
    { number: '03', title: 'Detail-Driven Craft', text: 'We care about the small choices that turn a good idea into a polished, consistent brand experience.' },
    { number: '04', title: 'Built for Real Use', text: 'We create flexible systems that work across actual platforms, formats, teams and customer touchpoints.' }
  ]
  return (
    <section className="difference section-pad">
      <div className="container difference-grid">
        <div className="difference-sticky">
          <p className="eyebrow">Why Choose Us</p>
          <h2>THE CREATIFY<br /><span className="gradient-text">DIFFERENCE</span></h2>
          <div className="difference-art">
            <div className="difference-art__ring" />
            <div className="difference-art__core">C</div>
          </div>
        </div>
        <div className="difference-points">
          {points.map(point => (
            <article key={point.number}>
              <span>{point.number}</span>
              <div><h3>{point.title}</h3><p>{point.text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats({ stats }) {
  return (
    <section className="stats-wrap">
      <div className="container stats-grid">
        {stats.map(stat => <div className="stat" key={stat.id}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
      </div>
    </section>
  )
}

function About({ settings }) {
  return (
    <section className="about section-pad" id="about">
      <div className="container about-grid">
        <div className="about-visual">
          <div className="about-poster about-poster--back">THINK<br />BOLD.</div>
          <div className="about-poster about-poster--front">
            <span>CREATIFY STUDIO</span>
            <img src="/mascot.svg" alt="Creatify mascot working on a laptop" />
          </div>
        </div>
        <div className="about-copy">
          <p className="eyebrow">Inside The Studio</p>
          <h2>{settings.about_title}</h2>
          <p>{settings.about_body}</p>
          <div className="about-tags"><span>CURIOUS</span><span>STRATEGIC</span><span>PLAYFUL</span><span>PRECISE</span></div>
          <a href="#contact" className="text-link">Build something with us <ArrowRight size={18} /></a>
        </div>
      </div>
    </section>
  )
}

function Testimonials({ testimonials }) {
  const [index, setIndex] = useState(0)
  const active = testimonials[index] || defaultTestimonials[0]
  const next = direction => setIndex(prev => (prev + direction + testimonials.length) % testimonials.length)
  if (!testimonials.length) return null
  return (
    <section className="testimonials section-pad">
      <div className="container">
        <SectionTitle eyebrow="Client Stories">WHAT THEY SAY<br />ABOUT US</SectionTitle>
        <div className="testimonial-card">
          <Quote className="quote-icon" />
          <blockquote>“{active.quote}”</blockquote>
          <div className="testimonial-footer">
            <div className="client-initial">{active.client_name?.charAt(0)}</div>
            <div><strong>{active.client_name}</strong><span>{active.client_role}</span></div>
            <div className="slider-controls">
              <button onClick={() => next(-1)} aria-label="Previous testimonial"><ArrowLeft /></button>
              <span>{String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span>
              <button onClick={() => next(1)} aria-label="Next testimonial"><ArrowRight /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ClientMarquee({ clients }) {
  const repeated = [...clients, ...clients]
  return (
    <section className="clients">
      <p>TRUSTED BY VISIONARY BRANDS</p>
      <div className="client-marquee">
        <div className="client-track">
          {repeated.map((client, i) => (
            <a key={`${client.id}-${i}`} href={client.website_url || '#'} aria-label={client.name}>
              {client.logo_url ? <img src={client.logo_url} alt={client.name} /> : <span>{client.name}</span>}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ({ faqs }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="faq section-pad">
      <div className="container faq-grid">
        <div>
          <p className="eyebrow">Common Questions</p>
          <h2>FREQUENTLY<br />ASKED QUESTIONS</h2>
          <p className="faq-support">Still have questions?</p>
          <a className="text-link" href="#contact">Get in touch <ArrowRight size={18} /></a>
        </div>
        <div className="accordion">
          {faqs.map((faq, index) => (
            <article className={open === index ? 'accordion-item accordion-item--open' : 'accordion-item'} key={faq.id}>
              <button onClick={() => setOpen(open === index ? -1 : index)}>
                <span>{faq.question}</span><ChevronDown />
              </button>
              <div className="accordion-answer"><p>{faq.answer}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact({ settings }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', project_type: 'Brand Identity', budget: '', message: '' })
  const [status, setStatus] = useState('idle')
  const update = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    if (supabase) {
      const { error } = await supabase.from('contact_submissions').insert(form)
      if (error) {
        console.error(error)
        setStatus('error')
        return
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 700))
    }
    setStatus('sent')
    setForm({ name: '', email: '', company: '', project_type: 'Brand Identity', budget: '', message: '' })
  }
  return (
    <section className="contact section-pad" id="contact">
      <div className="container contact-grid">
        <div className="contact-copy">
          <p className="eyebrow">Start A Project</p>
          <h2>HAVE SOMETHING<br /><span>WORTH CREATING?</span></h2>
          <p>Tell us where you are, where you want to go and what is standing in the way. Let us build something remarkable together.</p>
          <a href={`mailto:${settings.email}`} className="contact-email">{settings.email} <ArrowUpRight /></a>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <div className="form-grid">
            <label><span>Your name</span><input name="name" value={form.name} onChange={update} required placeholder="Jane Doe" /></label>
            <label><span>Email address</span><input type="email" name="email" value={form.email} onChange={update} required placeholder="jane@company.com" /></label>
            <label><span>Company</span><input name="company" value={form.company} onChange={update} placeholder="Your company" /></label>
            <label><span>Project type</span><select name="project_type" value={form.project_type} onChange={update}><option>Brand Identity</option><option>Web Design</option><option>UI/UX Design</option><option>Digital Campaign</option><option>Motion Design</option><option>Other</option></select></label>
            <label><span>Estimated budget</span><select name="budget" value={form.budget} onChange={update}><option value="">Select a range</option><option>Under R5,000</option><option>R5,000 – R15,000</option><option>R15,000 – R35,000</option><option>R35,000+</option></select></label>
            <label className="form-grid__full"><span>Tell us about your project</span><textarea name="message" value={form.message} onChange={update} required placeholder="What are you building, and how can Creatify help?" /></label>
          </div>
          <button className="button button--light" disabled={status === 'sending'}>{status === 'sending' ? <LoaderCircle className="spin" /> : status === 'sent' ? <Check /> : <ArrowUpRight />}{status === 'sent' ? 'Message Sent' : 'Send Enquiry'}</button>
          {status === 'error' && <p className="form-error">Something went wrong. Please email us directly.</p>}
        </form>
      </div>
    </section>
  )
}

function Footer({ settings }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><BrandLogo light logoUrl={settings.logo_url} /><p>{settings.footer_blurb}</p></div>
        <div><h3>Navigation</h3><a href="#work">Our Work</a><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact</a></div>
        <div><h3>Get In Touch</h3><a href="#contact">Start a Project</a><a href={`mailto:${settings.email}`}>{settings.email}</a><p>{settings.location}</p></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 CREATIFY STUDIOS. ALL RIGHTS RESERVED.</span><div><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><Link to="/admin">Admin</Link></div></div>
      <div className="footer-word">CREATIFY</div>
    </footer>
  )
}

function HomePage() {
  const { settings, projects, services, clients, testimonials, faqs, stats, loading } = usePublicContent()
  if (loading) return <div className="page-loader"><BrandLogo /><LoaderCircle className="spin" /></div>
  return <>
    <Header settings={settings} />
    <main>
      <Hero settings={settings} />
      <CapabilitiesMarquee />
      <Intro settings={settings} />
      <Work projects={projects} />
      <Services services={services} />
      <Difference />
      <Stats stats={stats} />
      <About settings={settings} />
      <Testimonials testimonials={testimonials} />
      <ClientMarquee clients={clients} />
      <FAQ faqs={faqs} />
      <Contact settings={settings} />
    </main>
    <Footer settings={settings} />
  </>
}

// -------------------- ADMIN --------------------

const entityConfig = {
  projects: {
    label: 'Projects', icon: FolderKanban,
    fields: [
      ['title', 'Project title', 'text'], ['slug', 'URL slug', 'text'], ['category', 'Category', 'text'], ['year', 'Year', 'text'],
      ['excerpt', 'Short summary', 'textarea'], ['description', 'Full description', 'textarea'], ['image_url', 'Cover image', 'media'],
      ['project_url', 'External project URL', 'url'], ['featured', 'Featured project', 'checkbox'], ['published', 'Published', 'checkbox'], ['sort_order', 'Display order', 'number']
    ], columns: ['title', 'category', 'year', 'featured', 'published']
  },
  services: {
    label: 'Services', icon: Sparkles,
    fields: [['title', 'Service title', 'text'], ['icon', 'Icon name', 'select', ['Sparkles', 'Monitor', 'PanelsTopLeft', 'Megaphone', 'Play', 'Package']], ['description', 'Description', 'textarea'], ['published', 'Published', 'checkbox'], ['sort_order', 'Display order', 'number']],
    columns: ['title', 'icon', 'published']
  },
  clients: {
    label: 'Clients & Logos', icon: Users,
    fields: [['name', 'Client name', 'text'], ['logo_url', 'Client logo', 'media'], ['website_url', 'Website URL', 'url'], ['published', 'Published', 'checkbox'], ['sort_order', 'Display order', 'number']],
    columns: ['name', 'logo_url', 'published']
  },
  testimonials: {
    label: 'Testimonials', icon: Quote,
    fields: [['quote', 'Testimonial', 'textarea'], ['client_name', 'Client name', 'text'], ['client_role', 'Client role / company type', 'text'], ['published', 'Published', 'checkbox'], ['sort_order', 'Display order', 'number']],
    columns: ['client_name', 'client_role', 'published']
  },
  faqs: {
    label: 'FAQs', icon: CircleHelp,
    fields: [['question', 'Question', 'text'], ['answer', 'Answer', 'textarea'], ['published', 'Published', 'checkbox'], ['sort_order', 'Display order', 'number']],
    columns: ['question', 'published']
  },
  stats: {
    label: 'Numbers', icon: BarChart3,
    fields: [['value', 'Value', 'text'], ['label', 'Label', 'text'], ['published', 'Published', 'checkbox'], ['sort_order', 'Display order', 'number']],
    columns: ['value', 'label', 'published']
  }
}

const emptyFor = table => {
  const config = entityConfig[table]
  return Object.fromEntries(config.fields.map(([name, , type]) => [name, type === 'checkbox' ? false : type === 'number' ? 0 : '']))
}

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => data.session && navigate('/admin/dashboard'))
  }, [navigate])

  async function signIn(e) {
    e.preventDefault()
    if (!supabase) return
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else navigate('/admin/dashboard')
  }

  return (
    <div className="admin-login">
      <div className="admin-login__brand"><BrandLogo /><p>Studio content management</p></div>
      <div className="login-card">
        <div className="login-icon"><Settings /></div>
        <p className="eyebrow">Private Dashboard</p>
        <h1>Welcome back.</h1>
        <p>Sign in to update projects, services, client logos, testimonials and website copy.</p>
        {!isSupabaseConfigured ? (
          <div className="setup-notice">
            <strong>Supabase is not connected yet.</strong>
            <p>Add your project URL and anon key to a local <code>.env</code> file, then run the SQL setup script included with this website.</p>
          </div>
        ) : (
          <form onSubmit={signIn}>
            <label><span>Email address</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
            <label><span>Password</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
            {error && <p className="form-error">{error}</p>}
            <button className="button" disabled={loading}>{loading ? <LoaderCircle className="spin" /> : <ArrowRight />} Sign In</button>
          </form>
        )}
        <Link className="back-link" to="/"><ArrowLeft size={17} /> Back to website</Link>
      </div>
    </div>
  )
}

function AdminSidebar({ active, setActive, onLogout, collapsed, setCollapsed }) {
  const nav = [
    ['dashboard', 'Overview', LayoutDashboard], ['projects', 'Projects', FolderKanban], ['services', 'Services', Sparkles],
    ['clients', 'Clients & Logos', Users], ['testimonials', 'Testimonials', Quote], ['faqs', 'FAQs', CircleHelp],
    ['stats', 'Numbers', BarChart3], ['settings', 'Site Settings', Settings], ['messages', 'Enquiries', Mail]
  ]
  return (
    <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar--collapsed' : ''}`}>
      <div className="admin-sidebar__top"><BrandLogo compact={collapsed} /><button onClick={() => setCollapsed(v => !v)}><Menu /></button></div>
      <nav>{nav.map(([key, label, Icon]) => <button className={active === key ? 'active' : ''} key={key} onClick={() => setActive(key)}><Icon /><span>{label}</span></button>)}</nav>
      <div className="admin-sidebar__bottom">
        <a href="/" target="_blank"><ExternalLink /><span>View live website</span></a>
        <button onClick={onLogout}><LogOut /><span>Sign out</span></button>
      </div>
    </aside>
  )
}

function AdminDashboardHome({ counts }) {
  const cards = [
    ['Projects', counts.projects, FolderKanban], ['Client logos', counts.clients, Users],
    ['Testimonials', counts.testimonials, Quote], ['New enquiries', counts.messages, Mail]
  ]
  return <div>
    <div className="admin-welcome"><div><p className="eyebrow">Creatify Control Room</p><h1>Good to see you.</h1><p>Manage every important part of the public website from one place.</p></div><a className="button" href="/" target="_blank">Open Website <ExternalLink size={17} /></a></div>
    <div className="dashboard-cards">{cards.map(([label, value, Icon]) => <article key={label}><span><Icon /></span><strong>{value}</strong><p>{label}</p></article>)}</div>
    <div className="admin-info-grid">
      <article><h3>Quick publishing flow</h3><ol><li>Add or edit the content.</li><li>Upload a cover or logo.</li><li>Switch “Published” on.</li><li>Save. The public site updates immediately.</li></ol></article>
      <article><h3>What this dashboard controls</h3><div className="chip-list"><span>Homepage copy</span><span>Project portfolio</span><span>Services</span><span>Client logos</span><span>Testimonials</span><span>FAQs</span><span>Stats</span><span>Contact enquiries</span></div></article>
    </div>
  </div>
}

function DataTable({ table, rows, onEdit, onDelete, onCreate }) {
  const config = entityConfig[table]
  return <div className="admin-panel">
    <div className="admin-panel__header"><div><p className="eyebrow">Content Collection</p><h2>{config.label}</h2></div><button className="button" onClick={onCreate}><Plus size={18} /> Add New</button></div>
    <div className="table-scroll"><table className="data-table"><thead><tr>{config.columns.map(c => <th key={c}>{c.replaceAll('_', ' ')}</th>)}<th>Actions</th></tr></thead><tbody>
      {rows.map(row => <tr key={row.id}>{config.columns.map(column => <td key={column}>{column === 'logo_url' ? (row[column] ? <img className="table-logo" src={row[column]} alt="" /> : <span className="muted">Text logo</span>) : typeof row[column] === 'boolean' ? <span className={`status ${row[column] ? 'status--live' : ''}`}>{row[column] ? <><Eye size={14} /> Yes</> : <><EyeOff size={14} /> No</>}</span> : String(row[column] ?? '')}</td>)}<td><div className="row-actions"><button onClick={() => onEdit(row)}><Pencil /></button><button className="danger" onClick={() => onDelete(row)}><Trash2 /></button></div></td></tr>)}
      {!rows.length && <tr><td colSpan={config.columns.length + 1} className="empty-state">No items yet. Add the first one.</td></tr>}
    </tbody></table></div>
  </div>
}

async function uploadMedia(file) {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')
  const path = `${Date.now()}-${safeName}`
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

function EntityEditor({ table, item, onClose, onSaved }) {
  const config = entityConfig[table]
  const [form, setForm] = useState(item || emptyFor(table))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState('')
  const [error, setError] = useState('')

  const update = (name, value) => setForm(prev => ({ ...prev, [name]: value }))
  async function mediaChange(field, file) {
    if (!file) return
    setUploading(field); setError('')
    try { update(field, await uploadMedia(file)) } catch (e) { setError(e.message) }
    setUploading('')
  }
  async function save(e) {
    e.preventDefault(); setSaving(true); setError('')
    const payload = { ...form }
    delete payload.id; delete payload.created_at; delete payload.updated_at
    if (table === 'projects' && !payload.slug) payload.slug = payload.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const query = item?.id ? supabase.from(table).update(payload).eq('id', item.id) : supabase.from(table).insert(payload)
    const { error } = await query
    setSaving(false)
    if (error) setError(error.message)
    else onSaved()
  }

  return <div className="drawer-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <aside className="editor-drawer">
      <div className="editor-drawer__header"><div><p className="eyebrow">{item ? 'Edit content' : 'Create content'}</p><h2>{item ? item.title || item.name || item.client_name || item.question || config.label : `New ${config.label.replace(/s$/, '')}`}</h2></div><button onClick={onClose}><X /></button></div>
      <form onSubmit={save}>
        {config.fields.map(([name, label, type, options]) => {
          if (type === 'checkbox') return <label className="toggle-field" key={name}><div><strong>{label}</strong><span>{form[name] ? 'Visible on the public website' : 'Hidden from the public website'}</span></div><button type="button" className={form[name] ? 'toggle toggle--on' : 'toggle'} onClick={() => update(name, !form[name])}><span /></button></label>
          if (type === 'textarea') return <label key={name}><span>{label}</span><textarea value={form[name] || ''} onChange={e => update(name, e.target.value)} rows={5} /></label>
          if (type === 'select') return <label key={name}><span>{label}</span><select value={form[name] || ''} onChange={e => update(name, e.target.value)}>{options.map(option => <option key={option}>{option}</option>)}</select></label>
          if (type === 'media') return <label key={name}><span>{label}</span><div className="media-field">{form[name] ? <img src={form[name]} alt="Preview" /> : <ImageIcon />}<div><label className="upload-button">{uploading === name ? <LoaderCircle className="spin" /> : <Upload />} Upload file<input type="file" accept="image/*" onChange={e => mediaChange(name, e.target.files?.[0])} /></label><input value={form[name] || ''} onChange={e => update(name, e.target.value)} placeholder="Or paste an image URL" /></div></div></label>
          return <label key={name}><span>{label}</span><input type={type} value={form[name] ?? ''} onChange={e => update(name, type === 'number' ? Number(e.target.value) : e.target.value)} /></label>
        })}
        {error && <p className="form-error">{error}</p>}
        <div className="editor-actions"><button type="button" className="button button--ghost" onClick={onClose}>Cancel</button><button className="button" disabled={saving || uploading}>{saving ? <LoaderCircle className="spin" /> : <Save />} Save Changes</button></div>
      </form>
    </aside>
  </div>
}

function SettingsEditor({ settings, onSaved }) {
  const [form, setForm] = useState(settings || defaultSettings)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const fields = [
    ['logo_url', 'Primary logo', 'media'], ['studio_name', 'Studio name'], ['eyebrow', 'Hero eyebrow'], ['hero_line_1', 'Hero line one'], ['hero_line_2', 'Hero line two'],
    ['hero_description', 'Hero description', 'textarea'], ['intro_title', 'Intro heading'], ['intro_body', 'Intro paragraph', 'textarea'],
    ['about_title', 'About heading'], ['about_body', 'About paragraph', 'textarea'], ['email', 'Public email'], ['phone', 'Phone number'],
    ['location', 'Location line'], ['primary_cta_label', 'Primary button label'], ['primary_cta_url', 'Primary button link'],
    ['secondary_cta_label', 'Secondary button label'], ['secondary_cta_url', 'Secondary button link'], ['instagram', 'Instagram link'],
    ['linkedin', 'LinkedIn link'], ['behance', 'Behance link'], ['footer_blurb', 'Footer description', 'textarea']
  ]
  useEffect(() => setForm(settings || defaultSettings), [settings])
  async function settingsMediaChange(file) {
    if (!file) return
    setUploading(true); setMessage('')
    try {
      const logoUrl = await uploadMedia(file)
      setForm(prev => ({ ...prev, logo_url: logoUrl }))
    }
    catch (error) { setMessage(error.message) }
    setUploading(false)
  }
  async function save(e) {
    e.preventDefault(); setSaving(true); setMessage('')
    const payload = { ...form, id: 1 }
    const { error } = await supabase.from('site_settings').upsert(payload, { onConflict: 'id' })
    setSaving(false)
    setMessage(error ? error.message : 'Website settings saved.')
    if (!error) onSaved()
  }
  return <div className="admin-panel"><div className="admin-panel__header"><div><p className="eyebrow">Global Website Copy</p><h2>Site Settings</h2></div></div><form className="settings-form" onSubmit={save}>{fields.map(([name, label, type]) => <label key={name}><span>{label}</span>{type === 'textarea' ? <textarea rows={4} value={form[name] || ''} onChange={e => setForm({ ...form, [name]: e.target.value })} /> : type === 'media' ? <div className="media-field settings-logo-field">{form[name] ? <img src={form[name]} alt="Logo preview" /> : <ImageIcon />}<div><label className="upload-button">{uploading ? <LoaderCircle className="spin" /> : <Upload />} Upload logo<input type="file" accept="image/*" onChange={e => settingsMediaChange(e.target.files?.[0])} /></label><input value={form[name] || ''} onChange={e => setForm({ ...form, [name]: e.target.value })} placeholder="Or paste a logo URL" /></div></div> : <input value={form[name] || ''} onChange={e => setForm({ ...form, [name]: e.target.value })} />}</label>)}<div className="settings-save"><span>{message}</span><button className="button" disabled={saving || uploading}>{saving ? <LoaderCircle className="spin" /> : <Save />} Save Settings</button></div></form></div>
}

function MessagesTable({ messages, onDelete }) {
  return <div className="admin-panel"><div className="admin-panel__header"><div><p className="eyebrow">Contact Form</p><h2>Project Enquiries</h2></div></div><div className="message-list">{messages.map(message => <article key={message.id}><div className="message-list__head"><div><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a></div><span>{new Date(message.created_at).toLocaleDateString()}</span></div><div className="message-tags"><span>{message.project_type || 'Project'}</span>{message.budget && <span>{message.budget}</span>}{message.company && <span>{message.company}</span>}</div><p>{message.message}</p><div className="message-actions"><a className="button button--small" href={`mailto:${message.email}?subject=Re: Your Creatify enquiry`}>Reply <Mail size={15} /></a><button onClick={() => onDelete(message)}><Trash2 size={16} /> Delete</button></div></article>)}{!messages.length && <div className="empty-state">No enquiries yet.</div>}</div></div>
}

function AdminApp() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [active, setActive] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [data, setData] = useState({ projects: [], services: [], clients: [], testimonials: [], faqs: [], stats: [], settings: defaultSettings, messages: [] })
  const [editor, setEditor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setChecking(false); navigate('/admin'); return }
    supabase.auth.getSession().then(async ({ data: authData }) => {
      if (!authData.session) {
        navigate('/admin')
      } else {
        const { data: membership } = await supabase.from('admin_users').select('user_id').eq('user_id', authData.session.user.id).maybeSingle()
        if (!membership) {
          await supabase.auth.signOut()
          navigate('/admin')
        } else {
          setSession(authData.session)
        }
      }
      setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      if (!currentSession) navigate('/admin')
    })
    return () => listener.subscription.unsubscribe()
  }, [navigate])

  async function loadAdminData() {
    if (!supabase) return
    setLoading(true)
    const tables = ['projects', 'services', 'clients', 'testimonials', 'faqs', 'stats']
    const results = await Promise.all(tables.map(table => supabase.from(table).select('*').order('sort_order', { ascending: true })))
    const settingsResult = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
    const messagesResult = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    const next = Object.fromEntries(tables.map((table, i) => [table, results[i].data || []]))
    setData({ ...next, settings: settingsResult.data || defaultSettings, messages: messagesResult.data || [] })
    setLoading(false)
  }
  useEffect(() => { if (session) loadAdminData() }, [session])

  async function deleteItem(table, item) {
    if (!window.confirm('Delete this item permanently?')) return
    const { error } = await supabase.from(table).delete().eq('id', item.id)
    if (error) alert(error.message)
    else loadAdminData()
  }
  async function logout() { await supabase.auth.signOut(); navigate('/admin') }

  if (checking || (session && loading)) return <div className="page-loader"><BrandLogo /><LoaderCircle className="spin" /></div>
  if (!session) return null

  const counts = { projects: data.projects.length, clients: data.clients.length, testimonials: data.testimonials.length, messages: data.messages.length }
  const title = active === 'dashboard' ? 'Dashboard' : active === 'settings' ? 'Site Settings' : active === 'messages' ? 'Enquiries' : entityConfig[active]?.label
  return <div className="admin-shell">
    <AdminSidebar active={active} setActive={setActive} onLogout={logout} collapsed={collapsed} setCollapsed={setCollapsed} />
    <main className="admin-main">
      <header className="admin-topbar"><div><span>CREATIFY STUDIOS</span><strong>{title}</strong></div><div className="admin-user"><span>{session.user.email?.charAt(0).toUpperCase()}</span><div><strong>{session.user.email}</strong><small>Administrator</small></div></div></header>
      <div className="admin-content">
        {active === 'dashboard' && <AdminDashboardHome counts={counts} />}
        {entityConfig[active] && <DataTable table={active} rows={data[active]} onCreate={() => setEditor({ table: active, item: null })} onEdit={item => setEditor({ table: active, item })} onDelete={item => deleteItem(active, item)} />}
        {active === 'settings' && <SettingsEditor settings={data.settings} onSaved={loadAdminData} />}
        {active === 'messages' && <MessagesTable messages={data.messages} onDelete={item => deleteItem('contact_submissions', item)} />}
      </div>
    </main>
    {editor && <EntityEditor table={editor.table} item={editor.item} onClose={() => setEditor(null)} onSaved={() => { setEditor(null); loadAdminData() }} />}
  </div>
}

function NotFound() {
  return <div className="not-found"><BrandLogo /><h1>404</h1><p>That page does not exist.</p><Link className="button" to="/">Return Home <ArrowRight /></Link></div>
}

export default function App() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/admin" element={<LoginPage />} />
    <Route path="/admin/dashboard" element={<AdminApp />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
}
