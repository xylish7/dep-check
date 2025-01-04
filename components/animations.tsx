"use client";

import { motion } from "framer-motion";

interface FadeInFromBottomProps {
  children: React.ReactNode;
  viewportAmount?: number;
}

export const FadeInFromBottom = ({
  children,
  viewportAmount = 0.1,
}: FadeInFromBottomProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      transition={{ duration: 0.5 }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
};
