"use client";

import { motion, useReducedMotion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import {
  tactileButtonClasses,
  type TactileButtonVariant,
} from "@/components/site/tactile-button-classes";

export type TactileButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: TactileButtonVariant;
  trailingIcon?: ReactNode;
  leadingIcon?: ReactNode;
  loading?: boolean;
};

type MotionAnchorRestProps = Omit<HTMLMotionProps<"a">, "children" | "className" | "onClick">;

export function TactileButton({
  variant = "primary",
  trailingIcon,
  leadingIcon,
  loading = false,
  children,
  className = "",
  onClick,
  ...props
}: TactileButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const motionProps = props as MotionAnchorRestProps;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (loading) event.preventDefault();
    onClick?.(event);
  }

  return (
    <motion.a
      {...motionProps}
      aria-busy={loading ? "true" : undefined}
      className={tactileButtonClasses(variant, className)}
      data-loading={loading ? "true" : undefined}
      onClick={handleClick}
      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.015 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.975 }}
    >
      {leadingIcon ? <span aria-hidden="true">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span aria-hidden="true">{trailingIcon}</span> : null}
    </motion.a>
  );
}
