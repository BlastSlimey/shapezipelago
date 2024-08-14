import { Mod } from "shapez/mods/mod";
import { addInputContainer } from "./ui_changes";
import { registerSavingData } from "./savefile";
import { client } from "./global_data";
import { overrideBuildings, overrideGameMode, overrideLocationsListenToItems, overridePatchGenerator } from "./overrides";

class ModImpl extends Mod {
    init() {
        addInputContainer(this, client, "Player", "localhost", "38281", "");
        registerSavingData(this);
        overrideGameMode(this);
        overrideLocationsListenToItems(this);
        overrideBuildings(this);
        //overridePatchGenerator(this);
    }
}