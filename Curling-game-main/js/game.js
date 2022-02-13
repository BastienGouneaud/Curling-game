function play(scene, camera) {
    const RED = new THREE.Color(0xff0000); // rouge
    const BLUE = new THREE.Color(0x0000ff); // bleu
    const GREEN = new THREE.Color(0x00ff00); // vert
    const SPEED = 1; // vitesse du tir d'une pierre
    const FRAMETIME = 16.6; // temps par frame en ms
    const BROOM_PLACEMENT = .5; // écart entre la pierre et le balai
    const OFFSET = .03; // constante d'offset x de déplacement du balai
    const MAX_MOVE = .55; // déplacement rectiligne maximum de l'animation du balai

    let t = 0; // variable de temps t
    let direction = true; // sens x de déplacement du balai
    let offsetXBroom = 0; // offset x total de déplacement du balai
    let p0 = new THREE.Vector3(0, -7.5, .004);
    let p1 = new THREE.Vector3(0, 0, .004);
    let p2 = new THREE.Vector3(0, 7.5, .004);
    let trajectory = createTrajectory(p0, p1, p2, GREEN); // Initialisation de la trajectoire
    let trajectoryLength = getTrajectoryLength(p0, p1, p2); // longueur de la courbe de trajectoire
    let tIncrement = (SPEED / trajectoryLength) / FRAMETIME; // incrément de la variable de temps t pour l'animation
    let rock = null; // pierre
    let broom = null; // balai
    let shootedRocks = []; // tableau des pierres qui ont été tirées
    let turn = 0; // tour de l'utilisateur
    let movement = false; // est-ce qu'une pierre est en mouvement ?
    let gui = createGUI();
    let terrain = createTerrain();
    let cameraFree = true;

    setScoreColor(colorChoice());
    cameraPositionBase(camera);
    scene.add(terrain);
    scene.add(trajectory);
    playGame();

    //  Fonction de jeu
    function playGame() {
        setTimeout(function () {
            // Si aucune pierre est en mouvement
            if (!rock && !movement) {
                if (broom)
                    scene.remove(broom);
                if (turn % 2 == 0) {
                    rock = createRock(RED);
                    broom = createBroom(RED);
                }
                else {
                    rock = createRock(BLUE);
                    broom = createBroom(BLUE);
                }
                rock.position.y = -7.5;
                broom.position.y = -7;
                scene.add(rock);
                scene.add(broom);
            }
            if (turn < 10)
                playGame();
        }, 1000);
    }

    //  Gestion du GUI
    function createGUI() {
        let gui = new dat.GUI();
        let menuGui = new function () {
            // Modifictaion des points de contrôles de la trajectoire
            this.p1x = p1.x;
            this.p1y = p1.y;
            this.p2x = p2.x;
            this.p2y = p2.y;
    
            this.shoot = function() {
                if (rock && !movement) {
                    trajectory.visible = false;
                    shootRock(rock, broom, tIncrement, p0.clone(), p1.clone(), p2.clone(), FRAMETIME);
                    shootedRocks.push(rock);
                    rock = null;
                    broom = null;
                    turn++;
                }
            }

            this.viewBase = function() {
                if (cameraFree && !movement)
                    cameraPositionBase(camera);
            }

            this.viewHouse = function() {
                if (cameraFree && !movement)
                    cameraPositionHouse(camera)
            }
        };

        let trajectoryGui = gui.addFolder("Trajectory");
        trajectoryGui.add(menuGui, "p1x", -1, 1).onChange(function() {
            p1.x = menuGui.p1x;
            modifyTrajectory();
        });
        trajectoryGui.add(menuGui, "p1y", -7.5, 7.5).onChange(function() {
            p1.y = menuGui.p1y;
            modifyTrajectory();
        });
        trajectoryGui.add(menuGui, "p2x", -1.24, 1.24).onChange(function() {
            p2.x = menuGui.p2x;
            modifyTrajectory();
        });
        trajectoryGui.add(menuGui, "p2y", 7.5, 12.2).onChange(function() {
            p2.y = menuGui.p2y;
            modifyTrajectory();
        });
        gui.add(menuGui, "shoot");
        gui.add(menuGui, "viewBase");
        gui.add(menuGui, "viewHouse");
        return gui;
    }

    //  Modifie la trajectoire si une pierre est crée et aucun mouvement n'est en cours
    function modifyTrajectory() {
        if (rock && !movement && cameraFree) {
            scene.remove(trajectory);
            trajectory = createTrajectory(p0, p1, p2, GREEN);
            trajectoryLength = getTrajectoryLength(p0, p1, p2);
            scene.add(trajectory);
        }
    }
    
    //  Fonction de tir
    function shootRock(rock, broom, tIncrement, p0, p1, p2, FRAMETIME) {
        setTimeout(function() {
            //  si t <= 1 on est pas à la fin de la trajectoire
            if (t <= 1) {
                cameraTracking(camera, rock.position);
                // La pierre est en mouvement
                movement = true;
                //  nouveau point de la courbe
                let newPosition = getNewPosition(t, p0, p1, p2);
                //  nouvelle position du balai en fonction de la courbe et de son offset de déplacement
                broom.position.set(newPosition.x + offsetXBroom, newPosition.y + BROOM_PLACEMENT, 0);
                //  calcul de la distance entre la pierre et le balai
                let distanceRockBroom = Math.sqrt(
                    Math.pow(broom.position.x - newPosition.x, 2) + 
                    Math.pow(broom.position.y - newPosition.y, 2)
                );
                //  update du sens de déplacement du balai en fonction de distanceRockBroom
                direction = updateBroomDirection(distanceRockBroom, direction, MAX_MOVE);
                //  incrémentation de l'offset en fonction du sens
                offsetXBroom += direction ? OFFSET : -OFFSET;
                //  actualisation du déplacement du balai en fonction du sens et de l'offset
                broom.position.x += direction ? OFFSET : -OFFSET;
                if (broom.position.y >= 7.5)
                    broom.visible = false;
                //  posistionnement de la pierre
                rock.position.set(newPosition.x, newPosition.y, 0);
                //  incrémentation de t
                t += tIncrement;
                checkCollision(rock, SPEED, FRAMETIME);
                shootRock(rock, broom, tIncrement, p0, p1, p2, FRAMETIME);
            }
            else {
                cameraFree = false;
                // La pierre n'est plus en mouvement
                movement = false;
                t = 0;
                if (broom)
                    scene.remove(broom);
                setTimeout(function() {
                    updateScore(shootedRocks);
                    cameraPositionBase(camera)
                    cameraFree = true;
                    trajectory.visible = true;
                    resetTrajectory();
                }, 3000);
            }
        }, FRAMETIME); 
    }

    //  Check si il y a une collision ou non
    function checkCollision(rock, speed, frameTime) {
        for (i = 0; i < shootedRocks.length; i++) {
            if (rock != shootedRocks[i]) {
                let rocksVector = new THREE.Vector3(
                    shootedRocks[i].position.x - rock.position.x,
                    shootedRocks[i].position.y - rock.position.y,
                    shootedRocks[i].position.z - rock.position.z
                );
                let distance = Math.sqrt(
                    Math.pow(rocksVector.x, 2) + 
                    Math.pow(rocksVector.y, 2) + 
                    Math.pow(rocksVector.z, 2)
                );
                if (distance <= .228) {
                    rebound(speed * .2, rock.position, rocksVector, shootedRocks[i], frameTime);
                    return true;
                }
            }
        }
        return false;
    }

    //  Gestion des collisions
    function rebound(speed, rock1Postion, rocksVector, rock2, frameTime) {
        setTimeout(function() {
            let distance = Math.sqrt(
                Math.pow(rock2.position.x - rock1Postion.x, 2) + 
                Math.pow(rock2.position.y - rock1Postion.y, 2) + 
                Math.pow(rock2.position.z - rock1Postion.z, 2)
            );
            // collision
            if (distance <= .228) {
                rock2.position.x += speed * rocksVector.x;
                rock2.position.y += speed * rocksVector.y;
                rebound(speed, rock1Postion, rocksVector, rock2, frameTime);
            }
            else if (speed > .000001 && rock2.position.x > -1.24 && rock2.position.x < 1.24 && rock2.position.y < 12.4) {
                rock2.position.x += speed * rocksVector.x;
                rock2.position.y += speed * rocksVector.y;
                speed *= .9;
                checkCollision(rock2, speed, frameTime);
                rebound(speed, rock1Postion, rocksVector, rock2, frameTime);
            }
            else {
                if (rock2.position.x < -1.24 || rock2.position.x > 1.24 || rock2.position.y > 12.4)
                    scene.remove(rock2);
            }
        }, FRAMETIME);
    }

    //  Reset de points de contrôles et de la trajectoires aux valeurs de base
    function resetTrajectory() {
        p0 = new THREE.Vector3(0, -7.5, .004);
        p1 = new THREE.Vector3(0, 0, .004);
        p2 = new THREE.Vector3(0, 7.5, .004);
        modifyTrajectory();
    }
}

