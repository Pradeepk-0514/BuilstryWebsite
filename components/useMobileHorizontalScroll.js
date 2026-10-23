import { useEffect, useRef } from "react";

const MOBILE_BREAKPOINT = "(max-width: 720px)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export default function useMobileHorizontalScroll({ sectionRef, stageRef, trackRef, viewportRef, onIndexChange }) {
  const onIndexChangeRef = useRef(onIndexChange);
  onIndexChangeRef.current = onIndexChange;

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!section || !stage || !track || !viewport) return undefined;

    const mobile = window.matchMedia(MOBILE_BREAKPOINT);
    const reducedMotion = window.matchMedia(REDUCED_MOTION);
    let distance = 0;
    let frame = 0;
    let observer;
    let activeIndex = -1;

    const publishIndex = (index) => {
      if (activeIndex === index) return;
      activeIndex = index;
      onIndexChangeRef.current(index);
    };

    const update = () => {
      frame = 0;
      if (!mobile.matches || reducedMotion.matches || distance <= 0) return;

      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / distance));
      track.style.setProperty("transform", `translate3d(${-distance * progress}px, 0, 0)`, "important");
      const cardCount = track.children.length;
      publishIndex(Math.min(cardCount - 1, Math.floor(progress * cardCount)));
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const syncNativeIndex = () => {
      if (!mobile.matches || !reducedMotion.matches) return;
      const firstCard = track.firstElementChild;
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
      const cardWidth = firstCard?.getBoundingClientRect().width || viewport.clientWidth;
      const index = Math.min(track.children.length - 1, Math.round(viewport.scrollLeft / Math.max(1, cardWidth + gap)));
      publishIndex(Math.max(0, index));
    };

    const measure = () => {
      if (!mobile.matches) {
        if (section.hasAttribute("data-mobile-scroll")) {
          section.removeAttribute("data-mobile-scroll");
          section.style.removeProperty("height");
          track.style.removeProperty("transform");
        }
        return;
      }

      if (reducedMotion.matches) {
        section.dataset.mobileScroll = "native";
        section.style.removeProperty("height");
        track.style.removeProperty("transform");
        syncNativeIndex();
        return;
      }

      section.dataset.mobileScroll = "sticky";
      viewport.scrollLeft = 0;
      const styles = window.getComputedStyle(viewport);
      const inlinePadding = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);
      const visibleWidth = Math.max(0, viewport.clientWidth - inlinePadding);
      distance = Math.max(0, track.getBoundingClientRect().width - visibleWidth);
      const sectionStyles = window.getComputedStyle(section);
      const borders = Number.parseFloat(sectionStyles.borderTopWidth) + Number.parseFloat(sectionStyles.borderBottomWidth);
      section.style.height = `${Math.ceil(stage.getBoundingClientRect().height + distance + borders)}px`;
      scheduleUpdate();
    };

    const onMotionChange = () => measure();
    measure();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.visualViewport?.addEventListener("resize", measure, { passive: true });
    viewport.addEventListener("scroll", syncNativeIndex, { passive: true });
    mobile.addEventListener?.("change", measure);
    reducedMotion.addEventListener?.("change", onMotionChange);

    if ("ResizeObserver" in window) {
      observer = new ResizeObserver(measure);
      observer.observe(stage);
      observer.observe(track);
      observer.observe(viewport);
    }

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      viewport.removeEventListener("scroll", syncNativeIndex);
      mobile.removeEventListener?.("change", measure);
      reducedMotion.removeEventListener?.("change", onMotionChange);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      if (section.hasAttribute("data-mobile-scroll")) {
        section.removeAttribute("data-mobile-scroll");
        section.style.removeProperty("height");
        track.style.removeProperty("transform");
      }
    };
  }, [sectionRef, stageRef, trackRef, viewportRef]);
}
