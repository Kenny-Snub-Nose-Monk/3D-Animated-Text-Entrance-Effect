import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './App.css';
import gPic from './img/g-pic/g-pic.png'; // Import the g-pic image

// Helper function to split text into letter spans
function splitTextIntoSpans(text, baseClass = 'fx-letter') {
  return text.split('').map((char, index) => (
    <span
      key={`${baseClass}-${index}`}
      className={`${baseClass} ${baseClass}--${index + 1}`}
      aria-hidden="true" // Hide decorative spans from screen readers
    >
      {char === ' ' ? '\u00A0' : char} {/* Replace space with non-breaking space */}
    </span>
  ));
}

function App() {
  const container = useRef();
  const pRef1 = useRef(); // Ref for first paragraph
  const pRef2 = useRef(); // Ref for second paragraph

  const text1 = '“ Team Taiwan! Team Taiwan!';
  const text2 = 'Taiwan is a great country! ”';

  useGSAP(() => {
    // Select letters within each paragraph separately
    const letters1 = pRef1.current.querySelectorAll('.fx-letter');
    const letters2 = pRef2.current.querySelectorAll('.fx-letter');
    const allLetters = ".fx-letter"; // Selector for the .to() tween
    const parents = ".fx-parent";

    // --- Calculate dynamic start Y positions ---
    const startY = 100; // Default fallback
    // let startY2 = 0; // Default fallback
    // if (pRef1.current && pRef2.current) {
    //     const rect1 = pRef1.current.getBoundingClientRect();
    //     const rect2 = pRef2.current.getBoundingClientRect();
    //     // Start Y for line 1: bottom of line 1 relative to top of line 1 + distance between lines + buffer
    //     startY1 = (rect2.top - rect1.top) + 20; // Start below line 2's top position
    //     // Start Y for line 2: Based on its own height
    //     startY2 = rect2.height * 0.8; // Start from below its own line
    // }
    // -----------------------------------------

    // Make parents visible before animation starts
    gsap.set(parents, { visibility: 'visible' });

    // Initial state for line 1
    gsap.set(letters1, {
      opacity: 0,
      rotationX: 90,
      rotationZ: -30,
      scale: 0.2,
      x: (index) => 30 + index * 1, // Reduced horizontal offset
      y: startY, // Dynamic start Y for line 1
      transformOrigin: 'center center',
    });

    // Initial state for line 2
    gsap.set(letters2, {
      opacity: 0,
      rotationX: 90,
      rotationZ: -15,
      scale: 0.2,
      x: (index) => 30 + index * 1, // Reduced horizontal offset
      y: startY, // Dynamic start Y for line 2
      transformOrigin: 'center center',
    });

    const animationDuration = 1.5;
    const animationStagger = 0.03; // Reduced stagger value

    // Animation for position, scale, opacity
    gsap.to(allLetters, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      duration: animationDuration,
      ease: 'power4.out', // Ease for movement/fade/scale
      stagger: animationStagger,
      delay: 0.5, // Add 0.5 second delay
    });

    // Separate animation for rotation with different ease
    gsap.to(allLetters, {
        rotationX: 0,
        rotationZ: 0,
        duration: animationDuration,
        ease: 'expoScale.out', // Ease specifically for rotation
        stagger: animationStagger,
        delay: 0.5, // Add 0.5 second delay
    });

  }, { scope: container, dependencies: [] }); // Add dependencies array for stability with refs/calculations

  return (
    <div className="app-container" ref={container}>
      <img src={gPic} alt="g-pic" className="background-image" />
      {/* Add refs to paragraphs */}
      <p className="fx-parent" ref={pRef1} aria-label={text1}>
        {splitTextIntoSpans(text1)}
      </p>
      <p className="fx-parent" ref={pRef2} aria-label={text2}>
        {splitTextIntoSpans(text2)}
      </p>
    </div>
  );
}

export default App;
