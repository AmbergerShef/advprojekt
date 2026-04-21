import { motion } from "framer-motion";

const baseViewport = {
  once: true,
  amount: 0.18
};

export default function RevealInView({
  children,
  as = "div",
  className,
  delay = 0,
  distance = 28,
  duration = 0.6,
  id,
  viewport = baseViewport,
  ...props
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      id={id}
      className={className}
      {...props}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </Component>
  );
}
