// Import Vercel Analytics dynamically
import("@vercel/analytics").then(({ inject }) => {
  inject(); // Initializes Vercel Analytics
});

// Fade-in animation using IntersectionObserver
document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  fadeElements.forEach((el) => observer.observe(el));

  // JavaScript for Typing Animation with Gradient Effect for "Hi"
  let greetingElement = document.getElementById("greeting");
  let hiPart = "Hi I'm Muhammad Razi";
  let index = 0;

  function typeWriter() {
    if (index < hiPart.length) {
      greetingElement.innerHTML = `<span id="hi-text">${hiPart.substring(
        0,
        index + 1
      )}</span>`;
      index++;
      setTimeout(typeWriter, 200); // Typing speed for 'Hi'
    }
  }

  typeWriter(); // Start typing animation
});
