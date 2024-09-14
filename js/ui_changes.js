import { Mod } from "shapez/mods/mod";
import { aplog, clearEfficiency3Interval, client, connected, customRewards, resetShapesanityCache, setConnected, setGamePackage, setLevelDefs, setProcessedItems, setShapesanityNames, setUpgredeDefs, shapesanity_names, trapLocked, trapMalfunction, trapThrottled } from "./global_data";
import { ITEMS_HANDLING_FLAGS, Client, SERVER_PACKET_TYPE, CLIENT_STATUS, CREATE_AS_HINT_MODE } from "archipelago.js";
import { processItemsPacket } from "./server_communication";
import { makeDiv, removeAllChildren } from "shapez/core/utils";
import { BaseHUDPart } from "shapez/game/hud/base_hud_part";
import { DynamicDomAttach } from "shapez/game/hud/dynamic_dom_attach";
import { InputReceiver } from "shapez/core/input_receiver";
import { KeyActionMapper, KEYMAPPINGS } from "shapez/game/key_action_mapper";

var scouted = [true, true, false];

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
        for (var index = 0; index < shapesanityNames.length; index++) {
            var nextName = document.createElement("span");
            nextName.classList.add("shapesanityRow");
            nextName.innerText = `${index+1}: ${shapesanityNames[index]}`;
            if (this.visible && (index < scouted.length ? scouted[index] : false)) {
                nextName.style.backgroundColor = "#325259";
            }
            this.contentDiv.appendChild(nextName);
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
    }

    close() {
        this.visible = false;
        this.root.app.inputMgr.makeSureDetached(this.inputReciever);
        this.update();
    }

    update() {
        this.domAttach.update(this.visible);
        if (this.visible) {
            if (this.root.time.now() - this.lastFullRerender > 1) {
                this.lastFullRerender = this.root.time.now();
                this.rerenderFull(shapesanity_names);
            }
        }
    }
    
    isBlockingOverlay() {
        return this.visible;
    }
    
}

/**
 * @param {String} name
 */
function shapesanityExample(name) {
    var words = name.split(" ");
    // TODO
}
