import { mobileMenu } from "../components/mobileMenu.js";
import { Carousel } from "@fancyapps/ui";
import { Thumbs } from "../../../dist/libs/fancybox/carousel.thumbs.esm.js";

document.addEventListener("DOMContentLoaded", function () {
  mobileMenu(".header__mobile", ".burgerBtn", ".closeMenuBtn", 991);

  const prodSlider = document.querySelector(".productSlider__slider");
  if (prodSlider) {
    const productCarousel = new Carousel(
      prodSlider,
      {
        transition: "slide",
        preload: 3,
        Navigation: false,
        Dots: false,
        Thumbs: {
          type: "classic",
        },
      },
      { Thumbs }
    );
  }

  const prodTabsBlock = document.querySelector("#prodTabs");
  if (prodTabsBlock) {
    const prodTabs = new VanillaTabs({
      selector: "#prodTabs",
      type: "horizontal",
      responsiveBreak: 200,
    });
  }
}); //------- end document.addEventListener ---------
