import { Mod } from "shapez/mods/mod";
import { client, connected, customRewards, leveldefs, roman, setLevelDefs, setUpgredeDefs, trapLocked, trapMalfunction, trapThrottled, upgradeDefs } from "./global_data";
import { RandomNumberGenerator } from "shapez/core/rng";
import { hardcoreUpgradeShapes, linearUpgradeShapes, randomizedHardcoreShapes, randomizedStretchedShapes, randomizedVanillaStepsShapes, vanillaLikeUpgradeShapes, vanillaShapes, vanillaUpgradeShapes } from "./requirement_definitions";
import { MOD_SIGNALS } from "shapez/mods/mod_signals";
import { checkLocation, setRootAndModImpl } from "./server_communication";
import { enumAnalyticsDataSource } from "shapez/game/production_analytics";
import { defaultBuildingVariant } from "shapez/game/meta_building";
import { enumPainterVariants } from "shapez/game/buildings/painter";
import { CLIENT_PACKET_TYPE } from "archipelago.js";
import { ShapeDefinition } from "shapez/game/shape_definition";
import { getShapesanityAnalyser } from "./shapesanity";
import { enumItemProcessorTypes } from "shapez/game/components/item_processor";
import { MOD_ITEM_PROCESSOR_SPEEDS } from "shapez/game/hub_goals";
import { ACHIEVEMENTS } from "shapez/platform/achievement_provider";

/**
 * 
 * @param {Mod} modImlp 
 */
export function overrideGameMode(modImlp) {
    modImlp.modInterface.replaceMethod(shapez.RegularGameMode, "getUpgrades", function ($original, []) {
        if (connected) {
            if (upgradeDefs) {
                return upgradeDefs;
            }
            setUpgredeDefs(calcUpgradeDefinitions());
            MOD_SIGNALS.modifyUpgrades.dispatch(upgradeDefs);
            return upgradeDefs;
        } else {
            return $original();
        }
    });
    modImlp.modInterface.replaceMethod(shapez.RegularGameMode, "getLevelDefinitions", function ($original, []) {
        if (connected) {
            if (leveldefs) {
                return leveldefs;
            }
            setLevelDefs(calcLevelDefinitions());
            MOD_SIGNALS.modifyLevelDefinitions.dispatch(leveldefs);
            return leveldefs;
        } else {
            return $original();
        }
    });
}

/**
 * @param {Mod} modImpl
 */
export function overrideLocationsListenToItems(modImpl) {
    modImpl.modInterface.replaceMethod(shapez.HubGoals, "onGoalCompleted", function($original, []) {
        if (connected) {
            var goal = client.data.slotData["goal"].valueOf();
            this.root.app.gameAnalytics.handleLevelCompleted(this.level);
            if (this.level == 1 || this.level == 20) {
                checkLocation("Level " + this.level, "Level " + this.level + " Additional");
            } else {
                checkLocation("Level " + this.level);
            }
            if (goal == 0 || goal == 1) {
                if (client.data.slotData["maxlevel"].valueOf() == this.level - 1) {
                    checkLocation("Goal");
                }
            }
            ++this.level;
            this.computeNextGoal();
            this.root.signals.storyGoalCompleted.dispatch(this.level - 1, "no_reward");
        } else {
            $original();
        }
    });
    modImpl.modInterface.replaceMethod(shapez.HubGoals, "tryUnlockUpgrade", function ($original, [upgradeId]) {
        if (connected) {
            if (!this.canUnlockUpgrade(upgradeId)) {
                return false;
            }
            const upgradeTiers = this.root.gameMode.getUpgrades()[upgradeId];
            const currentLevel = this.getUpgradeLevel(upgradeId);
            const tierData = upgradeTiers[currentLevel];
            if (!tierData) {
                return false;
            }
            for (let i = 0; i < tierData.required.length; ++i) {
                const requirement = tierData.required[i];
                this.storedShapes[requirement.shape] -= requirement.amount;
            }
            this.upgradeLevels[upgradeId] = (this.upgradeLevels[upgradeId] || 0) + 1;
            const upgradeNames = {belt: "Routing", miner: "Extracting", processors: "Shape Processing", painting: "Color Processing"};
            checkLocation(upgradeNames[upgradeId] + " Upgrade Tier " + roman(currentLevel+2));
            this.root.signals.upgradePurchased.dispatch(upgradeId);
            this.root.app.gameAnalytics.handleUpgradeUnlocked(upgradeId, currentLevel);
        } else {
            $original(upgradeId);
        }
    });
    modImpl.signals.gameStarted.add(function (root) {
        root.signals.shapeDelivered.add(getShapesanityAnalyser(root, true));
        root.signals.shapeDelivered.add(function (shape) {
            if (connected && client.data.slotData["goal"].valueOf() == 3 && root.productionAnalytics.getCurrentShapeRateRaw(
                enumAnalyticsDataSource.delivered, root.shapeDefinitionMgr.getShapeFromShortKey("CbCbCbRb:CwCwCwCw")
                ) / 10 >= 500) {
                checkLocation("Goal");
            }
        });
        root.signals.upgradePurchased.add(function (upgrade) {
            if (connected && client.data.slotData["goal"].valueOf() == 2) {
                var finaltier = client.data.slotData["finaltier"].valueOf();
                if (root.hubGoals.getUpgradeLevel("belt") == finaltier 
                && root.hubGoals.getUpgradeLevel("miner") == finaltier 
                && root.hubGoals.getUpgradeLevel("processors") == finaltier 
                && root.hubGoals.getUpgradeLevel("painting") == finaltier) {
                    checkLocation("Goal");
                }
            }
        });
        setRootAndModImpl(root, modImpl);
        client.send({cmd: CLIENT_PACKET_TYPE.SYNC});
    });
}

