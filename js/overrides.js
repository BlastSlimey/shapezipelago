import { Mod } from "shapez/mods/mod";
import { client, connected, customRewards, leveldefs, roman, setLevelDefs, setUpgredeDefs, trapLocked, trapMalfunction, trapThrottled, upgradeDefs, upgradeIdNames } from "./global_data";
import { RandomNumberGenerator } from "shapez/core/rng";
import { categoryRandomUpgradeShapes, categoryUpgradeShapes, hardcoreUpgradeShapes, linearUpgradeShapes, randomizedHardcoreShapes, randomizedQuickShapes, randomizedRandomStepsShapes, randomizedStretchedShapes, randomizedVanillaStepsShapes, vanillaLikeUpgradeShapes, vanillaShapes, vanillaUpgradeShapes } from "./requirement_definitions";
import { MOD_SIGNALS } from "shapez/mods/mod_signals";
import { checkLocation, getShapesanityAnalyser, processItemsPacket, setRootAndModImpl } from "./server_communication";
import { enumAnalyticsDataSource } from "shapez/game/production_analytics";
import { defaultBuildingVariant } from "shapez/game/meta_building";
import { enumPainterVariants } from "shapez/game/buildings/painter";
import { CLIENT_PACKET_TYPE, SERVER_PACKET_TYPE } from "archipelago.js";
import { ShapeDefinition } from "shapez/game/shape_definition";
import { enumItemProcessorTypes } from "shapez/game/components/item_processor";
import { ACHIEVEMENTS } from "shapez/platform/achievement_provider";
import { GameRoot } from "shapez/game/root";

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
            if (goal === "vanilla" || goal === "mam") {
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
            const upgradeNames = {belt: "Belt", miner: "Miner", processors: "Processors", painting: "Painting"};
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
            if (connected && client.data.slotData["goal"].valueOf() === "efficiency_iii" && root.productionAnalytics.getCurrentShapeRateRaw(
                enumAnalyticsDataSource.delivered, root.shapeDefinitionMgr.getShapeFromShortKey("CbCbCbRb:CwCwCwCw")
                ) / 10 >= 500) {
                checkLocation("Goal");
            }
        });
        root.signals.upgradePurchased.add(function (upgrade) {
            if (connected && client.data.slotData["goal"].valueOf() === "even_fasterer") {
                var finaltier = client.data.slotData["finaltier"].valueOf();
                if (root.hubGoals.getUpgradeLevel("belt") >= finaltier 
                && root.hubGoals.getUpgradeLevel("miner") >= finaltier 
                && root.hubGoals.getUpgradeLevel("processors") >= finaltier 
                && root.hubGoals.getUpgradeLevel("painting") >= finaltier) {
                    checkLocation("Goal");
                }
            }
        });
        setRootAndModImpl(root, modImpl);
        if (!client.data.slotData["lock_belt_and_extractor"].valueOf()) {
            customRewards.reward_belt = 1;
            customRewards.reward_extractor = 1;
        }
        client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, function (packet) {
            processItemsPacket(packet);
        });
        client.send({cmd: CLIENT_PACKET_TYPE.SYNC});
        resyncLocationChecks(root);
    });
}

/**
 * 
 * @param {Mod} modImpl 
 */
