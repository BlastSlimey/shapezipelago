import { enumSubShapeToShortcode, ShapeDefinition } from "shapez/game/shape_definition";
import { apassert, apdebuglog, aptry, baseBuildingNames, colorNames, Connection, connection, currentIngame, customRewards, getIsUnlockedForTrap, modImpl, subShapeNames, upgradeIdNames } from "./global_data";
import { CLIENT_STATUS } from "archipelago.js";
import { enumColorToShortcode } from "shapez/game/colors";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { GameRoot } from "shapez/game/root";
import { RandomNumberGenerator } from "shapez/core/rng";

/**
 * @type {{[x:string]: (root: GameRoot, resynced: Boolean, index: number) => String}}
 */
export const receiveItemFunctions = {
    "Progressive Extractor": (root, resynced, index) => {
        if (root.hubGoals.gainedRewards[customRewards.extractor]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_miner_chainable] = 1;
        else root.hubGoals.gainedRewards[customRewards.extractor] = 1; 
        return "";
    },
    "Progressive Cutter": (root, resynced, index) => {
        if (connection.unlockVariant === "backwards") {
            if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_cutter_quad]) root.hubGoals.gainedRewards[customRewards.cutter] = 1;
            else root.hubGoals.gainedRewards[enumHubGoalRewards.reward_cutter_quad] = 1;
        } else {
            if (root.hubGoals.gainedRewards[customRewards.cutter]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_cutter_quad] = 1;
            else root.hubGoals.gainedRewards[customRewards.cutter] = 1;
        }
        return "";
    },
    "Progressive Rotator": (root, resynced, index) => {
        if (connection.unlockVariant === "backwards") {
            if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater_ccw]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater] = 1;
            else if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater_180]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater_ccw] = 1;
            else root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater_180] = 1;
        } else {
            if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater_ccw]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater_180] = 1;
            else if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater_ccw] = 1;
            else root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater] = 1;
        }
        root.hubGoals.gainedRewards[customRewards.belt] = 1; 
        return "";
    },
    "Progressive Painter": (root, resynced, index) => {
        if (connection.unlockVariant === "backwards") {
            if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_painter_double]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_painter] = 1;
            else if (root.hubGoals.gainedRewards[customRewards.painter_quad]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_painter_double] = 1;
            else root.hubGoals.gainedRewards[customRewards.painter_quad] = 1;
        } else {
            if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_painter_double]) root.hubGoals.gainedRewards[customRewards.painter_quad] = 1;
            else if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_painter]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_painter_double] = 1;
            else root.hubGoals.gainedRewards[enumHubGoalRewards.reward_painter] = 1;
        }
        root.hubGoals.gainedRewards[customRewards.belt] = 1; 
        return "";
    },
    "Progressive Tunnel": (root, resynced, index) => {
        if (connection.unlockVariant === "backwards") {
            if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_underground_belt_tier_2]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_tunnel] = 1;
            else root.hubGoals.gainedRewards[enumHubGoalRewards.reward_underground_belt_tier_2] = 1;
        } else {
            if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_tunnel]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_underground_belt_tier_2] = 1;
            else root.hubGoals.gainedRewards[enumHubGoalRewards.reward_tunnel] = 1;
        }
        return "";
    },
    "Progressive Balancer": (root, resynced, index) => {
        if (connection.unlockVariant === "backwards") {
            if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_merger]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_balancer] = 1;
            else if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_splitter]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_merger] = 1;
            else root.hubGoals.gainedRewards[enumHubGoalRewards.reward_splitter] = 1;
        } else {
            if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_merger]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_splitter] = 1;
            else if (root.hubGoals.gainedRewards[enumHubGoalRewards.reward_balancer]) root.hubGoals.gainedRewards[enumHubGoalRewards.reward_merger] = 1;
            else root.hubGoals.gainedRewards[enumHubGoalRewards.reward_balancer] = 1;
        }
        root.hubGoals.gainedRewards[customRewards.belt] = 1; 
        return "";
    },
    "Belt": (root, resynced, index) => {root.hubGoals.gainedRewards[customRewards.belt] = 1; return "";},
    "Extractor": (root, resynced, index) => {root.hubGoals.gainedRewards[customRewards.extractor] = 1; return "";},
    "Cutter": (root, resynced, index) => {root.hubGoals.gainedRewards[customRewards.cutter] = 1; return "";},
    "Rotator": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater] = 1; return "";},
    "Painter": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_painter] = 1; return "";},
    "Rotator (CCW)": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater_ccw] = 1; return "";},
    "Color Mixer": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_mixer] = 1; return "";},
    "Stacker": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_stacker] = 1; return "";},
    "Quad Cutter": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_cutter_quad] = 1; return "";},
    "Double Painter": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_painter_double] = 1; return "";},
    "Rotator (180°)": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_rotater_180] = 1; return "";},
    "Quad Painter": (root, resynced, index) => {root.hubGoals.gainedRewards[customRewards.painter_quad] = 1; return "";},
    "Balancer": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_balancer] = 1; return "";},
    "Tunnel": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_tunnel] = 1; return "";},
    "Compact Merger": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_merger] = 1; return "";},
    "Tunnel Tier II": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_underground_belt_tier_2] = 1; return "";},
    "Compact Splitter": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_splitter] = 1; return "";},
    "Trash": (root, resynced, index) => {root.hubGoals.gainedRewards[customRewards.trash] = 1; return "";},
    "Chaining Extractor": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_miner_chainable] = 1; return "";},
    "Belt Reader": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_belt_reader] = 1; return "";},
    "Storage": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_storage] = 1; return "";},
    "Switch": (root, resynced, index) => {root.hubGoals.gainedRewards[customRewards.switch] = 1; return "";},
    "Item Filter": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_filter] = 1; return "";},
    "Display": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_display] = 1; return "";},
    "Wires": (root, resynced, index) => {root.hubGoals.gainedRewards[customRewards.wires] = 1; return "";},
    "Constant Signal": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_constant_signal] = 1; return "";},
    "Logic Gates": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_logic_gates] = 1; return "";},
    "Virtual Processing": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_virtual_processing] = 1; return "";},
    "Blueprints": (root, resynced, index) => {root.hubGoals.gainedRewards[enumHubGoalRewards.reward_blueprints] = 1; return "";},
    "Big Belt Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["belt"] += 1; return "";},
    "Big Miner Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["miner"] += 1; return "";},
    "Big Processors Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["processors"] += 1; return "";},
    "Big Painting Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["painting"] += 1; return "";},
    "Small Belt Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["belt"] += 0.1; return "";},
    "Small Miner Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["miner"] += 0.1; return "";},
    "Small Processors Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["processors"] += 0.1; return "";},
    "Small Painting Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["painting"] += 0.1; return "";},
    "Blueprint Shapes Bundle": (root, resynced, index) => {
        if (resynced) return "";
        root.hubGoals.storedShapes[connection.blueprintShape] = (root.hubGoals.storedShapes[connection.blueprintShape] || 0) + 1000; 
        shapesanityAnalyzer(ShapeDefinition.fromShortKey(connection.blueprintShape));
        return ": 1000";
    },
    "Level Shapes Bundle": (root, resynced, index) => {
        if (resynced) return "";
        /**
         * @type {{[x: string]: number}}
         */
        const upgrades = {};
        for (let category in currentIngame.upgradeDefs) {
            for (let tier of currentIngame.upgradeDefs[category]) {
                for (let next of tier.required) {
                    const remaining = next.amount - (root.hubGoals.storedShapes[next.shape] || 0);
                    upgrades[next.shape] = (
                        upgrades[next.shape] == null ? 
                        // If this shape wasn't written down yet, just use the calculated remaining
                        // If it was already written down, only update remaining if it's less than before
                        remaining : Math.min(upgrades[next.shape], remaining)
                    );
                }
            }
        }
        levelLoop: for (let levelIndex = root.hubGoals.level-1; levelIndex < currentIngame.levelDefs.length; levelIndex++) {
            const definition = currentIngame.levelDefs[levelIndex];
            const stored = root.hubGoals.storedShapes[definition.shape] || 0;
            let addedAmount;
            if (upgrades[definition.shape] > 0) {
                if (definition.throughputOnly) {
                    addedAmount = Math.floor(upgrades[definition.shape] / 2);
                } else {
                    addedAmount = Math.floor(Math.min(upgrades[definition.shape], definition.required - (stored)) / 2);
                }
            } else if (upgrades[definition.shape] == null && !definition.throughputOnly) {
                // No throughput, so stored will never be higher than required
                addedAmount = Math.floor((definition.required - (stored)) / 2);
            } else {
                addedAmount = 1000;
            }
            if (addedAmount == 0) continue levelLoop;
            apassert(addedAmount >= 0, `Trying to give negative amount of shapes: ${addedAmount}`);
            root.hubGoals.storedShapes[definition.shape] = stored + addedAmount;
            shapesanityAnalyzer(ShapeDefinition.fromShortKey(definition.shape));
            return `: ${addedAmount} ${definition.shape}`;
        }
        if (root.hubGoals.currentGoal.throughputOnly) {
            const definition = root.hubGoals.currentGoal;
            const stored = root.hubGoals.storedShapes[definition.definition.getHash()] || 0;
            let addedAmount;
            if (upgrades[definition.definition.getHash()] > 0) {
                addedAmount = Math.floor(upgrades[definition.definition.getHash()] / 2);
            } else {
                addedAmount = 1000;
            }
            if (addedAmount != 0) {
                apassert(addedAmount >= 0, `Trying to give negative amount of shapes: ${addedAmount}`);
                root.hubGoals.storedShapes[definition.definition.getHash()] = stored + addedAmount;
                shapesanityAnalyzer(ShapeDefinition.fromShortKey(definition.definition.getHash()));
                return `: ${addedAmount} ${definition.definition.getHash()}`;
            }
        }
        // If loop found nothing, then addedAmount can only be 0, so no shapes
        return ": None";
    },
    "Upgrade Shapes Bundle": (root, resynced, index) => {
        // Resyncing should never do something to hubGoals.storedShapes
        if (resynced) return "";
        // Write all remaining for every upgrade down
        // All shapes in current tiers can get the bundle
        /**
         * @type {{[x: string]: number}}
         */
        const remainingDict = {};
        /**
         * @type {string[]}
         */
        const addableShapes = [];
        for (let category in currentIngame.upgradeDefs) {
            for (let tier of currentIngame.upgradeDefs[category]) {
                for (let next of tier.required) {
                    const remaining = next.amount - (root.hubGoals.storedShapes[next.shape] || 0);
                    remainingDict[next.shape] = (
                        remainingDict[next.shape] == null ? 
                        // If this shape wasn't written down yet, just use the calculated remaining
                        // If it was already written down, only update remaining if it's less than before
                        remaining : Math.min(remainingDict[next.shape], remaining)
                    );
                }
            }
            const upgradeLevel = root.hubGoals.getUpgradeLevel(category);
            if (upgradeLevel < currentIngame.upgradeDefs[category].length) {
                const tier = currentIngame.upgradeDefs[category][upgradeLevel];
                for (let next of tier.required) {
                    addableShapes.push(next.shape);
                }
            }
        }
        for (let level of currentIngame.levelDefs) {
            if (!level.throughputOnly) {
                if (!(remainingDict[level.shape] == null)) {
                    remainingDict[level.shape] = Math.min(
                        remainingDict[level.shape],
                        level.required - (root.hubGoals.storedShapes[level.shape] || 0)
                    );
                }
            }
        }
        for (let addable of addableShapes.slice()) {
            if (remainingDict[addable] == 1) addableShapes.splice(addableShapes.indexOf(addable), 1);
        }
        // If loop found nothing, then addedAmount can only be 0, so no shapes
        if (addableShapes.length == 0) return ": None";
        const randomShape = addableShapes[Math.floor(Math.random() * addableShapes.length)];
        let addedAmount;
        if (remainingDict[randomShape] > 1) addedAmount = Math.floor(remainingDict[randomShape] / 2);
        else addedAmount = 1000;
        root.hubGoals.storedShapes[randomShape] = (root.hubGoals.storedShapes[randomShape] || 0) + addedAmount;
        shapesanityAnalyzer(ShapeDefinition.fromShortKey(randomShape));
        return `: ${addedAmount} ${randomShape}`;
    },
    "Inventory Draining Trap": (root, resynced, index) => {
        if (resynced) return "";
        const r = Math.random()*3;
        if (r < 1) {
            return receiveItemFunctions["Blueprint Shapes Draining Trap"](root, resynced, index) + " "
                + shapez.T.mods.shapezipelago.itemReceivingBox.extraInfo.versionBlueprint;
        } else if (r < 2) {
            return receiveItemFunctions["Level Shapes Draining Trap"](root, resynced, index);
        } else {
            return receiveItemFunctions["Upgrade Shapes Draining Trap"](root, resynced, index);
        }
    },
    "Blueprint Shapes Draining Trap": (root, resynced, index) => {
        if (resynced) return "";
        const storedBlueprint = root.hubGoals.storedShapes[connection.blueprintShape] || 0;
        const drained = Math.floor(storedBlueprint / Math.log10((storedBlueprint+1000))-2);
        root.hubGoals.storedShapes[connection.blueprintShape] = storedBlueprint - drained;
        return `: ${drained}`;
    },
    "Level Shapes Draining Trap": (root, resynced, index) => {
        if (resynced) return "";
        for (let levelIndex = root.hubGoals.level-1; levelIndex < currentIngame.levelDefs.length; levelIndex++) {
            const currentLevel = currentIngame.levelDefs[levelIndex];
            const stored = root.hubGoals.storedShapes[currentLevel.shape] || 0;
            if (!currentLevel.throughputOnly && stored) {
                const drained = Math.ceil(stored / 2);
                root.hubGoals.storedShapes[currentLevel.shape] = stored - drained;
                return `: ${drained} ${currentLevel.shape}`;
            }
        }
        for (let levelIndex = root.hubGoals.level-1; levelIndex < currentIngame.levelDefs.length; levelIndex++) {
            const currentLevel = currentIngame.levelDefs[levelIndex];
            const stored = root.hubGoals.storedShapes[currentLevel.shape] || 0;
            if (stored) {
                const drained = Math.ceil(stored / 2);
                root.hubGoals.storedShapes[currentLevel.shape] -= drained;
                return `: -${drained} ${currentLevel.shape}`;
            }
        }
        if (root.hubGoals.currentGoal.throughputOnly) {
            const currentLevel = root.hubGoals.currentGoal;
            const stored = root.hubGoals.storedShapes[currentLevel.definition.getHash()] || 0;
            if (stored) {
                const drained = Math.ceil(stored / 2);
                root.hubGoals.storedShapes[currentLevel.definition.getHash()] -= drained;
                return `: -${drained} ${currentLevel.definition.getHash()}`;
            }
        }
        return ": None";
    },
    "Upgrade Shapes Draining Trap": (root, resynced, index) => {
        if (resynced) return "";
        /**
         * @type {string[]}
         */
        const drainable = [];
        for (let category in currentIngame.upgradeDefs) {
            const upgradeLevel = root.hubGoals.getUpgradeLevel(category);
            if (upgradeLevel < currentIngame.upgradeDefs[category].length) {
                const tier = currentIngame.upgradeDefs[category][upgradeLevel];
                for (let next of tier.required) {
                    if (root.hubGoals.storedShapes[next.shape]) drainable.push(next.shape);
                }
            }
        }
        if (drainable.length == 0) {
            for (let category in currentIngame.upgradeDefs) {
                for (let tier of currentIngame.upgradeDefs[category]) {
                    for (let next of tier.required) {
                        if (root.hubGoals.storedShapes[next.shape]) drainable.push(next.shape);
                    }
                }
            }
        }
        if (drainable.length) {
            const randomShape = drainable[Math.floor(Math.random() * drainable.length)];
            const drained = Math.ceil(root.hubGoals.storedShapes[randomShape] / 2);
            root.hubGoals.storedShapes[randomShape] -= drained;
            return `: -${drained} ${randomShape}`;
        } else {
            return ": None";
        }
    },
    "Locked Building Trap": (root, resynced, index) => {
        if (resynced) return "";
        /**
         * @type {string[]}
         */
        const lockable = [];
        for (let trap in currentIngame.trapLocked) {
            if (getIsUnlockedForTrap[trap](root)) lockable.push(trap);
        }
        if (lockable.length == 0) return ": None";
        const randomBuilding = lockable[Math.floor(Math.random()*lockable.length)];
        const randomTimeSec = Math.floor(Math.random()*46) + 15;
        currentIngame.trapLocked[randomBuilding] = true;
        setTimeout(() => {
            currentIngame.trapLocked[randomBuilding] = false;
        }, randomTimeSec*1000);
        return `: ${shapez.T.mods.shapezipelago.itemReceivingBox.item[baseBuildingNames[randomBuilding]]} ${
            shapez.T.mods.shapezipelago.itemReceivingBox.extraInfo.time.replace("<x>", randomTimeSec)}`;
    },
    "Throttled Building Trap": (root, resynced, index) => {
        if (resynced) return "";
        /**
         * @type {string[]}
         */
        const throttlable = [];
        for (let trap in currentIngame.trapThrottled) {
            if (getIsUnlockedForTrap[trap](root) && !currentIngame.trapThrottled[trap]) throttlable.push(trap);
        }
        if (throttlable.length == 0) return ": None";
        const randomBuilding = throttlable[Math.floor(Math.random()*throttlable.length)];
        const randomTimeSec = Math.floor(Math.random()*46) + 15;
        currentIngame.trapThrottled[randomBuilding] = true;
        setTimeout(() => {
            currentIngame.trapThrottled[randomBuilding] = false;
        }, randomTimeSec*1000);
        return `: ${shapez.T.mods.shapezipelago.itemReceivingBox.item[baseBuildingNames[randomBuilding]]} ${
            shapez.T.mods.shapezipelago.itemReceivingBox.extraInfo.time.replace("<x>", randomTimeSec)}`;
    },
    "Malfunctioning Trap": (root, resynced, index) => {
        if (resynced) return "";
        /**
         * @type {string[]}
         */
        const malfunctionable = [];
        for (let trap in currentIngame.trapMalfunction) {
            if (getIsUnlockedForTrap[trap](root) && !currentIngame.trapMalfunction[trap]) malfunctionable.push(trap);
        }
        if (malfunctionable.length == 0) return ": None";
        const randomBuilding = malfunctionable[Math.floor(Math.random()*malfunctionable.length)];
        const randomTimeSec = Math.floor(Math.random()*46) + 15;
        currentIngame.trapMalfunction[randomBuilding] = true;
        setTimeout(() => {
            currentIngame.trapMalfunction[randomBuilding] = false;
        }, randomTimeSec*1000);
        return `: ${shapez.T.mods.shapezipelago.itemReceivingBox.item[baseBuildingNames[randomBuilding]]} ${
            shapez.T.mods.shapezipelago.itemReceivingBox.extraInfo.time.replace("<x>", randomTimeSec)}`;
    },
    "Gigantic Belt Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["belt"] += 10; return "";},
    "Gigantic Miner Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["miner"] += 10; return "";},
    "Gigantic Processors Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["processors"] += 10; return "";},
    "Gigantic Painting Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["painting"] += 10; return "";},
    "Rising Belt Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["belt"] *= 2; return "";},
    "Rising Miner Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["miner"] *= 2; return "";},
    "Rising Processors Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["processors"] *= 2; return "";},
    "Rising Painting Upgrade": (root, resynced, index) => {root.hubGoals.upgradeImprovements["painting"] *= 2; return "";},
    "Belt Upgrade Trap": (root, resynced, index) => {
        root.hubGoals.upgradeImprovements["belt"] -= 3;
        if (root.hubGoals.upgradeImprovements["belt"] < 0.5) root.hubGoals.upgradeImprovements["belt"] = 0.5;
        return "";
    },
    "Miner Upgrade Trap": (root, resynced, index) => {
        root.hubGoals.upgradeImprovements["miner"] -= 3;
        if (root.hubGoals.upgradeImprovements["miner"] < 0.5) root.hubGoals.upgradeImprovements["miner"] = 0.5;
        return "";
    },
    "Processors Upgrade Trap": (root, resynced, index) => {
        root.hubGoals.upgradeImprovements["processors"] -= 3;
        if (root.hubGoals.upgradeImprovements["processors"] < 0.5) root.hubGoals.upgradeImprovements["processors"] = 0.5;
        return "";
    },
    "Painting Upgrade Trap": (root, resynced, index) => {
        root.hubGoals.upgradeImprovements["painting"] -= 3;
        if (root.hubGoals.upgradeImprovements["painting"] < 0.5) root.hubGoals.upgradeImprovements["painting"] = 0.5;
        return "";
    },
    "Demonic Belt Upgrade Trap": (root, resynced, index) => {
        root.hubGoals.upgradeImprovements["belt"] *= 0.5;
        if (root.hubGoals.upgradeImprovements["belt"] < 0.5) root.hubGoals.upgradeImprovements["belt"] = 0.5;
        return "";
    },
    "Demonic Miner Upgrade Trap": (root, resynced, index) => {
        root.hubGoals.upgradeImprovements["miner"] *= 0.5;
        if (root.hubGoals.upgradeImprovements["miner"] < 0.5) root.hubGoals.upgradeImprovements["miner"] = 0.5;
        return "";
    },
    "Demonic Processors Upgrade Trap": (root, resynced, index) => {
        root.hubGoals.upgradeImprovements["processors"] *= 0.5;
        if (root.hubGoals.upgradeImprovements["processors"] < 0.5) root.hubGoals.upgradeImprovements["processors"] = 0.5;
        return "";
    },
    "Demonic Painting Upgrade Trap": (root, resynced, index) => {
        root.hubGoals.upgradeImprovements["painting"] *= 0.5;
        if (root.hubGoals.upgradeImprovements["painting"] < 0.5) root.hubGoals.upgradeImprovements["painting"] = 0.5;
        return "";
    },
    "Big Random Upgrade": (root, resynced, index) => {
        const category = new RandomNumberGenerator(connection.clientSeed + index).choice(["belt", "miner", "processors", "painting"]);
        root.hubGoals.upgradeImprovements[category] += 2; 
        return `: ${shapez.T.mods.shapezipelago.itemReceivingBox.extraInfo.upgradeId[category]}`;
    },
    "Small Random Upgrade": (root, resynced, index) => {
        const category = new RandomNumberGenerator(connection.clientSeed + index).choice(["belt", "miner", "processors", "painting"]);
        root.hubGoals.upgradeImprovements[category] += 0.2; 
        return `: ${shapez.T.mods.shapezipelago.itemReceivingBox.extraInfo.upgradeId[category]}`;
    },
    "Inflation Trap": (root, resynced, index) => {
        connection.requiredShapesMultiplier++;
        currentIngame.levelDefs = null;
        currentIngame.upgradeDefs = null;
        root.gameMode.getLevelDefinitions();
        root.gameMode.getUpgrades();
        return "";
    },
};