/**
 * 
 * @param {Mod} modImpl 
 */
export function overrideBuildings(modImpl) {
    // getIsUnlocked
    modImpl.modInterface.replaceMethod(shapez.MetaBeltBuilding, "getIsUnlocked", function ($original, [root]) {
        return $original(root) && !trapLocked.belt;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaBalancerBuilding, "getIsUnlocked", function ($original, [root]) {
        return $original(root) && !trapLocked.balancer;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaUndergroundBeltBuilding, "getIsUnlocked", function ($original, [root]) {
        return $original(root) && !trapLocked.tunnel;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaMinerBuilding, "getIsUnlocked", function ($original, [root]) {
        return $original(root) && !trapLocked.extractor;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaCutterBuilding, "getIsUnlocked", function ($original, [root]) {
        return (connected ? customRewards.reward_cutter != 0 : $original(root)) && !trapLocked.cutter;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaRotaterBuilding, "getIsUnlocked", function ($original, [root]) {
        return $original(root) && !trapLocked.rotator;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaStackerBuilding, "getIsUnlocked", function ($original, [root]) {
        return $original(root) && !trapLocked.stacker;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaPainterBuilding, "getIsUnlocked", function ($original, [root]) {
        return $original(root) && !trapLocked.painter;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaMixerBuilding, "getIsUnlocked", function ($original, [root]) {
        return $original(root) && !trapLocked.mixer;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaTrashBuilding, "getIsUnlocked", function ($original, [root]) {
        return (connected ? customRewards.reward_trash != 0 : $original(root)) && !trapLocked.trash;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaWireBuilding, "getIsUnlocked", function ($original, [root]) {
        if (connected) return customRewards.reward_wires != 0;
        else return $original(root);
    });
    // base speeds
    modImpl.modInterface.replaceMethod(shapez.HubGoals, "getBeltBaseSpeed", function ($original, []) {
        return $original() * (trapThrottled.belt ? 0.5 : 1);
    });
    modImpl.modInterface.replaceMethod(shapez.HubGoals, "getUndergroundBeltBaseSpeed", function ($original, []) {
        return $original() * (trapThrottled.tunnel ? 0.5 : 1);
    });
    modImpl.modInterface.replaceMethod(shapez.HubGoals, "getMinerBaseSpeed", function ($original, []) {
        return $original() * (trapThrottled.extractor ? 0.5 : 1);
    });
    modImpl.modInterface.replaceMethod(shapez.HubGoals, "getProcessorBaseSpeed", function ($original, [processorType]) {
        const originalSpeed = $original(processorType);
        switch (processorType) {
            case enumItemProcessorTypes.balancer:
                return originalSpeed * (trapThrottled.balancer ? 0.5 : 1);
            case enumItemProcessorTypes.mixer:
                return originalSpeed * (trapThrottled.mixer ? 0.5 : 1);
            case enumItemProcessorTypes.painter:
            case enumItemProcessorTypes.painterDouble:
            case enumItemProcessorTypes.painterQuad:
                return originalSpeed * (trapThrottled.painter ? 0.5 : 1);
            case enumItemProcessorTypes.cutter:
            case enumItemProcessorTypes.cutterQuad:
                return originalSpeed * (trapThrottled.cutter ? 0.5 : 1);
            case enumItemProcessorTypes.rotater:
            case enumItemProcessorTypes.rotaterCCW:
            case enumItemProcessorTypes.rotater180:
                return originalSpeed * (trapThrottled.rotator ? 0.5 : 1);
            case enumItemProcessorTypes.stacker:
                return originalSpeed * (trapThrottled.stacker ? 0.5 : 1);
            default:
                return originalSpeed;
        }
    });
    // getAvailableVariants
    modImpl.modInterface.replaceMethod(shapez.MetaPainterBuilding, "getAvailableVariants", function ($original, [root]) {
        if (connected) {
            let variants = [defaultBuildingVariant, enumPainterVariants.mirrored];
            if (root.hubGoals.isRewardUnlocked("reward_painter_double")) {
                variants.push(enumPainterVariants.double);
            }
            if (
                customRewards.reward_painter_quad != 0 &&
                root.gameMode.getSupportsWires()
            ) {
                variants.push(enumPainterVariants.quad);
            }
            return variants;
        } else {
            return $original(root);
        }
    });
    // shapeActions
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionCutHalf", function ($original, [definition]) {
        if (!trapMalfunction.cutter) {
            return $original(definition);
        }
        const key = "cut-mal/" + definition.getHash();
        if (this.operationCache[key]) {
            return /** @type {[ShapeDefinition, ShapeDefinition]} */ (this.operationCache[key]);
        }
        const rightSide = definition.cloneFilteredByQuadrants([3, 0]);
        const leftSide = definition.cloneFilteredByQuadrants([1, 2]);
        this.root.signals.achievementCheck.dispatch(ACHIEVEMENTS.cutShape, null);
        return /** @type {[ShapeDefinition, ShapeDefinition]} */ (this.operationCache[key] = [
            this.registerOrReturnHandle(rightSide),
            this.registerOrReturnHandle(leftSide),
        ]);
    });
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionCutQuad", function ($original, [definition]) {
        if (!trapMalfunction.cutter_quad) {
            return $original(definition);
        }
        const key = "cut-quad-mal/" + definition.getHash();
        if (this.operationCache[key]) {
            return /** @type {[ShapeDefinition, ShapeDefinition, ShapeDefinition, ShapeDefinition]} */ (this
                .operationCache[key]);
        }
        const rotated = definition.cloneRotateCW();
        return /** @type {[ShapeDefinition, ShapeDefinition, ShapeDefinition, ShapeDefinition]} */ (this.operationCache[
            key
        ] = [
            this.registerOrReturnHandle(rotated.cloneFilteredByQuadrants([2])),
            this.registerOrReturnHandle(rotated.cloneFilteredByQuadrants([0])),
            this.registerOrReturnHandle(rotated.cloneFilteredByQuadrants([1])),
            this.registerOrReturnHandle(rotated.cloneFilteredByQuadrants([3])),
        ]);
    });
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionRotateCW", function ($original, [definition]) {
        if (!trapMalfunction.rotator) {
            return $original(definition);
        }
        const key = "rotate-ccw/" + definition.getHash();
        if (this.operationCache[key]) {
            return /** @type {ShapeDefinition} */ (this.operationCache[key]);
        }
        const rotated = definition.cloneRotateCCW();
        this.root.signals.achievementCheck.dispatch(ACHIEVEMENTS.rotateShape, null);
        return /** @type {ShapeDefinition} */ (this.operationCache[key] = this.registerOrReturnHandle(
            rotated
        ));
    });
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionRotateCCW", function ($original, [definition]) {
        if (!trapMalfunction.rotator_ccw) {
            return $original(definition);
        }
        const key = "rotate-fl/" + definition.getHash();
        if (this.operationCache[key]) {
            return /** @type {ShapeDefinition} */ (this.operationCache[key]);
        }
        const rotated = definition.cloneRotate180();
        return /** @type {ShapeDefinition} */ (this.operationCache[key] = this.registerOrReturnHandle(
            rotated
        ));
    });
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionRotate180", function ($original, [definition]) {
        if (!trapMalfunction.rotator_180) {
            return $original(definition);
        }
        const key = "rotate-cw/" + definition.getHash();
        if (this.operationCache[key]) {
            return /** @type {ShapeDefinition} */ (this.operationCache[key]);
        }
        const rotated = definition.cloneRotateCW();
        return /** @type {ShapeDefinition} */ (this.operationCache[key] = this.registerOrReturnHandle(
            rotated
        ));
    });
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionStack", function ($original, [lowerDefinition, upperDefinition]) {
        if (!trapMalfunction.stacker) {
            return $original(lowerDefinition, upperDefinition);
        } else {
            return $original(upperDefinition, lowerDefinition);
        }
    });
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionPaintWith", function ($original, [definition, color]) {
        if (!trapMalfunction.painter) {
            return $original(definition, color);
        }
        const key = "paint-mal/" + definition.getHash() + "/" + color;
        if (this.operationCache[key]) {
            return /** @type {ShapeDefinition} */ (this.operationCache[key]);
        }
        this.root.signals.achievementCheck.dispatch(ACHIEVEMENTS.paintShape, null);
        const randomizedColors = [
            Math.random() < 0.75 ? color : null,
            Math.random() < 0.75 ? color : null,
            Math.random() < 0.75 ? color : null,
            Math.random() < 0.75 ? color : null
        ];
        const colorized = definition.cloneAndPaintWith4Colors(randomizedColors);
        return /** @type {ShapeDefinition} */ (this.operationCache[key] = this.registerOrReturnHandle(
            colorized
        ));
    });
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionPaintWith4Colors", function ($original, [definition, colors]) {
        if (!trapMalfunction.painter_quad) {
            return $original(definition, colors);
        }
        const randomizedColors = [
            colors[Math.floor(Math.random()*4)],
            colors[Math.floor(Math.random()*4)],
            colors[Math.floor(Math.random()*4)],
            colors[Math.floor(Math.random()*4)]
        ];
        const key = "paint4/" + definition.getHash() + "/" + randomizedColors.join(",");
        if (this.operationCache[key]) {
            return /** @type {ShapeDefinition} */ (this.operationCache[key]);
        }
        const colorized = definition.cloneAndPaintWith4Colors(randomizedColors);
        return /** @type {ShapeDefinition} */ (this.operationCache[key] = this.registerOrReturnHandle(
            colorized
        ));
    });
}

