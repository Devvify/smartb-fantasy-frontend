"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./Header.module.css";
import HomeIcon from "@/assets/icons/home.svg";
import LiveIcon from "@/assets/icons/live.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/smartPlayLogo.png"
              alt="SmartB"
              width={100}
              height={30}
              priority
            />
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/fantasy" className={styles.navLinkActive}>
            All Competitions
          </Link>
          <Link href="/" className={styles.navLink}>
            FAQs
          </Link>
          <Link href="/" className={styles.navLink}>
            Rules & Scoring
          </Link>
          <button
            onClick={() => setIsLiveModalOpen(true)}
            className={styles.liveButton}
          >
            <LiveIcon className={styles.liveIcon} />
          </button>
        </nav>

        <div className={styles.actions}>
          <Link href="/" className={styles.homeSmartBIcon}>
            <HomeIcon className={styles.homeIcon} />
            <Image
              src="/SmartBLogo.png"
              alt="SmartB"
              width={48}
              height={16}
              className={styles.smartBIcon}
            />
          </Link>
          <button className={styles.btnPrimary}>Sign Up</button>
          <button className={styles.btnSecondary}>Log In</button>
          <button
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" className={styles.mobileNavLink}>
            HOME
          </Link>
          <Link href="/fantasy" className={styles.mobileNavLink}>
            SMARTPLAY
          </Link>
          <Link href="/fantasy" className={styles.mobileNavLinkActive}>
            ALL COMPETITIONS
          </Link>
          <div className={styles.mobileActions}>
            <button className={styles.btnPrimary}>Sign Up</button>
            <button className={styles.btnSecondary}>Log In</button>
          </div>
        </div>
      )}

      {isLiveModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsLiveModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setIsLiveModalOpen(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Log In Required</h2>
              <p className={styles.modalDescription}>
                Please log in with your{" "}
                <span className={styles.brandInline}>
                  <Image
                    src="/login-popup-white-logo.e29d2b59.png"
                    alt="SmartB"
                    width={70}
                    height={23}
                    priority={false}
                  />
                </span>{" "}
                account for unrestricted access.
              </p>
              <button className={styles.modalLoginBtn}>Log In</button>
              <p className={styles.modalSignup}>
                Don&apos;t have an account?{" "}
                <a href="/signup" className={styles.signupLink}>
                  Sign Up Now
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
