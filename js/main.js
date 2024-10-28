import { Mod } from "shapez/mods/mod";
import { addInputContainer, addShapesanityBox } from "./ui_changes";
import { registerSavingData } from "./savefile";
import { overrideBuildings, overrideGameMode, overrideLocationsListenToItems, overrideStateMoving } from "./overrides";
import { aptry, connection, currentIngame, Ingame, setModImpl } from "./global_data";
import { GameRoot } from "shapez/game/root";

class ModImpl extends Mod {
    init() {
        aptry("Mod initialization failed", () => {
            setModImpl(this);
            addInputContainer();
            addShapesanityBox();
            registerSavingData();
            overrideGameMode();
            overrideLocationsListenToItems();
            overrideBuildings();
            overrideStateMoving();
            this.signals.gameInitialized.add((/** @type {GameRoot} */ root) => {
                currentIngame.afterRootInitialization(root);
            });
            this.signals.stateEntered.add((state) => {
                aptry("Ingame (de)contruction failed", () => {
                    if (state.key === "InGameState") {
                        new Ingame();
                    } else {
                        if (currentIngame) {
                            currentIngame.leave();
                            if (state.key === "MainMenuState")
                                if (connection)
                                    connection.disconnect();
                        }
                    }
                });
            });
        });
    }
}