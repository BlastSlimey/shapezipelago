import { apassert, apdebuglog, aptry, connection, currentIngame, customRewards, methodNames, modImpl, roman, upgradeIdNames } from "./global_data";
import { RandomNumberGenerator } from "shapez/core/rng";
import { categoryRandomUpgradeShapes, categoryUpgradeShapes, hardcoreUpgradeShapes, linearUpgradeShapes, randomizedHardcoreDopamineShapes, randomizedQuickShapes, randomizedRandomStepsShapes, randomizedStretchedShapes, randomizedVanillaStepsShapes, vanillaLikeUpgradeShapes, vanillaShapes, vanillaUpgradeShapes } from "./requirement_definitions";
import { checkLocation, shapesanityAnalyzer } from "./server_communication";
import { enumAnalyticsDataSource } from "shapez/game/production_analytics";
import { defaultBuildingVariant, MetaBuilding } from "shapez/game/meta_building";
import { enumPainterVariants } from "shapez/game/buildings/painter";
import { ShapeDefinition } from "shapez/game/shape_definition";
import { enumItemProcessorTypes } from "shapez/game/components/item_processor";
import { ACHIEVEMENTS } from "shapez/platform/achievement_provider";
import { GameRoot } from "shapez/game/root";
import { AchievementLocationProxy } from "./achievements";
import { makeDiv, randomInt, removeAllChildren } from "shapez/core/utils";
import { gMetaBuildingRegistry } from "shapez/core/global_registries";
import { MetaHubBuilding } from "shapez/game/buildings/hub";
import { Vector } from "shapez/core/vector";
import { globalConfig } from "shapez/core/config";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { enumCutterVariants } from "shapez/game/buildings/cutter";
import { enumRotaterVariants } from "shapez/game/buildings/rotater";
import { GAME_LOADING_STATES } from "shapez/states/ingame";
import { getBuildingDataFromCode } from "shapez/game/building_codes";
import { enumMinerVariants, MetaMinerBuilding } from "shapez/game/buildings/miner";
import { HUDBaseToolbar } from "shapez/game/hud/parts/base_toolbar";
import { KEYMAPPINGS } from "shapez/game/key_action_mapper";

export function overrideGameMode() {
    apdebuglog("Calling overrideGameMode");
    modImpl.modInterface.replaceMethod(shapez.RegularGameMode, "getUpgrades", function ($original, []) {
        if (connection) {
            aptry("Upgrade definitions failed", () => {
                if (!currentIngame.upgradeDefs) {
                    apdebuglog("Calculating upgrade definitions");
                    currentIngame.upgradeDefs = calcUpgradeDefinitions();
                    // MOD_SIGNALS.modifyUpgrades.dispatch(currentIngame.upgradeDefs);
                }
            });
            return currentIngame.upgradeDefs;
        } else {
            return $original();
        }
    });
    modImpl.modInterface.replaceMethod(shapez.RegularGameMode, "getLevelDefinitions", function ($original, []) {
        if (connection) {
            aptry("Level definitions failed", () => {
                if (!currentIngame.levelDefs) {
                    apdebuglog("Calculating level definitions");
                    currentIngame.levelDefs = calcLevelDefinitions();
                    // MOD_SIGNALS.modifyLevelDefinitions.dispatch(currentIngame.levelDefs);
                }
            });
            return currentIngame.levelDefs;
        } else {
            return $original();
        }
    });
}

