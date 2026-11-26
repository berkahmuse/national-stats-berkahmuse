// Nippon Numbers — router and boot.
// Hash routes: #/ (home), #/population, #/births, #/work, #/economy, #/sources.
// After each render, the view's chart setup runs; charts redraw on resize.

import { viewHome, viewPopulation, viewBirths, viewWork, viewEconomy, viewSources } from "./views.js";
import { redrawAll } from "./charts.js";

const ROUTES = {
  "/": { title: "Nippon Numbers — Japan in statistics", view: viewHome, nav: "Overview" },
  "/population": { title: "Population & ageing — Nippon Numbers", view: viewPopulation, nav: "Population" },
  "/births": { title: "Births, deaths & fertility — Nippon Numbers", view: viewBirths, nav: "Births" },
  "/work": { title: "Work & jobs — Nippon Numbers", view: viewWork, nav: "Work" },
  "/economy": { title: "Economy & prices — Nippon Numbers", view: viewEconomy, nav: "Economy" },
  "/sources": { title: "Sources & methods — Nippon Numbers", view: viewSources, nav: "Sources" },
};

const app = document.getElementById("app");
let chartSetups = [];
let resizeTimer = null;

function currentRoute() {
  const hash = window.location.hash || "#/";
  const path = hash.slice(1) || "/";
  return ROUTES[path] ? path : "/";
}

function render() {
  const path = currentRoute();
  const route = ROUTES[path];
  chartSetups = [];
  const register = (fn) => chartSetups.push(fn);
  app.innerHTML = route.view(register);
  document.title = route.title;
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#${path}`);
    if (a.getAttribute("href") === `#${path}`) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  // Charts need the DOM in place and laid out before measuring canvases.
  requestAnimationFrame(() => redrawAll(chartSetups));
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => redrawAll(chartSetups), 150);
});

render();
