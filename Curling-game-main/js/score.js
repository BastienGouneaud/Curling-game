const HOUSE_CENTER = new THREE.Vector3(0, 9.54, 0);
const HOUSE_RADIUS = 1.14;

//  Demande à l'utilisateur de choisir une couleur (bleu ou rouge)
function colorChoice() {
    let input = prompt("Choisissez la couleur initiale du texte (rouge/bleu)").toLowerCase();

    if (input == "rouge")
        return "#ff0000";
    return "#0000ff";
}

//  Change la couleur du tableau de score
function setScoreColor(color) {
    document.getElementById("scoreArray").style.color = color;
}

//  Met à jour le score et la couleur du tableau de score en fonction de l'équipe gagnante
function updateScore(rockArray) {
    //  Construction d'un tableau 2D contenant chaque pierre et leur distance par rapport au centre
    let rockDistanceArray = [rockArray, getDistanceArray(rockArray)];
    // Tri du tableau de pierre en fonction du tableau de distance
    sortRockDistanceArray(rockDistanceArray);
    // Calcul du score en fonction des pierres dans la maison
    setScore(rockDistanceArray);
}

//  Calcule le score et met à jour le score dans le tableau HTML
function setScore(rockDistanceArray) {
    let score = 0;
    let color = rockDistanceArray[0][0].children[0].material.color.getHexString();
    let colorMatch = true;
    let i = 0;

    document.getElementById("scoreTeamRed").innerHTML = 0;
    document.getElementById("scoreTeamBlue").innerHTML = 0;
    while (colorMatch && rockDistanceArray[1][i] < HOUSE_RADIUS) {
        if (rockDistanceArray[0][i].children[0].material.color.getHexString() != color)
            colorMatch = false;
        else
            score++;
        i++;
    }
    if (score)
        setScoreColor("#" + color);
    if (score && color == "ff0000")
        document.getElementById("scoreTeamRed").innerHTML = score;
    else if (score && color == "0000ff")
        document.getElementById("scoreTeamBlue").innerHTML = score;
    else
        setScoreColor(colorChoice());    
}

//  Calcule la distance entre chaque pierre et le centre de la maison et retourne le tableau associé
function getDistanceArray(rockArray) {
    let distanceArray = [];

    for (var i = 0; i < rockArray.length; i++)
        distanceArray.push(getDistance(rockArray[i]));
    return distanceArray;
}

//  Calcule la distance entre une pierre et le centre de la maison
function getDistance(rock) {
    let distance = Math.sqrt(
        Math.pow(HOUSE_CENTER.x - rock.position.x, 2) + 
        Math.pow(HOUSE_CENTER.y - rock.position.y, 2)
    );
    return distance;
}

//  Trie dans l'ordre croissant le tableau 2D de pierre en fonction des distances qui leur sont associées
function sortRockDistanceArray(rockDistanceArray) {
    for (var i = 0; i < rockDistanceArray[1].length; i++) {
        for (var j = 0; j < rockDistanceArray[1].length; j++) {
            if (rockDistanceArray[1][i] < rockDistanceArray[1][j]) {
                swap(rockDistanceArray, i, j);
            }
        }
    }
}

//  Echange deux valeurs du tableau 2D en fonction de leur index
function swap(rockDistanceArray, i, j) {
    let tmpRock = rockDistanceArray[0][i];
    let tmpDistance = rockDistanceArray[1][i];

    rockDistanceArray[0][i] = rockDistanceArray[0][j];
    rockDistanceArray[1][i] = rockDistanceArray[1][j];
    rockDistanceArray[0][j] = tmpRock;
    rockDistanceArray[1][j] = tmpDistance;
}