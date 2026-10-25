const btnCollapse = document.querySelectorAll(".btn-collapse");
const contentCollapse = document.querySelectorAll(
  ".btn-collapse + .content-collapse",
);

btnCollapse.forEach((btn, idx) => {
  const content = contentCollapse[idx];
  btn.addEventListener("click", () => {
    content.classList.toggle("expanded");
    const collapseIcon = btn.querySelector("i");
    collapseIcon.classList.toggle("fa-plus");
    collapseIcon.classList.toggle("fa-minus");
  });
});
