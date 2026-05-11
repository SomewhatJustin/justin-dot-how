import PhotoSwipeLightbox from "/assets/photoswipe/photoswipe-lightbox.esm.js"

const lightbox = new PhotoSwipeLightbox({
  gallery: "#photo-gallery",
  children: "a",
  pswpModule: () => import("/assets/photoswipe/photoswipe.esm.js"),
})

lightbox.on("uiRegister", () => {
  lightbox.pswp.ui.registerElement({
    name: "custom-caption",
    order: 9,
    isButton: false,
    appendTo: "root",
    onInit: (captionElement, pswp) => {
      pswp.on("change", () => {
        const slideElement = pswp.currSlide.data.element
        const caption = slideElement?.querySelector(".photo-caption")
        captionElement.textContent = caption?.textContent || ""
      })
    },
  })
})

lightbox.init()
