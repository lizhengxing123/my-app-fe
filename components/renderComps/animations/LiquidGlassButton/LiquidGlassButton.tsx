"use client";

import styles from "./LiquidGlassButton.module.css";

export default function LiquidGlassButton() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={`${styles.box} ${styles.dark}`}>
            <svg
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
            >
              <path
                d="M426.666667 426.666667H85.546667A85.418667 85.418667 0 0 0 0 512c0 47.445333 38.314667 85.333333 85.546667 85.333333H426.666667v341.12c0 47.274667 38.186667 85.546667 85.333333 85.546667 47.445333 0 85.333333-38.314667 85.333333-85.546667V597.333333h341.12A85.418667 85.418667 0 0 0 1024 512c0-47.445333-38.314667-85.333333-85.546667-85.333333H597.333333V85.546667A85.418667 85.418667 0 0 0 512 0c-47.445333 0-85.333333 38.314667-85.333333 85.546667V426.666667z"
                fill="#777"
                p-id="4929"
              ></path>
            </svg>
            <div className={styles['circle-overlay']}></div>
          </div>

          <div className={`${styles['start-btn']} ${styles.box} ${styles.dark}`}>
            <span>Get started</span>
            <div className={styles['btn-icon']}>
              <svg
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="7410"
              >
                <path
                  d="M779.180132 473.232045 322.354755 16.406668c-21.413706-21.413706-56.121182-21.413706-77.534887 0-21.413706 21.413706-21.413706 56.122205 0 77.534887l418.057421 418.057421L244.819868 930.057421c-21.413706 21.413706-21.413706 56.122205 0 77.534887 10.706853 10.706853 24.759917 16.059767 38.767955 16.059767s28.061103-5.353938 38.767955-16.059767L779.180132 550.767955C800.593837 529.35425 800.593837 494.64575 779.180132 473.232045z"
                  p-id="7411"
                ></path>
              </svg>
            </div>
            <div className={styles['circle-overlay']}></div>
          </div>
        </div>
      </div>
    </>
  );
}
