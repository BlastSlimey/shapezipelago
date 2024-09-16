import { Mod } from "shapez/mods/mod";
import { aplog, clearEfficiency3Interval, client, connected, customRewards, resetShapesanityCache, setConnected, setGamePackage, setLevelDefs, setProcessedItems, setShapesanityNames, setUpgredeDefs, shapesanity_names, trapLocked, trapMalfunction, trapThrottled } from "./global_data";
import { ITEMS_HANDLING_FLAGS, Client, SERVER_PACKET_TYPE, CLIENT_STATUS } from "archipelago.js";
import { processItemsPacket } from "./server_communication";
import { makeDiv, removeAllChildren } from "shapez/core/utils";
import { BaseHUDPart } from "shapez/game/hud/base_hud_part";
import { DynamicDomAttach } from "shapez/game/hud/dynamic_dom_attach";
import { InputReceiver } from "shapez/core/input_receiver";
import { KeyActionMapper, KEYMAPPINGS } from "shapez/game/key_action_mapper";

var scouted = [true, true, false];
var examples = [];

/**
 * @param {Mod} modImpl
 * @param {Client} client
 * @param {string} autoPlayer
 * @param {string} autoAddress
 * @param {string} autoPort
 * @param {string} autoPassword
 */
export function addInputContainer(modImpl, client, autoPlayer, autoAddress, autoPort, autoPassword) {
    modImpl.signals.stateEntered.add(state => {
        if (state.key === "MainMenuState") {
            // reset custom global data
            setProcessedItems(0);
            for (var [key, valNum] of Object.entries(customRewards)) {
                customRewards[key] = 0;
            }
            for (var [key, valBool] of Object.entries(trapLocked)) {
                trapLocked[key] = false;
            }
            for (var [key, valBool] of Object.entries(trapThrottled)) {
                trapThrottled[key] = false;
            }
            for (var [key, valBool] of Object.entries(trapMalfunction)) {
                trapMalfunction[key] = false;
            }
            setLevelDefs(null);
            setUpgredeDefs(null);
            resetShapesanityCache();
            clearEfficiency3Interval();
            if (connected) {
                client.removeListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, processItemsPacket);
                client.updateStatus(CLIENT_STATUS.CONNECTED);
            }
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
            statusLabel.innerText = connected ? "Connected" : "Not Connected";
            statusButton.innerText = connected ? "Disconnect" : "Connect";
            statusButton.classList.add("styledButton", "statusButton");
            statusButton.addEventListener("click", () => {
                if (!connected) {
                    var connectInfo = {
                        hostname: addressInput.value,
                        port: portInput.valueAsNumber, 
                        game: "shapez", 
                        name: playerInput.value,
                        items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL,
                        password: passwordInput.value
                    };
                    client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, (packet, message) => {
                        aplog(message);
                    });
                    client.connect(connectInfo)
                        .then(() => {
                            aplog("Connected to the server");
                            setConnected(true);
                            setGamePackage(client.data.package.get("shapez"));
                            statusLabel.innerText = "Connected";
                            statusButton.innerText = "Disconnect";
                        })
                        .catch((error) => {
                            aplog("Failed to connect: " + error);
                            statusLabel.innerText = "Connection failed";
                        });
                } else {
                    client.disconnect();
                    aplog("Disconnected from the server");
                    setConnected(false);
                    statusLabel.innerText = "Disconnected";
                    statusButton.innerText = "Connect";
                }
            });
            statusContainer.appendChild(statusLabel);
            statusContainer.appendChild(statusButton);
        }
    });
    modImpl.modInterface.registerHudElement("ingame_HUD_Shapesanity", HUDShapesanity);
    modImpl.signals.gameStarted.add((/** @type {import("shapez/game/root").GameRoot} */ root) => {
        if (connected) {
            const shapesanity_slotData = client.data.slotData["shapesanity"];
            setShapesanityNames(shapesanity_slotData ? shapesanity_slotData.valueOf() : []);
            examples = [];
            for (var name of shapesanity_names) {
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

    /**
     * @param {Array<String>} [shapesanityNames]
     */
    rerenderFull(shapesanityNames) {
        removeAllChildren(this.contentDiv);
        if (this.visible) {
            for (var index = 0; index < shapesanityNames.length; index++) {
                var divElem = makeDiv(this.contentDiv, null, ["shapesanityRow"]);
                var nextName = document.createElement("span");
                nextName.classList.add("shapesanityName");
                nextName.innerText = `${index+1}: ${shapesanityNames[index]}`;
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
        this.rerenderFull(shapesanity_names);
    }

    scout() {
        scouted = new Array(shapesanity_names.length).fill(false);
        for (var checked of client.locations.checked) {
            var name = client.locations.name(client.data.slot, checked).split(" ");
            if (name[0] === "Shapesanity") {
                var index = Number(name[1]);
                if (!Number.isNaN(index)) {
                    scouted[index-1] = true;
                }
            }
        }
    }

    show() {
        this.visible = true;
        this.root.app.inputMgr.makeSureAttachedAndOnTop(this.inputReciever);
        if (connected) this.scout();
        this.update();
        this.rerenderFull(shapesanity_names);
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