function calcLevelDefinitions() {
    var multiplier = Number(client.data.slotData["required_shapes_multiplier"].valueOf());
    var isRandomized = client.data.slotData["randomize_level_requirements"].valueOf();
    if (isRandomized) {
        var seed = client.data.slotData["seed"].valueOf();
        const randomizer = new RandomNumberGenerator(Number(seed));
        var maxlevel = 25;
        if (client.data.slotData["goal"].valueOf() == 1) {
            maxlevel = Number(client.data.slotData["maxlevel"].valueOf());
        }
        var logic = Number(client.data.slotData["randomize_level_logic"].valueOf());
        var throughputratio = Number(client.data.slotData["throughput_levels_ratio"].valueOf());
        var building1 = client.data.slotData["Level building 1"].valueOf(); //immer
        var building2 = client.data.slotData["Level building 2"].valueOf(); //immer
        var building3 = client.data.slotData["Level building 3"].valueOf(); //immer
        var building4 = client.data.slotData["Level building 4"].valueOf(); //immer
        var building5 = client.data.slotData["Level building 5"].valueOf(); //immer
        if (logic < 2) {
            return randomizedVanillaStepsShapes(randomizer, maxlevel, throughputratio, multiplier, building1, building2, building3, building4, building5);
        } else if (logic == 4) {
            return randomizedHardcoreShapes(randomizer, maxlevel, throughputratio);
        } else {
            return randomizedStretchedShapes(randomizer, maxlevel, throughputratio, multiplier, building1, building2, building3, building4, building5);
        }
    } else {
        return vanillaShapes(multiplier);
    }
}

