/* B&B I Gerani — interazioni: menu, reveal, contatori, parallax, prenota, lightbox rail */
(function(){
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // menu mobile
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function(){
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.addEventListener("click", function(e){
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  // reveal on scroll
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: .12 });
    reveals.forEach(function(el, i){ el.style.transitionDelay = (i % 3) * 90 + "ms"; io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add("is-in"); });
  }

  // contatori
  var stats = [].slice.call(document.querySelectorAll(".stat__n[data-count]"));
  function animate(el){
    var target = +el.getAttribute("data-count");
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduced) { el.textContent = target + suffix; return; }
    var t0 = null, dur = 1100;
    function step(ts){
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) { animate(en.target); io2.unobserve(en.target); }
      });
    }, { threshold: .4 });
    stats.forEach(function(el){ io2.observe(el); });
  } else {
    stats.forEach(animate);
  }

  // parallax lieve pe hero (desktop)
  var heroImg = document.querySelector(".hero__img");
  if (heroImg && !reduced && window.matchMedia("(min-width: 900px)").matches) {
    var ticking = false;
    window.addEventListener("scroll", function(){
      if (!ticking) {
        requestAnimationFrame(function(){
          var y = window.scrollY || 0;
          if (y < 900) heroImg.style.transform = "translateY(" + (y * 0.06) + "px) scale(1.02)";
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // prenotare: compune mesajul
  var form = document.getElementById("prenotaForm");
  var res = document.getElementById("prenotaRisultato");
  var sintesi = document.getElementById("prenotaSintesi");
  var waLink = document.getElementById("waLink");
  var mailLink = document.getElementById("mailLink");
  function fmt(iso){
    if (!iso) return "";
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }
  if (form) {
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var dIn = document.getElementById("inDate").value;
      var dOut = document.getElementById("outDate").value;
      var osp = document.getElementById("ospiti").value;
      if (!dIn || !dOut) return;
      var msg = "Buongiorno, vorrei verificare la disponibilità al B&B I Gerani dal " + fmt(dIn) + " al " + fmt(dOut) + " per " + osp + (osp === "1" ? " persona." : " persone.") + " Grazie!";
      sintesi.textContent = " dal " + fmt(dIn) + " al " + fmt(dOut) + " per " + osp + (osp === "1" ? " persona" : " persone");
      waLink.href = "https://wa.me/393386752691?text=" + encodeURIComponent(msg);
      mailLink.href = "mailto:i.gerani@tiscali.it?subject=" + encodeURIComponent("Richiesta disponibilità dal " + fmt(dIn) + " al " + fmt(dOut)) + "&body=" + encodeURIComponent(msg);
      res.hidden = false;
      res.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
    });
  }

  // rail: navigare cu roata mouse-ului
  var rail = document.querySelector(".rail");
  if (rail) {
    rail.addEventListener("wheel", function(e){
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        rail.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }
})();
