import { achievementNames, apdebuglog, aptry, Connection, connection, currentIngame, modImpl } from "./global_data";
import { CLIENT_STATUS, ITEMS_HANDLING_FLAGS } from "archipelago.js";
import { processItemsPacket } from "./server_communication";
import { makeButton, makeDiv, removeAllChildren } from "shapez/core/utils";
import { BaseHUDPart } from "shapez/game/hud/base_hud_part";
import { DynamicDomAttach } from "shapez/game/hud/dynamic_dom_attach";
import { InputReceiver } from "shapez/core/input_receiver";
import { KeyActionMapper, KEYMAPPINGS } from "shapez/game/key_action_mapper";
import { ClickDetector } from "shapez/core/click_detector";

export function addInputContainer() {
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
            playerLabel.innerText = shapez.T.mods.shapezipelago.inputBox.player;
            playerInput.type = "text";
            playerInput.className = "playerInput";
            playerInput.value = modImpl.settings.player;
            playerContainer.appendChild(playerLabel);
            playerContainer.appendChild(playerInput);
            const addressLabel = document.createElement("h4");
            const addressInput = document.createElement("input");
            addressLabel.innerText = shapez.T.mods.shapezipelago.inputBox.address;
            addressInput.type = "text";
            addressInput.className = "addressInput";
            addressInput.value = modImpl.settings.address;
            addressContainer.appendChild(addressLabel);
            addressContainer.appendChild(addressInput);
            const portLabel = document.createElement("h4");
            const portInput = document.createElement("input");
            portLabel.innerText = shapez.T.mods.shapezipelago.inputBox.port;
            portInput.type = "number";
            portInput.value = modImpl.settings.port;
            portContainer.appendChild(portLabel);
            portContainer.appendChild(portInput);
            const passwordLabel = document.createElement("h4");
            const passwordInput = document.createElement("input");
            passwordLabel.innerText = shapez.T.mods.shapezipelago.inputBox.password;
            passwordInput.type = "password";
            passwordInput.value = modImpl.settings.password;
            passwordContainer.appendChild(passwordLabel);
            passwordContainer.appendChild(passwordInput);
            const statusLabel = document.createElement("h4");
            const statusButton = document.createElement("button");
            statusLabel.innerText = shapez.T.mods.shapezipelago.inputBox.notConnected;
            statusButton.innerText = shapez.T.mods.shapezipelago.inputBox.connect;
            statusButton.classList.add("styledButton", "statusButton");
            statusButton.addEventListener("click", () => {
                aptry("Connect click failed", () => {
                    if (!connection) {
                        modImpl.settings.player = playerInput.value;
                        modImpl.settings.address = addressInput.value;
                        modImpl.settings.port = portInput.valueAsNumber;
                        modImpl.settings.password = passwordInput.value;
                        modImpl.saveSettings();
                        var connectInfo = {
                            hostname: addressInput.value,
                            port: portInput.valueAsNumber, 
                            game: "shapez", 
                            name: playerInput.value,
                            items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL,
                            password: passwordInput.value
                        };
                        new Connection().tryConnect(connectInfo, processItemsPacket).finally(function () {
                            if (connection) {
                                statusLabel.innerText = shapez.T.mods.shapezipelago.inputBox.connected;
                                statusButton.innerText = shapez.T.mods.shapezipelago.inputBox.disconnect;
                            } else {
                                statusLabel.innerText = shapez.T.mods.shapezipelago.inputBox.failed;
                            }
                        });
                    } else {
                        connection.disconnect();
                        statusLabel.innerText = shapez.T.mods.shapezipelago.inputBox.disconnected;
                        statusButton.innerText = shapez.T.mods.shapezipelago.inputBox.connect;
                    }
                });
            });
            statusContainer.appendChild(statusLabel);
            statusContainer.appendChild(statusButton);
        }
    });
}

