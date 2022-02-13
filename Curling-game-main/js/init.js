//  Initialisation de l'affichage
function init() {
    //  Création d'une scene
    let scene = new THREE.Scene();
    //  Création d'une caméra
    let camera = new THREE.PerspectiveCamera(
        20,                                         // fov
        window.innerWidth / window.innerHeight,     // ratio
        0.1,                                        // near
        1000                                        // far
    );
    //  Création du renderer WebGL
    let renderer = new THREE.WebGLRenderer({
        antialias: true                             // antialiasing activé
    });
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(window.innerWidth * .997, window.innerHeight * .997);
    //  Ajout du rendu au DOM
    document.body.appendChild(renderer.domElement);
    //  Appel de la fonction d'éclairage de la scène
    light(scene);
    //  Appel de la fonction de jeu
    play(scene, camera);
    //  Appel de la fonction d'animation
    animate();

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
}