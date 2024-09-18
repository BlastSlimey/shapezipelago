import { Mod } from "shapez/mods/mod";
import { addInputContainer } from "./ui_changes";
import { registerSavingData } from "./savefile";
import { overrideBuildings, overrideGameMode, overrideLocationsListenToItems } from "./overrides";
import { connection, currentIngame, Ingame, setModImpl } from "./global_data";
import { GameRoot } from "shapez/game/root";

class ModImpl extends Mod {
    init() {
        setModImpl(this);
        addInputContainer("Player1", "localhost", "38281", "");
        registerSavingData();
        overrideGameMode();
        overrideLocationsListenToItems();
        overrideBuildings();
        this.signals.gameInitialized.add((/** @type {GameRoot} */ root) => {
            currentIngame.root = root;
            currentIngame.isAPSave = !(!connection);
        });
        this.signals.stateEntered.add((state) => {
            if (state.key === "InGameState") {
                new Ingame();
            } else {
                if (currentIngame)
                    currentIngame.leave();
            }
        });
    }
}