import Link from "../../components/RouterLink";
import { ArrowUpRight, BriefcaseBusiness, Code2, UsersRound } from "lucide-react";
import Reveal from "../../components/Reveal";
import InsightsPage from "../../components/InsightsPage";
import AboutReferencePage from "../../components/AboutReferencePage";
import { people, products } from "../../lib/content";

const pages = {
  "industry-solutions": { eyebrow: "BUILSTRY / INDUSTRY SOLUTIONS", title: "Build for the real world.", intro: "Practical AI, technology and design systems shaped around the needs of modern teams and industries." },
  "business-product-strategy": { eyebrow: "BUILSTRY / BUSINESS & PRODUCT STRATEGY", title: "Find the useful direction.", intro: "Clear strategy, product thinking and decisions that turn a complex opportunity into a focused next move." },
  "innovation-community": { eyebrow: "BUILSTRY / INNOVATION & COMMUNITY", title: "Make momentum contagious.", intro: "Upskilling, innovation programs and communities that help people learn, collaborate and build what matters." },
  launchpad: { eyebrow: "BUILSTRY / LAUNCHPAD", title: "Turn learning into action.", intro: "Upskilling, hackathons and incubation programs that move people from potential to practical momentum." },
  brand: { eyebrow: "BUILSTRY / BRAND STUDIO", title: "Make the idea matter.", intro: "Brand thinking, product experience and creative systems that make ideas feel coherent and move people to act." },
  products: { eyebrow: "BUILSTRY / PRODUCTS", title: "Build what should exist.", intro: "Digital products, AI systems and experiences built around real workflows and human needs." },
  people: { eyebrow: "BUILSTRY / PEOPLE", title: "A small team. A wide lens.", intro: "Strategists, designers, technologists and builders working across the problem." },
  team: { eyebrow: "BUILSTRY / TEAM", title: "A small team. A wide lens.", intro: "Strategists, designers, technologists and builders working across the problem." },
  about: { eyebrow: "BUILSTRY / ABOUT", title: "Build with purpose.", intro: "The right technology starts with the right problem. We bring strategy, design and technology together to create useful things." },
  insights: { eyebrow: "BUILSTRY / INSIGHTS", title: "Thinking before building.", intro: "Research, perspectives and deep dives into the problems, products, industries and technologies shaping what comes next." },
  blog: { eyebrow: "BUILSTRY / INSIGHTS", title: "Thinking before building.", intro: "Research, perspectives and deep dives into the problems, products, industries and technologies shaping what comes next." },
  capabilities: { eyebrow: "BUILSTRY / CAPABILITIES", title: "From problem to possibility.", intro: "Strategy, technology, design and innovation brought together around the problem." },
  "ai-forge": { eyebrow: "BUILSTRY / AI FORGE", title: "Make AI useful.", intro: "Intelligent products, automation and AI systems designed around real workflows." },
  "brand-studio": { eyebrow: "BUILSTRY / BRAND STUDIO", title: "Make the idea matter.", intro: "Brand thinking, product experience and creative systems that make ideas matter." },
  contact: { eyebrow: "BUILSTRY / CONTACT", title: "Start with the question.", intro: "Tell us what is difficult, what is changing or what should exist next." },
  industries: { eyebrow: "BUILSTRY / INDUSTRIES", title: "Find where systems can work better.", intro: "We work across sectors to discover where better systems can create better outcomes." },
  solutions: { eyebrow: "BUILSTRY / SOLUTIONS", title: "Move from problem to progress.", intro: "From a difficult problem to a working system: a practical path from thinking to building." },
  projects: { eyebrow: "BUILSTRY / PROJECTS", title: "Work in progress.", intro: "Selected work and experiments. Detailed case studies can be added as Builstry content becomes available." },
  resources: { eyebrow: "BUILSTRY / RESOURCES", title: "Tools for thoughtful builders.", intro: "Guides, frameworks, tools and useful material for people who are building." },
  events: { eyebrow: "BUILSTRY / EVENTS", title: "Ideas are better in the room.", intro: "Workshops, conversations and experiences designed to bring ideas into the room." },
  hackathons: { eyebrow: "BUILSTRY / HACKATHONS", title: "Build together, with intent.", intro: "Focused build sprints where people come together around meaningful problems." },
  careers: { eyebrow: "BUILSTRY / CAREERS", title: "Build what should exist.", intro: "Join a team that cares about useful technology, thoughtful strategy and work that moves things forward." },
  faq: { eyebrow: "BUILSTRY / FAQ", title: "Straight answers.", intro: "Straight answers to the questions people usually ask before starting a conversation." },
  "privacy-policy": { eyebrow: "BUILSTRY / PRIVACY POLICY", title: "Your information matters.", intro: "How Builstry handles information shared through this website." },
  "terms-and-conditions": { eyebrow: "BUILSTRY / TERMS", title: "Terms & Conditions.", intro: "The terms that apply when you use the Builstry website." },
};

export default function DynamicPage({ slug }) {
  const data = pages[slug] || { eyebrow: "BUILSTRY / 404", title: "This page does not exist.", intro: "The route is not part of this project yet." };
  if (slug === "people" || slug === "team") return <PeoplePage data={data} />;
  if (slug === "products") return <ProductsPage data={data} />;
  if (slug === "about") return <AboutReferencePage />;
  if (slug === "insights" || slug === "blog") return <InsightsPage />;

  return <div className="inner-page"><section className="inner-hero"><Reveal><p className="eyebrow">{data.eyebrow}</p><h1>{data.title}</h1><p className="inner-lede">{data.intro}</p><Link className="button button-primary" href="/contact">Start a conversation <ArrowUpRight size={17} /></Link></Reveal></section><section className="inner-cards">{["Discover the real problem", "Shape the useful direction", "Build the next move"].map((title, i) => <Reveal key={title} delay={i * .08}><article><span>0{i + 1}</span><h2>{title}</h2><p>Thoughtful work, clear decisions and practical momentum for the people who need the outcome.</p></article></Reveal>)}</section></div>;
}

function ProductsPage({ data }) {
  return <div className="inner-page"><section className="inner-hero"><Reveal><p className="eyebrow">{data.eyebrow}</p><h1>{data.title}</h1><p className="inner-lede">{data.intro}</p></Reveal></section><section className="product-grid">{products.map(([number, title, text, logo, href]) => <Reveal key={title}><article className="product-card"><div className="card-top"><span>{number}</span><img src={`/assets/${logo}`} alt="Partner logo" /></div><h2>{title}</h2><p>{text}</p><a className="text-link" href={href} target="_blank" rel="noreferrer">Try now <ArrowUpRight size={16} /></a></article></Reveal>)}</section></div>;
}

function PeoplePage({ data }) {
  return <div className="inner-page"><section className="inner-hero"><Reveal><p className="eyebrow">{data.eyebrow}</p><h1>{data.title}</h1><p className="inner-lede">{data.intro}</p></Reveal></section><section className="people-section"><div className="section-heading"><div><p className="eyebrow dark">MEET THE TEAM</p><h2>Creative thinkers, sharp creators, doers.</h2></div><UsersRound /></div><div className="people-grid">{people.map(([name, role, image]) => <Reveal key={name}><article className="person-card"><img src={`/assets/${image}`} alt={name} /><div><h3>{name}</h3><p>{role}</p></div></article></Reveal>)}</div><div className="careers-banner"><BriefcaseBusiness /><div><p className="eyebrow dark">CAREERS</p><h2>Grow with Builstry.</h2><p>Explore opportunities to work across strategy, design, AI and technology.</p></div><Code2 /></div></section></div>;
}
