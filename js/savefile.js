import { GameRoot } from "shapez/game/root";
import { apdebuglog, Connection, connection, currentIngame, modImpl } from "./global_data";
import { processItemsPacket } from "./server_communication";

export function registerSavingData() {
    apdebuglog("Calling registerSavingData");
    modImpl.signals.gameSerialized.add((/** @type {GameRoot} */ root, savegame) => {
        if (connection) {
            // Connection is established, use always-present connection.connectionInformation
            savegame.modExtraData["connectInfo"] = connection.connectionInformation;
        } else if (currentIngame.connectionInformation) {
            // Connecting from stored info probably failed, use info from currentIngame to not loose it
            savegame.modExtraData["connectInfo"] = currentIngame.connectionInformation;
        } else {
            // No connection planned for this save, so do not save anything
            return;
        }
        savegame.modExtraData["processedItemCount"] = currentIngame.processedItemCount;
        apdebuglog("Serialized with processed item count " + currentIngame.processedItemCount);
    });
    modImpl.signals.gameDeserialized.add((/**@type GameRoot */root, savegame) => {
        const lateInitializations = () => {
            for (const entry in currentIngame.lateToolbarInitializations) {
                currentIngame.lateToolbarInitializations[entry]();
            }
        };
        if (connection) {
            currentIngame.processedItemCount = savegame.modExtraData["processedItemCount"] || 0;
            apdebuglog("Deserialized with processed item count " + currentIngame.processedItemCount);
            lateInitializations();
        } else {
            if (savegame.modExtraData["connectInfo"]) {
                currentIngame.isTryingToConnect = true;
                currentIngame.processedItemCount = savegame.modExtraData["processedItemCount"] || 0;
                currentIngame.connectionInformation = savegame.modExtraData["connectInfo"];
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