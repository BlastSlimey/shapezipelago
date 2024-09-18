import { apdebuglog, Connection, connection, modImpl } from "./global_data";
import { ITEMS_HANDLING_FLAGS } from "archipelago.js";
import { processItemsPacket } from "./server_communication";
import { makeDiv, removeAllChildren } from "shapez/core/utils";
import { BaseHUDPart } from "shapez/game/hud/base_hud_part";
import { DynamicDomAttach } from "shapez/game/hud/dynamic_dom_attach";
import { InputReceiver } from "shapez/core/input_receiver";
import { KeyActionMapper, KEYMAPPINGS } from "shapez/game/key_action_mapper";
import { GameRoot } from "shapez/game/root";

var scouted = [true, true, false];
var examples = [];

/**
 * @param {string} autoPlayer
 * @param {string} autoAddress
 * @param {string} autoPort
 * @param {string} autoPassword
 */
export function addInputContainer(autoPlayer, autoAddress, autoPort, autoPassword) {
    apdebuglog("Calling addInputContainer");
    modImpl.signals.stateEntered.add(state => {
        if (state.key === "MainMenuState") {
            apdebuglog("Creating input box");
            // add input box
            const mainWrapper = document.body.getElementsByClassName("mainWrapper").item(0);
            const sideContainer = mainWrapper.getElementsByClassName("sideContainer").item(0);
            const inputContainer = document.createElement("div");
            inputContainer.className = "inputContainer";
            sideContainer.appendChild(inputContainer);
            const playerContainer = document.createElement("div");
            const addressContainer = document.createElement("div");
            const portContainer = document.createElement("div");
            const passwordContainer = document.createElement("div");
            const statusContainer = document.createElement("div");
            playerContainer.className = "playerContainer";
            addressContainer.className = "addressContainer";
            portContainer.className = "portContainer";
            passwordContainer.className = "passwordContainer";
            statusContainer.className = "statusContainer";
            inputContainer.appendChild(playerContainer);
            inputContainer.appendChild(addressContainer);
            inputContainer.appendChild(portContainer);
            inputContainer.appendChild(passwordContainer);
            inputContainer.appendChild(statusContainer);
            const playerLabel = document.createElement("h4");
            const playerInput = document.createElement("input");
            playerLabel.innerText = "Player";
            playerInput.type = "text";
            playerInput.className = "playerInput";
            playerInput.value = autoPlayer;
            playerContainer.appendChild(playerLabel);
            playerContainer.appendChild(playerInput);
            const addressLabel = document.createElement("h4");
            const addressInput = document.createElement("input");
            addressLabel.innerText = "Address";
            addressInput.type = "text";
            addressInput.className = "addressInput";
            addressInput.value = autoAddress;
            addressContainer.appendChild(addressLabel);
            addressContainer.appendChild(addressInput);
            const portLabel = document.createElement("h4");
            const portInput = document.createElement("input");
            portLabel.innerText = "Port";
            portInput.type = "number";
            portInput.value = autoPort;
            portContainer.appendChild(portLabel);
            portContainer.appendChild(portInput);
            const passwordLabel = document.createElement("h4");
            const passwordInput = document.createElement("input");
            passwordLabel.innerText = "Password";
            passwordInput.type = "password";
            passwordInput.value = autoPassword;
            passwordContainer.appendChild(passwordLabel);
            passwordContainer.appendChild(passwordInput);
            const statusLabel = document.createElement("h4");
            const statusButton = document.createElement("button");
            statusLabel.innerText = connection ? "Connected" : "Not Connected";
            statusButton.innerText = connection ? "Disconnect" : "Connect";
            statusButton.classList.add("styledButton", "statusButton");
            statusButton.addEventListener("click", () => {
                if (!connection) {
                    var connectInfo = {
                        hostname: addressInput.value,
                        port: portInput.valueAsNumber, 
                        game: "shapez", 
                        name: playerInput.value,
                        items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL,
                        password: passwordInput.value
                    };
                    new Connection().tryConnect(connectInfo, processItemsPacket, () => {
                        if (connection) {
                            statusLabel.innerText = "Connected";
                            statusButton.innerText = "Disconnect";
                        } else {
                            statusLabel.innerText = "Connection failed";
                        }
                    });
                } else {
                    connection.disconnect();
                    statusLabel.innerText = "Disconnected";
                    statusButton.innerText = "Connect";
                }
            });
            statusContainer.appendChild(statusLabel);
            statusContainer.appendChild(statusButton);
        }
    });
    modImpl.modInterface.registerHudElement("ingame_HUD_Shapesanity", HUDShapesanity);
    modImpl.signals.gameStarted.add((/** @type {GameRoot} */ root) => {
        if (connection) {
            apdebuglog("Creating shapesanity button");
            examples = [];
            for (var name of connection.shapesanityNames) {
                examples.push(root.shapeDefinitionMgr.getShapeFromShortKey(shapesanityExample(name)).generateAsCanvas(50));
            }
            var ingame_HUD_GameMenu;
            for (var index = 0; index < document.body.children.length; index++) {
                if (document.body.children.item(index).id === "ingame_HUD_GameMenu") {
                    ingame_HUD_GameMenu = document.body.children.item(index);
                }
            }
            const shapesanityButton = document.createElement("button");
            shapesanityButton.classList.add("shapesanityButton");
            shapesanityButton.addEventListener("mousedown", () => {
                shapesanityButton.classList.add("pressed");
            });
            shapesanityButton.addEventListener("mouseout", () => {
                shapesanityButton.classList.remove("pressed");
            });
            shapesanityButton.addEventListener("mouseup", () => {
                shapesanityButton.classList.remove("pressed");
                root.hud.parts["ingame_HUD_Shapesanity"].show();
            });
            ingame_HUD_GameMenu.appendChild(shapesanityButton);
        }
    });
}

