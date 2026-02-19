document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navbar = document.querySelector(".navbar");

  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }

  // Efecto scroll navbar
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
});
// Animación al hacer scroll
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach((element) => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
const counters = document.querySelectorAll(".stat-number");

counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.innerText.replace("+", "").replace("k", "000");
    const count = +counter.innerText.replace(/\D/g, "");
    const increment = target / 100;

    if (count < target) {
      counter.innerText = Math.ceil(count + increment) + "+";
      setTimeout(updateCount, 20);
    } else {
      counter.innerText = target + "+";
    }
  };

  updateCount();
});
// Fondo dinámico Especialidades
document.addEventListener("DOMContentLoaded", function () {

  const section = document.querySelector(".especialidades-bg");

  const images = [
    "imagenes/img1.jpg",
    "imagenes/img2.jpg",
    "imagenes/img3.jpg",
    "imagenes/img4.jpg",
    "imagenes/img5.jpg"
  ];

  let index = 0;

  function changeBackground() {
    section.style.setProperty(
      "--bg-image",
      `url(${images[index]})`
    );

    section.style.setProperty(
      "background-image",
      `url(${images[index]})`
    );

    index = (index + 1) % images.length;
  }

  // Primera imagen
  changeBackground();

  // Cambiar cada 2 segundos
  setInterval(changeBackground, 2000);

});
