import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { id: "overview", label: "Research Frame" },
  { id: "waste-story", label: "Waste Pressure" },
  { id: "chart-2-section", label: "Treatment Divide" },
  { id: "transition-story", label: "Transition Signals" },
  { id: "spotlight", label: "National Pathways" },
  { id: "climate-story", label: "Climate Context" },
  { id: "dashboard", label: "Build Comparison" },
  { id: "methods", label: "Sources & Limits" },
  { id: "conclusion", label: "Closing Takeaway" }
];

export default function FloatingNav() {
  const [activeId, setActiveId] = useState(navItems[0].id);

  useEffect(() => {
    const updateActiveSection = () => {
      if (window.scrollY < 160) {
        setActiveId(navItems[0].id);
        return;
      }

      const viewportMarker = window.innerHeight * 0.3;
      let nextActiveId = navItems[0].id;

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (!element) {
          continue;
        }

        const { top } = element.getBoundingClientRect();
        if (top <= viewportMarker) {
          nextActiveId = item.id;
        }
      }

      setActiveId(nextActiveId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const scrollToSection = (id) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav style={styles.navContainer} className="hide-scrollbar" aria-label="Story navigation">
      <style>{`
        /* Hide scrollbars for a cleaner Apple-like aesthetic */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div style={styles.track}>
        {/* Continuous background timebar line */}
        <div style={styles.backgroundLine} />
        
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          
          return (
            <motion.button
              key={item.id}
              type="button"
              style={styles.itemContainer}
              onClick={() => scrollToSection(item.id)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              aria-current={isActive ? "true" : undefined}
            >
              <div style={styles.dotContainer}>
                {/* Default inactive timeline dot */}
                <div style={styles.inactiveDot} />
                
                {/* Animated active dot that glides between sections */}
                {isActive && (
                  <motion.div
                    layoutId="activeTimelineDot"
                    style={styles.activeDot}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>

              {/* Dynamic text resizing & coloring */}
              <motion.div
                initial={false}
                animate={{
                  fontSize: isActive ? "1.3rem" : "1.02rem",
                  color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
                  fontWeight: isActive ? 600 : 400,
                }}
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                style={styles.label}
              >
                <span>{item.label}</span>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

const styles = {
  navContainer: {
    position: "fixed",
    left: "2rem",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 9999,
    maxHeight: "80vh",
    overflowY: "auto",
    padding: "1.4rem 1.5rem 1.4rem 1.1rem",
    // Apple-feel Glassmorphism
    background: "rgba(30, 30, 30, 0.35)",
    backdropFilter: "saturate(180%) blur(24px)",
    WebkitBackdropFilter: "saturate(180%) blur(24px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  track: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
    position: "relative",
  },
  backgroundLine: {
    position: "absolute",
    left: "4px",
    top: "10px",
    bottom: "10px",
    width: "2px",
    background: "rgba(255, 255, 255, 0.15)",
    zIndex: 1,
    borderRadius: "1px",
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
    zIndex: 2,
    minHeight: "2rem",
    padding: 0,
    border: "none",
    background: "transparent",
    textAlign: "left",
  },
  dotContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "10px",
    marginRight: "1.5rem",
  },
  inactiveDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  activeDot: {
    position: "absolute",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    boxShadow: "0 0 16px rgba(255, 255, 255, 0.8)",
    zIndex: 3,
  },
  label: {
    whiteSpace: "nowrap",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    userSelect: "none",
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
  },
};