export function overrideLocationsListenToItems() {
    apdebuglog("Calling overrideLocationsListenToItems");
    modImpl.modInterface.replaceMethod(shapez.HubGoals, "onGoalCompleted", function($original, []) {
        if (connection) {
            aptry("Completing level failed", () => {
                this.root.app.gameAnalytics.handleLevelCompleted(this.level);
                if (this.level == 1) {
                    checkLocation("Checked", false, "Level 1", "Level 1 Additional");
                } else if (this.level == 20) {
                    checkLocation("Checked", false, "Level 20", "Level 20 Additional", "Level 20 Additional 2");
                } else {
                    checkLocation("Checked", false, "Level " + this.level);
                }
                if (connection.goal === "vanilla" || connection.goal === "mam") {
                    if (connection.levelsToGenerate <= this.level) {
                        checkLocation("Checked", true);
                    }
                }
                ++this.level;
                this.computeNextGoal();
                this.root.signals.storyGoalCompleted.dispatch(this.level - 1, this.currentGoal.reward);
            });
        } else {
            $original();
        }
    });
    modImpl.modInterface.replaceMethod(shapez.HubGoals, "tryUnlockUpgrade", function ($original, [upgradeId]) {
        if (connection) {
            return aptry("Unlocking upgrade failed", () => {
                const upgradeIdFixed = upgradeId.toString();
                if (!this.canUnlockUpgrade(upgradeId)) {
                    return false;
                }
                const upgradeTiers = this.root.gameMode.getUpgrades()[upgradeIdFixed];
                const currentLevel = this.getUpgradeLevel(upgradeId);
                const tierData = upgradeTiers[currentLevel];
                if (!tierData) {
                    return false;
                }
                for (let i = 0; i < tierData.required.length; ++i) {
                    const requirement = tierData.required[i];
                    this.storedShapes[requirement.shape] -= requirement.amount;
                }
                this.upgradeLevels[upgradeIdFixed] = (this.upgradeLevels[upgradeIdFixed] || 0) + 1;
                checkLocation("Checked", false, upgradeIdNames[upgradeId] + " Upgrade Tier " + roman(currentLevel+2));
                this.root.signals.upgradePurchased.dispatch(upgradeId);
                this.root.app.gameAnalytics.handleUpgradeUnlocked(upgradeId, currentLevel);
                return true
            });
        } else {
            return $original(upgradeId);
        }
    });
    modImpl.modInterface.replaceMethod(shapez.GameCore, "initNewGame", function ($original, []) {
        aptry("Game initialization failed", () => {
            apdebuglog("Initializing new AP game");
            this.root.gameIsFresh = true;
            if (connection) {
                this.root.map.seed = connection.clientSeed;
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
    });
    modImpl.modInterface.replaceMethod(shapez.HUDShop, "initialize", function ($original, []) {
        $original();
        // Register the rerendering of the shop to item receiving signal, so that it immediately updates upon receiving an upgrade item
        currentIngame.itemReceiveSignal.add(this.rerenderFull, this);
    });
    modImpl.signals.gameInitialized.add(function (/** @type {GameRoot} */ root) {
        aptry("AchievementProxy contruction failed", () => {
            root.achievementProxy = new AchievementLocationProxy(root);
        });
    });
    modImpl.signals.gameStarted.add(function (/** @type {GameRoot} */ root) {
        if (connection) {
            apdebuglog("I need to restructure these signals.gameStarted things...");
            root.signals.shapeDelivered.add(shapesanityAnalyzer);
            root.signals.upgradePurchased.add(function (upgrade) {
                aptry("Testing even_fasterer goal failed", () => {
                    if (connection.goal === "even_fasterer") {
                        if (root.hubGoals.getUpgradeLevel("belt") >= connection.tiersToGenerate 
                        && root.hubGoals.getUpgradeLevel("miner") >= connection.tiersToGenerate 
                        && root.hubGoals.getUpgradeLevel("processors") >= connection.tiersToGenerate 
                        && root.hubGoals.getUpgradeLevel("painting") >= connection.tiersToGenerate) {
                            checkLocation("Checked", true);
                        }
                    }
                });
            });
            aptry("Requesting item package failed", () => connection.requestItemPackage());
            aptry("Resyncing locations failed", resyncLocationChecks);
            if (connection.goal === "efficiency_iii") {
                currentIngame.startEfficiency3Interval(() => {
                    aptry("Efficiency III failed", () => {
                        const currentRateRaw = currentIngame.root.productionAnalytics.getCurrentShapeRateRaw(
                            enumAnalyticsDataSource.delivered, 
                            currentIngame.root.shapeDefinitionMgr.getShapeFromShortKey(connection.blueprintShape)
                        );
                        if (currentRateRaw / globalConfig["analyticsSliceDurationSeconds"] >= 256) {
                            checkLocation("Checked", true);
                        }
                    });
                }, 5000);
            }
        }
    });
}

export function overrideBuildings() {
    apdebuglog("Calling overrideBuildings");
    // getIsUnlocked
    modImpl.modInterface.replaceMethod(shapez.MetaBeltBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        return (connection ? currentIngame.root.hubGoals.isRewardUnlocked(customRewards.belt) : $original(root)) && !currentIngame.trapLocked.belt;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaBalancerBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        return (connection ? $original(root) || currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_merger)
            || currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_splitter) : $original(root)) && !currentIngame.trapLocked.balancer;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaUndergroundBeltBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        return (connection ? $original(root) || currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_underground_belt_tier_2)
            : $original(root)) && !currentIngame.trapLocked.tunnel;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaMinerBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        return (connection ? currentIngame.root.hubGoals.isRewardUnlocked(customRewards.extractor)
            || currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_miner_chainable) : $original(root)) && !currentIngame.trapLocked.extractor;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaCutterBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        return (connection ? currentIngame.root.hubGoals.isRewardUnlocked(customRewards.cutter) 
            || currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_cutter_quad) : $original(root)) && !currentIngame.trapLocked.cutter;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaRotaterBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        return (connection ? $original(root) || currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_rotater_ccw) 
            || currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_rotater_180) : $original(root)) && !currentIngame.trapLocked.rotator;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaStackerBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        return $original(root) && !currentIngame.trapLocked.stacker;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaPainterBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        return (connection ? $original(root) || currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_painter_double) 
            || currentIngame.root.hubGoals.isRewardUnlocked(customRewards.painter_quad) : $original(root)) && !currentIngame.trapLocked.painter;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaMixerBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        return $original(root) && !currentIngame.trapLocked.mixer;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaTrashBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        return (connection ? currentIngame.root.hubGoals.isRewardUnlocked(customRewards.trash) : $original(root)) && !currentIngame.trapLocked.trash;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaWireBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        if (connection) return currentIngame.root.hubGoals.isRewardUnlocked(customRewards.wires);
        else return $original(root);
    });
    modImpl.modInterface.replaceMethod(shapez.MetaWireTunnelBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        if (connection) return currentIngame.root.hubGoals.isRewardUnlocked(customRewards.wires);
        else return $original(root);
    });
    modImpl.modInterface.replaceMethod(shapez.MetaLeverBuilding, methodNames.metaBuildings.getIsUnlocked, function ($original, [root]) {
        if (connection) return currentIngame.root.hubGoals.isRewardUnlocked(customRewards.switch);
        else return $original(root);
    });
    // base speeds
    modImpl.modInterface.replaceMethod(shapez.HubGoals, "getBeltBaseSpeed", function ($original, []) {
        return $original() * (currentIngame.trapThrottled.belt ? 0.5 : 1);
    });
    modImpl.modInterface.replaceMethod(shapez.HubGoals, "getUndergroundBeltBaseSpeed", function ($original, []) {
        return $original() * (currentIngame.trapThrottled.tunnel ? 0.5 : 1);
    });
    modImpl.modInterface.replaceMethod(shapez.HubGoals, "getMinerBaseSpeed", function ($original, []) {
        return $original() * (currentIngame.trapThrottled.extractor ? 0.5 : 1);
    });
    modImpl.modInterface.replaceMethod(shapez.HubGoals, "getProcessorBaseSpeed", function ($original, [processorType]) {
        const originalSpeed = $original(processorType);
        switch (processorType) {
            case enumItemProcessorTypes.balancer:
                return originalSpeed * (currentIngame.trapThrottled.balancer ? 0.5 : 1);
            case enumItemProcessorTypes.mixer:
                return originalSpeed * (currentIngame.trapThrottled.mixer ? 0.5 : 1);
            case enumItemProcessorTypes.painter:
            case enumItemProcessorTypes.painterDouble:
            case enumItemProcessorTypes.painterQuad:
                return originalSpeed * (currentIngame.trapThrottled.painter ? 0.5 : 1);
            case enumItemProcessorTypes.cutter:
            case enumItemProcessorTypes.cutterQuad:
                return originalSpeed * (currentIngame.trapThrottled.cutter ? 0.5 : 1);
            case enumItemProcessorTypes.rotater:
            case enumItemProcessorTypes.rotaterCCW:
            case enumItemProcessorTypes.rotater180:
                return originalSpeed * (currentIngame.trapThrottled.rotator ? 0.5 : 1);
            case enumItemProcessorTypes.stacker:
                return originalSpeed * (currentIngame.trapThrottled.stacker ? 0.5 : 1);
            default:
                return originalSpeed;
        }
    });
    // getAvailableVariants
    modImpl.modInterface.replaceMethod(shapez.MetaPainterBuilding, methodNames.metaBuildings.getAvailableVariants, function ($original, [root]) {
        if (connection) {
            let variants = [];
            if (currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_painter)) {
                variants.push(defaultBuildingVariant, enumPainterVariants.mirrored);
            }
            if (currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_painter_double)) {
                variants.push(enumPainterVariants.double);
            }
            if (
                currentIngame.root.hubGoals.isRewardUnlocked(customRewards.painter_quad) &&
                currentIngame.root.gameMode.getSupportsWires()
            ) {
                variants.push(enumPainterVariants.quad);
            }
            return variants;
        } else {
            return $original(root);
        }
    });
    modImpl.modInterface.replaceMethod(shapez.MetaBalancerBuilding, methodNames.metaBuildings.getAvailableVariants, function ($original, [root]) {
        var available = $original(root);
        if (connection && !currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_balancer)) {
            var defaultindex = available.indexOf("default");
            if (defaultindex > -1) {
                available.splice(defaultindex, 1);
            }
        }
        return available;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaUndergroundBeltBuilding, methodNames.metaBuildings.getAvailableVariants, function ($original, [root]) {
        var available = $original(root);
        if (connection && !currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_tunnel)) {
            var defaultindex = available.indexOf("default");
            if (defaultindex > -1) {
                available.splice(defaultindex, 1);
            }
        }
        return available;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaCutterBuilding, methodNames.metaBuildings.getAvailableVariants, function ($original, [root]) {
        var available = $original(root);
        if (connection && !currentIngame.root.hubGoals.isRewardUnlocked(customRewards.cutter)) {
            var defaultindex = available.indexOf("default");
            if (defaultindex > -1) {
                available.splice(defaultindex, 1);
            }
        }
        return available;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaRotaterBuilding, methodNames.metaBuildings.getAvailableVariants, function ($original, [root]) {
        var available = $original(root);
        if (connection && !currentIngame.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_rotater)) {
            var defaultindex = available.indexOf("default");
            if (defaultindex > -1) {
                available.splice(defaultindex, 1);
            }
        }
        return available;
    });
    // shapeActions
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionCutHalf", function ($original, [definition]) {
        if (definition instanceof ShapeDefinition) {
            if (!currentIngame.trapMalfunction.cutter) {
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
        } else {
            modImpl.dialogs.showInfo(shapez.T.mods.shapezipelago.infoBox.impossible.title, 
                `${shapez.T.mods.shapezipelago.infoBox.impossible.report}<br />${
                    shapez.T.mods.shapezipelago.infoBox.impossible.shapeActionCutHalf}`);
            return $original(definition); // damn "unknown"
        }
    });
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionCutQuad", function ($original, [definition]) {
        if (!(definition instanceof ShapeDefinition)) {
            modImpl.dialogs.showInfo(shapez.T.mods.shapezipelago.infoBox.impossible.title, 
                `${shapez.T.mods.shapezipelago.infoBox.impossible.report}<br />${
                    shapez.T.mods.shapezipelago.infoBox.impossible.shapeActionCutQuad}`);
            return $original(definition);
        }
        if (!currentIngame.trapMalfunction.cutter_quad) {
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
        if (!(definition instanceof ShapeDefinition)) {
            modImpl.dialogs.showInfo(shapez.T.mods.shapezipelago.infoBox.impossible.title, 
                `${shapez.T.mods.shapezipelago.infoBox.impossible.report}<br />${
                    shapez.T.mods.shapezipelago.infoBox.impossible.shapeActionRotateCW}`);
            return $original(definition);
        }
        if (!currentIngame.trapMalfunction.rotator) {
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
        if (!(definition instanceof ShapeDefinition)) {
            modImpl.dialogs.showInfo(shapez.T.mods.shapezipelago.infoBox.impossible.title, 
                `${shapez.T.mods.shapezipelago.infoBox.impossible.report}<br />${
                    shapez.T.mods.shapezipelago.infoBox.impossible.shapeActionRotateCCW}`);
            return $original(definition);
        }
        if (!currentIngame.trapMalfunction.rotator_ccw) {
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
        if (!(definition instanceof ShapeDefinition)) {
            modImpl.dialogs.showInfo(shapez.T.mods.shapezipelago.infoBox.impossible.title, 
                `${shapez.T.mods.shapezipelago.infoBox.impossible.report}<br />${
                    shapez.T.mods.shapezipelago.infoBox.impossible.shapeActionRotate180}`);
            return $original(definition);
        }
        if (!currentIngame.trapMalfunction.rotator_180) {
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
        if (!currentIngame.trapMalfunction.stacker) {
            return $original(lowerDefinition, upperDefinition);
        } else {
            return $original(upperDefinition, lowerDefinition);
        }
    });
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionPaintWith", function ($original, [definition, color]) {
        if (!(definition instanceof ShapeDefinition)) {
            modImpl.dialogs.showInfo(shapez.T.mods.shapezipelago.infoBox.impossible.title, 
                `${shapez.T.mods.shapezipelago.infoBox.impossible.report}<br />${
                    shapez.T.mods.shapezipelago.infoBox.impossible.shapeActionPaintWith}`);
            return $original(definition);
        }
        if (false) {
            modImpl.dialogs.showInfo("You just found a bug! :)", "Please report this to the author of the mod: "
                +"<br />This stupid color parameter in shapeActionPaintWith drives me crazy."
                +"<br />Why is it not an enumColor? What have I done to deserve this?"
                +"<br />And all of this just to not have these stupid @ts-ignore tags that make overlook actual errors."
                +"<br />Why do these parameters have to be unknown?"
                +"<br />Why Tobias, why?");
            return $original(definition);
        }
        if (!currentIngame.trapMalfunction.painter) {
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
        // @ts-ignore
        const colorized = definition.cloneAndPaintWith4Colors(randomizedColors);
        return /** @type {ShapeDefinition} */ (this.operationCache[key] = this.registerOrReturnHandle(
            colorized
        ));
    });
    modImpl.modInterface.replaceMethod(shapez.ShapeDefinitionManager, "shapeActionPaintWith4Colors", function ($original, [definition, colors]) {
        if (!(definition instanceof ShapeDefinition)) {
            modImpl.dialogs.showInfo(shapez.T.mods.shapezipelago.infoBox.impossible.title, 
                `${shapez.T.mods.shapezipelago.infoBox.impossible.report}<br />${
                    shapez.T.mods.shapezipelago.infoBox.impossible.shapeActionPaintWith4Colors}`);
            return $original(definition);
        }
        if (!currentIngame.trapMalfunction.painter_quad) {
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
        // @ts-ignore
        const colorized = definition.cloneAndPaintWith4Colors(randomizedColors);
        return /** @type {ShapeDefinition} */ (this.operationCache[key] = this.registerOrReturnHandle(
            colorized
        ));
    });
    // keyboard button pressing
    modImpl.modInterface.replaceMethod(shapez.HUDWiresOverlay, "switchLayers", function ($original, []) {
        if (!connection) {
            $original();
        }
        if (!this.root.gameMode.getSupportsWires()) {
            return;
        }
        if (this.root.currentLayer === "regular") {
            if (this.root.hubGoals.isRewardUnlocked(customRewards.wires)) {
                this.root.currentLayer = "wires";
            }
        } else {
            this.root.currentLayer = "regular";
        }
        this.root.signals.editModeChanged.dispatch(this.root.currentLayer);
    });
    modImpl.modInterface.replaceMethod(shapez.HUDBuildingPlacerLogic, "startPipette", function ($original, []) {
        if (this.root.camera.getIsMapOverlayActive()) return;
        const mousePosition = this.root.app.mousePosition;
        if (!mousePosition) return;
        const worldPos = this.root.camera.screenToWorld(mousePosition);
        const tile = worldPos.toTileSpace();
        const contents = this.root.map.getTileContent(tile, this.root.currentLayer);
        if (!contents) {
            const tileBelow = this.root.map.getLowerLayerContentXY(tile.x, tile.y);
            if (
                tileBelow &&
                this.root.app.settings.getAllSettings().pickMinerOnPatch &&
                this.root.currentLayer === "regular" &&
                this.root.gameMode.hasResources() &&
                (this.root.hubGoals.isRewardUnlocked(customRewards.extractor) 
                || this.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_miner_chainable))
            ) {
                this.currentMetaBuilding.set(gMetaBuildingRegistry.findByClass(MetaMinerBuilding));
                if (this.root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_miner_chainable)) {
                    this.currentVariant.set(enumMinerVariants.chainable);
                }
            } else {
                this.currentMetaBuilding.set(null);
            }
            return;
        }
        const buildingCode = contents.components.StaticMapEntity.code;
        const extracted = getBuildingDataFromCode(buildingCode);
        if (extracted.metaInstance.getId() === gMetaBuildingRegistry.findByClass(MetaHubBuilding).getId()) {
            this.currentMetaBuilding.set(null);
            return;
        }
        if (this.root.gameMode.isBuildingExcluded(extracted.metaClass)) {
            this.currentMetaBuilding.set(null);
            return;
        }
        if (
            this.currentMetaBuilding.get() &&
            extracted.metaInstance.getId() === this.currentMetaBuilding.get().getId() &&
            extracted.variant === this.currentVariant.get()
        ) {
            this.currentMetaBuilding.set(null);
            return;
        }
        this.currentMetaBuilding.set(extracted.metaInstance);
        this.currentVariant.set(extracted.variant);
        this.currentBaseRotation = contents.components.StaticMapEntity.rotation;
    });
    // getAdditionalStatistics
    modImpl.modInterface.replaceMethod(shapez.MetaMinerBuilding, methodNames.metaBuildings.getAdditionalStatistics, function ($original, [root, variant]) {
        let stats = $original(root, variant);
        stats.push([
            shapez.T.mods.shapezipelago.statisticsBox.perBelt, 
            Number(currentIngame.root.hubGoals.getBeltBaseSpeed() / currentIngame.root.hubGoals.getMinerBaseSpeed())
                .toFixed(1).replace(".", shapez.T.global.decimalSeparator)
        ]);
        return stats;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaCutterBuilding, methodNames.metaBuildings.getAdditionalStatistics, function ($original, [root, variant]) {
        let stats = $original(root, variant);
        stats.push([
            shapez.T.mods.shapezipelago.statisticsBox.perBelt, 
            Number(currentIngame.root.hubGoals.getBeltBaseSpeed()/currentIngame.root.hubGoals.getProcessorBaseSpeed(
                variant === enumCutterVariants.quad ? enumItemProcessorTypes.cutterQuad : enumItemProcessorTypes.cutter
            ))
                .toFixed(1).replace(".", shapez.T.global.decimalSeparator)
        ]);
        return stats;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaRotaterBuilding, methodNames.metaBuildings.getAdditionalStatistics, function ($original, [root, variant]) {
        var speed = 1;
        if (variant === defaultBuildingVariant)
            speed = currentIngame.root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.rotater);
        else if (variant === enumRotaterVariants.ccw)
            speed = currentIngame.root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.rotaterCCW);
        else if (variant === enumRotaterVariants.rotate180)
            speed = currentIngame.root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.rotater180);
        let stats = $original(root, variant);
        stats.push([
            shapez.T.mods.shapezipelago.statisticsBox.perBelt, 
            Number(currentIngame.root.hubGoals.getBeltBaseSpeed()/speed)
                .toFixed(1).replace(".", shapez.T.global.decimalSeparator)
        ]);
        return stats;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaStackerBuilding, methodNames.metaBuildings.getAdditionalStatistics, function ($original, [root, variant]) {
        let stats = $original(root, variant);
        stats.push([
            shapez.T.mods.shapezipelago.statisticsBox.perBelt, 
            Number(currentIngame.root.hubGoals.getBeltBaseSpeed()/currentIngame.root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.stacker))
                .toFixed(1).replace(".", shapez.T.global.decimalSeparator)
        ]);
        return stats;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaPainterBuilding, methodNames.metaBuildings.getAdditionalStatistics, function ($original, [root, variant]) {
        var speed = 1;
        if (variant === defaultBuildingVariant || variant === enumPainterVariants.mirrored)
            speed = currentIngame.root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.painter);
        else if (variant === enumPainterVariants.double)
            speed = currentIngame.root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.painterDouble);
        else if (variant === enumPainterVariants.quad)
            speed = currentIngame.root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.painterQuad);
        let stats = $original(root, variant);
        stats.push([
            shapez.T.mods.shapezipelago.statisticsBox.perBelt, 
            Number(currentIngame.root.hubGoals.getBeltBaseSpeed()/speed)
                .toFixed(1).replace(".", shapez.T.global.decimalSeparator)
        ]);
        return stats;
    });
    modImpl.modInterface.replaceMethod(shapez.MetaMixerBuilding, methodNames.metaBuildings.getAdditionalStatistics, function ($original, [root, variant]) {
        let stats = $original(root, variant);
        stats.push([
            shapez.T.mods.shapezipelago.statisticsBox.perBelt, 
            Number(currentIngame.root.hubGoals.getBeltBaseSpeed()/currentIngame.root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.mixer))
                .toFixed(1).replace(".", shapez.T.global.decimalSeparator)
        ]);
        return stats;
    });
    // Cosmetic randomization and shuffling
    modImpl.modInterface.replaceMethod(shapez.HUDBaseToolbar, "initialize", function ($original, []) {
        aptry("Toolbar initializing failed", () => {
            // This code is used in 2 seperate places
            const shuffle = () => {
                /**
                 * @type {Array<typeof MetaBuilding>}
                 */
                let allBuildings = this.allBuildings.slice();
                let random = new RandomNumberGenerator(connection.clientSeed);
                this.primaryBuildings = [];
                this.secondaryBuildings = [];
                while (allBuildings.length) {
                    let nextBuilding = allBuildings.splice(random.nextIntRange(0, allBuildings.length), 1)[0];
                    if (this.primaryBuildings.length >= 12 || random.choice([true, false]))
                        this.secondaryBuildings.push(nextBuilding);
                    else
                        this.primaryBuildings.push(nextBuilding);
                }
                if (this.primaryBuildings.length == 0) {
                    this.primaryBuildings.push(this.secondaryBuildings.pop());
                }
            };
            /**@type {GameRoot} */
            const root = this.root;
            if (!root.savegame.hasGameDump()) {
                apdebuglog("Initializing toolbar");
                if (connection && connection.isToolbarShuffled) {
                    shuffle();
                }
                $original();
            } else {
                currentIngame.lateToolbarInitializations[this.htmlElementId] = () => {
                    apdebuglog("Late initializing toolbar");
                    if (connection && connection.isToolbarShuffled) {
                        shuffle();
                    }
                    $original();
                };
            }
        });
    });
}

