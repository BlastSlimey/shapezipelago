import { GameRoot } from "shapez/game/root";
import { apdebuglog, connection, currentIngame, modImpl } from "./global_data";

export function registerSavingData() {
    apdebuglog("Calling registerSavingData");
    modImpl.signals.gameSerialized.add((/** @type {GameRoot} */ root, data) => {
        if (connection) {
            for (var rewardName in root.hubGoals.gainedRewards) {
                data.modExtraData[rewardName] = root.hubGoals.gainedRewards[rewardName];
            }
            for (var upgradeName in root.hubGoals.upgradeImprovements) {
                data.modExtraData["improvement_"+upgradeName] = root.hubGoals.upgradeImprovements[upgradeName];
            }
            data.modExtraData["processedItemCount"] = currentIngame.processedItemCount;
            apdebuglog("Serialized with processed item count " + currentIngame.processedItemCount);
        }
    });
    modImpl.signals.gameDeserialized.add((root, data) => {
        if (connection) {
            for (var modDataName in data.modExtraData) {
                if (modDataName.startsWith("reward_")) {
                    root.hubGoals.gainedRewards[modDataName] = data.modExtraData[modDataName] || 0;
                }
            }
            for (var upgradeName in root.hubGoals.upgradeImprovements) {
                root.hubGoals.upgradeImprovements[upgradeName] = data.modExtraData["improvement_"+upgradeName] || 1;
            }
            currentIngame.processedItemCount = data.modExtraData["processedItemCount"] || 0;
            apdebuglog("Deserialized with processed item count " + currentIngame.processedItemCount);
        }
    });
}