class HUDShapesanity extends BaseHUDPart {

    createElements(parent) {
        this.background = makeDiv(parent, "ingame_HUD_Shapesanity", ["ingameDialog"]);
        this.dialogInner = makeDiv(this.background, null, ["dialogInner"]);
        this.title = makeDiv(this.dialogInner, null, ["title"], "Shapesanity");
        this.closeButton = makeDiv(this.title, null, ["closeButton"]);
        this.trackClicks(this.closeButton, this.close);
        this.contentDiv = makeDiv(this.dialogInner, null, ["content"]);
        this.visible = false;
    }

    rerenderFull() {
        removeAllChildren(this.contentDiv);
        if (this.visible) {
            for (var index = 0; index < connection.shapesanityNames.length; index++) {
                var divElem = makeDiv(this.contentDiv, null, ["shapesanityRow"]);
                var nextName = document.createElement("span");
                nextName.classList.add("shapesanityName");
                nextName.innerText = `${index+1}: ${connection.shapesanityNames[index]}`;
                if (index < scouted.length ? scouted[index] : false) {
                    divElem.classList.add("locationChecked");
                }
                divElem.appendChild(nextName);
                divElem.appendChild(examples[index]);
            }
        }
    }

    initialize() {
        this.domAttach = new DynamicDomAttach(this.root, this.background, {
            attachClass: "visible",
        });
        this.inputReciever = new InputReceiver("shapesanity");
        this.keyActionMapper = new KeyActionMapper(this.root, this.inputReciever);
        this.keyActionMapper.getBinding(KEYMAPPINGS.general.back).add(this.close, this);
        this.keyActionMapper.getBinding(KEYMAPPINGS.ingame.menuClose).add(this.close, this);
        this.lastFullRerender = 0;
        this.close();
        this.rerenderFull();
    }

    scout() {
        scouted = new Array(connection.shapesanityNames.length).fill(false);
        for (var checked of connection.getCheckedLocationNames()) {
            const name = checked.split(" ");
            if (name[0] === "Shapesanity") {
                var index = Number(name[1]);
                if (!Number.isNaN(index)) {
                    scouted[index-1] = true;
                }
            }
        }
    }

