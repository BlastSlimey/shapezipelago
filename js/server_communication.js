import { enumSubShapeToShortcode, ShapeDefinition } from "shapez/game/shape_definition";
import { aplog, baseBuildingNames, client, connected, customRewards, gamePackage, getIsUnlockedForTrap, increaseProcessedItems, processedItemCount, shapesanityCache, trapLocked, trapMalfunction, trapThrottled, upgradeDefs, upgradeIdNames } from "./global_data";
import { CLIENT_STATUS } from "archipelago.js";
import { enumColorToShortcode } from "shapez/game/colors";
import { GameRoot } from "shapez/game/root";

export var storedRoot = null;
export var storedModImpl = null;
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

export const receiveItemFunctions = {
    "Belt": (root, resynced) => {customRewards.reward_belt = 1; return "";},
    "Extractor": (root, resynced) => {customRewards.reward_extractor = 1; return "";},
    "Cutter": (root, resynced) => {customRewards.reward_cutter = 1; return "";},
    "Rotator": (root, resynced) => {root.hubGoals.gainedRewards["reward_rotater"] = 1; return "";},
    "Painter": (root, resynced) => {root.hubGoals.gainedRewards["reward_painter"] = 1; return "";},
    "Rotator (CCW)": (root, resynced) => {root.hubGoals.gainedRewards["reward_rotater_ccw"] = 1; return "";},
    "Color Mixer": (root, resynced) => {root.hubGoals.gainedRewards["reward_mixer"] = 1; return "";},
    "Stacker": (root, resynced) => {root.hubGoals.gainedRewards["reward_stacker"] = 1; return "";},
    "Quad Cutter": (root, resynced) => {root.hubGoals.gainedRewards["reward_cutter_quad"] = 1; return "";},
    "Double Painter": (root, resynced) => {root.hubGoals.gainedRewards["reward_painter_double"] = 1; return "";},
    "Rotator (180°)": (root, resynced) => {root.hubGoals.gainedRewards["reward_rotater_180"] = 1; return "";},
    "Quad Painter": (root, resynced) => {customRewards.reward_painter_quad = 1; return "";},
    "Balancer": (root, resynced) => {root.hubGoals.gainedRewards["reward_balancer"] = 1; return "";},
    "Tunnel": (root, resynced) => {root.hubGoals.gainedRewards["reward_tunnel"] = 1; return "";},
    "Compact Merger": (root, resynced) => {root.hubGoals.gainedRewards["reward_merger"] = 1; return "";},
    "Tunnel Tier II": (root, resynced) => {root.hubGoals.gainedRewards["reward_underground_belt_tier_2"] = 1; return "";},
    "Compact Splitter": (root, resynced) => {root.hubGoals.gainedRewards["reward_splitter"] = 1; return "";},
    "Trash": (root, resynced) => {customRewards.reward_trash = 1; return "";},
    "Chaining Extractor": (root, resynced) => {root.hubGoals.gainedRewards["reward_miner_chainable"] = 1; return "";},
    "Belt Reader": (root, resynced) => {root.hubGoals.gainedRewards["reward_belt_reader"] = 1; return "";},
    "Storage": (root, resynced) => {root.hubGoals.gainedRewards["reward_storage"] = 1; return "";},
    "Switch": (root, resynced) => {customRewards.reward_switch = 1; return "";},
    "Item Filter": (root, resynced) => {root.hubGoals.gainedRewards["reward_filter"] = 1; return "";},
    "Display": (root, resynced) => {root.hubGoals.gainedRewards["reward_display"] = 1; return "";},
    "Wires": (root, resynced) => {customRewards.reward_wires = 1; return "";},
    "Constant Signal": (root, resynced) => {root.hubGoals.gainedRewards["reward_constant_signal"] = 1; return "";},
    "Logic Gates": (root, resynced) => {root.hubGoals.gainedRewards["reward_logic_gates"] = 1; return "";},
    "Virtual Processing": (root, resynced) => {root.hubGoals.gainedRewards["reward_virtual_processing"] = 1; return "";},
    "Blueprints": (root, resynced) => {root.hubGoals.gainedRewards["reward_blueprints"] = 1; return "";},
    "Big Belt Upgrade": (root, resynced) => {root.hubGoals.upgradeImprovements["belt"] += 1; return "";},
    "Big Miner Upgrade": (root, resynced) => {root.hubGoals.upgradeImprovements["miner"] += 1; return "";},
    "Big Processors Upgrade": (root, resynced) => {root.hubGoals.upgradeImprovements["processors"] += 1; return "";},
    "Big Painting Upgrade": (root, resynced) => {root.hubGoals.upgradeImprovements["painting"] += 1; return "";},
    "Small Belt Upgrade": (root, resynced) => {root.hubGoals.upgradeImprovements["belt"] += 0.1; return "";},
    "Small Miner Upgrade": (root, resynced) => {root.hubGoals.upgradeImprovements["miner"] += 0.1; return "";},
    "Small Processors Upgrade": (root, resynced) => {root.hubGoals.upgradeImprovements["processors"] += 0.1; return "";},
    "Small Painting Upgrade": (root, resynced) => {root.hubGoals.upgradeImprovements["painting"] += 0.1; return "";},
    "Blueprint Shapes Bundle": (root, resynced) => {
        if (resynced) return "";
        root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] = (root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] || 0) + 1000; 
        if (root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] > 0) {
            getShapesanityAnalyser()(ShapeDefinition.fromShortKey("CbCbCbRb:CwCwCwCw"));
        }
        return ": 1000";
    },
    "Level Shapes Bundle": (root, resynced) => {
        if (resynced) return "";
        const levelShape = root.hubGoals.currentGoal.definition.getHash();
        const requiredLevelShapes = root.hubGoals.currentGoal.required;
        const storedLevelShapes = root.hubGoals.storedShapes[levelShape] || 0;
        var addedAmount = Math.floor((requiredLevelShapes - storedLevelShapes) / 2);
        if (addedAmount < 0) {
            addedAmount = 100;
        }
        root.hubGoals.storedShapes[levelShape] = (storedLevelShapes || 0) + addedAmount;
        if (root.hubGoals.storedShapes[levelShape] > 0) {
            getShapesanityAnalyser()(root.hubGoals.currentGoal.definition);
        }
        return ": " + addedAmount.toString();
    },
    "Upgrade Shapes Bundle": (/** @type {import("shapez/game/root").GameRoot} */ root, resynced) => {
        if (resynced) return "";
        const upgradeIds = ["belt", "miner", "processors", "painting"];
        var addedAmount = 0, randomID, requiredShapes, requirement, stored;
        for (var tries = 0; tries < 10 && addedAmount <= 0; tries++) {
            randomID = upgradeIds[Math.floor(Math.random()*4)];
            requiredShapes = upgradeDefs[randomID][root.hubGoals.getUpgradeLevel(randomID)].required;
            requirement = requiredShapes[Math.floor(Math.random()*requiredShapes.length)];
            stored = root.hubGoals.storedShapes[requirement.shape] || 0;
            addedAmount = Math.floor((requirement.amount - stored) / 2);
        }
        if (addedAmount < 0) {
            addedAmount = 100;
        }
        root.hubGoals.storedShapes[requirement.shape] = (stored || 0) + addedAmount;
        if (root.hubGoals.storedShapes[requirement.shape] > 0) {
            getShapesanityAnalyser()(ShapeDefinition.fromShortKey(requirement.shape));
        }
        return `: ${addedAmount} ${requirement.shape} in ${upgradeIdNames[randomID]} Upgrades`;
    },
    "Inventory Draining Trap": (root, resynced) => {
        if (resynced) return "";
        const r = Math.random()*3;
        if (r < 1) {
            return receiveItemFunctions["Blueprint Shapes Draining Trap"](root, resynced) + ": Blueprint shapes";
        } else if (r < 2) {
            return receiveItemFunctions["Level Shapes Draining Trap"](root, resynced) + ": Current level shapes";
        } else {
            return receiveItemFunctions["Upgrade Shapes Draining Trap"](root, resynced);
        }
    },
    "Blueprint Shapes Draining Trap": (root, resynced) => {
        if (resynced) return "";
        var storedBlueprint = root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] || 0;
        root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] = Math.floor(storedBlueprint / 2);
        return "";
    },
    "Level Shapes Draining Trap": (root, resynced) => {
        if (resynced) return "";
        const levelShape = root.hubGoals.currentGoal.definition.getHash();
        const storedLevelShapes = root.hubGoals.storedShapes[levelShape] || 0;
        root.hubGoals.storedShapes[levelShape] = Math.floor((storedLevelShapes || 0) / 2);
        return "";
    },
    "Upgrade Shapes Draining Trap": (root, resynced) => {
        if (resynced) return "";
        const upgradeIds = ["belt", "miner", "processors", "painting"];
        const randomID = upgradeIds[Math.floor(Math.random()*4)];
        const requiredShapes = upgradeDefs[randomID][root.hubGoals.getUpgradeLevel(randomID)].required;
        const requirement = requiredShapes[Math.floor(Math.random()*requiredShapes.length)];
        const stored = root.hubGoals.storedShapes[requirement.shape] || 0;
        root.hubGoals.storedShapes[requirement.shape] = Math.floor((stored || 0) / 2);
        return `: ${requirement.shape} from ${upgradeIdNames[randomID]} Upgrades`;
    },
    "Locked Building Trap": (root, resynced) => {
        if (resynced) return "";
        const keys = Object.keys(trapLocked);
        var randomBuilding = keys[Math.floor(Math.random()*keys.length)];
        for (var tries = 0; tries < 10 && !getIsUnlockedForTrap[randomBuilding](root); tries++) {
            randomBuilding = keys[Math.floor(Math.random()*keys.length)];
        }
        const randomTimeSec = Math.floor(Math.random()*46) + 15;
        trapLocked[randomBuilding] = true;
        setTimeout(() => {
            trapLocked[randomBuilding] = false;
        }, randomTimeSec*1000);
        return `: ${baseBuildingNames[randomBuilding]} for ${randomTimeSec} seconds`;
    },
    "Throttled Building Trap": (root, resynced) => {
        if (resynced) return "";
        const keys = Object.keys(trapThrottled);
        var randomBuilding = keys[Math.floor(Math.random()*keys.length)];
        for (var tries = 0; tries < 10 && !getIsUnlockedForTrap[randomBuilding](root); tries++) {
            randomBuilding = keys[Math.floor(Math.random()*keys.length)];
        }
        const randomTimeSec = Math.floor(Math.random()*46) + 15;
        trapThrottled[randomBuilding] = true;
        setTimeout(() => {
            trapThrottled[randomBuilding] = false;
        }, randomTimeSec*1000);
        return `: ${baseBuildingNames[randomBuilding]} for ${randomTimeSec} seconds`;
    },
    "Malfunctioning Trap": (root, resynced) => {
        if (resynced) return "";
        const keys = Object.keys(trapMalfunction);
        var randomBuilding = keys[Math.floor(Math.random()*keys.length)];
        for (var tries = 0; tries < 10 && !getIsUnlockedForTrap[randomBuilding](root); tries++) {
            randomBuilding = keys[Math.floor(Math.random()*keys.length)];
        }
        const randomTimeSec = Math.floor(Math.random()*46) + 15;
        trapMalfunction[randomBuilding] = true;
        setTimeout(() => {
            trapMalfunction[randomBuilding] = false;
        }, randomTimeSec*1000);
        return `: ${baseBuildingNames[randomBuilding]} for ${randomTimeSec} seconds`;
    }
};

