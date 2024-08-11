import { enumColors, enumColorToShortcode } from "shapez/game/colors";
import { checkLocation } from "./main";
import { enumSubShape, enumSubShapeToShortcode } from "shapez/game/shape_definition";

const subShapeNames = {
    rect: "Square",
    circle: "Circle",
    star: "Star",
    windmill: "Windmill"
};
const colorNames = {
    red: "Red",
    green: "Green",
    blue: "Blue",

    yellow: "Yellow",
    purple: "Purple",
    cyan: "Cyan",

    white: "White",
    uncolored: "Uncolored",
};

var shapesanityHubGoals = null;

export function setShapesanityHubGoal(hubGoal) {
    shapesanityHubGoals = hubGoal;
}

function isSame(part1, part2) {
    return part1.subShape === part2.subShape && part1.color === part2.color;
}

function toShort(part) {
    return enumSubShapeToShortcode[part.subShape] + enumColorToShortcode[part.color];
}

function ordered(part1, part2) {
    var string1 = toShort(part1);
    var string2 = toShort(part2);
    if (string1 < string2) {
        return string1 + " " + string2;
    } else {
        return string2 + " " + string1;
    }
}

export const shapesanityAnalyser = shape => {
    if (shape.layers.length == 1) {
        if (shapesanityHubGoals.getShapesStored(shape) <= 16) {
            var parts = shape.layers[0];
            if (parts[0]) {
                if (parts[1]) {
                    if (isSame(parts[0], parts[1])) { // AA
                        if (parts[2]) { // AA?
                            if (isSame(parts[0], parts[2])) { // AAA
                                if (parts[3]) { // AAA?
                                    if (isSame(parts[0], parts[3])) { // AAAA
                                        checkLocation("Shapesanity " + colorNames[parts[0].color] + " " + 
                                            subShapeNames[parts[0].subShape]);
                                    } else { // AAAB
                                        checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                            toShort(parts[3]));
                                    }
                                } else { // AAA-
                                    checkLocation("Shapesanity Cut Out " + colorNames[parts[2].color] + " " + 
                                        subShapeNames[parts[2].subShape]);
                                }
                            } else { // AAB
                                if (parts[3]) { // AAB?
                                    if (isSame(parts[0], parts[3])) { // AABA
                                        checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                            toShort(parts[2]));
                                    } else if (isSame(parts[2], parts[3])) { // AABB
                                        checkLocation("Shapesanity Half-Half " + ordered(parts[0], parts[2]));
                                    }
                                }
                            }
                        } else { // AA-
                            if (parts[3]) { // AA-?
                                if (isSame(parts[0], parts[3])) { // AA-A
                                    checkLocation("Shapesanity Cut Out " + colorNames[parts[1].color] + " " + 
                                        subShapeNames[parts[1].subShape]);
                                }
                            } else { // AA--
                                checkLocation("Shapesanity Half " + colorNames[parts[1].color] + " " + 
                                    subShapeNames[parts[1].subShape]);
                            }
                        }
                    } else { // AB
                        if (parts[2]) { // AB?
                            if (isSame(parts[0], parts[2])) { // ABA
                                if (parts[3]) { // ABA?
                                    if (isSame(parts[0], parts[3])) { // ABAA
                                        checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                            toShort(parts[1]));
                                    } else if (isSame(parts[1], parts[3])) { // ABAB
                                        checkLocation("Shapesanity Checkered " + ordered(parts[0], parts[1]));
                                    }
                                }
                            } else if (isSame(parts[1], parts[2])) { // ABB
                                if (parts[3]) {
                                    if (isSame(parts[0], parts[3])) { // ABBA
                                        checkLocation("Shapesanity Half-Half " + ordered(parts[0], parts[1]));
                                    } else if (isSame(parts[1], parts[3])) { // ABBB
                                        checkLocation("Shapesanity 3-1 " + toShort(parts[1]) + " " + 
                                            toShort(parts[0]));
                                    }
                                }
                            }
                        }
                    }
                } else { // only simple
                    if (parts[2]) {
                        if (isSame(parts[0], parts[2])) {
                            if (parts[3]) {
                                if (isSame(parts[0], parts[3])) {
                                    checkLocation("Shapesanity Cut Out " + colorNames[parts[2].color] + " " + 
                                        subShapeNames[parts[2].subShape]);
                                }
                            } else {
                                checkLocation("Shapesanity Cornered " + colorNames[parts[2].color] + " " + 
                                    subShapeNames[parts[2].subShape]);
                            }
                        }
                    } else {
                        if (parts[3]) {
                            if (isSame(parts[0], parts[3])) {
                                checkLocation("Shapesanity Half " + colorNames[parts[3].color] + " " + 
                                    subShapeNames[parts[3].subShape]);
                            }
                        } else {
                            checkLocation("Shapesanity " + colorNames[parts[0].color] + " " + 
                                subShapeNames[parts[0].subShape + " Piece"]);
                        }
                    }
                }
            } else { // only simple
                if (parts[1]) {
                    if (parts[2]) {
                        if (isSame(parts[1], parts[2])) {
                            if (parts[3]) {
                                if (isSame(parts[1], parts[3])) {
                                    checkLocation("Shapesanity Cut Out " + colorNames[parts[2].color] + " " + 
                                        subShapeNames[parts[2].subShape]);
                                }
                            } else {
                                checkLocation("Shapesanity Half " + colorNames[parts[2].color] + " " + 
                                    subShapeNames[parts[2].subShape]);
                            }
                        }
                    } else {
                        if (parts[3]) {
                            if (isSame(parts[1], parts[3])) {
                                checkLocation("Shapesanity Cornered " + colorNames[parts[1].color] + " " + 
                                    subShapeNames[parts[1].subShape]);
                            }
                        } else {
                            checkLocation("Shapesanity " + colorNames[parts[1].color] + " " + 
                                subShapeNames[parts[1].subShape + " Piece"]);
                        }
                    }
                } else {
                    if (parts[2]) {
                        if (parts[3]) {
                            if (isSame(parts[3], parts[2])) {
                                checkLocation("Shapesanity Half " + colorNames[parts[2].color] + " " + 
                                    subShapeNames[parts[2].subShape]);
                            }
                        } else {
                            checkLocation("Shapesanity " + colorNames[parts[2].color] + " " + 
                                subShapeNames[parts[2].subShape + " Piece"]);
                        }
                    } else {
                        checkLocation("Shapesanity " + colorNames[parts[3].color] + " " + 
                            subShapeNames[parts[3].subShape + " Piece"]);
                    }
                }
            }
        }
    }
};