function calcUpgradeDefinitions() {
    var multiplier = client.data.slotData["required_shapes_multiplier"].valueOf();
    console.log("[Archipelago] Loaded multiplier from slotData: " + multiplier);
    var isRandomized = client.data.slotData["randomize_upgrade_requirements"].valueOf();
    if (isRandomized) {
        var seed = client.data.slotData["seed"].valueOf();
        const randomizer = new RandomNumberGenerator(Number(seed));
        var finaltier = 8;
        if (client.data.slotData["goal"].valueOf() == 2) {
            finaltier = Number(client.data.slotData["finaltier"].valueOf());
        }
        var samelate = client.data.slotData["same_late_upgrade_requirements"].valueOf();
        var logic = Number(client.data.slotData["randomize_upgrade_logic"].valueOf());
        var building1 = client.data.slotData["Upgrade building 1"].valueOf(); //immer
        var building2 = client.data.slotData["Upgrade building 2"].valueOf(); //immer
        var building3 = client.data.slotData["Upgrade building 3"].valueOf(); //immer
        var building4 = client.data.slotData["Upgrade building 4"].valueOf(); //immer
        var building5 = client.data.slotData["Upgrade building 5"].valueOf(); //immer
        if (logic == 0) {
            return vanillaLikeUpgradeShapes(multiplier, randomizer, finaltier, samelate, building1, building2, building3, building4, building5);
        } else if (logic == 1) {
            return linearUpgradeShapes(multiplier, randomizer, finaltier, samelate, building1, building2, building3, building4, building5);
        } else {
            return hardcoreUpgradeShapes(multiplier, randomizer, finaltier, samelate);
        }
    } else {
        return vanillaUpgradeShapes(multiplier, finaltier);
    }
}
