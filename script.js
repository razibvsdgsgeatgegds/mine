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
  });
  
  // JavaScript for Typing Animation with Gradient Effect for "Hi"
let greetingElement = document.getElementById('greeting');
let hiPart = "Hi I'm Muhammad Razi";
let index = 0;

function typeWriter() {
  // Write the "Hi" part with the gradient effect
  if (index < hiPart.length) {
    greetingElement.innerHTML = `<span id="hi-text">${hiPart.substring(0, index + 1)}</span>`;
    index++;
    setTimeout(typeWriter, 200); // Typing speed for 'Hi'
  }
}
document.addEventListener("DOMContentLoaded", function() {
  typeWriter();
});

