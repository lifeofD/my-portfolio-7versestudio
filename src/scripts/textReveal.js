import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".reveal-text").forEach((text) => {
    const words = text.textContent.trim().split(/\s+/);

    text.innerHTML = words
      .map((word) => `<span class="word">${word}</span>`)
      .join(" ");

    gsap.to(text.querySelectorAll(".word"), {
      color: "var(--primary-text-color)",
      stagger: 0.025,
      ease: "none",
      scrollTrigger: {
        trigger: text,
        start: "top 85%",
        end: "bottom 60%",
        scrub: true,
      },
    });
  });
});

// Initialize animation when the DOM is ready
function initHeaderAnimation() {
  let mm = gsap.matchMedia();

  // Desktop Animation (768px and up)
  mm.add("(min-width: 768px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top -50px", // Starts right away when scrolling begins
        end: "top -400px", // Extended distance for smoother scrubbing
        scrub: 1,
      },
    });

    tl.to(
      ".nav-capsule",
      {
        width: "410px", // Shrinks precisely to wrap the remaining items
        padding: "8px 24px",
        duration: 1,
      },
      0,
    );

    tl.to(
      ".studio-text",
      {
        opacity: 0,
        width: 0,
        margin: 0,
        duration: 1,
        ease: "power2.out",
      },
      0,
    );
  });

  // Mobile Animation (under 768px)
  mm.add("(max-width: 767px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top -50",
        end: "top -300px",
        scrub: 1,
      },
    });

    tl.to(
      ".nav-capsule",
      {
        width: "360px", // Shrinks to perfectly wrap mobile items
        padding: "8px 24px",
        duration: 1,
      },
      0,
    );

    tl.to(
      ".studio-text",
      {
        opacity: 0,
        width: 0,
        margin: 0,
        duration: 1,
        ease: "power2.out",
      },
      0,
    );
  });
}

// Start the animation
initHeaderAnimation();

// Select all elements that have the data-speed attribute
const parallaxElements = document.querySelectorAll("[data-speed]");

parallaxElements.forEach((el) => {
  const speed = parseFloat(el.getAttribute("data-speed") || "1");

  // The multiplier (250) determines the overall travel distance.
  // Increase this number for more dramatic movement, decrease for subtlety.
  const yMovement = (1 - speed) * 250;

  gsap.to(el, {
    y: yMovement,
    ease: "none", // Linear easing is required for scrubbed animations
    scrollTrigger: {
      trigger: el,
      start: "top bottom", // Animation starts when element enters viewport from bottom
      end: "bottom top", // Animation ends when element leaves viewport at the top
      scrub: 1, // 1-second smoothing delay
      invalidateOnRefresh: true, // Recalculates start/end points if the window is resized
    },
  });
});

// batch() automatically detects when elements enter the viewport
ScrollTrigger.batch(".reveal-element", {
  // Triggers exactly when the top of the element hits the bottom of the screen
  start: "top bottom",

  // 'batch' is an array of all elements that entered the screen at this exact moment
  onEnter: (batch) => {
    gsap.to(batch, {
      opacity: 1,
      y: 0, // Move upwards to natural position
      duration: 0.8, // How long the animation takes
      stagger: 0.15, // THE MAGIC: 150ms time delay between each element appearing
      ease: "power2.out", // Smooth deceleration
      overwrite: true, // Prevents animation conflicts
    });
  },

  // Optional: If you want them to hide again when scrolling back to the very top
  onLeaveBack: (batch) => {
    gsap.set(batch, { opacity: 0, y: 30, overwrite: true });
  },
});
