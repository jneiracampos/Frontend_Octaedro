import lottieWeb from "https://cdn.skypack.dev/lottie-web";
var animations = lottieWeb.loadAnimation({
    container: document.getElementById("prueba_animacion"),
    path: "../animations/info1.json", 
    renderer: 'svg',
    loop: true,
    autoplay: true,
    name: "Demo Animation",
})