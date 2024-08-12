import { Mod } from "shapez/mods/mod";
import { addInputContainer } from "./ui_changes";
import { SERVER_PACKET_TYPE } from "archipelago.js";
import { registerSavingData } from "./savefile";
import { client } from "./global_data";
import { overrideBuildings, overrideGameMode, overrideLocationsListenToItems, overridePatchGenerator } from "./overrides";

class ModImpl extends Mod {
    init() {
        addInputContainer(this, client, "Player1", "localhost", "38281", "");
        client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, (packet, message) => {
            console.log("[Archipelago] ", message);
        });
        registerSavingData(this);
        overrideGameMode(this);
        overrideLocationsListenToItems(this);
        overrideBuildings(this);
        overridePatchGenerator(this);
    }
}