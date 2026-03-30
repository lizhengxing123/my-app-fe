"use client";

import { ReactNode } from "react";
import styles from "./FlowingLightButton.module.css";

export default function FlowingLightButton({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={styles.btn}
    >
      <div className={styles.smoke}>
        {Array.from({ length: 14 }).map((_, index) => (
          <div key={index} className={styles.cloud}></div>
        ))}
      </div>
      <div className={styles.title}>
        <span className={styles.thunder}>⚡</span>
        <strong className={styles.description}>{children}</strong>
      </div>
      <div className={styles.glass}>
        <div className={styles['inner-glass']}></div>
      </div>
    </button>
  );
}
