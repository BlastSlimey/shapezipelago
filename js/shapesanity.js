import { enumColorToShortcode } from "shapez/game/colors";
import { enumSubShapeToShortcode, ShapeDefinition } from "shapez/game/shape_definition";
import { connected } from "./global_data";
import { checkLocation } from "./server_communication";
import { GameRoot } from "shapez/game/root";

const subShapeNames = {
    rect: "Square",
    circle: "Circle",
    star: "Star",
    windmill: "Windmill",
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

/**
 * 
 * @param {string} letter1 
 * @param {string} letter2 
 * @param {string} letter3 
 * @param {string} letter4 
 */
function orderedOnlyDifferent(letter1, letter2, letter3, letter4 = "-") {
    var arr = [letter1, letter2, letter3, letter4].sort();
    return arr[0] + arr[1] + arr[2] + arr[3];
}

/**
 * 
 * @param {GameRoot} root 
 * @param {boolean} checkStored
 * @returns 
 */
export function getShapesanityAnalyser(root, checkStored) {
    return function (shape) {
        return shapesanityAnalyzer(shape, root, checkStored);
    };
}

/**
 * @param {ShapeDefinition} shape
 * @param {GameRoot} root
 * @param {boolean} checkStored
 */
function shapesanityAnalyzer(shape, root, checkStored) {
    if (!connected) {
        return;
    }
    if (shape.layers.length == 1) {
        if (!checkStored || root.hubGoals.getShapesStored(shape) <= 2) {
            var parts = shape.layers[0];
            if (parts[0]) { //Aa
                if (parts[1]) { //Aa??
                    if (parts[0].subShape === parts[1].subShape) { //AaA?
                        if (parts[2]) { //AaA???
                            if (parts[3]) { //AaA?????
                                if (parts[0].subShape === parts[2].subShape) { //AaA?A???
                                    if (parts[0].subShape === parts[3].subShape) { //AaA?A?A?
                                        if (parts[0].color === parts[1].color) { //AaAaA?A?
                                            if (parts[0].color === parts[2].color) { //AaAaAaA?
                                                if (parts[0].color === parts[3].color) { //AaAaAaAa
                                                    checkLocation("Shapesanity " + colorNames[parts[0].color] + " " + 
                                                        subShapeNames[parts[0].subShape]);
                                                } else { //AaAaAaAb
                                                    checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                        toShort(parts[3]));
                                                }
                                            } else { //AaAaAbA?
                                                if (parts[0].color === parts[3].color) { //AaAaAbAa
                                                    checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                        toShort(parts[2]));
                                                } else if (parts[2].color === parts[3].color) { //AaAaAbAb
                                                    checkLocation("Shapesanity Half-Half " + ordered(parts[0], parts[2]));
                                                } //AaAaAbAc
                                            }
                                        } else { //AaAbA?A?
                                            if (parts[0].color === parts[2].color) { //AaAbAaA?
                                                if (parts[0].color === parts[3].color) { //AaAbAaAa
                                                    checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                        toShort(parts[1]));
                                                } else if (parts[1].color === parts[3].color) { //AaAbAaAb
                                                    checkLocation("Shapesanity Checkered " + ordered(parts[0], parts[1]));
                                                } //AaAbAaAc UNUSED
                                            } else if (parts[1].color === parts[2].color) { //AaAbAbA?
                                                if (parts[0].color === parts[3].color) { //AaAbAbAa
                                                    checkLocation("Shapesanity Half-Half " + ordered(parts[0], parts[1]));
                                                } else if (parts[1].color === parts[3].color) { //AaAbAbAb
                                                    checkLocation("Shapesanity 3-1 " + toShort(parts[1]) + " " + 
                                                        toShort(parts[0]));
                                                } //AaAbAbAc UNUSED
                                            } else { //AaAbAcA?
                                                if (parts[0].color !== parts[3].color) { //AaAbAcA!(a)
                                                    if (parts[1].color !== parts[3].color) { //AaAbAcA!(a|b)
                                                        if (parts[2].color !== parts[3].color) { //AaAbAcAd
                                                            checkLocation("Shapesanity " + orderedOnlyDifferent(
                                                                enumColorToShortcode[parts[0].color],
                                                                enumColorToShortcode[parts[1].color],
                                                                enumColorToShortcode[parts[2].color],
                                                                enumColorToShortcode[parts[3].color]
                                                            ) + " " + subShapeNames[parts[0].subShape]);
                                                        } //AaAbAcAc UNUSED
                                                    } //AaAbAcAb UNUSED
                                                } //AaAbAcAa UNUSED
                                            }
                                        }
                                    } else { //AaA?A?B?
                                        if (parts[0].color === parts[1].color) { //AaAaA?B?
                                            if (parts[0].color === parts[2].color) { //AaAaAaB?
                                                checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[3]));
                                            } //AaAaAbB? UNUSED
                                        } //AaAbA?B? UNUSED
                                    }
                                } else { //AaA?B???
                                    if (parts[0].subShape === parts[3].subShape) { //AaA?B?A?
                                        if (parts[0].color === parts[1].color) { //AaAaB?A?
                                            if (parts[0].color === parts[3].color) { //AaAaB?Aa
                                                checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[2]));
                                            } //AaAaB?Ab UNUSED
                                        } //AaAbB?A? UNUSED
                                    } else if (parts[2].subShape === parts[3].subShape) { //AaA?B?B?
                                        if (parts[0].color === parts[1].color) { //AaAaB?B?
                                            if (parts[2].color === parts[3].color) { //AaAaBxBx
                                                checkLocation("Shapesanity Half-Half " + ordered(parts[0], parts[2]));
                                            } //AaAaBxBy UNUSED
                                        } //AaAbB?B? UNUSED
                                    } //AaA?B?C? UNUSED
                                }
                            } else { //AaA???--
                                if (parts[0].subShape === parts[2].subShape) { //AaA?A?--
                                    if (parts[0].color === parts[1].color) { //AaAaA?--
                                        if (parts[0].color === parts[2].color) { //AaAaAa--
                                            checkLocation("Shapesanity Cut Out " + colorNames[parts[0].color] + " " + 
                                                subShapeNames[parts[0].subShape]);
                                        } else { //AaAaAb--
                                            checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[2]));
                                        }
                                    } else { //AaAbA?--
                                        if (parts[0].color === parts[2].color) { //AaAbAa--
                                            checkLocation("Shapesanity Cornered 2-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[1]));
                                        } else if (parts[1].color === parts[2].color) { //AaAbAb--
                                            checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[1]) + " " + 
                                                toShort(parts[0]));
                                        } else { //AaAbAc--
                                            checkLocation("Shapesanity " + orderedOnlyDifferent(
                                                enumColorToShortcode[parts[0].color],
                                                enumColorToShortcode[parts[1].color],
                                                enumColorToShortcode[parts[2].color]
                                            ) + " " + subShapeNames[parts[0].subShape]);
                                        }
                                    }
                                } else { //AaA?B?--
                                    if (parts[0].color === parts[1].color) { //AaAaB?--
                                        checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                            toShort(parts[2]));
                                    } //AaAbB?-- UNUSED
                                }
                            }
                        } else { //AaA?--
                            if (parts[3]) { //AaA?--??
                                if (parts[0].color === parts[1].color) { //AaAa--??
                                    if (isSame(parts[0], parts[3])) { //AaAa--Aa
                                        checkLocation("Shapesanity Cut Out " + colorNames[parts[0].color] + " " + 
                                            subShapeNames[parts[0].subShape]);
                                    } else { //AaAa--!(Aa)
                                        checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                            toShort(parts[3]));
                                    }
                                } else { //AaAb--??
                                    if (parts[0].subShape === parts[3].subShape) { //AaAb--A?
                                        if (parts[0].color === parts[3].color) { //AaAb--Aa
                                            checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[1]));
                                        } else if (parts[1].color === parts[3].color) { //AaAb--Ab
                                            checkLocation("Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                                toShort(parts[0]));
                                        } else { //AaAb--Ac
                                            checkLocation("Shapesanity " + orderedOnlyDifferent(
                                                enumColorToShortcode[parts[0].color],
                                                enumColorToShortcode[parts[1].color],
                                                enumColorToShortcode[parts[3].color]
                                            ) + " " + subShapeNames[parts[0].subShape]);
                                        }
                                    } //AaAb--B? UNUSED
                                }
                            } else { //AaA?----
                                if (parts[0].color === parts[1].color) { //AaAa----
                                    checkLocation("Shapesanity Half " + colorNames[parts[0].color] + " " + 
                                        subShapeNames[parts[0].subShape]);
                                } else { //AaAb----
                                    checkLocation("Shapesanity Adjacent Singles " + ordered(parts[0], parts[1]));
                                }
                            }
                        }
                    } else { //AaB?
                        if (parts[0].color === parts[1].color) { //AaBa
                            if (parts[2]) { //AaBa??
                                if (parts[0].color === parts[2].color) { //AaBa?a
                                    if (parts[0].subShape === parts[2].subShape) { //AaBaAa
                                        if (parts[3]) { //AaBaAa??
                                            if (isSame(parts[0], parts[3])) { //AaBaAaAa
                                                checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[1]));
                                            } else if (isSame(parts[1], parts[3])) { //AaBaAaBa
                                                checkLocation("Shapesanity Checkered " + ordered(parts[0], parts[1]));
                                            } //AaBaAa!(Aa|Ba) UNUSED
                                        } else { //AaBaAa--
                                            checkLocation("Shapesanity Cornered 2-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[1]));
                                        }
                                    } else if (parts[1].subShape === parts[2].subShape) { //AaBaBa
                                        if (parts[3]) { //AaBaBa??
                                            if (isSame(parts[0], parts[3])) { //AaBaBaAa
                                                checkLocation("Shapesanity Half-Half " + ordered(parts[0], parts[1]));
                                            } else if (isSame(parts[1], parts[3])) { //AaBaBaBa
                                                checkLocation("Shapesanity 3-1 " + toShort(parts[1]) + " " + 
                                                    toShort(parts[0]));
                                            } //AaBaBa!(Aa|Ba) UNUSED
                                        } else { //AaBaBa--
                                            checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[1]) + " " + 
                                                toShort(parts[0]));
                                        }
                                    } else { //AaBaCa
                                        if (parts[3]) { //AaBaCa??
                                            if (parts[0].color === parts[3].color) { //AaBaCa?a
                                                if (parts[0].subShape !== parts[3].subShape) { //AaBaCa!(A)a
                                                    if (parts[1].subShape !== parts[3].subShape) { //AaBaCa!(A|B)a
                                                        if (parts[2].subShape !== parts[3].subShape) { //AaBaCaDa
                                                            checkLocation("Shapesanity " + colorNames[parts[0].color] + " " + 
                                                                orderedOnlyDifferent(enumSubShapeToShortcode[parts[0].subShape],
                                                                    enumSubShapeToShortcode[parts[1].subShape],
                                                                    enumSubShapeToShortcode[parts[2].subShape],
                                                                    enumSubShapeToShortcode[parts[3].subShape]));
                                                        } //AaBaCaCa UNUSED
                                                    } //AaBaCaBa UNUSED
                                                } //AaBaCaAa UNUSED
                                            } //AaBaCa?b UNUSED
                                        } else { //AaBaCa--
                                            checkLocation("Shapesanity " + colorNames[parts[0].color] + " " + 
                                                orderedOnlyDifferent(enumSubShapeToShortcode[parts[0].subShape],
                                                    enumSubShapeToShortcode[parts[1].subShape],
                                                    enumSubShapeToShortcode[parts[2].subShape]));
                                        }
                                    }
                                } //AaBa?b UNUSED
                            } else { //AaBa--
                                if (parts[3]) { //AaBa--??
                                    if (parts[0].color === parts[3].color) { //AaBa--?a
                                        if (parts[0].subShape === parts[3].subShape) { //AaBa--Aa
                                            checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[1]));
                                        } else if (parts[1].subShape === parts[3].subShape) { //AaBa--Ba
                                            checkLocation("Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                                toShort(parts[0]));
                                        } else { //AaBa--Ca
                                            checkLocation("Shapesanity " + colorNames[parts[0].color] + " " + 
                                                orderedOnlyDifferent(enumSubShapeToShortcode[parts[0].subShape],
                                                    enumSubShapeToShortcode[parts[1].subShape],
                                                    enumSubShapeToShortcode[parts[3].subShape]));
                                        }
                                    } //AaBa--?b UNUSED
                                } else { //AaBa----
                                    checkLocation("Shapesanity Adjacent Singles " + ordered(parts[0], parts[1]));
                                }
                            }
                        } else { //AaBb
                            if (parts[2]) { //AaBb??
                                if (isSame(parts[0], parts[2])) { //AaBbAa
                                    if (parts[3]) { //AaBbAa??
                                        if (isSame(parts[0], parts[3])) { //AaBbAaAa
                                            checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[1]));
                                        } else if (isSame(parts[1], parts[3])) { //AaBbAaBb
                                            checkLocation("Shapesanity Checkered " + ordered(parts[0], parts[1]));
                                        } //AaBbAa!(Aa|Bb) UNUSED
                                    } else { //AaBbAa--
                                        checkLocation("Shapesanity Cornered 2-1 " + toShort(parts[0]) + " " + 
                                            toShort(parts[1]));
                                    }
                                } else if (isSame(parts[1], parts[2])) { //AaBbBb
                                    if (parts[3]) { //AaBbBb??
                                        if (isSame(parts[0], parts[3])) { //AaBbBbAa
                                            checkLocation("Shapesanity Half-Half " + ordered(parts[0], parts[1]));
                                        } else if (isSame(parts[1], parts[3])) { //AaBbBbBb
                                            checkLocation("Shapesanity 3-1 " + toShort(parts[1]) + " " + 
                                                toShort(parts[0]));
                                        } //AaBbBb!(Aa|Bb) UNUSED
                                    } else { //AaBbBb--
                                        checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[1]) + " " + 
                                            toShort(parts[0]));
                                    }
                                } //AaBb!(Aa|Bb) UNUSED
                            } else { //AaBb--
                                if (parts[3]) { //AaBb--??
                                    if (isSame(parts[0], parts[3])) { //AaBb--Aa
                                        checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                            toShort(parts[1]));
                                    } else if (isSame(parts[1], parts[3])) { //AaBb--Bb
                                        checkLocation("Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                            toShort(parts[0]));
                                    } //AaBb--!(Aa|Bb) UNUSED
                                } else { //AaBb----
                                    checkLocation("Shapesanity Adjacent Singles " + ordered(parts[0], parts[1]));
                                }
                            }
                        }
                    }
                } else { //Aa--
                    if (parts[2]) { //Aa--??
                        if (parts[0].subShape === parts[2].subShape) { //Aa--A?
                            if (parts[0].color === parts[2].color) { //Aa--Aa
                                if (parts[3]) { //Aa--Aa??
                                    if (isSame(parts[0], parts[3])) { //Aa--AaAa
                                        checkLocation("Shapesanity Cut Out " + colorNames[parts[0].color] + " " + 
                                            subShapeNames[parts[0].subShape]);
                                    } else { //Aa--Aa!(Aa)
                                        checkLocation("Shapesanity Cornered 2-1 " + toShort(parts[0]) + " " + 
                                            toShort(parts[3]));
                                    }
                                } else { //Aa--Aa--
                                    checkLocation("Shapesanity Cornered " + colorNames[parts[0].color] + " " + 
                                        subShapeNames[parts[0].subShape]);
                                }
                            } else { //Aa--Ab
                                if (parts[3]) { //Aa--Ab??
                                    if (parts[0].subShape === parts[3].subShape) { //Aa--AbA?
                                        if (parts[0].color === parts[3].color) { //Aa--AbAa
                                            checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[2]));
                                        } else if (parts[2].color === parts[3].color) { //Aa--AbAb
                                            checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                                toShort(parts[0]));
                                        } else { //Aa--AbAc
                                            checkLocation("Shapesanity " + orderedOnlyDifferent(
                                                enumColorToShortcode[parts[0].color],
                                                enumColorToShortcode[parts[2].color],
                                                enumColorToShortcode[parts[3].color]
                                            ) + " " + subShapeNames[parts[0].subShape]);
                                        }
                                    } //Aa--AbB? UNUSED
                                } else { //Aa--Ab--
                                    checkLocation("Shapesanity Cornered Singles " + ordered(parts[0], parts[2]));
                                }
                            }
                        } else { //Aa--B?
                            if (parts[0].color === parts[2].color) { //Aa--Ba
                                if (parts[3]) { //Aa--Ba??
                                    if (parts[0].color === parts[3].color) { //Aa--Ba?a
                                        if (parts[0].subShape === parts[3].subShape) { //Aa--BaAa
                                            checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[2]));
                                        } else if (parts[2].subShape === parts[3].subShape) { //Aa--BaBa
                                            checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                                toShort(parts[0]));
                                        } else { //Aa--BaCa
                                            checkLocation("Shapesanity " + colorNames[parts[0].color] + " " + 
                                                orderedOnlyDifferent(enumSubShapeToShortcode[parts[0].subShape],
                                                    enumSubShapeToShortcode[parts[2].subShape],
                                                    enumSubShapeToShortcode[parts[3].subShape]));
                                        }
                                    } //Aa--Ba?!(a) UNUSED
                                } else { //Aa--Ba--
                                    checkLocation("Shapesanity Cornered Singles " + ordered(parts[0], parts[2]));
                                }
                            } else { //Aa--Bb
                                if (parts[3]) { //Aa--Bb??
                                    if (parts[0].subShape === parts[3].subShape) { //Aa--BbA?

                                    } else if (parts[2].subShape === parts[3].subShape) { //Aa--BbB?
                                        if (parts[2].color === parts[3].color) { //Aa--BbBb
                                            checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                                toShort(parts[0]));
                                        } //Aa--BbB!(b) UNUSED
                                    } //Aa--BbC? UNUSED
                                } else { //Aa--Bb--
                                    checkLocation("Shapesanity Cornered Singles " + ordered(parts[0], parts[2]));
                                }
                            }
                        }
                    } else { //Aa----
                        if (parts[3]) { //Aa----??
                            if (isSame(parts[0], parts[3])) { //Aa----Aa
                                checkLocation("Shapesanity Half " + colorNames[parts[0].color] + " " + 
                                    subShapeNames[parts[3].subShape]);
                            } else { //Aa----!(Aa)
                                checkLocation("Shapesanity Adjacent Singles " + ordered(parts[0], parts[3]));
                            }
                        } else { //Aa------
                            checkLocation("Shapesanity " + colorNames[parts[0].color] + " " + 
                                subShapeNames[parts[0].subShape] + " Piece");
                        }
                    }
                }
            } else { //--
                if (parts[1]) { //--Aa
                    if (parts[2]) { //--Aa??
                        if (parts[1].subShape === parts[2].subShape) { //--AaA?
                            if (parts[1].color === parts[2].color) { //--AaAa
                                if (parts[3]) { //--AaAa??
                                    if (isSame(parts[1], parts[3])) { //--AaAaAa
                                        checkLocation("Shapesanity Cut Out " + colorNames[parts[1].color] + " " + 
                                            subShapeNames[parts[1].subShape]);
                                    } else { //--AaAa!(Aa)
                                        checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[1]) + " " + 
                                            toShort(parts[3]));
                                    }
                                } else { //--AaAa--
                                    checkLocation("Shapesanity Half " + colorNames[parts[1].color] + " " + 
                                        subShapeNames[parts[1].subShape]);
                                }
                            } else { //--AaAb
                                if (parts[3]) { //--AaAb??
                                    if (parts[1].subShape === parts[3].subShape) { //--AaAbA?
                                        if (parts[1].color === parts[3].color) { //--AaAbAa
                                            checkLocation("Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                                toShort(parts[2]));
                                        } else if (parts[2].color === parts[3].color) { //--AaAbAb
                                            checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                                toShort(parts[1]));
                                        } else { //--AaAbAc
                                            checkLocation("Shapesanity " + orderedOnlyDifferent(
                                                enumColorToShortcode[parts[1].color],
                                                enumColorToShortcode[parts[2].color],
                                                enumColorToShortcode[parts[3].color]
                                            ) + " " + subShapeNames[parts[1].subShape]);
                                        }
                                    } //--AaAbB? UNUSED
                                } else { //--AaAb--
                                    checkLocation("Shapesanity Adjacent Singles " + ordered(parts[1], parts[2]));
                                }
                            }
                        } else { //--AaB?
                            if (parts[3]) { //--AaB???
                                if (parts[1].color === parts[2].color) { //--AaBa??
                                    if (parts[1].color === parts[3].color) { //--AaBa?a
                                        if (parts[1].subShape === parts[3].subShape) { //--AaBaAa
                                            checkLocation("Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                                toShort(parts[2]));
                                        } else if (parts[2].subShape === parts[3].subShape) { //--AaBaBa
                                            checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                                toShort(parts[1]));
                                        } else { //--AaBaCa
                                            checkLocation("Shapesanity " + colorNames[parts[1].color] + " " + 
                                                orderedOnlyDifferent(enumSubShapeToShortcode[parts[1].subShape],
                                                    enumSubShapeToShortcode[parts[2].subShape],
                                                    enumSubShapeToShortcode[parts[3].subShape]));
                                        }
                                    } //--AaBa?b UNUSED
                                } else { //--AaBb??
                                    if (isSame(parts[1], parts[3])) { //--AaBbAa
                                        checkLocation("Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                            toShort(parts[2]));
                                    } else if (isSame(parts[2], parts[3])) { //--AaBbBb
                                        checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                            toShort(parts[1]));
                                    } //--AaBb!(Aa|Bb) UNUSED
                                }
                            } else { //--AaB?--
                                checkLocation("Shapesanity Adjacent Singles " + ordered(parts[1], parts[2]));
                            }
                        }
                    } else { //--Aa--
                        if (parts[3]) { //--Aa--??
                            if (isSame(parts[1], parts[3])) { //--Aa--Aa
                                checkLocation("Shapesanity Cornered " + colorNames[parts[1].color] + " " + 
                                    subShapeNames[parts[1].subShape]);
                            } else { //--Aa--!(Aa)
                                checkLocation("Shapesanity Cornered Singles " + ordered(parts[1], parts[3]));
                            }
                        } else { //--Aa----
                            checkLocation("Shapesanity " + colorNames[parts[1].color] + " " + 
                                subShapeNames[parts[1].subShape] + " Piece");
                        }
                    }
                } else { //----
                    if (parts[2]) { //----Aa
                        if (parts[3]) { //----Aa??
                            if (isSame(parts[2], parts[3])) { //----AaAa
                                checkLocation("Shapesanity Half " + colorNames[parts[2].color] + " " + 
                                    subShapeNames[parts[2].subShape]);
                            } else { //----Aa!(Aa)
                                checkLocation("Shapesanity Adjacent Singles " + ordered(parts[2], parts[3]));
                            }
                        } else { //----Aa--
                            checkLocation("Shapesanity " + colorNames[parts[2].color] + " " + 
                                subShapeNames[parts[2].subShape] + " Piece");
                        }
                    } else { //------ => ------Aa
                        checkLocation("Shapesanity " + colorNames[parts[3].color] + " " + 
                            subShapeNames[parts[3].subShape] + " Piece");
                    }
                }
            }
            return;













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
}