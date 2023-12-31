// menu_show-s
const menuNav = document.getElementById('menu-nav'),
toggleNav = document.getElementById('toggle-nav'),
closeNav = document.getElementById('close-nav');

// show
if (toggleNav){
  toggleNav.addEventListener("click", () =>{
    menuNav.classList.add('menu_show')
  })
}

// hidden
if (closeNav){
  closeNav.addEventListener("click", () =>{
    menuNav.classList.remove('menu_show')
  })
}

// menu_show-e







// swiper-home-1-4-s
var homeSwiper = new Swiper(".home-swiper", {
  spaceBetween: 30,
  loop: "true",
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
// swiper-home-1-4-e

// deal-js-s
const tabs = document.querySelectorAll("[data-target]"),
  contentTabs = document.querySelectorAll("[content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target);
    contentTabs.forEach((contentTab) => {
      contentTab.classList.remove('tab_active');
    });

    target.classList.add('tab_active');

    tabs.forEach((tab) => {
      tab.classList.remove('tab_active');
    });

    tab.classList.add('tab_active');
  });
});
// deal-js-e


// show-scrollup-s
function upScroll(){
  const upScroll= document.getElementById('scroll');

  if(this.scrollY >= 350) upScroll.classList.add('scroll_show');
  else upScroll.classList.remove('scroll_show');F
}

window.addEventListener('scroll', upScroll)
// show-scrollup-e