    show() {
        apdebuglog("Showing shapesanity checklist");
        this.visible = true;
        this.root.app.inputMgr.makeSureAttachedAndOnTop(this.inputReciever);
        if (connection) this.scout();
        this.update();
        this.rerenderFull();
    }

    close() {
        this.visible = false;
        this.root.app.inputMgr.makeSureDetached(this.inputReciever);
        this.update();
    }

    update() {
        this.domAttach.update(this.visible);
    }
    
    isBlockingOverlay() {
        return this.visible;
    }
    
}

const capitalColorNames = {
    "Uncolored": "u",
    "Red": "r",
    "Green": "g",
    "Blue": "b",
    "Yellow": "y",
    "Cyan": "c",
    "Purple": "p",
    "White": "w"
};
const capitalShapeNames = {
    "Circle": "C",
    "Square": "R",
    "Star": "S",
    "Windmill": "W"
};
const oneWordLen3 = {
    "Half": (words) => {
        const code = capitalShapeNames[words[2]]+capitalColorNames[words[1]]; 
        return "----"+code+code;
    },
    "Cornered": (words) => {
        const code = capitalShapeNames[words[2]]+capitalColorNames[words[1]]; 
        return "--"+code+"--"+code;
    },
    "3-1": (words) => {
        return words[2]+words[1]+words[1]+words[1];
    },
    "Half-Half": (words) => {
        return words[2]+words[2]+words[1]+words[1];
    },
    "Checkered": (words) => {
        return words[2]+words[1]+words[2]+words[1];
    }
};
const twoWordLen4 = {
    "AdjacentSingles": (words) => {
        return "--"+words[3]+words[2]+"--";
    },
    "Adjacent2-1": (words) => {
        return "--"+words[3]+words[2]+words[2];
    },
    "CorneredSingles": (words) => {
        return words[3]+"--"+words[2]+"--";
    },
    "Cornered2-1": (words) => {
        return words[2]+words[3]+words[2]+"--";
    }
}

/**
 * @param {String} name
 */
function shapesanityExample(name) {
    const words = name.split(" ");
    if (capitalColorNames[words[0]]) {
        if (capitalShapeNames[words[1]]) {
            if (words[2] === "Piece") {
                return capitalShapeNames[words[1]]+capitalColorNames[words[0]]+"------";
            } else {
                var code = capitalShapeNames[words[1]]+capitalColorNames[words[0]];
                return code+code+code+code;
            }
        } else {
            const col = capitalColorNames[words[0]];
            var ret = "";
            for (var i = 0; i < 4; i++) {
                if (words[1].charAt(i) == "-")
                    ret = ret+"--";
                else
                    ret = ret+words[1].charAt(i)+col;
            }
            return ret;
        }
    } else if (words[0] === "Singles") {
        if (words.length == 4)
            return "--"+words[1]+words[2]+words[3];
        if (words.length == 5)
            return words[1]+words[2]+words[3]+words[4];
    } else if (words.length == 3) {
        return oneWordLen3[words[0]](words);
    } else if (words.length == 4) {
        if (words[0] === "Cut" && words[1] === "Out") {
            var code = capitalShapeNames[words[3]]+capitalColorNames[words[2]];
            return "--"+code+code+code;
        }
        return twoWordLen4[words[0]+words[1]](words);
    } else if (words.length == 5 && words[1] === "2-1-1") {
        if (words[0] === "Cornered")
            return words[2]+words[3]+words[2]+words[4];
        if (words[0] === "Adjacent")
            return words[2]+words[3]+words[4]+words[2];
    } else {
        const shap = capitalShapeNames[words[1]];
        var ret = "";
        for (var i = 0; i < 4; i++) {
            if (words[0].charAt(i) == "-")
                ret = ret+"--";
            else
                ret = ret+shap+words[0].charAt(i);
        }
        return ret;
    }
    return "";
}
