//  Retourne un terrain de curling
function createTerrain() {
    //  Longueur du terrain 
    const TERRAINLENGTH = 25;
    //  Largeur du terrain            
    const TERRAINWIDTH = TERRAINLENGTH / 9.144;
    //  Hauteur d'un bord
    const BORDERHEIGHT = (TERRAINWIDTH * 5) / 100;
    //  Profondeur d'un bord
     const BORDERDEPTH = (TERRAINWIDTH * 2) / 100;
    //  Terrain de curling
    let terrain = new THREE.Group();
    let surfaceMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        emissive: 0x000000,
        shininess: 100
    });
    let borderMaterial = new THREE.MeshPhongMaterial({
        color: 0x999999
    });

    //  Surface du terrain de curling
    let surfaceGeometry = new THREE.PlaneGeometry(TERRAINWIDTH, TERRAINLENGTH);
    let surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    //  Active les ombres sur le plan
    surface.receiveShadow = true;

    //  Bords du terrain
    let borderTopGeomety = new THREE.BoxGeometry(TERRAINWIDTH, BORDERHEIGHT, BORDERDEPTH);
    let borderTop = new THREE.Mesh(borderTopGeomety, borderMaterial);
    borderTop.position.set(0, TERRAINLENGTH / 2 + BORDERHEIGHT / 2, BORDERDEPTH / 2);
    let borderBottom = borderTop.clone();
    borderBottom.position.set(0, -(TERRAINLENGTH / 2 + BORDERHEIGHT / 2), BORDERDEPTH / 2);
    let borderRightGeomety = new THREE.BoxGeometry(BORDERHEIGHT, TERRAINLENGTH + BORDERHEIGHT * 2, BORDERDEPTH);
    let borderRight = new THREE.Mesh(borderRightGeomety, borderMaterial);
    borderRight.position.set(TERRAINWIDTH / 2 + BORDERHEIGHT / 2, 0, BORDERDEPTH / 2);
    let borderLeft = borderRight.clone();
    borderLeft.position.set(-(TERRAINWIDTH / 2 + BORDERHEIGHT / 2), 0, BORDERDEPTH / 2);

    //  Lignes de jeu
    let a = new THREE.Vector3(TERRAINWIDTH / 2, -7.5, .003);
    let b = new THREE.Vector3(-(TERRAINWIDTH / 2), -7.5, .003);
    let startLine = createSegment(a, b, 0xff0000);
    let arrivalLine = startLine.clone();
    arrivalLine.position.y = 15; // 2 * 7.5 car la position initiale du clone = -7.5 et on veut se positionner à 7.5

    //  Maisons
    let house1 = createHouse((TERRAINWIDTH / 2) * .8);
    house1.position.set(0, (TERRAINLENGTH / 2) / 1.31, 0);
    let house2 = createHouse((TERRAINWIDTH / 2) * .8);
    house2.position.set(0, -((TERRAINLENGTH / 2) / 1.31), 0);

    //  Construction du terrain de curling
    terrain.add(surface, borderTop, borderRight, borderBottom, borderLeft, startLine, arrivalLine, house1, house2);
    return terrain;
}

//  Retourne un segment AB avec une couleur spécifique
function createSegment(a, b, color) {
    let material = new THREE.LineDashedMaterial({
        color: color,
        linewidth: 2
    });
    let geometry = new THREE.Geometry();
    geometry.vertices.push(a, b);
    let segment = new THREE.Line(geometry, material);
    return segment;
}

//  Retourne une maison
function createHouse(radius) {
    let house = new THREE.Group();
    let circle1 = createCircle(radius, 0xff0000);
    let circle2 = createCircle(radius * 2 / 3, 0xffffff);
    let circle3 = createCircle(radius / 3, 0x0000ff);

    circle1.position.z = .001;
    circle2.position.z = .002;
    circle3.position.z = .003;
    house.add(circle1, circle2, circle3);
    return house;
}

//  Retourne un cercle
function createCircle(radius, color) {
    let geometry = new THREE.CircleGeometry(radius, 100);
    let material = new THREE.MeshPhongMaterial({
        color: color,
        specular: 0xffffff,
        emissive: 0x000000,
        shininess: 100
    });
    let circle = new THREE.Mesh(geometry, material);
    circle.receiveShadow = true;
    return circle;
}