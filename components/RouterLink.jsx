import { Link as ReactRouterLink } from "react-router-dom";

export default function RouterLink({ href, prefetch, scroll, legacyBehavior, ...props }) {
  return <ReactRouterLink to={href || "/"} {...props} />;
}
