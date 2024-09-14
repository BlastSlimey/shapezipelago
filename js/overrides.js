import { Mod } from "shapez/mods/mod";
import { aplog, client, connected, customRewards, leveldefs, roman, setLevelDefs, setUpgredeDefs, startEfficiency3Interval, trapLocked, trapMalfunction, trapThrottled, upgradeDefs, upgradeIdNames } from "./global_data";
import { RandomNumberGenerator } from "shapez/core/rng";
import { categoryRandomUpgradeShapes, categoryUpgradeShapes, hardcoreUpgradeShapes, linearUpgradeShapes, randomizedHardcoreShapes, randomizedQuickShapes, randomizedRandomStepsShapes, randomizedStretchedShapes, randomizedVanillaStepsShapes, vanillaLikeUpgradeShapes, vanillaShapes, vanillaUpgradeShapes } from "./requirement_definitions";
import { MOD_SIGNALS } from "shapez/mods/mod_signals";
import { checkLocation, getShapesanityAnalyser, processItemsPacket, setRootAndModImpl } from "./server_communication";
import { enumAnalyticsDataSource } from "shapez/game/production_analytics";
import { defaultBuildingVariant } from "shapez/game/meta_building";
import { enumPainterVariants } from "shapez/game/buildings/painter";
import { CLIENT_PACKET_TYPE, CLIENT_STATUS, SERVER_PACKET_TYPE } from "archipelago.js";
import { ShapeDefinition } from "shapez/game/shape_definition";
import { enumItemProcessorTypes } from "shapez/game/components/item_processor";
import { ACHIEVEMENTS } from "shapez/platform/achievement_provider";
import { GameRoot } from "shapez/game/root";
import { AchievementLocationProxy } from "./achievements";
import { randomInt } from "shapez/core/utils";
import { gMetaBuildingRegistry } from "shapez/core/global_registries";
import { MetaHubBuilding } from "shapez/game/buildings/hub";
import { Vector } from "shapez/core/vector";
import { globalConfig } from "shapez/core/config";

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
            if (this.level == 1) {
                checkLocation("Checked", false, "Level 1", "Level 1 Additional");
            } else if (this.level == 20) {
                checkLocation("Checked", false, "Level 20", "Level 20 Additional", "Level 20 Additional 2");
            } else {
                checkLocation("Checked", false, "Level " + this.level);
            }
            if (goal === "vanilla" || goal === "mam" || goal === 0 || goal === 1) {
                if (client.data.slotData["maxlevel"].valueOf() == this.level - 1) {
                    checkLocation("Checked", true);
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
            // @ts-ignore
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
            // @ts-ignore
            this.upgradeLevels[upgradeId] = (this.upgradeLevels[upgradeId] || 0) + 1;
            const upgradeNames = {belt: "Belt", miner: "Miner", processors: "Processors", painting: "Painting"};
            checkLocation("Checked", false, upgradeNames[upgradeId] + " Upgrade Tier " + roman(currentLevel+2));
            this.root.signals.upgradePurchased.dispatch(upgradeId);
            this.root.app.gameAnalytics.handleUpgradeUnlocked(upgradeId, currentLevel);
        } else {
            $original(upgradeId);
        }
    });
    modImpl.modInterface.replaceMethod(shapez.GameCore, "initNewGame", function ($original, []) {
        aplog("Initializing new AP game");
        this.root.gameIsFresh = true;
        if (connected) {
            this.root.map.seed = Number(client.data.slotData["seed"].valueOf());
        } else {
            this.root.map.seed = randomInt(0, 100000);
        }
        if (!this.root.gameMode.hasHub()) {
            return;
        }
        // Place the hub
        const hub = gMetaBuildingRegistry.findByClass(MetaHubBuilding).createEntity({
            root: this.root,
            origin: new Vector(-2, -2),
            rotation: 0,
            originalRotation: 0,
            rotationVariant: 0,
            variant: defaultBuildingVariant,
        });
        this.root.map.placeStaticEntity(hub);
        this.root.entityMgr.registerEntity(hub);
        this.root.camera.center = new Vector(-5, 2).multiplyScalar(globalConfig.tileSize);
    });
    modImpl.signals.gameInitialized.add(function (/** @type {GameRoot} */ root) {
        if (connected) {
            root.achievementProxy = new AchievementLocationProxy(root);
        }
    });
    modImpl.signals.gameStarted.add(function (root) {
        root.signals.shapeDelivered.add(getShapesanityAnalyser());
        root.signals.upgradePurchased.add(function (upgrade) {
            const goal = client.data.slotData["goal"].valueOf();
            if (connected && goal === "even_fasterer" || goal === 2) {
                var finaltier = client.data.slotData["finaltier"].valueOf();
                if (root.hubGoals.getUpgradeLevel("belt") >= finaltier 
                && root.hubGoals.getUpgradeLevel("miner") >= finaltier 
                && root.hubGoals.getUpgradeLevel("processors") >= finaltier 
                && root.hubGoals.getUpgradeLevel("painting") >= finaltier) {
                    checkLocation("Checked", true);
                }
            }
        });
        setRootAndModImpl(root, modImpl);
        if (connected) {
            client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, processItemsPacket);
            const lockBeltExtractor = client.data.slotData["lock_belt_and_extractor"];
            if ((lockBeltExtractor ? !lockBeltExtractor.valueOf() : true)) {
                customRewards.reward_belt = 1;
                customRewards.reward_extractor = 1;
            }
            client.send({cmd: CLIENT_PACKET_TYPE.SYNC});
            resyncLocationChecks(root);
            client.updateStatus(CLIENT_STATUS.PLAYING);
            const goal = client.data.slotData["goal"].valueOf();
            if (goal === "efficiency_iii" || goal === 3) {
                startEfficiency3Interval(() => {
                    if (root.productionAnalytics.getCurrentShapeRateRaw(enumAnalyticsDataSource.delivered, 
                            root.shapeDefinitionMgr.getShapeFromShortKey("CbCbCbRb:CwCwCwCw")) / 10 >= 256) {
                        checkLocation("Checked", true);
                    }
                }, 5000);
            }
        }
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
        // @ts-ignore
        return (connected ? $original(root) || root.hubGoals.isRewardUnlocked("reward_merger")
            // @ts-ignore
            || root.hubGoals.isRewardUnlocked("reward_splitter") : $original(root)) && !trapLocked.balancer;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaUndergroundBeltBuilding, "getIsUnlocked", function ($original, [root]) {
        // @ts-ignore
        return (connected ? $original(root) || root.hubGoals.isRewardUnlocked("reward_underground_belt_tier_2")
            : $original(root)) && !trapLocked.tunnel;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaMinerBuilding, "getIsUnlocked", function ($original, [root]) {
        return (connected ? customRewards.reward_extractor != 0 
            // @ts-ignore
            || root.hubGoals.isRewardUnlocked("reward_miner_chainable") : $original(root)) && !trapLocked.extractor;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaCutterBuilding, "getIsUnlocked", function ($original, [root]) {
        // @ts-ignore
        return (connected ? customRewards.reward_cutter != 0 || root.hubGoals.isRewardUnlocked("reward_cutter_quad") 
            : $original(root)) && !trapLocked.cutter;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaRotaterBuilding, "getIsUnlocked", function ($original, [root]) {
        // @ts-ignore
        return (connected ? $original(root) || root.hubGoals.isRewardUnlocked("reward_rotater_ccw") 
            // @ts-ignore
            || root.hubGoals.isRewardUnlocked("reward_rotater_180") : $original(root)) && !trapLocked.rotator;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaStackerBuilding, "getIsUnlocked", function ($original, [root]) {
        return $original(root) && !trapLocked.stacker;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaPainterBuilding, "getIsUnlocked", function ($original, [root]) {
        // @ts-ignore
        return (connected ? $original(root) || root.hubGoals.isRewardUnlocked("reward_painter_double") 
            || customRewards.reward_painter_quad != 0 : $original(root)) && !trapLocked.painter;
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
    modImpl.modInterface.replaceMethod(shapez.MetaWireTunnelBuilding, "getIsUnlocked", function ($original, [root]) {
        if (connected) return customRewards.reward_wires != 0;
        else return $original(root);
    });
    modImpl.modInterface.replaceMethod(shapez.MetaLeverBuilding, "getIsUnlocked", function ($original, [root]) {
        if (connected) return customRewards.reward_switch != 0;
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
            let variants = [];
            // @ts-ignore
            if (root.hubGoals.isRewardUnlocked("reward_painter")) {
                variants.push(defaultBuildingVariant, enumPainterVariants.mirrored);
            }
            // @ts-ignore
            if (root.hubGoals.isRewardUnlocked("reward_painter_double")) {
                variants.push(enumPainterVariants.double);
            }
            if (
                customRewards.reward_painter_quad != 0 &&
                // @ts-ignore
                root.gameMode.getSupportsWires()
            ) {
                variants.push(enumPainterVariants.quad);
            }
            return variants;
        } else {
            return $original(root);
        }
    });
    modImpl.modInterface.replaceMethod(shapez.MetaBalancerBuilding, "getAvailableVariants", function ($original, [root]) {
        var available = $original(root);
        // @ts-ignore
        if (connected && !root.hubGoals.isRewardUnlocked("reward_balancer")) {
            var defaultindex = available.indexOf("default");
            if (defaultindex > -1) {
                available.splice(defaultindex, 1);
            }
        }
        return available;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaUndergroundBeltBuilding, "getAvailableVariants", function ($original, [root]) {
        var available = $original(root);
        // @ts-ignore
        if (connected && !root.hubGoals.isRewardUnlocked("reward_tunnel")) {
            var defaultindex = available.indexOf("default");
            if (defaultindex > -1) {
                available.splice(defaultindex, 1);
            }
        }
        return available;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaCutterBuilding, "getAvailableVariants", function ($original, [root]) {
        var available = $original(root);
        if (connected && customRewards.reward_cutter == 0) {
            var defaultindex = available.indexOf("default");
            if (defaultindex > -1) {
                available.splice(defaultindex, 1);
            }
        }
        return available;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaRotaterBuilding, "getAvailableVariants", function ($original, [root]) {
        var available = $original(root);
        // @ts-ignore
        if (connected && !root.hubGoals.isRewardUnlocked("reward_rotater")) {
            var defaultindex = available.indexOf("default");
            if (defaultindex > -1) {
                available.splice(defaultindex, 1);
            }
        }
        return available;
    });
    // shapeActions
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionCutHalf", function ($original, [definition]) {
        if (!trapMalfunction.cutter) {
            return $original(definition);
        }
        // @ts-ignore
        const key = "cut-mal/" + definition.getHash();
        if (this.operationCache[key]) {
            return /** @type {[ShapeDefinition, ShapeDefinition]} */ (this.operationCache[key]);
        }
        // @ts-ignore
        const rightSide = definition.cloneFilteredByQuadrants([3, 0]);
        // @ts-ignore
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
        // @ts-ignore
        const key = "cut-quad-mal/" + definition.getHash();
        if (this.operationCache[key]) {
            return /** @type {[ShapeDefinition, ShapeDefinition, ShapeDefinition, ShapeDefinition]} */ (this
                .operationCache[key]);
        }
        // @ts-ignore
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
        // @ts-ignore
        const key = "rotate-ccw/" + definition.getHash();
        if (this.operationCache[key]) {
            return /** @type {ShapeDefinition} */ (this.operationCache[key]);
        }
        // @ts-ignore
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
        // @ts-ignore
        const key = "rotate-fl/" + definition.getHash();
        if (this.operationCache[key]) {
            return /** @type {ShapeDefinition} */ (this.operationCache[key]);
        }
        // @ts-ignore
        const rotated = definition.cloneRotate180();
        return /** @type {ShapeDefinition} */ (this.operationCache[key] = this.registerOrReturnHandle(
            rotated
        ));
    });
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionRotate180", function ($original, [definition]) {
        if (!trapMalfunction.rotator_180) {
            return $original(definition);
        }
        // @ts-ignore
        const key = "rotate-cw/" + definition.getHash();
        if (this.operationCache[key]) {
            return /** @type {ShapeDefinition} */ (this.operationCache[key]);
        }
        // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
        const key = "paint4/" + definition.getHash() + "/" + randomizedColors.join(",");
        if (this.operationCache[key]) {
            return /** @type {ShapeDefinition} */ (this.operationCache[key]);
        }
        // @ts-ignore
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
        const goal = client.data.slotData["goal"].valueOf();
        if (goal !== "vanilla" && goal !== 0) {
            maxlevel = Number(client.data.slotData["maxlevel"].valueOf());
        }
        var logic = client.data.slotData["randomize_level_logic"].valueOf().toString();
        const throughput_slotdata = client.data.slotData["throughput_levels_ratio"];
        var throughputratio = throughput_slotdata ? Number(throughput_slotdata.valueOf()) : -1;
        var building1 = client.data.slotData["Level building 1"].valueOf();
        var building2 = client.data.slotData["Level building 2"].valueOf();
        var building3 = client.data.slotData["Level building 3"].valueOf();
        var building4 = client.data.slotData["Level building 4"].valueOf();
        var building5 = client.data.slotData["Level building 5"].valueOf();
        if (logic.startsWith("vanilla") || logic === "0" || logic === "1") {
            return randomizedVanillaStepsShapes(randomizer, maxlevel, throughputratio, multiplier, 
                building1, building2, building3, building4, building5);
        } else if (logic.startsWith("stretched") || logic === "2" || logic === "3") {
            return randomizedStretchedShapes(randomizer, maxlevel, throughputratio, multiplier, 
                building1, building2, building3, building4, building5);
        } else if (logic.startsWith("quick")) {
            return randomizedQuickShapes(randomizer, maxlevel, throughputratio, multiplier, 
                building1, building2, building3, building4, building5);
        } else if (logic.startsWith("random_steps")) {
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
    var isRandomized = client.data.slotData["randomize_upgrade_requirements"].valueOf();
    if (isRandomized) {
        var seed = client.data.slotData["seed"].valueOf();
        const randomizer = new RandomNumberGenerator(Number(seed));
        var finaltier = 8;
        const goal = client.data.slotData["goal"].valueOf();
        if (goal === "even_fasterer" || goal === 2) {
            finaltier = Number(client.data.slotData["finaltier"].valueOf());
        }
        var samelate = client.data.slotData["same_late_upgrade_requirements"].valueOf();
        var logic = client.data.slotData["randomize_upgrade_logic"].valueOf().toString();
        var building1 = client.data.slotData["Upgrade building 1"].valueOf();
        var building2 = client.data.slotData["Upgrade building 2"].valueOf();
        var building3 = client.data.slotData["Upgrade building 3"].valueOf();
        var building4 = client.data.slotData["Upgrade building 4"].valueOf();
        var building5 = client.data.slotData["Upgrade building 5"].valueOf();
        if (logic === "vanilla_like" || logic === "0") {
            return vanillaLikeUpgradeShapes(multiplier, randomizer, finaltier, samelate, 
                building1, building2, building3, building4, building5);
        } else if (logic === "linear" || logic === "1") {
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
        checkLocation("Resynced", false, `Level ${i}`);
    }
    if (root.hubGoals.level > 20) {
        checkLocation("Resynced", false, "Level 1 Additional", "Level 20 Additional");
    } else if (root.hubGoals.level > 1) {
        checkLocation("Resynced", false, "Level 1 Additional");
    }
    // resync upgrades
    for (var upgradeId of ["belt", "miner", "processors", "painting"]) {
        const currentLevel = root.hubGoals.getUpgradeLevel(upgradeId);
        for (var i = 1; i <= currentLevel; i++) {
            checkLocation("Resynced", false, upgradeIdNames[upgradeId] + " Upgrade Tier " + roman(i+1));
        }
    }
    // resync shapesanity
    for (var [hash, amount] of Object.entries(root.hubGoals.storedShapes)) {
        if ((amount || 0) > 0) {
            getShapesanityAnalyser()(ShapeDefinition.fromShortKey(hash));
        }
    }
    // resync goals
    const goal = client.data.slotData["goal"].valueOf();
    if (goal === "vanilla" || goal === "mam" || goal === 0 || goal === 1) {
        if (client.data.slotData["maxlevel"].valueOf() == root.hubGoals.level - 1) 
            checkLocation("Checked", true);
    } else if (goal === "even_fasterer") {
        const finaltier = Number(client.data.slotData["finaltier"].valueOf());
        if (root.hubGoals.getUpgradeLevel("belt") >= finaltier 
                && root.hubGoals.getUpgradeLevel("miner") >= finaltier 
                && root.hubGoals.getUpgradeLevel("processors") >= finaltier 
                && root.hubGoals.getUpgradeLevel("painting") >= finaltier) {
            checkLocation("Checked", true);
        }
    }
}

