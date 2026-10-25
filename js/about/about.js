const btnsCollapse = [...document.querySelectorAll(".btn-collapse")];

btnsCollapse.forEach((btn) => {
  const content = btn.nextElementSibling;
  const icon = btn.querySelector("i");
  btn.addEventListener("click", () => {
    const isExpanded = toggleState(content, icon);
    if (isExpanded) {
      btnsCollapse.forEach((otherBtn) => {
        if (otherBtn === btn) {
          return;
        }
        collapse(otherBtn.nextElementSibling, otherBtn.querySelector("i"));
      });
    }
  });
});

function toggleState(content, icon) {
  icon.classList.toggle("fa-plus");
  icon.classList.toggle("fa-minus");
  return content.classList.toggle("expanded");
}

function collapse(content, icon) {
  if (content.classList.contains("expanded")) {
    toggleState(content, icon);
  }
}
