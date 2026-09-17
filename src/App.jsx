import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import About from "./pages/About";
import GenericPage from "./pages/GenericPage";
import Insights from "./pages/Insights";

function RouteScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const frame = window.requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}

// =====================================================
// GENERIC PAGES
// =====================================================

const pages = [
  [
    "industry-solutions",
    "Industry Solutions",
    "Practical systems and solutions designed around real industry problems and measurable outcomes.",
  ],

  [
    "business-product-strategy",
    "Business & Product Strategy",
    "Strategy, product thinking and execution aligned around the outcomes a business actually needs.",
  ],

  [
    "innovation-community",
    "Innovation & Community",
    "Platforms, programs and communities that help people experiment, learn and build what should exist.",
  ],

  [
    "capabilities",
    "Capabilities",
    "Strategy, technology, design and innovation brought together around the problem.",
  ],

  [
    "launchpad",
    "Launchpad",
    "Programs that help people and organisations learn, experiment and build.",
  ],

  [
    "ai-forge",
    "AI Forge",
    "Intelligent products, automation and AI systems designed around real workflows.",
  ],

  [
    "brand-studio",
    "Brand Studio",
    "Brand thinking, product experience and creative systems that make ideas matter.",
  ],

  [
    "industries",
    "Industries",
    "We work across sectors to discover where better systems can create better outcomes.",
  ],

  [
    "solutions",
    "Solutions",
    "From a difficult problem to a working system: a practical path from thinking to building.",
  ],

  [
    "projects",
    "Projects",
    "Selected work and experiments. Detailed case studies can be added as Builstry content becomes available.",
  ],


  [
    "resources",
    "Resources",
    "Guides, frameworks, tools and useful material for people who are building.",
  ],

  [
    "events",
    "Events",
    "Workshops, conversations and experiences designed to bring ideas into the room.",
  ],

  [
    "hackathons",
    "Hackathons",
    "Focused build sprints where people come together around meaningful problems.",
  ],

  [
    "careers",
    "Careers",
    "Join a team that cares about useful technology, thoughtful strategy and work that moves things forward.",
  ],

  ["team", "Team", "The people behind the thinking, making and building."],

  [
    "faq",
    "FAQ",
    "Straight answers to the questions people usually ask before starting a conversation.",
  ],

  [
    "contact",
    "Contact",
    "Have a problem worth solving? Let's figure out what should exist.",
  ],

  [
    "privacy-policy",
    "Privacy Policy",
    "How Builstry handles information shared through this website.",
  ],

  [
    "terms-and-conditions",
    "Terms & Conditions",
    "The terms that apply when you use the Builstry website.",
  ],
];

// =====================================================
// APP
// =====================================================

export default function App() {
  return (
    <Layout>
      <RouteScrollManager />
      <Routes>
        {/* =================================================
            HOME
        ================================================= */}

        <Route path="/" element={<Home />} />

        {/* =================================================
            ABOUT
            IMPORTANT:
            This now uses the new 3D About page.
        ================================================= */}

        <Route path="/about" element={<About />} />

        {/* =================================================
            INSIGHTS
        ================================================= */}

        <Route path="/blog" element={<Insights />} />
        <Route path="/insights" element={<Insights />} />
        <Route
          path="/blog/:slug"
          element={
            <GenericPage
              title="Insight"
              intro="This insight detail page is ready for the final Builstry-approved article content."
              path="blog"
            />
          }
        />

        {/* =================================================
            OTHER PAGES
        ================================================= */}

        {pages.map(([path, title, intro]) => (
          <Route
            key={path}
            path={`/${path}`}
            element={<GenericPage title={title} intro={intro} path={path} />}
          />
        ))}

        {/* =================================================
            404
        ================================================= */}

        <Route
          path="*"
          element={
            <GenericPage
              title="404"
              intro="The page you're looking for doesn't exist."
              notFound
            />
          }
        />
      </Routes>
    </Layout>
  );
}
