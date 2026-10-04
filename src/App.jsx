import React, { useLayoutEffect } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Home from "../app/page";
import About from "../components/AboutReferencePage";
import Insights from "../components/InsightsPage";
import VerifyCertificatePage from "../app/verify-certificate/page";
import DynamicPage from "../app/[slug]/page";

function RouteScrollManager() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    root.scrollTop = 0;
    document.body.scrollTop = 0;
    document.querySelectorAll("[data-route-scroll], .approach-window, .curiosity-rail").forEach((element) => {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    });
    const restore = (callback) => {
      if (typeof window.queueMicrotask === "function") window.queueMicrotask(callback);
      else window.setTimeout(callback, 0);
    };
    restore(() => { root.style.scrollBehavior = previousScrollBehavior; });
  }, [pathname]);

  return null;
}

function SingleSlugRoute() {
  const { slug } = useParams();
  return <DynamicPage slug={slug} />;
}

function BlogArticleRoute() {
  const { slug } = useParams();
  const title = (slug || "insight").split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  return (
    <div className="inner-page">
      <section className="inner-hero">
        <div>
          <p className="eyebrow">BUILSTRY / INSIGHT</p>
          <h1>{title}</h1>
          <p className="inner-lede">This insight detail page is ready for the final Builstry-approved article content.</p>
          <Link className="button button-primary" to="/insights">Back to Insights</Link>
        </div>
      </section>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="inner-page">
      <section className="inner-hero">
        <div>
          <p className="eyebrow">BUILSTRY / 404</p>
          <h1>This page does not exist.</h1>
          <p className="inner-lede">The page you’re looking for could not be found.</p>
          <Link className="button button-primary" to="/">Return home</Link>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <RouteScrollManager />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/blog" element={<Insights />} />
          <Route path="/blog/:slug" element={<BlogArticleRoute />} />
          <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
          <Route path="/:slug" element={<SingleSlugRoute />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
