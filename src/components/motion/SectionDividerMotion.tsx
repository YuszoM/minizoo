"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export function SectionDividerMotion() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  return (
    <div className="band-divider" aria-hidden ref={ref}>
      <div className="container-site">
        <motion.div
          className="relative mx-auto h-[68px] max-w-4xl overflow-hidden sm:h-[84px] md:h-[96px]"
          initial={reduce ? false : { opacity: 0, scaleX: 0.88, scaleY: 0.6 }}
          animate={
            inView || reduce
              ? { opacity: 1, scaleX: 1, scaleY: 1 }
              : { opacity: 0, scaleX: 0.88, scaleY: 0.6 }
          }
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
        >
          <Image
            src="/images/illustrations/divider-branches.jpg"
            alt=""
            fill
            className="object-cover object-bottom"
            sizes="(max-width: 1180px) 90vw, 960px"
          />
        </motion.div>
      </div>
    </div>
  );
}