export function addShapesanityBox() {
    apdebuglog("Calling addShapesanityBox");
    modImpl.modInterface.registerHudElement("ingame_HUD_Shapesanity", HUDShapesanity);
    modImpl.signals.gameStarted.add((root) => {
        if (connection) {
            aptry("Shapesanity button creation failed", () => {
                apdebuglog("Creating shapesanity button");
                let game_menu = currentIngame.root.hud.parts["gameMenu"];
                const shapesanityButton = document.createElement("button");
                shapesanityButton.classList.add("shapesanityButton");
                game_menu.element.prepend(shapesanityButton);
                game_menu.trackClicks(shapesanityButton, () => currentIngame.root.hud.parts["ingame_HUD_Shapesanity"].show());
                /*shapesanityButton.addEventListener("mousedown", () => {
                    shapesanityButton.classList.add("pressed");
                });
                shapesanityButton.addEventListener("mouseout", () => {
                    shapesanityButton.classList.remove("pressed");
                });
                shapesanityButton.addEventListener("mouseup", () => {
                    shapesanityButton.classList.remove("pressed");
                    root.hud.parts["ingame_HUD_Shapesanity"].show();
                });*/
            });
            connection.reportStatusToServer(CLIENT_STATUS.PLAYING);
            currentIngame.scoutedShapesanity = new Array(connection.shapesanityNames.length).fill(false);
            for (let name of connection.shapesanityNames) {
                let hash = shapesanityExample(name);
                currentIngame.shapesanityExamplesHash.push(hash);
                currentIngame.shapesanityExamples.push(root.shapeDefinitionMgr.getShapeFromShortKey(hash).generateAsCanvas(50));
            }
        }
    });
}

class HUDShapesanity extends BaseHUDPart {

    createElements(parent) {
        this.background = makeDiv(parent, "ingame_HUD_Shapesanity", ["ingameDialog"]);

        this.dialogInner = makeDiv(this.background, null, ["dialogInner"]);
        this.title = makeDiv(this.dialogInner, null, ["title"], shapez.T.mods.shapezipelago.APBox.title);
        this.closeButton = makeDiv(this.title, null, ["closeButton"]);
        this.trackClicks(this.closeButton, this.close);

        this.tabs = makeDiv(this.dialogInner, null, ["tabs"]);
        this.tabButtonShapesanity = makeButton(this.tabs, ["tabsButtonShapesanity"], shapez.T.mods.shapezipelago.shapesanityBox.title);
        this.trackClicks(this.tabButtonShapesanity, this.setTabShapesanity);
        this.tabButtonSlotDetails = makeButton(this.tabs, ["tabButtonSlotDetails"], shapez.T.mods.shapezipelago.slotDetailsBox.title);
        this.trackClicks(this.tabButtonSlotDetails, this.setTabSlotDetails);
        this.tabButtonAchievements = makeButton(this.tabs, ["tabButtonAchievements"], shapez.T.mods.shapezipelago.achievementsBox.title);
        this.trackClicks(this.tabButtonAchievements, this.setTabAchievements);
        this.tabButtonTimeTrials = makeButton(this.tabs, ["tabButtonTimeTrials"], shapez.T.mods.shapezipelago.timeTrialsBox.title);
        this.trackClicks(this.tabButtonTimeTrials, this.setTabTimeTrials);
        this.tabButtonGiftShop = makeButton(this.tabs, ["tabButtonGiftShop"], shapez.T.mods.shapezipelago.giftShopBox.title);
        this.trackClicks(this.tabButtonGiftShop, this.setTabGiftShop);

        this.contentDiv = makeDiv(this.dialogInner, null, ["content"]);
        this.visible = false;

    }

