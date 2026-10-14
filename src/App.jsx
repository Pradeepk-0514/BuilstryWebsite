import React, { useLayoutEffect, useRef } from "react";
import { Link, Route, Routes, useLocation, useNavigationType, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollExperience from "./components/ScrollExperience";
import { CtaModalProvider } from "./components/CtaModalContext";
import Home from "../app/page";
import About from "../components/AboutReferencePage";
import Insights from "../components/InsightsPage";
import VerifyCertificatePage from "../app/verify-certificate/page";
import DynamicPage from "../app/[slug]/page";

const SCROLL_AREAS = "[data-route-scroll], .approach-window, .curiosity-rail";
const SCROLL_STORAGE_PREFIX = "builstry-route-scroll:";
const routeScrollCache = new Map();

function captureRouteScroll() {
  const isCtaLocked = document.body.style.position === "fixed"
    && Number.isFinite(window.__builstryCtaScrollY);
  const areas = [...document.querySelectorAll(SCROLL_AREAS)].map((element, index) => ({
    index,
    key: element.dataset.routeScroll || `${element.tagName}:${String(element.className)}:${index}`,
    left: element.scrollLeft,
    top: element.scrollTop,
  }));
  return {
    left: window.scrollX,
    top: isCtaLocked ? window.__builstryCtaScrollY : window.scrollY,
    areas,
  };
}

function readRouteScroll(key) {
  if (routeScrollCache.has(key)) return routeScrollCache.get(key);
  try {
    const stored = window.sessionStorage.getItem(`${SCROLL_STORAGE_PREFIX}${key}`);
    if (stored) {
      const snapshot = JSON.parse(stored);
      routeScrollCache.set(key, snapshot);
      return snapshot;
    }
  } catch {
    // Session storage may be unavailable in private or restricted browsing contexts.
  }
  return null;
}

function writeRouteScroll(key, snapshot) {
  routeScrollCache.set(key, snapshot);
  try {
    window.sessionStorage.setItem(`${SCROLL_STORAGE_PREFIX}${key}`, JSON.stringify(snapshot));
  } catch {
    // The in-memory cache still covers SPA back/forward navigation.
  }
}

function applyRouteScroll(snapshot, resetAreas = false) {
  const root = document.documentElement;
  const oldBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  const lenis = window.__builstryLenis;
  lenis?.resize?.();
  if (lenis) {
    lenis.scrollTo(snapshot.top, { immediate: true, force: true });
    if (snapshot.left) window.scrollTo({ left: snapshot.left, top: snapshot.top, behavior: "instant" });
  } else {
    window.scrollTo({ left: snapshot.left || 0, top: snapshot.top || 0, behavior: "instant" });
  }

  const nodes = [...document.querySelectorAll(SCROLL_AREAS)];
  if (resetAreas) {
    nodes.forEach((element) => { element.scrollLeft = 0; element.scrollTop = 0; });
  } else {
    for (const area of snapshot.areas || []) {
      const element = nodes[area.index];
      if (element) {
        element.scrollLeft = area.left;
        element.scrollTop = area.top;
      }
    }
  }
  window.requestAnimationFrame(() => { root.style.scrollBehavior = oldBehavior; });
}

function scheduleRouteScroll(snapshot, resetAreas = false) {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => applyRouteScroll(snapshot, resetAreas));
  });
}

function RouteScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousLocation = useRef(null);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

    const previous = previousLocation.current;
    const changedEntry = previous && previous.key !== location.key;
    const hashOnlyPush = changedEntry
      && navigationType !== "POP"
      && previous.pathname === location.pathname
      && previous.search === location.search
      && previous.hash !== location.hash;
    const samePath = previous?.pathname === location.pathname;

    if (changedEntry && navigationType === "POP") {
      scheduleRouteScroll(readRouteScroll(location.key) || { left: 0, top: 0, areas: [] }, !readRouteScroll(location.key));
    } else if (changedEntry && !samePath && !hashOnlyPush) {
      scheduleRouteScroll({ left: 0, top: 0, areas: [] }, true);
    }
    previousLocation.current = location;

    let lastSnapshot = changedEntry
      ? (navigationType === "POP" ? (readRouteScroll(location.key) || { left: 0, top: 0, areas: [] }) : { left: 0, top: 0, areas: [] })
      : captureRouteScroll();
    let writeTimer = 0;

    const persist = () => {
      if (writeTimer) window.clearTimeout(writeTimer);
      writeTimer = 0;
      writeRouteScroll(location.key, lastSnapshot);
    };
    const save = () => {
      lastSnapshot = captureRouteScroll();
      routeScrollCache.set(location.key, lastSnapshot);
      if (!writeTimer) {
        writeTimer = window.setTimeout(() => {
          writeTimer = 0;
          writeRouteScroll(location.key, lastSnapshot);
        }, 140);
      }
    };
    const onInternalLink = (event) => {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor || anchor.target === "_blank" || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      try {
        const target = new URL(anchor.href, window.location.href);
        if (target.origin === window.location.origin) save();
      } catch {
        // Ignore malformed or non-navigation links.
      }
    };

    window.addEventListener("scroll", save, { passive: true });
    window.addEventListener("popstate", save);
    window.addEventListener("pagehide", save);
    document.addEventListener("click", onInternalLink, true);

    return () => {
      window.removeEventListener("scroll", save);
      window.removeEventListener("popstate", save);
      window.removeEventListener("pagehide", save);
      document.removeEventListener("click", onInternalLink, true);
      persist();
    };
  }, [location.key, navigationType]);

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
    <CtaModalProvider>
      <>
        <Header />
        <ScrollExperience />
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
    </CtaModalProvider>
  );
}
