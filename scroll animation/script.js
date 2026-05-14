// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// --- 1. Intro Animations ---
// Simple reveal for the hero text
gsap.from(".intro-title", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "expo.out",
    delay: 0.2
});

gsap.from(".scroll-indicator", {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    delay: 1
});

// --- 2. Advanced Horizontal Scroll with Velocity Momentum ---

const horizontalContainer = document.querySelector(".horizontal-container");
const panels = gsap.utils.toArray(".panel");

// Calculate how far to move left: 100% per panel, minus one
const scrollTween = gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none", // CRITICAL BEST PRACTICE
    scrollTrigger: {
        trigger: ".horizontal-wrapper",
        pin: true,           
        scrub: 1,            
        start: "top top",
        end: "+=4000"
    }
});


// --- 3. Inner Parallax & Nested ScrollTriggers ---
panels.forEach((panel, i) => {
    const img = panel.querySelector("img");
    const text = panel.querySelector(".panel-text");
    
    // A. Parallax Image sliding within its mask
    if (img) {
        gsap.to(img, {
            xPercent: 20, 
            ease: "none",
            scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween, 
                start: "left right",             
                end: "right left",               
                scrub: true
            }
        });
    }

    // B. Text Parallax (Moves slightly faster than the panel itself)
    if (text) {
        gsap.from(text, {
            x: 200,
            ease: "none",
            scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: "left right",
                end: "center center",
                scrub: true
            }
        });
    }
});

// --- 4. Special Nested Reveal ---
gsap.to(".panel-subtext", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "back.out(1.7)",
    scrollTrigger: {
        trigger: ".nested-box",
        containerAnimation: scrollTween, 
        start: "left center", 
        toggleActions: "play none none reverse" 
    }
});

// --- 5. EPIC OUTRO & CORE: The Grand Finale ---
// We create a master timeline for the pinned ending section
const finalTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".outro-wrapper",
        pin: true,
        scrub: 1, // Restored smooth scrolling integration
        start: "top top",
        end: "+=3000" // Long scroll distance for the entire finale sequence
    }
});

// Scene 1: Expand the white circle mask
finalTl.to(".outro-content", {
    clipPath: "circle(150% at 50% 50%)", 
    duration: 2, // Take up a good portion of the scroll
    ease: "power2.inOut"
})
// Pause slightly so the user can read the text
.to({}, {duration: 0.5})
// Scene 2: Fade out "Beyond Limits" text and move it up
.to(".outro-text-container", {
    y: -100,
    autoAlpha: 0,
    duration: 1
})
// Scene 3: Fade in "Focus" and Floating Orbs seamlessly
.fromTo(".core-elements", 
    { y: 100, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1 }, 
    "<" // The "<" symbol means play at the exact same time as the previous animation (crossfade)
)
// Scene 4: Epic Kinetic Typography Movement
// Animate the marquees horizontally in opposite directions
.fromTo(".m1", { x: "0%" }, { x: "-15%", duration: 2 }, "<")
.fromTo(".m2", { x: "-15%" }, { x: "0%", duration: 2 }, "<")
.fromTo(".m3", { x: "0%" }, { x: "-15%", duration: 2 }, "<")
// Reveal the massive center text from the bottom up (slicing effect)
.to(".core-text", { y: "0%", duration: 1.5, ease: "power3.out" }, "-=1.5");