export function setRootAndModImpl(root, modImpl) {
    storedModImpl = modImpl;
    storedRoot = root;
}

/**
 * 
 * @param {string} name 
 */
export function checkLocation(name, another = null, resyncMessage = "Checked") {
    if (name === "Goal") {
        client.updateStatus(CLIENT_STATUS.GOAL);
    } else {
        if (another) {
            client.locations.check(gamePackage.location_name_to_id[name], gamePackage.location_name_to_id[another]);
            aplog(`${resyncMessage} location ` + name);
            aplog(`${resyncMessage} location ` + another)
        } else {
            client.locations.check(gamePackage.location_name_to_id[name]);
            aplog(`${resyncMessage} location ` + name);
        }
    }
}

/**
 * @param {import("archipelago.js").ReceivedItemsPacket} packet
 */
export function processItemsPacket(packet) {
    /**aplog(packet.index, processedItemCount)
    if (packet.index == 0 && processedItemCount > 0) {
        //set all gainedRewards to 0
        for (var [reward, value] of Object.entries(storedRoot.hubGoals.gainedRewards)) {
            storedRoot.hubGoals.gainedRewards[reward] = 0;
        }
        //set all upgradeImprovement to 1
        storedRoot.hubGoals.upgradeImprovements["belt"] = 1;
        storedRoot.hubGoals.upgradeImprovements["miner"] = 1;
        storedRoot.hubGoals.upgradeImprovements["processors"] = 1;
        storedRoot.hubGoals.upgradeImprovements["painting"] = 1;
        //bundles and traps should not be resynced
        //resync items
        setProcessedItems(0);
        for (var i = 0; i < packet.items.length; i++) {
            receiveItem(packet.items[i], false, true);
            increaseProcessedItems();
        }
    } else */
    aplog("Received packet with " + packet.items.length + 
        " items, while having " + processedItemCount + " items");
    if (processedItemCount + 1 >= packet.items.length) {
        for (var i = processedItemCount; i < packet.items.length; i++) {
            receiveItem(packet.items[i], true, false);
            increaseProcessedItems();
        }
    } else {
        var itemCounting = [];
        for (var i = processedItemCount; i < packet.items.length; i++) {
            itemCounting.push(receiveItem(packet.items[i], false, false));
            increaseProcessedItems();
        }
        storedModImpl.dialogs.showInfo("Items received!", itemCounting.join("<br />"));
    }
}

