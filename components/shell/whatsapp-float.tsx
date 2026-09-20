"use client";

import { motion, useReducedMotion } from "framer-motion";
import { RiWhatsappFill } from "react-icons/ri";

export function WhatsappFloat({ href }: { href: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed inset-s-4 bottom-20 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 lg:start-6 lg:bottom-6"
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <RiWhatsappFill className="size-7" />
    </motion.a>
  );
}
