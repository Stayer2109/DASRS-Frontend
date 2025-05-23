import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types"; // ✅ Import PropTypes

export default function ScrollToTop({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const canControlScrollRestoration = "scrollRestoration" in window.history;
    if (canControlScrollRestoration) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}

// ✅ Add PropTypes validation
ScrollToTop.propTypes = {
  children: PropTypes.node, // Accepts anything that can be rendered (elements, strings, numbers, etc.)
};