export function overrideBuildings(modImpl) {
    // getIsUnlocked
    modImpl.modInterface.replaceMethod(shapez.MetaBeltBuilding, "getIsUnlocked", function ($original, [root]) {
        return (connected ? customRewards.reward_belt != 0 : $original(root)) && !trapLocked.belt;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaBalancerBuilding, "getIsUnlocked", function ($original, [root]) {
        return $original(root) && !trapLocked.balancer;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaUndergroundBeltBuilding, "getIsUnlocked", function ($original, [root]) {
        return $original(root) && !trapLocked.tunnel;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaMinerBuilding, "getIsUnlocked", function ($original, [root]) {
        return (connected ? customRewards.reward_extractor != 0 : $original(root)) && !trapLocked.extractor;
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
    // switching layers
    modImpl.modInterface.replaceMethod(shapez.HUDWiresOverlay, "switchLayers", function ($original, []) {
        if (!connected) {
            $original();
        }
        if (!this.root.gameMode.getSupportsWires()) {
            return;
        }
        if (this.root.currentLayer === "regular") {
            if (customRewards.reward_wires != 0) {
                this.root.currentLayer = "wires";
            }
        } else {
            this.root.currentLayer = "regular";
        }
        this.root.signals.editModeChanged.dispatch(this.root.currentLayer);
    });
}

function calcLevelDefinitions() {
    var multiplier = Number(client.data.slotData["required_shapes_multiplier"].valueOf());
    var isRandomized = client.data.slotData["randomize_level_requirements"].valueOf();
    if (isRandomized) {
        var seed = client.data.slotData["seed"].valueOf();
        const randomizer = new RandomNumberGenerator(Number(seed));
        var maxlevel = 25;
        if (client.data.slotData["goal"].valueOf() === "mam") {
            maxlevel = Number(client.data.slotData["maxlevel"].valueOf());
        }
        var logic = client.data.slotData["randomize_level_logic"].valueOf().toString();
        var throughputratio = Number(client.data.slotData["throughput_levels_ratio"].valueOf());
        var building1 = client.data.slotData["Level building 1"].valueOf();
        var building2 = client.data.slotData["Level building 2"].valueOf();
        var building3 = client.data.slotData["Level building 3"].valueOf();
        var building4 = client.data.slotData["Level building 4"].valueOf();
        var building5 = client.data.slotData["Level building 5"].valueOf();
        if (logic.startsWith("vanilla")) {
            return randomizedVanillaStepsShapes(randomizer, maxlevel, throughputratio, multiplier, 
                building1, building2, building3, building4, building5);
        } else if (logic.startsWith("stretched")) {
            return randomizedStretchedShapes(randomizer, maxlevel, throughputratio, multiplier, 
                building1, building2, building3, building4, building5);
        } else if (logic.startsWith("quick")) {
            return randomizedQuickShapes(randomizer, maxlevel, throughputratio, multiplier, 
                building1, building2, building3, building4, building5);
        } else if (logic.startsWith("random")) {
            var phase0 = Number(client.data.slotData["Phase 0 length"].valueOf());
            var phase1 = Number(client.data.slotData["Phase 1 length"].valueOf());
            var phase2 = Number(client.data.slotData["Phase 2 length"].valueOf());
            var phase3 = Number(client.data.slotData["Phase 3 length"].valueOf());
            var phase4 = Number(client.data.slotData["Phase 4 length"].valueOf());
            return randomizedRandomStepsShapes(randomizer, maxlevel, throughputratio, multiplier, 
                building1, building2, building3, building4, building5,
                phase0, phase1, phase2, phase3, phase4);
        } else {
            return randomizedHardcoreShapes(randomizer, maxlevel, throughputratio);
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
        if (client.data.slotData["goal"].valueOf() === "even_fasterer") {
            finaltier = Number(client.data.slotData["finaltier"].valueOf());
        }
        var samelate = client.data.slotData["same_late_upgrade_requirements"].valueOf();
        var logic = client.data.slotData["randomize_upgrade_logic"].valueOf().toString();
        var building1 = client.data.slotData["Upgrade building 1"].valueOf();
        var building2 = client.data.slotData["Upgrade building 2"].valueOf();
        var building3 = client.data.slotData["Upgrade building 3"].valueOf();
        var building4 = client.data.slotData["Upgrade building 4"].valueOf();
        var building5 = client.data.slotData["Upgrade building 5"].valueOf();
        if (logic === "vanilla_like") {
            return vanillaLikeUpgradeShapes(multiplier, randomizer, finaltier, samelate, 
                building1, building2, building3, building4, building5);
        } else if (logic === "linear") {
            return linearUpgradeShapes(multiplier, randomizer, finaltier, samelate, 
                building1, building2, building3, building4, building5);
        } else if (logic === "category") {
            return categoryUpgradeShapes(multiplier, randomizer, finaltier, samelate);
        } else if (logic === "category_random") {
            var amountBelt = Number(client.data.slotData["belt category buildings amount"].valueOf());
            var amountMiner = Number(client.data.slotData["miner category buildings amount"].valueOf());
            var amountProcessors = Number(client.data.slotData["processors category buildings amount"].valueOf());
            var amountPainting = Number(client.data.slotData["painting category buildings amount"].valueOf());
            return categoryRandomUpgradeShapes(multiplier, randomizer, finaltier, samelate, 
                building1, building2, building3, building4, building5, 
                amountBelt, amountMiner, amountProcessors, amountPainting);
        } else {
            return hardcoreUpgradeShapes(multiplier, randomizer, finaltier, samelate);
        }
    } else {
        return vanillaUpgradeShapes(multiplier, finaltier);
    }
}

/**
 * 
 * @param {GameRoot} root 
 */
function resyncLocationChecks(root) {
    // resync levels
    for (var i = 1; i < root.hubGoals.level; i++) { // current level is what is to be completed
        checkLocation(`Level ${i}`, null, "Resynced");
    }
    if (root.hubGoals.level > 20) {
        checkLocation("Level 1 Additional", "Level 20 Additional", "Resynced");
    } else if (root.hubGoals.level > 1) {
        checkLocation("Level 1 Additional", null, "Resynced");
    }
    // resync upgrades
    for (var upgradeId of ["belt", "miner", "processors", "painting"]) {
        const currentLevel = root.hubGoals.getUpgradeLevel(upgradeId);
        for (var i = 1; i <= currentLevel; i++) {
            checkLocation(upgradeIdNames[upgradeId] + " Upgrade Tier " + roman(i+1), null, "Resynced");
        }
    }
    // resync shapesanity
    for (var [hash, amount] of Object.entries(root.hubGoals.storedShapes)) {
        if ((amount || 0) > 0) {
            getShapesanityAnalyser(root, false)(ShapeDefinition.fromShortKey(hash));
        }
    }
}

