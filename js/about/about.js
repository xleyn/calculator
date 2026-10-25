const btnCollapse = document.querySelectorAll(".btn-collapse");
const contentCollapse = document.querySelectorAll(
  ".btn-collapse + .content-collapse",
);

btnCollapse.forEach((btn, idx) => {
  const content = contentCollapse[idx];
  btn.addEventListener("click", () => {
    content.classList.toggle("expanded");
  });
});
