export const mobileMenu = function (menu, burger, close, media = 991) {
  const body = document.body;
  const mobileMenu = document.querySelector(`${menu}`);
  if (!mobileMenu) {
    return;
  }
  const burgerBtn = document.querySelector(`${burger}`);
  if (!burgerBtn) {
    return;
  }
  const closeBtn = document.querySelector(`${close}`);
  if (!closeBtn) {
    return;
  }

  // с 992px и выше
  const mediaQuery = window.matchMedia(`(min-width: ${media + 1}px)`);

  function showMenu(menu, body) {
    menu.classList.add("visible");
    body.classList.add("lock");
  }

  function hideMenu(menu, body) {
    menu.classList.remove("visible");
    body.classList.remove("lock");
  }

  burgerBtn.addEventListener("click", function () {
    if (window.innerWidth <= media) {
      showMenu(mobileMenu, body);
    }
  });

  closeBtn.addEventListener("click", function () {
    if (window.innerWidth <= media) {
      hideMenu(mobileMenu, body);
    }
  });

  // Слушает 992px и на 992 мобильное меню будет
  // "исчезать", так как переходит
  // в обычное меню

  mediaQuery.addEventListener("change", () => {
    if (mediaQuery.matches && mobileMenu.classList.contains("visible")) {
      hideMenu(mobileMenu, body);
    }
  });

  // Прячем меню после клика по ссылкам, у которых нет сабменю -
  // в это время происходит переход по ссылке и меню должно быть
  // убрано
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (
        !window.innerWidth <= media &&
        !mobileMenu.classList.contains("visible")
      ) {
        return;
      }

      if (
        link.nextElementSibling &&
        link.nextElementSibling.classList.contains("sub-menu")
      ) {
        return;
      }
      hideMenu(mobileMenu, body);
    });
  });

  // Прячем меню при нажатии Escape
  document.addEventListener("keydown", (e) => {
    if (window.innerWidth <= media) {
      if (e.key == "Escape") {
        hideMenu(mobileMenu, body);
      }
    }
  });
};
