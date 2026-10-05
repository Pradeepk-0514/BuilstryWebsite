import { Link as ReactRouterLink } from "react-router-dom";
import { useCtaModal } from "../src/components/CtaModalContext";

export default function RouterLink({ href, prefetch, scroll, legacyBehavior, ctaMode, ...props }) {
  const ctaModal = useCtaModal();
  const { onClick, ...linkProps } = props;

  const handleClick = (event) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return;

    const label = event.currentTarget.textContent?.replace(/\s+/g, " ").trim().toLowerCase() || "";
    const target = new URL(typeof href === "string" ? href : "/", window.location.href);
    const isBooking = target.searchParams.get("mode") === "booking" || /\bbook a call\b/.test(label);
    const isConversation = /\bstart a conversation\b/.test(label);

    if (ctaModal && (isBooking || isConversation)) {
      event.preventDefault();
      ctaModal.openCta(ctaMode || (isBooking ? "booking" : "inquiry"));
    }
  };

  return <ReactRouterLink to={href || "/"} {...linkProps} onClick={handleClick} />;
}