export function overrideStateMoving() {
    apdebuglog("Calling overrideStateMoving");
    modImpl.modInterface.replaceMethod(shapez.InGameState, "stage4bResumeGame", function ($original, []) {
        if (this.switchStage(GAME_LOADING_STATES.s4_B_resumeGame)) {
            if (!this.core.initExistingGame()) {
                this.onInitializationFailure("Savegame is corrupt and can not be restored.");
                return;
            }
            // This needs to "pause" if trying to connect
            if (!currentIngame.isTryingToConnect) {
                apdebuglog("Switching to stage 5 without trying to connect");
                this.app.gameAnalytics.handleGameResumed();
                this.stage5FirstUpdate();
            }
        }
    });
}

/**
 * 
 * @returns {{shape: string; required: number; reward: string; throughputOnly: boolean;}[]}
 */
function calcLevelDefinitions() {
    if (connection.israndomizedLevels) {
        const randomizer = new RandomNumberGenerator(connection.clientSeed);
        var logic = connection.levelsLogic;
        if (logic.startsWith("vanilla")) {
            return randomizedVanillaStepsShapes(randomizer);
        } else if (logic.startsWith("stretched")) {
            return randomizedStretchedShapes(randomizer);
        } else if (logic.startsWith("quick")) {
            return randomizedQuickShapes(randomizer);
        } else if (logic.startsWith("random_steps")) {
            return randomizedRandomStepsShapes(randomizer);
        } else if (logic === "hardcore") {
            return randomizedHardcoreDopamineShapes(randomizer, 5);
        } else if (logic === "dopamine") {
            return randomizedHardcoreDopamineShapes(randomizer, 2);
        } else if (logic === "dopamine_overflow") {
            return randomizedHardcoreDopamineShapes(randomizer, 0);
        } else {
            apassert(false, "Illegal level logic type: " + logic);
        }
    } else {
        return vanillaShapes();
    }
}