/**
 * 
 * @param {import("archipelago.js").NetworkItem} item 
 */
function receiveItem(item, showInfo, resynced) {
    const itemName = client.items.name("shapez", item.item);
    const message = receiveItemFunctions[itemName](storedRoot, resynced);
    if (showInfo) {
        const sendingPlayerName = client.players.name(item.player);
        const foundLocationName = client.locations.name(item.player, item.location);
        storedModImpl.dialogs.showInfo("Item received!", 
            itemName + message + "<br />found by " + sendingPlayerName + " at " + foundLocationName);
        return "";
    } else {
        return itemName + message;
    }
}

function isSame(part1, part2) {
    return part1.subShape === part2.subShape && part1.color === part2.color;
}

function toShort(part) {
    return enumSubShapeToShortcode[part.subShape] + enumColorToShortcode[part.color];
}

function ordered(part1, part2, part3 = null, part4 = null) {
    if (part3 == null) {
        return [toShort(part1), toShort(part2)].sort().join(" ");
    } else if (part4 == null) {
        return [toShort(part1), toShort(part2), toShort(part3)].sort().join(" ");
    } else {
        return [toShort(part1), toShort(part2), toShort(part3), toShort(part4)].sort().join(" ");
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

export function getShapesanityAnalyser() {
    return function (shape) {
        return shapesanityAnalyzer(shape);
    };
}

/**
 * @param {ShapeDefinition} shape
 */
function shapesanityAnalyzer(shape) {
    if (!connected) {
        return;
    }
    if (shape.layers.length == 1) {
        if (shapesanityCache[shape.getHash()]) {
            return;
        }
        if (true) { //leftover from old code
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
                                                    checkLocation("Shapesanity Half-Half " + 
                                                        ordered(parts[0], parts[2]));
                                                } //AaAaAbAc
                                            }
                                        } else { //AaAbA?A?
                                            if (parts[0].color === parts[2].color) { //AaAbAaA?
                                                if (parts[0].color === parts[3].color) { //AaAbAaAa
                                                    checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                        toShort(parts[1]));
                                                } else if (parts[1].color === parts[3].color) { //AaAbAaAb
                                                    checkLocation("Shapesanity Checkered " + 
                                                        ordered(parts[0], parts[1]));
                                                } else { //AaAbAaAc
                                                    checkLocation("Shapesanity Cornered 2-1-1 " + toShort(parts[0]) + " " + 
                                                        ordered(parts[1], parts[3]));
                                                }
                                            } else if (parts[1].color === parts[2].color) { //AaAbAbA?
                                                if (parts[0].color === parts[3].color) { //AaAbAbAa
                                                    checkLocation("Shapesanity Half-Half " + 
                                                        ordered(parts[0], parts[1]));
                                                } else if (parts[1].color === parts[3].color) { //AaAbAbAb
                                                    checkLocation("Shapesanity 3-1 " + toShort(parts[1]) + " " + 
                                                        toShort(parts[0]));
                                                } else { //AaAbAbAc
                                                    checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[1]) + " " + 
                                                        ordered(parts[0], parts[3]));
                                                }
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
                                                        } else { //AaAbAcAc
                                                            checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[2]) + 
                                                                " " + ordered(parts[0], parts[1]));
                                                        }
                                                    } else { //AaAbAcAb
                                                        checkLocation("Shapesanity Cornered 2-1-1 " + toShort(parts[1]) + " " + 
                                                            ordered(parts[0], parts[2]));
                                                    }
                                                } else { //AaAbAcAa
                                                    checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                        ordered(parts[1], parts[2]));
                                                }
                                            }
                                        }
                                    } else { //AaA?A?B?
                                        if (parts[0].color === parts[1].color) { //AaAaA?B?
                                            if (parts[0].color === parts[2].color) { //AaAaAaB?
                                                checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[3]));
                                            } else { //AaAaAbB?
                                                checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                    ordered(parts[2], parts[3]));
                                            }
                                        } else { //AaAbA?B?
                                            if (parts[0].color === parts[2].color) { //AaAbAaB?
                                                checkLocation("Shapesanity Cornered 2-1-1 " + toShort(parts[0]) + " " + 
                                                    ordered(parts[1], parts[3]));
                                            } else if (parts[1].color === parts[2].color) { //AaAbAbB?
                                                checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[1]) + " " + 
                                                    ordered(parts[0], parts[3]));
                                            } else { //AaAbAcB?
                                                checkLocation("Shapesanity Singles " + 
                                                    ordered(parts[0], parts[1], parts[2], parts[3]));
                                            }
                                        }
                                    }
                                } else { //AaA?B???
                                    if (parts[0].subShape === parts[3].subShape) { //AaA?B?A?
                                        if (parts[0].color === parts[1].color) { //AaAaB?A?
                                            if (parts[0].color === parts[3].color) { //AaAaB?Aa
                                                checkLocation("Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[2]));
                                            } else { //AaAaB?Ab
                                                checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                    ordered(parts[2], parts[3]));
                                            }
                                        } else { //AaAbB?A?
                                            if (parts[0].color === parts[3].color) { //AaAbB?Aa
                                                checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                    ordered(parts[1], parts[2]));
                                            } else if (parts[1].color === parts[3].color) { //AaAbB?Ab
                                                checkLocation("Shapesanity Cornered 2-1-1 " + toShort(parts[1]) + " " + 
                                                    ordered(parts[0], parts[2]));
                                            } else { //AaAbB?Ac
                                                checkLocation("Shapesanity Singles " + 
                                                    ordered(parts[0], parts[1], parts[2], parts[3]));
                                            }
                                        }
                                    } else if (parts[2].subShape === parts[3].subShape) { //AaA?B?B?
                                        if (parts[0].color === parts[1].color) { //AaAaB?B?
                                            if (parts[2].color === parts[3].color) { //AaAaBxBx
                                                checkLocation("Shapesanity Half-Half " + ordered(parts[0], parts[2]));
                                            } else { //AaAaBxB!(x)
                                                checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                    ordered(parts[2], parts[3]));
                                            }
                                        } else { //AaAbB?B?
                                            if (parts[2].color === parts[3].color) { //AaAbBxBx
                                                checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[2]) + " " + 
                                                    ordered(parts[0], parts[1]));
                                            } else { //AaAbBxB!(x)
                                                checkLocation("Shapesanity Singles " + 
                                                    ordered(parts[0], parts[1], parts[2], parts[3]));
                                            }
                                        }
                                    } else { //AaA?B?C?
                                        if (parts[0].color === parts[1].color) { //AaAaB?C?
                                            checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                ordered(parts[2], parts[3]));
                                        } else { //AaAbB?C?
                                            checkLocation("Shapesanity Singles " + 
                                                ordered(parts[0], parts[1], parts[2], parts[3]));
                                        }
                                    }
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
                                    } else { //AaAbB?--
                                        checkLocation("Shapesanity Singles " + 
                                            ordered(parts[0], parts[1], parts[2]));
                                    }
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
                                    } else { //AaAb--B?
                                        checkLocation("Shapesanity Singles " + 
                                            ordered(parts[0], parts[1], parts[3]));
                                    }
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
                                            } else { //AaBaAa!(Aa|Ba)
                                                checkLocation("Shapesanity Cornered 2-1-1 " + toShort(parts[0]) + " " + 
                                                    ordered(parts[1], parts[3]));
                                            }
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
                                            } else { //AaBaBa!(Aa|Ba)
                                                checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[1]) + " " + 
                                                    ordered(parts[0], parts[3]));
                                            }
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
                                                            checkLocation("Shapesanity " + colorNames[parts[0].color] + 
                                                                " " + orderedOnlyDifferent(
                                                                    enumSubShapeToShortcode[parts[0].subShape],
                                                                    enumSubShapeToShortcode[parts[1].subShape],
                                                                    enumSubShapeToShortcode[parts[2].subShape],
                                                                    enumSubShapeToShortcode[parts[3].subShape]));
                                                        } else { //AaBaCaCa
                                                            checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[2]) + " " + 
                                                                ordered(parts[0], parts[1]));
                                                        }
                                                    } else { //AaBaCaBa
                                                        checkLocation("Shapesanity Cornered 2-1-1 " + toShort(parts[1]) + " " + 
                                                            ordered(parts[0], parts[2]));
                                                    }
                                                } else { //AaBaCaAa
                                                    checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                        ordered(parts[1], parts[2]));
                                                }
                                            } else { //AaBaCa?b
                                                checkLocation("Shapesanity Singles " + 
                                                    ordered(parts[0], parts[1], parts[2], parts[3]));
                                            }
                                        } else { //AaBaCa--
                                            checkLocation("Shapesanity " + colorNames[parts[0].color] + " " + 
                                                orderedOnlyDifferent(enumSubShapeToShortcode[parts[0].subShape],
                                                    enumSubShapeToShortcode[parts[1].subShape],
                                                    enumSubShapeToShortcode[parts[2].subShape]));
                                        }
                                    }
                                } else { //AaBa?b
                                    if (parts[3]) { //AaBa?b??
                                        if (isSame(parts[0], parts[3])) { //AaBa?bAa
                                            checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                ordered(parts[1], parts[2]));
                                        } else if (isSame(parts[1], parts[3])) { //AaBa?bBa
                                            checkLocation("Shapesanity Cornered 2-1-1 " + toShort(parts[1]) + " " + 
                                                ordered(parts[0], parts[2]));
                                        } else if (isSame(parts[2], parts[3])) { //AaBaXbXb
                                            checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[2]) + " " + 
                                                ordered(parts[0], parts[1]));
                                        } else { //AaBa?b!(Aa|Ba|-//-)
                                            checkLocation("Shapesanity Singles " + 
                                                ordered(parts[0], parts[1], parts[2], parts[3]));
                                        }
                                    } else { //AaBa?b--
                                        checkLocation("Shapesanity Singles " + 
                                            ordered(parts[0], parts[1], parts[2]));
                                    }
                                }
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
                                    } else { //AaBa--?b
                                        checkLocation("Shapesanity Singles " + 
                                            ordered(parts[0], parts[1], parts[3]));
                                    }
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
                                        } else { //AaBbAa!(Aa|Bb)
                                            checkLocation("Shapesanity Cornered 2-1-1 " + toShort(parts[0]) + " " + 
                                                ordered(parts[1], parts[3]));
                                        }
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
                                        } else { //AaBbBb!(Aa|Bb)
                                            checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[1]) + " " + 
                                                ordered(parts[0], parts[3]));
                                        }
                                    } else { //AaBbBb--
                                        checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[1]) + " " + 
                                            toShort(parts[0]));
                                    }
                                } else { //AaBb!(Aa|Bb)
                                    if (parts[3]) { //AaBb!(Aa|Bb)??
                                        if (isSame(parts[0], parts[3])) { //AaBb!(Aa|Bb)Aa
                                            checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                ordered(parts[1], parts[2]));
                                        } else if (isSame(parts[1], parts[3])) { //AaBb!(Aa|Bb)Bb
                                            checkLocation("Shapesanity Cornered 2-1-1 " + toShort(parts[1]) + " " + 
                                                ordered(parts[0], parts[2]));
                                        } else if (isSame(parts[2], parts[3])) { //AaBb!(Aa|Bb)(-//-)
                                            checkLocation("Shapesanity Adjacent 2-1-1 " + toShort(parts[2]) + " " + 
                                                ordered(parts[0], parts[1]));
                                        } else { //AaBb!(Aa|Bb)!(Aa|Bb|-//-)
                                            checkLocation("Shapesanity Singles " + 
                                                ordered(parts[0], parts[1], parts[2], parts[3]));
                                        }
                                    } else { //AaBb!(Aa|Bb)--
                                        checkLocation("Shapesanity Singles " + 
                                            ordered(parts[0], parts[1], parts[2]));
                                    }
                                }
                            } else { //AaBb--
                                if (parts[3]) { //AaBb--??
                                    if (isSame(parts[0], parts[3])) { //AaBb--Aa
                                        checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                            toShort(parts[1]));
                                    } else if (isSame(parts[1], parts[3])) { //AaBb--Bb
                                        checkLocation("Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                            toShort(parts[0]));
                                    } else { //AaBb--!(Aa|Bb)
                                        checkLocation("Shapesanity Singles " + 
                                            ordered(parts[0], parts[1], parts[3]));
                                    }
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
                                    } else { //Aa--AbB?
                                        checkLocation("Shapesanity Singles " + 
                                            ordered(parts[0], parts[2], parts[3]));
                                    }
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
                                    } else { //Aa--Ba?b
                                        checkLocation("Shapesanity Singles " + 
                                            ordered(parts[0], parts[2], parts[3]));
                                    }
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
                                        } else { //Aa--BbB!(b)
                                            checkLocation("Shapesanity Singles " + 
                                                ordered(parts[0], parts[2], parts[3]));
                                        }
                                    } else { //Aa--BbC?
                                        checkLocation("Shapesanity Singles " + 
                                            ordered(parts[0], parts[2], parts[3]));
                                    }
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
                                    } else { //--AaAbB?
                                        checkLocation("Shapesanity Singles " + 
                                            ordered(parts[1], parts[2], parts[3]));
                                    }
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
                                    } else { //--AaBa?b
                                        checkLocation("Shapesanity Singles " + 
                                            ordered(parts[1], parts[2], parts[3]));
                                    }
                                } else { //--AaBb??
                                    if (isSame(parts[1], parts[3])) { //--AaBbAa
                                        checkLocation("Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                            toShort(parts[2]));
                                    } else if (isSame(parts[2], parts[3])) { //--AaBbBb
                                        checkLocation("Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                            toShort(parts[1]));
                                    } else { //--AaBb!(Aa|Bb)
                                        checkLocation("Shapesanity Singles " + 
                                            ordered(parts[1], parts[2], parts[3]));
                                    }
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
        }
        shapesanityCache[shape.getHash()] = true;
    }
}
