const NUMBER_OF_POINTS = 30;

//  Créé une trajectoire en fonction de p0, p1, p2
function createTrajectory(p0, p1, p2, color) {
    const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
    const points = curve.getPoints(NUMBER_OF_POINTS);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color : color 
    });
    return new THREE.Line(geometry, material);
}

//  Calcul la longueur de la trajectoire
function getTrajectoryLength(p0, p1, p2) {
    let i;
    let length = 0;
    const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
    const points = curve.getPoints(NUMBER_OF_POINTS);

    for (i = 1; i < NUMBER_OF_POINTS; i++) {
        length += Math.sqrt(
            Math.pow(points[i - 1].x - points[i].x, 2) + 
            Math.pow(points[i - 1].y - points[i].y, 2) +
            Math.pow(points[i - 1].z - points[i].z, 2)
        );
    }
    return length;
}