    setTabShapesanity() {
        aptry("Showing gift shop failed", () => {
            apdebuglog("Showing shapesanity checklist");
            removeAllChildren(this.contentDiv);
            this.dialogInner.setAttribute("currentTab", "shapesanity");
            if (this.visible) {
                let currentGoalShape = this.root.hubGoals.currentGoal.definition.getHash();
                for (let index = 0; index < connection.shapesanityNames.length; index++) {
                    // Create div for every row
                    const divElem = makeDiv(this.contentDiv, null, ["shapesanityRow"]);
                    // Create name and translate it
                    const nextName = document.createElement("span");
                    nextName.classList.add("shapesanityName");
                    nextName.innerText = `${index+1}: ${translateShapesanity(connection.shapesanityNames[index])}`;
                    // Mark already checked rows
                    if (currentIngame.scoutedShapesanity[index]) {
                        divElem.classList.add("locationChecked");
                    }
                    // Append everything to div
                    divElem.appendChild(nextName);
                    divElem.appendChild(currentIngame.shapesanityExamples[index]);
                    // Create pin button 
                    const pinButton = makeButton(divElem, ["pin"]);
                    pinButton.classList.remove("styledButton");
                    // Determine appearence and behavior of pin button
                    if (currentIngame.shapesanityExamplesHash[index] === currentGoalShape) 
                        pinButton.classList.add("isGoal");
                    else if (this.root.hud.parts["pinnedShapes"].isShapePinned(currentIngame.shapesanityExamplesHash[index]))
                        pinButton.classList.add("alreadyPinned");
                    // Add listener to pin button
                    const shapedef = this.root.shapeDefinitionMgr.getShapeFromShortKey(currentIngame.shapesanityExamplesHash[index]);
                    new ClickDetector(pinButton, {consumeEvents: true, preventDefault: true}).click.add(() => {
                        if (this.root.hud.parts["pinnedShapes"].isShapePinned(currentIngame.shapesanityExamplesHash[index])) {
                            this.root.hud.signals.shapeUnpinRequested.dispatch(currentIngame.shapesanityExamplesHash[index]);
                            pinButton.classList.add("unpinned");
                            pinButton.classList.remove("pinned", "alreadyPinned");
                        } else {
                            this.root.hud.signals.shapePinRequested.dispatch(shapedef);
                            pinButton.classList.add("pinned");
                            pinButton.classList.remove("unpinned");
                        }
                    });
                    // Create shape details button and add button listener
                    const detailsButton = makeButton(divElem, ["showInfo"]);
                    detailsButton.classList.remove("styledButton");
                    new ClickDetector(detailsButton, {consumeEvents: true, preventDefault: true}).click.add(() => {
                        this.root.hud.signals.viewShapeDetailsRequested.dispatch(shapedef);
                    });
                }
            }
        });
    }

    setTabSlotDetails() {
        aptry("Showing slot details failed", () => {
            apdebuglog("Showing slot details");
            removeAllChildren(this.contentDiv);
            this.dialogInner.setAttribute("currentTab", "slotDetails");
            if (this.visible) {
                let detailsElem = document.createElement("span");
                detailsElem.innerHTML = shapez.T.mods.shapezipelago.slotDetailsBox.goal + ": " + connection.goal 
                + "<br />" + shapez.T.mods.shapezipelago.slotDetailsBox.levelAmount + ": " + connection.levelsToGenerate.toString() 
                + "<br />" + shapez.T.mods.shapezipelago.slotDetailsBox.upgradeAmount + ": " + connection.tiersToGenerate.toString() 
                + "<br />" + shapez.T.mods.shapezipelago.slotDetailsBox.levelLogic + ": " 
                + (connection.israndomizedLevels ? connection.levelsLogic : shapez.T.mods.shapezipelago.slotDetailsBox.notRandomized)
                + "<br />" + shapez.T.mods.shapezipelago.slotDetailsBox.upgradeLogic + ": " 
                + (connection.isRandomizedUpgrades ? connection.upgradesLogic : shapez.T.mods.shapezipelago.slotDetailsBox.notRandomized)
                + "<br />" + shapez.T.mods.shapezipelago.slotDetailsBox.seed + ": " + connection.clientSeed.toString() 
                + "<br />" + shapez.T.mods.shapezipelago.slotDetailsBox.floatingLayers + ": " + connection.isFloatingLayersAllowed 
                + "<br />" + shapez.T.mods.shapezipelago.slotDetailsBox.shop + ": " + shapez.T.mods.shapezipelago.slotDetailsBox.shopNone;
                this.contentDiv.appendChild(detailsElem);
                let clearCanvasButton = makeButton(this.contentDiv, [], shapez.T.mods.shapezipelago.slotDetailsBox.clearCanvasButton);
                clearCanvasButton.addEventListener("click", () => {
                    currentIngame.root.logic.clearAllBeltsAndItems();
                });
            }
        });
    }

