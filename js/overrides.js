import { Mod } from "shapez/mods/mod";
import { client, connected, customRewards, leveldefs, roman, setLevelDefs, setUpgredeDefs, upgradeDefs } from "./global_data";
import { RandomNumberGenerator } from "shapez/core/rng";
import { hardcoreUpgradeShapes, linearUpgradeShapes, randomizedHardcoreShapes, randomizedStretchedShapes, randomizedVanillaStepsShapes, vanillaLikeUpgradeShapes, vanillaShapes, vanillaUpgradeShapes } from "./requirement_definitions";
import { MOD_SIGNALS } from "shapez/mods/mod_signals";
import { checkLocation, setRootAndModImpl } from "./server_communication";
import { enumAnalyticsDataSource } from "shapez/game/production_analytics";
import { defaultBuildingVariant } from "shapez/game/meta_building";
import { enumPainterVariants } from "shapez/game/buildings/painter";
import { CLIENT_PACKET_TYPE } from "archipelago.js";
import { enumSubShape } from "shapez/game/shape_definition";
import { clamp } from "shapez/core/utils";
import { MODS_ADDITIONAL_SHAPE_MAP_WEIGHTS } from "shapez/game/map_chunk";
import { getShapesanityAnalyser } from "./shapesanity";

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
            checkLocation("Level " + this.level);
            if (this.level == 1 || this.level == 20) {
                checkLocation("Level " + this.level + " Additional");
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
        root.signals.shapeDelivered.add(getShapesanityAnalyser(root));
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
    modImpl.modInterface.replaceMethod(shapez.MetaCutterBuilding, "getIsUnlocked", function ($original, [root]) {
        if (connected) return customRewards.reward_cutter != 0;
        else return $original(root);
    });
    modImpl.modInterface.replaceMethod(shapez.MetaTrashBuilding, "getIsUnlocked", function ($original, [root]) {
        if (connected) return customRewards.reward_trash != 0;
        else return $original(root);
    });
    modImpl.modInterface.replaceMethod(shapez.MetaWireBuilding, "getIsUnlocked", function ($original, [root]) {
        if (connected) return customRewards.reward_wires != 0;
        else return $original(root);
    });
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
}

/**
 * 
 * @param {Mod} modImpl 
 */
export function overridePatchGenerator(modImpl) {
    modImpl.modInterface.replaceMethod(shapez.MapChunk, "internalGenerateShapePatch", function ($original, [rng, shapePatchSize, distanceToOriginInChunks]) {
        if (connected) {
            /** @type {[enumSubShape, enumSubShape, enumSubShape, enumSubShape]} */
            let subShapes = null;
            let weights = {};
            weights = {
                [enumSubShape.rect]: 100,
                [enumSubShape.circle]: Math.round(50 + clamp(distanceToOriginInChunks * 2, 0, 50)),
                [enumSubShape.star]: Math.round(20 + clamp(distanceToOriginInChunks, 0, 30)),
                [enumSubShape.windmill]: Math.round(15 + clamp(distanceToOriginInChunks / 2, 0, 20)),
            };
            for (const key in MODS_ADDITIONAL_SHAPE_MAP_WEIGHTS) {
                weights[key] = MODS_ADDITIONAL_SHAPE_MAP_WEIGHTS[key](distanceToOriginInChunks);
            }
            if (distanceToOriginInChunks < 7) {
                weights[enumSubShape.star] = 0;
                weights[enumSubShape.windmill] = 0;
            }
            if (distanceToOriginInChunks < 10) {
                const subShape = this.internalGenerateRandomSubShape(rng, weights);
                subShapes = [subShape, subShape, subShape, subShape];
            } else if (distanceToOriginInChunks < 15) {
                const subShapeA = this.internalGenerateRandomSubShape(rng, weights);
                const subShapeB = this.internalGenerateRandomSubShape(rng, weights);
                subShapes = [subShapeA, subShapeA, subShapeB, subShapeB];
            } else {
                subShapes = [
                    this.internalGenerateRandomSubShape(rng, weights),
                    this.internalGenerateRandomSubShape(rng, weights),
                    this.internalGenerateRandomSubShape(rng, weights),
                    this.internalGenerateRandomSubShape(rng, weights),
                ];
            }
            const definition = this.root.shapeDefinitionMgr.getDefinitionFromSimpleShapes(subShapes);
            this.internalGeneratePatch(
                rng,
                shapePatchSize,
                this.root.shapeDefinitionMgr.getShapeItemFromDefinition(definition)
            );
        } else {
            $original(rng, shapePatchSize, distanceToOriginInChunks);
        }
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
        var building1 = client.data.slotData["Level building 1"].valueOf(); //immer
        var building2 = client.data.slotData["Level building 2"].valueOf(); //immer
        var building3 = client.data.slotData["Level building 3"].valueOf(); //immer
        var building4 = client.data.slotData["Level building 4"].valueOf(); //immer
        var building5 = client.data.slotData["Level building 5"].valueOf(); //immer
        if (logic < 2) {
            return randomizedVanillaStepsShapes(randomizer, maxlevel, multiplier, building1, building2, building3, building4, building5);
        } else if (logic == 4) {
            return randomizedHardcoreShapes(randomizer, maxlevel);
        } else {
            return randomizedStretchedShapes(randomizer, maxlevel, multiplier, building1, building2, building3, building4, building5);
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