function calcUpgradeDefinitions() {
    if (connection.isRandomizedUpgrades) {
        const randomizer = new RandomNumberGenerator(connection.clientSeed);
        var logic = connection.upgradesLogic;
        if (logic === "vanilla_like") {
            return vanillaLikeUpgradeShapes(randomizer);
        } else if (logic === "linear") {
            return linearUpgradeShapes(randomizer);
        } else if (logic === "category") {
            return categoryUpgradeShapes(randomizer);
        } else if (logic === "category_random") {
            return categoryRandomUpgradeShapes(randomizer);
        } else {
            return hardcoreUpgradeShapes(randomizer);
        }
    } else {
        return vanillaUpgradeShapes();
    }
}

function resyncLocationChecks() {
    apdebuglog("Resyncing already reached locations");
    // resync levels
    for (var i = 1; i < currentIngame.root.hubGoals.level; i++) { // current level is what is to be completed
        checkLocation("Resynced", false, `Level ${i}`);
    }
    if (currentIngame.root.hubGoals.level > 20) {
        checkLocation("Resynced", false, "Level 1 Additional", "Level 20 Additional", "Level 20 Additional 2");
    } else if (currentIngame.root.hubGoals.level > 1) {
        checkLocation("Resynced", false, "Level 1 Additional");
    }
    // resync upgrades
    for (var upgradeId of ["belt", "miner", "processors", "painting"]) {
        const currentLevel = currentIngame.root.hubGoals.getUpgradeLevel(upgradeId);
        for (var i = 1; i <= currentLevel; i++) {
            checkLocation("Resynced", false, upgradeIdNames[upgradeId] + " Upgrade Tier " + roman(i+1));
        }
    }
    // resync shapesanity
    for (var [hash, amount] of Object.entries(currentIngame.root.hubGoals.storedShapes)) {
        if ((amount || 0) > 0) {
            shapesanityAnalyzer(ShapeDefinition.fromShortKey(hash));
        }
    }
    // resync goals
    if (connection.goal === "vanilla" || connection.goal === "mam") {
        if (connection.levelsToGenerate < currentIngame.root.hubGoals.level) 
            checkLocation("Checked", true);
    } else if (connection.goal === "even_fasterer") {
        if (currentIngame.root.hubGoals.getUpgradeLevel("belt") >= connection.tiersToGenerate 
                && currentIngame.root.hubGoals.getUpgradeLevel("miner") >= connection.tiersToGenerate 
                && currentIngame.root.hubGoals.getUpgradeLevel("processors") >= connection.tiersToGenerate 
                && currentIngame.root.hubGoals.getUpgradeLevel("painting") >= connection.tiersToGenerate) {
            checkLocation("Checked", true);
        }
    }
}