    setTabAchievements() {
        aptry("Showing achievement checklist failed", () => {
            apdebuglog("Showing achievements checklist");
            removeAllChildren(this.contentDiv);
            this.dialogInner.setAttribute("currentTab", "achievements");
            if (this.visible) {
                if (this.achievementsIncluded) {
                    for (let achievementId in achievementNames) {
                        let availability = 0, id = connection.gamepackage.location_name_to_id[achievementNames[achievementId]];
                        if (connection.client.locations.missing.includes(id)) availability = 1;
                        if (connection.client.locations.checked.includes(id)) availability = 2;
                        if (availability) {
                            const divElem = makeDiv(this.contentDiv, null, ["shapesanityRow"]);
                            const nextName = document.createElement("span");
                            nextName.classList.add("achievementName");
                            nextName.innerText = achievementNames[achievementId];
                            if (availability == 2) {
                                divElem.classList.add("locationChecked");
                            }
                            divElem.appendChild(nextName);
                        }
                    }
                } else {
                    let placeholder = document.createElement("span", {});
                    placeholder.innerText = shapez.T.mods.shapezipelago.achievementsBox.disabled;
                    this.contentDiv.appendChild(placeholder);
                }
            }
        });
    }

    setTabTimeTrials() {
        aptry("Showing time trials failed", () => {
            apdebuglog("Showing time trials overview");
            removeAllChildren(this.contentDiv);
            this.dialogInner.setAttribute("currentTab", "timeTrials");
            if (this.visible) {
                let placeholder = document.createElement("span", {});
                placeholder.classList.add("comingSoonPlaceholder");
                placeholder.innerText = "Coming Soon™";
                this.contentDiv.appendChild(placeholder);
            }
        });
    }

    setTabGiftShop() {
        aptry("Showing gift shop failed", () => {
            apdebuglog("Showing gift shop overview");
            removeAllChildren(this.contentDiv);
            this.dialogInner.setAttribute("currentTab", "giftShop");
            if (this.visible) {
                let placeholder = document.createElement("span", {});
                placeholder.classList.add("comingSoonPlaceholder");
                placeholder.innerText = "Coming Soon™";
                this.contentDiv.appendChild(placeholder);
            }
        });
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
    }

    scout() {
        for (let checked of connection.getCheckedLocationNames()) {
            if (checked.startsWith("Shapesanity")) {
                currentIngame.scoutedShapesanity[Number(checked.split(" ")[1])-1] = true;
            }
        }
    }

