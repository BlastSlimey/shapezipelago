import { GameRoot } from "shapez/game/root";
import { apdebuglog, Connection, connection, currentIngame, modImpl } from "./global_data";
import { processItemsPacket } from "./server_communication";

export function registerSavingData() {
    apdebuglog("Calling registerSavingData");
    modImpl.signals.gameSerialized.add((/** @type {GameRoot} */ root, savegame) => {
        if (connection) {
            /*for (var rewardName in root.hubGoals.gainedRewards) {
                savegame.modExtraData[rewardName] = root.hubGoals.gainedRewards[rewardName];
            }
            for (var upgradeName in root.hubGoals.upgradeImprovements) {
                savegame.modExtraData["improvement_"+upgradeName] = root.hubGoals.upgradeImprovements[upgradeName];
            }*/
            savegame.modExtraData["processedItemCount"] = currentIngame.processedItemCount;
            savegame.modExtraData["connectInfo"] = connection.connectionInformation;
            apdebuglog("Serialized with processed item count " + currentIngame.processedItemCount);
        }
    });
    modImpl.signals.gameDeserialized.add((/**@type GameRoot */root, savegame) => {
        const lateInitializations = () => {
            for (const entry in currentIngame.lateToolbarInitializations) {
                currentIngame.lateToolbarInitializations[entry]();
            }
        };
        if (connection) {
            /*for (var modDataName in data.modExtraData) {
                if (modDataName.startsWith("reward_")) {
                    root.hubGoals.gainedRewards[modDataName] = data.modExtraData[modDataName] || 0;
                }
            }
            for (var upgradeName in root.hubGoals.upgradeImprovements) {
                root.hubGoals.upgradeImprovements[upgradeName] = data.modExtraData["improvement_"+upgradeName] || 1;
            }*/
            currentIngame.processedItemCount = savegame.modExtraData["processedItemCount"] || 0;
            apdebuglog("Deserialized with processed item count " + currentIngame.processedItemCount);
            lateInitializations();
        } else {
            if (savegame.modExtraData["connectInfo"]) {
                currentIngame.isTryingToConnect = true;
                currentIngame.processedItemCount = savegame.modExtraData["processedItemCount"] || 0;
                apdebuglog("Deserialized with processed item count " + currentIngame.processedItemCount);
                new Connection().tryConnect(savegame.modExtraData["connectInfo"], processItemsPacket).finally(function () {
                    // Resuming InGame stages
                    apdebuglog("Redeserializing data");
                    root.map.deserialize(savegame.map);
                    root.gameMode.deserialize(savegame.gameMode);
                    root.hubGoals.deserialize(savegame.hubGoals, root);
                    lateInitializations();
                    apdebuglog("Switching to stage 5 after trying to connect");
                    root.app.gameAnalytics.handleGameResumed();
                    root.gameState.stage5FirstUpdate();
                });
            } else {
                lateInitializations();
            }
        }
    });
}