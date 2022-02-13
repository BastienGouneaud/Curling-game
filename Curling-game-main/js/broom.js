//  Créé un nouveau balai
function createBroom(color){
    const RADIUS = 30;
    let broom = new THREE.Group();
    let blackMaterial = new THREE.MeshPhongMaterial({
        color : 0x000000,
        specular: 0xffffff,
        emissive: 0x000000,
        shininess: 100
    });
    let colorMaterial = new THREE.MeshPhongMaterial({
        color : color,
        specular: 0xffffff,
        emissive: 0x000000,
        shininess: 100
    });
    let grayMaterial = new THREE.MeshPhongMaterial({
        color : 0x7f7f7f,
        emissive: 0x000000,
        shininess: 50
    });

    //  Création du manche de balai
    let broomHandleGeometry = new THREE.CylinderGeometry(.01, .01, 1, RADIUS);
    let broomHandle = new THREE.Mesh(broomHandleGeometry, colorMaterial);
    broomHandle.position.set(0, -(1 / 1.97), 1 / 3);
    broomHandle.rotation.x = -(Math.PI / 6);

    //  Création de la poigné du balai
    let handleGripGeometry = new THREE.CylinderGeometry(.015, .015, .1, RADIUS);
    let handleGrip = new THREE.Mesh(handleGripGeometry, grayMaterial);
    handleGrip.position.set(0, -1 + .205, .5);
    handleGrip.rotation.x = -(Math.PI / 6);

    //  Création du bout du manche de balai
    let handleConeGeometry = new THREE.CylinderGeometry(.01 ,.015, .15, RADIUS);
    let handleCone = new THREE.Mesh(handleConeGeometry, grayMaterial);
    handleCone.rotation.x = 5 * Math.PI / 6;
    handleCone.position.set(0, -.075, .084);

    //  Création de la base du balai
    let broomBaseGeometry = new THREE.BoxGeometry(.25, .05, .02);
    let broomBase = new THREE.Mesh(broomBaseGeometry, grayMaterial);
    broomBase.position.set(0, 0, .03)

    //  Création de la brosse du balai
    let broomBrush = new THREE.Mesh(broomBaseGeometry, blackMaterial);
    broomBrush.position.set(0, 0, .01);

    //  Création de l'embout du balai
    let mouthpieceGeometry = new THREE.SphereGeometry(.02, 30, RADIUS);
    let mouthpiece = new THREE.Mesh(mouthpieceGeometry, colorMaterial);
    mouthpiece.position.set(0, -.0063, .045);

    //  Création des poils du balai
    let broomHairGeometry = new THREE.ConeGeometry(.001, .01, 5);
    let broomHair1 = new THREE.Mesh(broomHairGeometry, colorMaterial);
    broomHair1.rotation.x = -(Math.PI / 2);
    let broomHair2 = broomHair1.clone();
    let broomHair3 = broomHair1.clone();
    broomHair1.position.set(0, 0, 0);
    broomHair2.position.set(.1, 0, 0);
    broomHair3.position.set(-.1, 0, 0);

    //  Activation de la projection des ombres
    broomHandle.castShadow = true;
    handleGrip.castShadow = true;
    handleCone.castShadow = true;
    broomBase.castShadow = true;
    broomBrush.castShadow = true;
    mouthpiece.castShadow = true;

    //  Construction du balai
    broom.add(broomHandle, handleGrip, handleCone, broomBase, broomBrush, mouthpiece, broomHair1, broomHair2, broomHair3);
    broom.rotation.z = Math.PI / 3;
    return broom
}