/**
 * @param {string[]} names
 * @param {string} resyncMessage
 * @param {boolean} goal
 */
export function checkLocation(resyncMessage, goal, ...names) {
    aptry("Checking location failed", () => {
        apdebuglog(`Checking ${names.length} locations (goal==${goal}): ${names.toString()}`);
        if (goal) 
            connection.reportStatusToServer(CLIENT_STATUS.GOAL);
        const locids = [];
        const namesCopy = names.slice();
        for (var name of namesCopy)
            if (name.startsWith("Shapesanity"))
                names.push("Shapesanity " + (connection.shapesanityNames.indexOf(name.substring("Shapesanity ".length))+1));
        for (var name of names)
            if (connection.gamepackage.location_name_to_id[name]) {
                locids.push(connection.gamepackage.location_name_to_id[name]);
                apdebuglog(`${resyncMessage} location ${name} with ID ${connection.gamepackage.location_name_to_id[name]}`);
            }
        connection.sendLocationChecks(locids);
    });
}

/**
 * @param {import("archipelago.js").ReceivedItemsPacket} packet
 */
export function processItemsPacket(packet) {
    apdebuglog("Received packet with " + packet.items.length + 
        " items and reported index " + packet.index + 
        ", while having " + currentIngame.processedItemCount + " items");
    // Prevent errors in main menu
    if (!currentIngame)
        return;
    let all_items = connection.client.items.received;
    // Resync already received items at first packet
    if (!currentIngame.isItemsResynced) {
        currentIngame.isItemsResynced = true;
        // Resetting gained rewards to 0 (mostly used like a boolean)
        for (var reward in currentIngame.root.hubGoals.gainedRewards) {
            currentIngame.root.hubGoals.gainedRewards[reward] = 0;
        }
        // Resetting upgrade improvements to 1 (it's a multiplier)
        for (var id in currentIngame.root.hubGoals.upgradeImprovements) {
            currentIngame.root.hubGoals.upgradeImprovements[id] = 1;
        }
        // Re-receive items without popup
        const cachedprocessedItemCount = currentIngame.processedItemCount;
        for (var i = 0; i < cachedprocessedItemCount; i++) {
            receiveItem(all_items[i], false, true, i);
        }
        // Backwards compatibility to 0.5.3
        const datacache = connection.client.data.slotData["lock_belt_and_extractor"];
        if (datacache != null) {
            apdebuglog(`Loaded lock_belt_and_extractor as backwards compatibility: ${datacache}`);
            if (!datacache) {
                currentIngame.root.hubGoals.gainedRewards[customRewards.belt] = 1;
                currentIngame.root.hubGoals.gainedRewards[customRewards.extractor] = 1;
            }
        } else {
            apdebuglog("No lock_belt_and_extractor found in slotData");
        }
    }
    if (currentIngame.processedItemCount == all_items.length) {
        apdebuglog("Items up-to-date");
    } else if (currentIngame.processedItemCount == all_items.length - 1) {
        receiveItem(all_items[currentIngame.processedItemCount], true, false, currentIngame.processedItemCount);
        currentIngame.processedItemCount++;
    } else if (currentIngame.processedItemCount == all_items.length - 2) {
        receiveItem(all_items[currentIngame.processedItemCount], true, false, currentIngame.processedItemCount);
        currentIngame.processedItemCount++;
        receiveItem(all_items[currentIngame.processedItemCount], true, false, currentIngame.processedItemCount);
        currentIngame.processedItemCount++;
    } else if (currentIngame.processedItemCount == all_items.length - 3) {
        receiveItem(all_items[currentIngame.processedItemCount], true, false, currentIngame.processedItemCount);
        currentIngame.processedItemCount++;
        receiveItem(all_items[currentIngame.processedItemCount], true, false, currentIngame.processedItemCount);
        currentIngame.processedItemCount++;
        receiveItem(all_items[currentIngame.processedItemCount], true, false, currentIngame.processedItemCount);
        currentIngame.processedItemCount++;
    } else {
        var itemCounting = [];
        for (var i = currentIngame.processedItemCount; i < all_items.length; i++) {
            itemCounting.push(receiveItem(all_items[i], false, false, i));
            currentIngame.processedItemCount++;
        }
        modImpl.dialogs.showInfo(shapez.T.mods.shapezipelago.itemReceivingBox.title.multiple, itemCounting.join("<br />"));
    }
    currentIngame.itemReceiveSignal.dispatch();
}