//  Calcul d'un nouveau point de la courbe avec les polynômes de Bernstein
function getNewPosition(t, p0, p1, p2) {
    //  Polynômes de Bernstein
    const b0 = Math.pow(1 - t, 2);
    const b1 = 2 * t * (1 - t);
    const b2 = Math.pow(t, 2);

    //  p0 * b0 | p1 * b1 | p2 * b2
    let point0 = p0.clone().multiplyScalar(b0);
    let point1 = p1.clone().multiplyScalar(b1);
    let point2 = p2.clone().multiplyScalar(b2);
    //  Return l'additions des vecteurs
    return point0.add(point1.add(point2));
}

//  Modifie le sens de déplacement du balai
function updateBroomDirection(distanceRockBroom, direction, maxMove) {
    if (distanceRockBroom > maxMove) {
        if (!direction)
            direction = true;
        else
            direction = false;
    }
    return direction;
}

//  Initialise la position de la caméra
function cameraPositionBase(camera) {
    camera.position.set(0, -25, 5);
    camera.lookAt(new THREE.Vector3(0, -7.5, 0));
}

//  Point de vue de la caméra sur la maison cible
function cameraPositionHouse(camera) {
    camera.position.set(0, 0, 5);
    camera.lookAt(new THREE.Vector3(0, 10, 0));
}

//  Tracking de la pierre lors du tir
function cameraTracking(camera, rock1Postion) {
    camera.position.set(0, rock1Postion.y - 5, 1);
    camera.lookAt(new THREE.Vector3(0, rock1Postion.y + 3, 0));
}