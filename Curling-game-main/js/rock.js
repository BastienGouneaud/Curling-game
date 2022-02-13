//  Créé une nouvelle pierre
function createRock(color) {
    let rock = new THREE.Group();
    //  Création des material
    const grayMaterial = new THREE.MeshPhongMaterial({
        color : 0xb1b1b1,
        side: THREE.DoubleSide,
        specular: 0xffffff,
        emissive: 0x000000,
        shininess: 100
    });
    const colorMaterial = new THREE.MeshPhongMaterial({
        color : color,
        emissive: 0x000000,
    });
    //  Vecteur de rotation et angle de rotation
    const rotationVector = new THREE.Vector3(1, 0, 0);
    const rotationAngle = Math.PI / 2;

    // Construction des courbes de bézier et jointure G1
    const bezierTop = new THREE.CubicBezierCurve(
        new THREE.Vector2(-.1143, 0),
        new THREE.Vector2(-.1143, .045),
        new THREE.Vector2(-.09525, .045),
        new THREE.Vector2(0, .045)
    );
    const bezierMid = new THREE.QuadraticBezierCurve3(
        new THREE.Vector2(-.1143, -.01905),
        new THREE.Vector2(-.1143, 0),
        new THREE.Vector2(-.1143, 0)
    );
    const bezierBoth = new THREE.CubicBezierCurve(
        new THREE.Vector2(-.1143, -.01905),
        new THREE.Vector2(-.1143, -.06405),
        new THREE.Vector2(-.09525, -.06405),
        new THREE.Vector2(0, -.06405)
    );
    //  Création des tableaux de points correspondant aux courbes de bézier
    const curveTopPoints = bezierTop.getPoints(30);
    const curveMidPoints = bezierMid.getPoints(30);
    const curveBothPoints = bezierBoth.getPoints(30);

    //  Création des Lathes à partir des tableaux de points
    const topLatheGeometry = new THREE.LatheGeometry(curveTopPoints, 50);
    let topLathe = new THREE.Mesh(topLatheGeometry, grayMaterial);
    const midLatheGeometry = new THREE.LatheGeometry(curveMidPoints, 50);
    let midLathe = new THREE.Mesh(midLatheGeometry, colorMaterial);
    const bothLatheGeometry = new THREE.LatheGeometry(curveBothPoints, 50);
    let bothLathe = new THREE.Mesh(bothLatheGeometry, grayMaterial);

    // Rotation et positionnement y des Lathes
    topLathe.rotateOnAxis(rotationVector, rotationAngle);
    midLathe.rotateOnAxis(rotationVector, rotationAngle);
    bothLathe.rotateOnAxis(rotationVector, rotationAngle);
    topLathe.position.z = .06405;
    midLathe.position.z = .06405;
    bothLathe.position.z = .06405;

    // Création de la poignée de la pierre de curling
    const cylinder1 = cylinder(.07, .002, colorMaterial); // base de la poignée
    const cylinder2 = cylinder(.007, .02, colorMaterial); // barre verticale
    const cylinder3 = cylinder(.007, .1, colorMaterial); // barre horizontale
    const sphereGeometry = new THREE.SphereGeometry(.007, 32, 16);
    const sphere1 = new THREE.Mesh(sphereGeometry, colorMaterial); // coude de la poignée
    const sphere2 = new THREE.Mesh(sphereGeometry, colorMaterial); // embout de la poignée

    // Rotation et placement de la poignée
    cylinder1.rotateOnAxis(rotationVector, rotationAngle);
    cylinder2.rotateOnAxis(rotationVector, rotationAngle);
    cylinder1.position.set(0, 0, .109);
    cylinder2.position.set(0, -.05, .12);
    cylinder3.position.set(0, 0, .13);
    sphere1.position.set(0, -.05, .13);
    sphere2.position.set(0, .05, .13);

    //  Activation du cast des ombres
    cylinder1.castShadow = true;
    cylinder2.castShadow = true;
    cylinder3.castShadow = true;
    sphere1.castShadow = true;
    sphere2.castShadow = true;
    topLathe.castShadow = true;
    midLathe.castShadow = true;
    
    // Construction de la pierre
    rock.add(cylinder1, cylinder2, cylinder3, sphere1, sphere2, topLathe, midLathe, bothLathe);
    rock.rotation.z = Math.PI;
    return rock
}

//  Créé un nouveau cylindre
function cylinder(radius, height, material) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 50, 2, false, 0, 2 * Math.PI);
    return new THREE.Mesh(geometry, material);
}