/**
 * @param {import("archipelago.js").NetworkItem} item
 * @param {boolean} showInfo
 * @param {boolean} resynced
 * @param {number} index
 */
function receiveItem(item, showInfo, resynced, index) {
    const itemName = connection.getItemName(item.item);
    const message = receiveItemFunctions[itemName](currentIngame.root, resynced, index);
    apdebuglog("Processed item " + itemName + message);
    if (showInfo) {
        const sendingPlayerName = connection.getPlayername(item.player);
        const foundLocationName = connection.getLocationName(item.player, item.location);
        modImpl.dialogs.showInfo(shapez.T.mods.shapezipelago.itemReceivingBox.title.single, 
            shapez.T.mods.shapezipelago.itemReceivingBox.item[itemName] + message + "<br />" + 
                shapez.T.mods.shapezipelago.itemReceivingBox.foundBy
                    .replace("<player>", sendingPlayerName)
                    .replace("<location>", foundLocationName));
        return "";
    } else {
        return shapez.T.mods.shapezipelago.itemReceivingBox.item[itemName] + message;
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
function orderedOnlyDifferent(letter1, letter2, letter3, letter4 = null) {
    if (letter4 == null) {
        return [letter1, letter2, letter3].sort().join("") + "-";
    } else {
        return [letter1, letter2, letter3, letter4].sort().join("");
    }
}

/**
 * @param {ShapeDefinition} shape
 */
export function shapesanityAnalyzer(shape) {
    aptry("Analyzing shapesanity failed", () => {
        if (shape.layers.length == 1) {
            if (connection.shapesanityCache[shape.getHash()]) {
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
                                                        checkLocation("Checked", false, "Shapesanity " + colorNames[parts[0].color] + " " + 
                                                            subShapeNames[parts[0].subShape]);
                                                    } else { //AaAaAaAb
                                                        checkLocation("Checked", false, "Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                            toShort(parts[3]));
                                                    }
                                                } else { //AaAaAbA?
                                                    if (parts[0].color === parts[3].color) { //AaAaAbAa
                                                        checkLocation("Checked", false, "Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                            toShort(parts[2]));
                                                    } else if (parts[2].color === parts[3].color) { //AaAaAbAb
                                                        checkLocation("Checked", false, "Shapesanity Half-Half " + 
                                                            ordered(parts[0], parts[2]));
                                                    } //AaAaAbAc
                                                }
                                            } else { //AaAbA?A?
                                                if (parts[0].color === parts[2].color) { //AaAbAaA?
                                                    if (parts[0].color === parts[3].color) { //AaAbAaAa
                                                        checkLocation("Checked", false, "Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                            toShort(parts[1]));
                                                    } else if (parts[1].color === parts[3].color) { //AaAbAaAb
                                                        checkLocation("Checked", false, "Shapesanity Checkered " + 
                                                            ordered(parts[0], parts[1]));
                                                    } else { //AaAbAaAc
                                                        checkLocation("Checked", false, "Shapesanity Cornered 2-1-1 " + toShort(parts[0]) + " " + 
                                                            ordered(parts[1], parts[3]));
                                                    }
                                                } else if (parts[1].color === parts[2].color) { //AaAbAbA?
                                                    if (parts[0].color === parts[3].color) { //AaAbAbAa
                                                        checkLocation("Checked", false, "Shapesanity Half-Half " + 
                                                            ordered(parts[0], parts[1]));
                                                    } else if (parts[1].color === parts[3].color) { //AaAbAbAb
                                                        checkLocation("Checked", false, "Shapesanity 3-1 " + toShort(parts[1]) + " " + 
                                                            toShort(parts[0]));
                                                    } else { //AaAbAbAc
                                                        checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[1]) + " " + 
                                                            ordered(parts[0], parts[3]));
                                                    }
                                                } else { //AaAbAcA?
                                                    if (parts[0].color !== parts[3].color) { //AaAbAcA!(a)
                                                        if (parts[1].color !== parts[3].color) { //AaAbAcA!(a|b)
                                                            if (parts[2].color !== parts[3].color) { //AaAbAcAd
                                                                checkLocation("Checked", false, "Shapesanity " + orderedOnlyDifferent(
                                                                    enumColorToShortcode[parts[0].color],
                                                                    enumColorToShortcode[parts[1].color],
                                                                    enumColorToShortcode[parts[2].color],
                                                                    enumColorToShortcode[parts[3].color]
                                                                ) + " " + subShapeNames[parts[0].subShape]);
                                                            } else { //AaAbAcAc
                                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[2]) + 
                                                                    " " + ordered(parts[0], parts[1]));
                                                            }
                                                        } else { //AaAbAcAb
                                                            checkLocation("Checked", false, "Shapesanity Cornered 2-1-1 " + toShort(parts[1]) + " " + 
                                                                ordered(parts[0], parts[2]));
                                                        }
                                                    } else { //AaAbAcAa
                                                        checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                            ordered(parts[1], parts[2]));
                                                    }
                                                }
                                            }
                                        } else { //AaA?A?B?
                                            if (parts[0].color === parts[1].color) { //AaAaA?B?
                                                if (parts[0].color === parts[2].color) { //AaAaAaB?
                                                    checkLocation("Checked", false, "Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                        toShort(parts[3]));
                                                } else { //AaAaAbB?
                                                    checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                        ordered(parts[2], parts[3]));
                                                }
                                            } else { //AaAbA?B?
                                                if (parts[0].color === parts[2].color) { //AaAbAaB?
                                                    checkLocation("Checked", false, "Shapesanity Cornered 2-1-1 " + toShort(parts[0]) + " " + 
                                                        ordered(parts[1], parts[3]));
                                                } else if (parts[1].color === parts[2].color) { //AaAbAbB?
                                                    checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[1]) + " " + 
                                                        ordered(parts[0], parts[3]));
                                                } else { //AaAbAcB?
                                                    checkLocation("Checked", false, "Shapesanity Singles " + 
                                                        ordered(parts[0], parts[1], parts[2], parts[3]));
                                                }
                                            }
                                        }
                                    } else { //AaA?B???
                                        if (parts[0].subShape === parts[3].subShape) { //AaA?B?A?
                                            if (parts[0].color === parts[1].color) { //AaAaB?A?
                                                if (parts[0].color === parts[3].color) { //AaAaB?Aa
                                                    checkLocation("Checked", false, "Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                        toShort(parts[2]));
                                                } else { //AaAaB?Ab
                                                    checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                        ordered(parts[2], parts[3]));
                                                }
                                            } else { //AaAbB?A?
                                                if (parts[0].color === parts[3].color) { //AaAbB?Aa
                                                    checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                        ordered(parts[1], parts[2]));
                                                } else if (parts[1].color === parts[3].color) { //AaAbB?Ab
                                                    checkLocation("Checked", false, "Shapesanity Cornered 2-1-1 " + toShort(parts[1]) + " " + 
                                                        ordered(parts[0], parts[2]));
                                                } else { //AaAbB?Ac
                                                    checkLocation("Checked", false, "Shapesanity Singles " + 
                                                        ordered(parts[0], parts[1], parts[2], parts[3]));
                                                }
                                            }
                                        } else if (parts[2].subShape === parts[3].subShape) { //AaA?B?B?
                                            if (parts[0].color === parts[1].color) { //AaAaB?B?
                                                if (parts[2].color === parts[3].color) { //AaAaBxBx
                                                    checkLocation("Checked", false, "Shapesanity Half-Half " + ordered(parts[0], parts[2]));
                                                } else { //AaAaBxB!(x)
                                                    checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                        ordered(parts[2], parts[3]));
                                                }
                                            } else { //AaAbB?B?
                                                if (parts[2].color === parts[3].color) { //AaAbBxBx
                                                    checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[2]) + " " + 
                                                        ordered(parts[0], parts[1]));
                                                } else { //AaAbBxB!(x)
                                                    checkLocation("Checked", false, "Shapesanity Singles " + 
                                                        ordered(parts[0], parts[1], parts[2], parts[3]));
                                                }
                                            }
                                        } else { //AaA?B?C?
                                            if (parts[0].color === parts[1].color) { //AaAaB?C?
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                    ordered(parts[2], parts[3]));
                                            } else { //AaAbB?C?
                                                checkLocation("Checked", false, "Shapesanity Singles " + 
                                                    ordered(parts[0], parts[1], parts[2], parts[3]));
                                            }
                                        }
                                    }
                                } else { //AaA???--
                                    if (parts[0].subShape === parts[2].subShape) { //AaA?A?--
                                        if (parts[0].color === parts[1].color) { //AaAaA?--
                                            if (parts[0].color === parts[2].color) { //AaAaAa--
                                                checkLocation("Checked", false, "Shapesanity Cut Out " + colorNames[parts[0].color] + " " + 
                                                    subShapeNames[parts[0].subShape]);
                                            } else { //AaAaAb--
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[2]));
                                            }
                                        } else { //AaAbA?--
                                            if (parts[0].color === parts[2].color) { //AaAbAa--
                                                checkLocation("Checked", false, "Shapesanity Cornered 2-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[1]));
                                            } else if (parts[1].color === parts[2].color) { //AaAbAb--
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[1]) + " " + 
                                                    toShort(parts[0]));
                                            } else { //AaAbAc--
                                                checkLocation("Checked", false, "Shapesanity " + orderedOnlyDifferent(
                                                    enumColorToShortcode[parts[0].color],
                                                    enumColorToShortcode[parts[1].color],
                                                    enumColorToShortcode[parts[2].color]
                                                ) + " " + subShapeNames[parts[0].subShape]);
                                            }
                                        }
                                    } else { //AaA?B?--
                                        if (parts[0].color === parts[1].color) { //AaAaB?--
                                            checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[2]));
                                        } else { //AaAbB?--
                                            checkLocation("Checked", false, "Shapesanity Singles " + 
                                                ordered(parts[0], parts[1], parts[2]));
                                        }
                                    }
                                }
                            } else { //AaA?--
                                if (parts[3]) { //AaA?--??
                                    if (parts[0].color === parts[1].color) { //AaAa--??
                                        if (isSame(parts[0], parts[3])) { //AaAa--Aa
                                            checkLocation("Checked", false, "Shapesanity Cut Out " + colorNames[parts[0].color] + " " + 
                                                subShapeNames[parts[0].subShape]);
                                        } else { //AaAa--!(Aa)
                                            checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[3]));
                                        }
                                    } else { //AaAb--??
                                        if (parts[0].subShape === parts[3].subShape) { //AaAb--A?
                                            if (parts[0].color === parts[3].color) { //AaAb--Aa
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[1]));
                                            } else if (parts[1].color === parts[3].color) { //AaAb--Ab
                                                checkLocation("Checked", false, "Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                                    toShort(parts[0]));
                                            } else { //AaAb--Ac
                                                checkLocation("Checked", false, "Shapesanity " + orderedOnlyDifferent(
                                                    enumColorToShortcode[parts[0].color],
                                                    enumColorToShortcode[parts[1].color],
                                                    enumColorToShortcode[parts[3].color]
                                                ) + " " + subShapeNames[parts[0].subShape]);
                                            }
                                        } else { //AaAb--B?
                                            checkLocation("Checked", false, "Shapesanity Singles " + 
                                                ordered(parts[0], parts[1], parts[3]));
                                        }
                                    }
                                } else { //AaA?----
                                    if (parts[0].color === parts[1].color) { //AaAa----
                                        checkLocation("Checked", false, "Shapesanity Half " + colorNames[parts[0].color] + " " + 
                                            subShapeNames[parts[0].subShape]);
                                    } else { //AaAb----
                                        checkLocation("Checked", false, "Shapesanity Adjacent Singles " + ordered(parts[0], parts[1]));
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
                                                    checkLocation("Checked", false, "Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                        toShort(parts[1]));
                                                } else if (isSame(parts[1], parts[3])) { //AaBaAaBa
                                                    checkLocation("Checked", false, "Shapesanity Checkered " + ordered(parts[0], parts[1]));
                                                } else { //AaBaAa!(Aa|Ba)
                                                    checkLocation("Checked", false, "Shapesanity Cornered 2-1-1 " + toShort(parts[0]) + " " + 
                                                        ordered(parts[1], parts[3]));
                                                }
                                            } else { //AaBaAa--
                                                checkLocation("Checked", false, "Shapesanity Cornered 2-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[1]));
                                            }
                                        } else if (parts[1].subShape === parts[2].subShape) { //AaBaBa
                                            if (parts[3]) { //AaBaBa??
                                                if (isSame(parts[0], parts[3])) { //AaBaBaAa
                                                    checkLocation("Checked", false, "Shapesanity Half-Half " + ordered(parts[0], parts[1]));
                                                } else if (isSame(parts[1], parts[3])) { //AaBaBaBa
                                                    checkLocation("Checked", false, "Shapesanity 3-1 " + toShort(parts[1]) + " " + 
                                                        toShort(parts[0]));
                                                } else { //AaBaBa!(Aa|Ba)
                                                    checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[1]) + " " + 
                                                        ordered(parts[0], parts[3]));
                                                }
                                            } else { //AaBaBa--
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[1]) + " " + 
                                                    toShort(parts[0]));
                                            }
                                        } else { //AaBaCa
                                            if (parts[3]) { //AaBaCa??
                                                if (parts[0].color === parts[3].color) { //AaBaCa?a
                                                    if (parts[0].subShape !== parts[3].subShape) { //AaBaCa!(A)a
                                                        if (parts[1].subShape !== parts[3].subShape) { //AaBaCa!(A|B)a
                                                            if (parts[2].subShape !== parts[3].subShape) { //AaBaCaDa
                                                                checkLocation("Checked", false, "Shapesanity " + colorNames[parts[0].color] + 
                                                                    " " + orderedOnlyDifferent(
                                                                        enumSubShapeToShortcode[parts[0].subShape],
                                                                        enumSubShapeToShortcode[parts[1].subShape],
                                                                        enumSubShapeToShortcode[parts[2].subShape],
                                                                        enumSubShapeToShortcode[parts[3].subShape]));
                                                            } else { //AaBaCaCa
                                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[2]) + " " + 
                                                                    ordered(parts[0], parts[1]));
                                                            }
                                                        } else { //AaBaCaBa
                                                            checkLocation("Checked", false, "Shapesanity Cornered 2-1-1 " + toShort(parts[1]) + " " + 
                                                                ordered(parts[0], parts[2]));
                                                        }
                                                    } else { //AaBaCaAa
                                                        checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                            ordered(parts[1], parts[2]));
                                                    }
                                                } else { //AaBaCa?b
                                                    checkLocation("Checked", false, "Shapesanity Singles " + 
                                                        ordered(parts[0], parts[1], parts[2], parts[3]));
                                                }
                                            } else { //AaBaCa--
                                                checkLocation("Checked", false, "Shapesanity " + colorNames[parts[0].color] + " " + 
                                                    orderedOnlyDifferent(enumSubShapeToShortcode[parts[0].subShape],
                                                        enumSubShapeToShortcode[parts[1].subShape],
                                                        enumSubShapeToShortcode[parts[2].subShape]));
                                            }
                                        }
                                    } else { //AaBa?b
                                        if (parts[3]) { //AaBa?b??
                                            if (isSame(parts[0], parts[3])) { //AaBa?bAa
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                    ordered(parts[1], parts[2]));
                                            } else if (isSame(parts[1], parts[3])) { //AaBa?bBa
                                                checkLocation("Checked", false, "Shapesanity Cornered 2-1-1 " + toShort(parts[1]) + " " + 
                                                    ordered(parts[0], parts[2]));
                                            } else if (isSame(parts[2], parts[3])) { //AaBaXbXb
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[2]) + " " + 
                                                    ordered(parts[0], parts[1]));
                                            } else { //AaBa?b!(Aa|Ba|-//-)
                                                checkLocation("Checked", false, "Shapesanity Singles " + 
                                                    ordered(parts[0], parts[1], parts[2], parts[3]));
                                            }
                                        } else { //AaBa?b--
                                            checkLocation("Checked", false, "Shapesanity Singles " + 
                                                ordered(parts[0], parts[1], parts[2]));
                                        }
                                    }
                                } else { //AaBa--
                                    if (parts[3]) { //AaBa--??
                                        if (parts[0].color === parts[3].color) { //AaBa--?a
                                            if (parts[0].subShape === parts[3].subShape) { //AaBa--Aa
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[1]));
                                            } else if (parts[1].subShape === parts[3].subShape) { //AaBa--Ba
                                                checkLocation("Checked", false, "Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                                    toShort(parts[0]));
                                            } else { //AaBa--Ca
                                                checkLocation("Checked", false, "Shapesanity " + colorNames[parts[0].color] + " " + 
                                                    orderedOnlyDifferent(enumSubShapeToShortcode[parts[0].subShape],
                                                        enumSubShapeToShortcode[parts[1].subShape],
                                                        enumSubShapeToShortcode[parts[3].subShape]));
                                            }
                                        } else { //AaBa--?b
                                            checkLocation("Checked", false, "Shapesanity Singles " + 
                                                ordered(parts[0], parts[1], parts[3]));
                                        }
                                    } else { //AaBa----
                                        checkLocation("Checked", false, "Shapesanity Adjacent Singles " + ordered(parts[0], parts[1]));
                                    }
                                }
                            } else { //AaBb
                                if (parts[2]) { //AaBb??
                                    if (isSame(parts[0], parts[2])) { //AaBbAa
                                        if (parts[3]) { //AaBbAa??
                                            if (isSame(parts[0], parts[3])) { //AaBbAaAa
                                                checkLocation("Checked", false, "Shapesanity 3-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[1]));
                                            } else if (isSame(parts[1], parts[3])) { //AaBbAaBb
                                                checkLocation("Checked", false, "Shapesanity Checkered " + ordered(parts[0], parts[1]));
                                            } else { //AaBbAa!(Aa|Bb)
                                                checkLocation("Checked", false, "Shapesanity Cornered 2-1-1 " + toShort(parts[0]) + " " + 
                                                    ordered(parts[1], parts[3]));
                                            }
                                        } else { //AaBbAa--
                                            checkLocation("Checked", false, "Shapesanity Cornered 2-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[1]));
                                        }
                                    } else if (isSame(parts[1], parts[2])) { //AaBbBb
                                        if (parts[3]) { //AaBbBb??
                                            if (isSame(parts[0], parts[3])) { //AaBbBbAa
                                                checkLocation("Checked", false, "Shapesanity Half-Half " + ordered(parts[0], parts[1]));
                                            } else if (isSame(parts[1], parts[3])) { //AaBbBbBb
                                                checkLocation("Checked", false, "Shapesanity 3-1 " + toShort(parts[1]) + " " + 
                                                    toShort(parts[0]));
                                            } else { //AaBbBb!(Aa|Bb)
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[1]) + " " + 
                                                    ordered(parts[0], parts[3]));
                                            }
                                        } else { //AaBbBb--
                                            checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[1]) + " " + 
                                                toShort(parts[0]));
                                        }
                                    } else { //AaBb!(Aa|Bb)
                                        if (parts[3]) { //AaBb!(Aa|Bb)??
                                            if (isSame(parts[0], parts[3])) { //AaBb!(Aa|Bb)Aa
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[0]) + " " + 
                                                    ordered(parts[1], parts[2]));
                                            } else if (isSame(parts[1], parts[3])) { //AaBb!(Aa|Bb)Bb
                                                checkLocation("Checked", false, "Shapesanity Cornered 2-1-1 " + toShort(parts[1]) + " " + 
                                                    ordered(parts[0], parts[2]));
                                            } else if (isSame(parts[2], parts[3])) { //AaBb!(Aa|Bb)(-//-)
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1-1 " + toShort(parts[2]) + " " + 
                                                    ordered(parts[0], parts[1]));
                                            } else { //AaBb!(Aa|Bb)!(Aa|Bb|-//-)
                                                checkLocation("Checked", false, "Shapesanity Singles " + 
                                                    ordered(parts[0], parts[1], parts[2], parts[3]));
                                            }
                                        } else { //AaBb!(Aa|Bb)--
                                            checkLocation("Checked", false, "Shapesanity Singles " + 
                                                ordered(parts[0], parts[1], parts[2]));
                                        }
                                    }
                                } else { //AaBb--
                                    if (parts[3]) { //AaBb--??
                                        if (isSame(parts[0], parts[3])) { //AaBb--Aa
                                            checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[1]));
                                        } else if (isSame(parts[1], parts[3])) { //AaBb--Bb
                                            checkLocation("Checked", false, "Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                                toShort(parts[0]));
                                        } else { //AaBb--!(Aa|Bb)
                                            checkLocation("Checked", false, "Shapesanity Singles " + 
                                                ordered(parts[0], parts[1], parts[3]));
                                        }
                                    } else { //AaBb----
                                        checkLocation("Checked", false, "Shapesanity Adjacent Singles " + ordered(parts[0], parts[1]));
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
                                            checkLocation("Checked", false, "Shapesanity Cut Out " + colorNames[parts[0].color] + " " + 
                                                subShapeNames[parts[0].subShape]);
                                        } else { //Aa--Aa!(Aa)
                                            checkLocation("Checked", false, "Shapesanity Cornered 2-1 " + toShort(parts[0]) + " " + 
                                                toShort(parts[3]));
                                        }
                                    } else { //Aa--Aa--
                                        checkLocation("Checked", false, "Shapesanity Cornered " + colorNames[parts[0].color] + " " + 
                                            subShapeNames[parts[0].subShape]);
                                    }
                                } else { //Aa--Ab
                                    if (parts[3]) { //Aa--Ab??
                                        if (parts[0].subShape === parts[3].subShape) { //Aa--AbA?
                                            if (parts[0].color === parts[3].color) { //Aa--AbAa
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[2]));
                                            } else if (parts[2].color === parts[3].color) { //Aa--AbAb
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                                    toShort(parts[0]));
                                            } else { //Aa--AbAc
                                                checkLocation("Checked", false, "Shapesanity " + orderedOnlyDifferent(
                                                    enumColorToShortcode[parts[0].color],
                                                    enumColorToShortcode[parts[2].color],
                                                    enumColorToShortcode[parts[3].color]
                                                ) + " " + subShapeNames[parts[0].subShape]);
                                            }
                                        } else { //Aa--AbB?
                                            checkLocation("Checked", false, "Shapesanity Singles " + 
                                                ordered(parts[0], parts[2], parts[3]));
                                        }
                                    } else { //Aa--Ab--
                                        checkLocation("Checked", false, "Shapesanity Cornered Singles " + ordered(parts[0], parts[2]));
                                    }
                                }
                            } else { //Aa--B?
                                if (parts[0].color === parts[2].color) { //Aa--Ba
                                    if (parts[3]) { //Aa--Ba??
                                        if (parts[0].color === parts[3].color) { //Aa--Ba?a
                                            if (parts[0].subShape === parts[3].subShape) { //Aa--BaAa
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[0]) + " " + 
                                                    toShort(parts[2]));
                                            } else if (parts[2].subShape === parts[3].subShape) { //Aa--BaBa
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                                    toShort(parts[0]));
                                            } else { //Aa--BaCa
                                                checkLocation("Checked", false, "Shapesanity " + colorNames[parts[0].color] + " " + 
                                                    orderedOnlyDifferent(enumSubShapeToShortcode[parts[0].subShape],
                                                        enumSubShapeToShortcode[parts[2].subShape],
                                                        enumSubShapeToShortcode[parts[3].subShape]));
                                            }
                                        } else { //Aa--Ba?b
                                            checkLocation("Checked", false, "Shapesanity Singles " + 
                                                ordered(parts[0], parts[2], parts[3]));
                                        }
                                    } else { //Aa--Ba--
                                        checkLocation("Checked", false, "Shapesanity Cornered Singles " + ordered(parts[0], parts[2]));
                                    }
                                } else { //Aa--Bb
                                    if (parts[3]) { //Aa--Bb??
                                        if (parts[0].subShape === parts[3].subShape) { //Aa--BbA?
    
                                        } else if (parts[2].subShape === parts[3].subShape) { //Aa--BbB?
                                            if (parts[2].color === parts[3].color) { //Aa--BbBb
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                                    toShort(parts[0]));
                                            } else { //Aa--BbB!(b)
                                                checkLocation("Checked", false, "Shapesanity Singles " + 
                                                    ordered(parts[0], parts[2], parts[3]));
                                            }
                                        } else { //Aa--BbC?
                                            checkLocation("Checked", false, "Shapesanity Singles " + 
                                                ordered(parts[0], parts[2], parts[3]));
                                        }
                                    } else { //Aa--Bb--
                                        checkLocation("Checked", false, "Shapesanity Cornered Singles " + ordered(parts[0], parts[2]));
                                    }
                                }
                            }
                        } else { //Aa----
                            if (parts[3]) { //Aa----??
                                if (isSame(parts[0], parts[3])) { //Aa----Aa
                                    checkLocation("Checked", false, "Shapesanity Half " + colorNames[parts[0].color] + " " + 
                                        subShapeNames[parts[3].subShape]);
                                } else { //Aa----!(Aa)
                                    checkLocation("Checked", false, "Shapesanity Adjacent Singles " + ordered(parts[0], parts[3]));
                                }
                            } else { //Aa------
                                checkLocation("Checked", false, "Shapesanity " + colorNames[parts[0].color] + " " + 
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
                                            checkLocation("Checked", false, "Shapesanity Cut Out " + colorNames[parts[1].color] + " " + 
                                                subShapeNames[parts[1].subShape]);
                                        } else { //--AaAa!(Aa)
                                            checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[1]) + " " + 
                                                toShort(parts[3]));
                                        }
                                    } else { //--AaAa--
                                        checkLocation("Checked", false, "Shapesanity Half " + colorNames[parts[1].color] + " " + 
                                            subShapeNames[parts[1].subShape]);
                                    }
                                } else { //--AaAb
                                    if (parts[3]) { //--AaAb??
                                        if (parts[1].subShape === parts[3].subShape) { //--AaAbA?
                                            if (parts[1].color === parts[3].color) { //--AaAbAa
                                                checkLocation("Checked", false, "Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                                    toShort(parts[2]));
                                            } else if (parts[2].color === parts[3].color) { //--AaAbAb
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                                    toShort(parts[1]));
                                            } else { //--AaAbAc
                                                checkLocation("Checked", false, "Shapesanity " + orderedOnlyDifferent(
                                                    enumColorToShortcode[parts[1].color],
                                                    enumColorToShortcode[parts[2].color],
                                                    enumColorToShortcode[parts[3].color]
                                                ) + " " + subShapeNames[parts[1].subShape]);
                                            }
                                        } else { //--AaAbB?
                                            checkLocation("Checked", false, "Shapesanity Singles " + 
                                                ordered(parts[1], parts[2], parts[3]));
                                        }
                                    } else { //--AaAb--
                                        checkLocation("Checked", false, "Shapesanity Adjacent Singles " + ordered(parts[1], parts[2]));
                                    }
                                }
                            } else { //--AaB?
                                if (parts[3]) { //--AaB???
                                    if (parts[1].color === parts[2].color) { //--AaBa??
                                        if (parts[1].color === parts[3].color) { //--AaBa?a
                                            if (parts[1].subShape === parts[3].subShape) { //--AaBaAa
                                                checkLocation("Checked", false, "Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                                    toShort(parts[2]));
                                            } else if (parts[2].subShape === parts[3].subShape) { //--AaBaBa
                                                checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                                    toShort(parts[1]));
                                            } else { //--AaBaCa
                                                checkLocation("Checked", false, "Shapesanity " + colorNames[parts[1].color] + " " + 
                                                    orderedOnlyDifferent(enumSubShapeToShortcode[parts[1].subShape],
                                                        enumSubShapeToShortcode[parts[2].subShape],
                                                        enumSubShapeToShortcode[parts[3].subShape]));
                                            }
                                        } else { //--AaBa?b
                                            checkLocation("Checked", false, "Shapesanity Singles " + 
                                                ordered(parts[1], parts[2], parts[3]));
                                        }
                                    } else { //--AaBb??
                                        if (isSame(parts[1], parts[3])) { //--AaBbAa
                                            checkLocation("Checked", false, "Shapesanity Cornered 2-1 " + toShort(parts[1]) + " " + 
                                                toShort(parts[2]));
                                        } else if (isSame(parts[2], parts[3])) { //--AaBbBb
                                            checkLocation("Checked", false, "Shapesanity Adjacent 2-1 " + toShort(parts[2]) + " " + 
                                                toShort(parts[1]));
                                        } else { //--AaBb!(Aa|Bb)
                                            checkLocation("Checked", false, "Shapesanity Singles " + 
                                                ordered(parts[1], parts[2], parts[3]));
                                        }
                                    }
                                } else { //--AaB?--
                                    checkLocation("Checked", false, "Shapesanity Adjacent Singles " + ordered(parts[1], parts[2]));
                                }
                            }
                        } else { //--Aa--
                            if (parts[3]) { //--Aa--??
                                if (isSame(parts[1], parts[3])) { //--Aa--Aa
                                    checkLocation("Checked", false, "Shapesanity Cornered " + colorNames[parts[1].color] + " " + 
                                        subShapeNames[parts[1].subShape]);
                                } else { //--Aa--!(Aa)
                                    checkLocation("Checked", false, "Shapesanity Cornered Singles " + ordered(parts[1], parts[3]));
                                }
                            } else { //--Aa----
                                checkLocation("Checked", false, "Shapesanity " + colorNames[parts[1].color] + " " + 
                                    subShapeNames[parts[1].subShape] + " Piece");
                            }
                        }
                    } else { //----
                        if (parts[2]) { //----Aa
                            if (parts[3]) { //----Aa??
                                if (isSame(parts[2], parts[3])) { //----AaAa
                                    checkLocation("Checked", false, "Shapesanity Half " + colorNames[parts[2].color] + " " + 
                                        subShapeNames[parts[2].subShape]);
                                } else { //----Aa!(Aa)
                                    checkLocation("Checked", false, "Shapesanity Adjacent Singles " + ordered(parts[2], parts[3]));
                                }
                            } else { //----Aa--
                                checkLocation("Checked", false, "Shapesanity " + colorNames[parts[2].color] + " " + 
                                    subShapeNames[parts[2].subShape] + " Piece");
                            }
                        } else { //------ => ------Aa
                            checkLocation("Checked", false, "Shapesanity " + colorNames[parts[3].color] + " " + 
                                subShapeNames[parts[3].subShape] + " Piece");
                        }
                    }
                }
            }
            connection.shapesanityCache[shape.getHash()] = true;
        }
    });
}
