//  Initialise la lumière de la scène de façon basique
function light(scene) {
    let startLight = new THREE.PointLight(0xffffff, 1, 100);
    let arrivalLight = startLight.clone();
    startLight.position.set(1, -7.5, 5);
    arrivalLight.position.set(-1, 7.5, 20);
    scene.add(startLight);
    scene.add(arrivalLight); 
}