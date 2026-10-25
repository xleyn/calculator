const btnsCollapse = [...document.querySelectorAll(".about-btn")];

function openSectionFromHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const btn = document.querySelector(`#about-btn-${id}`);
  focusSection(btn);
}

function focusSection(btn) {
  const content = btn.nextElementSibling;
  const icon = btn.querySelector("i");
  const isExpanded = toggleState(content, icon);
  if (isExpanded) {
    btnsCollapse.forEach((otherBtn) => {
      if (otherBtn === btn) {
        return;
      }
      collapse(otherBtn.nextElementSibling, otherBtn.querySelector("i"));
    });
  }
}

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

btnsCollapse.forEach((btn) => {
  console.log(btn);
  btn.addEventListener("click", () => focusSection(btn));
});

openSectionFromHash();