    show() {
        aptry("AP hud failed", () => {
            apdebuglog("Showing AP hud");
            this.visible = true;
            this.root.app.inputMgr.makeSureAttachedAndOnTop(this.inputReciever);
            if (connection) this.scout();
            this.update();
            this.setTabShapesanity();
            const exampleId = connection.gamepackage.location_name_to_id[achievementNames.cutShape];
            this.achievementsIncluded = (
                connection.client.locations.missing.includes(exampleId) || 
                connection.client.locations.checked.includes(exampleId)
            );
        });
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

/**
 * @param {string} name
 */
function translateShapesanity(name) {
    if (currentIngame.translated[name])
        return currentIngame.translated[name];
    var words = name.split(" ");
    if (words.length == 2) { // simple full, 1-4
        if (capitalColorNames[words[0]]) {
            if (capitalShapeNames[words[1]]) {
                var ret = shapez.T.mods.shapezipelago.shapesanityBox.byNoun[words[0]][words[1]]
                    .replace("<shape>", shapez.T.mods.shapezipelago.shapesanityBox.shape[words[1]]);
                currentIngame.translated[name] = ret.charAt(0).toUpperCase() + ret.slice(1);
            } else {
                currentIngame.translated[name] = shapez.T.mods.shapezipelago.shapesanityBox["1Color4Shapes"][words[0]].replace("<code>", words[1]);
            }
        } else {
            currentIngame.translated[name] = shapez.T.mods.shapezipelago.shapesanityBox["4Colors1Shape"][words[1]].replace("<code>", words[0]);
        }
    } else if (words.length == 3) { // half, piece, cornered simple, 3-1, half-half, checkered
        if (words[0] === "Half") {
            currentIngame.translated[name] = shapez.T.mods.shapezipelago.shapesanityBox.byNoun.Half[words[2]]
                .replace("<comb>", shapez.T.mods.shapezipelago.shapesanityBox.byNoun[words[1]][words[2]]
                    .replace("<shape>", shapez.T.mods.shapezipelago.shapesanityBox.shape[words[2]]));
        } else if (words[2] === "Piece") {
            var ret = shapez.T.mods.shapezipelago.shapesanityBox.Piece[words[1]]
                .replace("<comb>", shapez.T.mods.shapezipelago.shapesanityBox.byNoun[words[0]].Piece
                    .replace("<shape>", shapez.T.mods.shapezipelago.shapesanityBox.shape[words[1]]));
            currentIngame.translated[name] = ret.charAt(0).toUpperCase() + ret.slice(1);
        } else if (words[0] === "Cornered") {
            currentIngame.translated[name] = shapez.T.mods.shapezipelago.shapesanityBox.byNoun.Cornered[words[2]]
                .replace("<comb>", shapez.T.mods.shapezipelago.shapesanityBox.byNoun[words[1]][words[2]]
                    .replace("<shape>", shapez.T.mods.shapezipelago.shapesanityBox.shape[words[2]]));
        } else if (words[0] === "3-1") {
            currentIngame.translated[name] = shapez.T.mods.shapezipelago.shapesanityBox.shortKeys["3-1"]
                .replace("<codes>", `${words[1]} ${words[2]}`);
        } else if (words[0] === "Half-Half") {
            currentIngame.translated[name] = shapez.T.mods.shapezipelago.shapesanityBox.shortKeys["Half-Half"]
                .replace("<codes>", `${words[1]} ${words[2]}`);
        } else { // if (words[0] === "Checkered")
            currentIngame.translated[name] = shapez.T.mods.shapezipelago.shapesanityBox.shortKeys["Checkered"]
                .replace("<codes>", `${words[1]} ${words[2]}`);
        }
    } else if (words.length == 4) { // Cut Out, 2-sided singles and 2-1, 3-part singles
        if (words[0] === "Cut") {
            currentIngame.translated[name] = shapez.T.mods.shapezipelago.shapesanityBox.byNoun.CutOut[words[3]]
                .replace("<comb>", shapez.T.mods.shapezipelago.shapesanityBox.byNoun[words[2]][words[3]]
                    .replace("<shape>", shapez.T.mods.shapezipelago.shapesanityBox.shape[words[3]]));
        } else if (words[0] === "Singles") {
            currentIngame.translated[name] = shapez.T.mods.shapezipelago.shapesanityBox.shortKeys["Singles"]
                .replace("<codes>", `${words[1]} ${words[2]} ${words[3]}`);
        } else { // 2-sided singles and 2-1
            currentIngame.translated[name] = shapez.T.mods.shapezipelago.shapesanityBox.shortKeys[words[0]+words[1]]
                .replace("<codes>", `${words[2]} ${words[3]}`);
        }
    } else { // (words.length == 5): 3-part 2-1-1, 4-part
        if (words[0] === "Singles") {
            currentIngame.translated[name] = shapez.T.mods.shapezipelago.shapesanityBox.shortKeys["Singles"]
                .replace("<codes>", `${words[1]} ${words[2]} ${words[3]} ${words[4]}`);
        } else { // 3-part 2-1-1
            currentIngame.translated[name] = shapez.T.mods.shapezipelago.shapesanityBox.shortKeys[words[0]+words[1]]
                .replace("<codes>", `${words[2]} ${words[3]} ${words[4]}`);
        }
    }
    return currentIngame.translated[name];
}

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
