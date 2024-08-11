import { Mod } from "shapez/mods/mod";
import { Client, ITEMS_HANDLING_FLAGS, SERVER_PACKET_TYPE, CLIENT_STATUS } from "archipelago.js";
import { GameMode } from "shapez/game/game_mode";
import { APGameMode } from "./ap_game_mode";
import { gGameModeRegistry } from "shapez/core/global_registries";
import { setShapesanityHubGoal, shapesanityAnalyser } from "./shapesanity";
import { enumAnalyticsDataSource } from "shapez/game/production_analytics";
import { defaultBuildingVariant } from "shapez/game/meta_building";
import { enumPainterVariants } from "shapez/game/buildings/painter";
import { RandomNumberGenerator } from "shapez/core/rng";
import { hardcoreUpgradeShapes, linearUpgradeShapes, randomizedHardcoreShapes, randomizedStretchedShapes, randomizedVanillaStepsShapes, vanillaLikeUpgradeShapes, vanillaShapes, vanillaUpgradeShapes } from "./requirement_definitions";

var loadedOnce = false;
const client = new Client();
var connected = false;
var last_processed_item_index = -1;
var gamePackage = null;
var rootSaved = null;
const achievements = new Map();
const achievementNames = {
    "belt500Tiles": "I need trains",
    "blueprint100k": "It's piling up",
    "blueprint1m": "I'll use it later",
    "completeLvl26": "Freedom",
    "cutShape": "Cutter",
    "destroy1000": "Perfectionist",
    "irrelevantShape": "Oops",
    "level100": "Is this the end?",
    "level50": "Can't stop",
    "logoBefore18": "A bit early?",
    "mam": "MAM (Make Anything Machine)",
    "mapMarkers15": "GPS",
    "noBeltUpgradesUntilBp": "It's so slow",
    "noInverseRotater": "King of Inefficiency",
    "oldLevel17": "Memories from the past",
    "openWires": "The next dimension",
    "paintShape": "Painter",
    "place5000Wires": "Computer Guy",
    "placeBlueprint": "Now it's easy",
    "placeBp1000": "Copy-Pasta",
    "play1h": "Getting into it",
    "play10h": "It's been a long time",
    "play20h": "Addicted",
    "produceLogo": "The logo!",
    "produceMsLogo": "I've seen that before ...",
    "produceRocket": "To the moon",
    "rotateShape": "Rotater",
    "speedrunBp30": "Speedrun Master",
    "speedrunBp60": "Speedrun Novice",
    "speedrunBp120": "Not an idle game",
    "stack4Layers": "Stack overflow",
    "stackShape": "Wait, they stack?",
    "store100Unique": "It's a mess",
    "storeShape": "Storage",
    "throughputBp25": "Efficiency 1",
    "throughputBp50": "Efficiency 2",
    "throughputLogo25": "Branding specialist 1",
    "throughputLogo50": "Branding specialist 2",
    "throughputRocket10": "Preparing to launch",
    "throughputRocket20": "SpaceY",
    "trash1000": "Get rid of them",
    "unlockWires": "Wires",
    "upgradesTier5": "Faster",
    "upgradesTier8": "Even faster"
};
const receiveItemFunctions = {
    "Cutter": (root) => {root.hubGoals.gainedRewards["reward_only_cutter"] = 1},
    "Rotator": (root) => {root.hubGoals.gainedRewards["reward_rotater"] = 1},
    "Painter": (root) => {root.hubGoals.gainedRewards["reward_painter"] = 1},
    "Rotator (CCW)": (root) => {root.hubGoals.gainedRewards["reward_rotater_ccw"] = 1},
    "Color Mixer": (root) => {root.hubGoals.gainedRewards["reward_mixer"] = 1},
    "Stacker": (root) => {root.hubGoals.gainedRewards["reward_stacker"] = 1},
    "Quad Cutter": (root) => {root.hubGoals.gainedRewards["reward_cutter_quad"] = 1},
    "Double Painter": (root) => {root.hubGoals.gainedRewards["reward_painter_double"] = 1},
    "Rotator (180°)": (root) => {root.hubGoals.gainedRewards["reward_rotater_180"] = 1},
    "Quad Painter": (root) => {root.hubGoals.gainedRewards["reward_only_painter_quad"] = 1},
    "Balancer": (root) => {root.hubGoals.gainedRewards["reward_balancer"] = 1},
    "Tunnel": (root) => {root.hubGoals.gainedRewards["reward_tunnel"] = 1},
    "Compact Merger": (root) => {root.hubGoals.gainedRewards["reward_merger"] = 1},
    "Tunnel Tier II": (root) => {root.hubGoals.gainedRewards["reward_underground_belt_tier_2"] = 1},
    "Compact Splitter": (root) => {root.hubGoals.gainedRewards["reward_splitter"] = 1},
    "Trash": (root) => {root.hubGoals.gainedRewards["reward_only_trash"] = 1},
    "Chaining Extractor": (root) => {root.hubGoals.gainedRewards["reward_miner_chainable"] = 1},
    "Belt Reader": (root) => {root.hubGoals.gainedRewards["reward_belt_reader"] = 1},
    "Storage": (root) => {root.hubGoals.gainedRewards["reward_storage"] = 1},
    "Item Filter": (root) => {root.hubGoals.gainedRewards["reward_filter"] = 1},
    "Display": (root) => {root.hubGoals.gainedRewards["reward_display"] = 1},
    "Wires": (root) => {root.hubGoals.gainedRewards["reward_only_wires"] = 1},
    "Constant Signal": (root) => {root.hubGoals.gainedRewards["reward_constant_signal"] = 1},
    "Logic Gates": (root) => {root.hubGoals.gainedRewards["reward_logic_gates"] = 1},
    "Virtual Processing": (root) => {root.hubGoals.gainedRewards["reward_virtual_processing"] = 1},
    "Blueprints": (root) => {root.hubGoals.gainedRewards["reward_blueprints"] = 1},
    "Big Routing Upgrade": (root) => {root.hubGoals.upgradeImprovements["belt"] += 1},
    "Big Extraction Upgrade": (root) => {root.hubGoals.upgradeImprovements["miner"] += 1},
    "Big Shape Processing Upgrade": (root) => {root.hubGoals.upgradeImprovements["processors"] += 1},
    "Big Color Processing Upgrade": (root) => {root.hubGoals.upgradeImprovements["painting"] += 1},
    "Small Routing Upgrade": (root) => {root.hubGoals.upgradeImprovements["belt"] += 1},
    "Small Extraction Upgrade": (root) => {root.hubGoals.upgradeImprovements["miner"] += 1},
    "Small Shape Processing Upgrade": (root) => {root.hubGoals.upgradeImprovements["processors"] += 1},
    "Small Color Processing Upgrade": (root) => {root.hubGoals.upgradeImprovements["painting"] += 1},
    "Blueprint Shapes Bundle": (root) => {root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] = (root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] || 0) + 1000},
    "Inventory Draining Trap": (root) => {
        var storedBlueprint = root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] || 0;
        root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] = storedBlueprint / 2;
    }
};
var customRewards = {
    reward_cutter: false,
    reward_trash: false,
    reward_wires: false,
    reward_painter_quad: false
};

class ModImpl extends Mod {

    init() {
        gGameModeRegistry.register(APGameMode);
        this.addInputContainer(this);
        client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, (packet, message) => {
            console.log("[Archipelago] ", message);
        });
        this.signals.gameSerialized.add((root, data) => {
            if (connected) {
                data.modExtraData["last_processed_item_index"] = last_processed_item_index;
                data.modExtraData["reward_cutter"] = customRewards.reward_cutter;
                data.modExtraData["reward_trash"] = customRewards.reward_trash;
                data.modExtraData["reward_wires"] = customRewards.reward_wires;
                data.modExtraData["reward_painter_quad"] = customRewards.reward_painter_quad;
            }
        });
        this.signals.gameDeserialized.add((root, data) => {
            if (connected) {
                rootSaved = root;
                customRewards.reward_cutter = data.modExtraData["reward_cutter"];
                customRewards.reward_trash = data.modExtraData["reward_trash"];
                customRewards.reward_wires = data.modExtraData["reward_wires"];
                customRewards.reward_painter_quad = data.modExtraData["reward_painter_quad"];
                gamePackage = client.data.package.get("shapez");
                root.gameMode = GameMode.create(root, "apMode", APGameMode).setDefinitions(
                    this.calcLevelDefinitions(), this.calcUpgradeDefinitions()
                );
                this.rewriteLocations(root);
                this.rewriteBuildings();
                last_processed_item_index = data.modExtraData["last_processed_item_index"];
                this.processReceivedItems();
                client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, (packet) => {
                    this.processItemsPacket(packet);
                });
            }
        });
    }

    calcLevelDefinitions() {
        var multiplier = client.data.slotData["required_shapes_multiplier"].valueOf();
        var isRandomized = client.data.slotData["randomize_level_requirements"].valueOf();
        if (isRandomized) {
            var seed = client.data.slotData["seed"].valueOf();
            const randomizer = new RandomNumberGenerator(Number(seed));
            var maxlevel = 25;
            if (client.data.slotData["goal"].valueOf() == 1) {
                maxlevel = Number(client.data.slotData["maxlevel"].valueOf());
            }
            var logic = Number(client.data.slotData["randomize_level_logic"].valueOf());
            var building1 = client.data.slotData["Level building 1"].valueOf(); //immer
            var building2 = client.data.slotData["Level building 2"].valueOf(); //immer
            var building3 = client.data.slotData["Level building 3"].valueOf(); //immer
            var building4 = client.data.slotData["Level building 4"].valueOf(); //immer
            var building5 = client.data.slotData["Level building 5"].valueOf(); //immer
            if (logic < 2) {
                return randomizedVanillaStepsShapes(randomizer, maxlevel, multiplier, building1, building2, building3, building4, building5);
            } else if (logic == 4) {
                return randomizedStretchedShapes(randomizer, maxlevel, multiplier, building1, building2, building3, building4, building5);
            } else {
                return randomizedHardcoreShapes(randomizer, maxlevel);
            }
        } else {
            return vanillaShapes(multiplier);
        }
    }

    calcUpgradeDefinitions() {
        var multiplier = client.data.slotData["required_shapes_multiplier"].valueOf();
        var isRandomized = client.data.slotData["randomize_upgrade_requirements"].valueOf();
        if (isRandomized) {
            var seed = client.data.slotData["seed"].valueOf();
            const randomizer = new RandomNumberGenerator(Number(seed));
            var finaltier = 8;
            if (client.data.slotData["goal"].valueOf() == 2) {
                finaltier = Number(client.data.slotData["finaltier"].valueOf());
            }
            var samelate = client.data.slotData["same_late_upgrade_requirements"].valueOf();
            var logic = Number(client.data.slotData["randomize_upgrade_logic"].valueOf());
            var building1 = client.data.slotData["Upgrade building 1"].valueOf(); //immer
            var building2 = client.data.slotData["Upgrade building 2"].valueOf(); //immer
            var building3 = client.data.slotData["Upgrade building 3"].valueOf(); //immer
            var building4 = client.data.slotData["Upgrade building 4"].valueOf(); //immer
            var building5 = client.data.slotData["Upgrade building 5"].valueOf(); //immer
            if (logic == 0) {
                return vanillaLikeUpgradeShapes(multiplier, randomizer, finaltier, samelate, building1, building2, building3, building4, building5);
            } else if (logic == 1) {
                return linearUpgradeShapes(multiplier, randomizer, finaltier, samelate, building1, building2, building3, building4, building5);
            } else {
                return hardcoreUpgradeShapes(multiplier, randomizer, finaltier, samelate);
            }
        } else {
            return vanillaUpgradeShapes(multiplier, finaltier);
        }
    }

    rewriteBuildings() {
        this.modInterface.replaceMethod(shapez.MetaCutterBuilding, "getIsUnlocked", (root) => {
            return customRewards.reward_cutter;
        });
        this.modInterface.replaceMethod(shapez.MetaTrashBuilding, "getIsUnlocked", (root) => {
            return customRewards.reward_trash;
        });
        this.modInterface.replaceMethod(shapez.MetaWireBuilding, "getIsUnlocked", (root) => {
            return customRewards.reward_wires;
        });
        this.modInterface.replaceMethod(shapez.MetaPainterBuilding, "getAvailableVariants", (root) => {
            let variants = [defaultBuildingVariant, enumPainterVariants.mirrored];
            if (root.hubGoals.isRewardUnlocked("reward_painter_double")) {
                variants.push(enumPainterVariants.double);
            }
            if (
                customRewards.reward_painter_quad &&
                root.gameMode.getSupportsWires()
            ) {
                variants.push(enumPainterVariants.quad);
            }
            return variants;
        });
    }

    processReceivedItems() {
        if (client.items.index == 0) {
            console.log("ReceivedItems index is 0");
            last_processed_item_index = -1
            // TODO remove old inventory
            for (var i = 0; i < client.items.received.length; i++) {
                this.receiveItem(client.items.received[i]);
                last_processed_item_index++;
            }
        } else {
            for (var i = 0; i < client.items.received.length; i++) {
                this.receiveItem(client.items.received[i]);
                last_processed_item_index++;
            }
            if (last_processed_item_index + 1 != client.items.index) {
                // TODO something about resyncing
                console.log("Received Items Desync");
            }
        } 
    }

    /**
     * 
     * @param {import("archipelago.js").ReceivedItemsPacket} itemsPacket 
     */
    processItemsPacket(itemsPacket) {
        if (itemsPacket.index == 0) {
            console.log("ReceivedItems index is 0");
            last_processed_item_index = -1
            // TODO remove old inventory
            for (var i = 0; i < itemsPacket.items.length; i++) {
                this.receiveItem(itemsPacket.items[i]);
                last_processed_item_index++;
            }
        } else {
            for (var i = 0; i < itemsPacket.items.length; i++) {
                this.receiveItem(itemsPacket.items[i]);
                last_processed_item_index++;
            }
            if (last_processed_item_index + 1 != itemsPacket.index) {
                // TODO something about resyncing
                console.log("Received Items Desync");
            }
        } 
    }

    /**
     * 
     * @param {import("archipelago.js").NetworkItem} item 
     */
    receiveItem(item) {
        const itemName = client.items.name("shapez", item.item);
        receiveItemFunctions[itemName](rootSaved);
        this.dialogs.showInfo("Item received!", itemName)
    }

    rewriteLocations(root) {
        var goal = client.data.slotData["goal"].valueOf();
        this.modInterface.replaceMethod(shapez.HubGoals, "onGoalCompleted", function() {
            this.root.app.gameAnalytics.handleLevelCompleted(this.level);
            checkLocation("Level " + this.level);
            if (this.level == 1 || this.level == 20) {
                checkLocation("Level " + this.level + " Additional");
            }
            if (goal == 0 || goal == 1) {
                if (client.data.slotData["maxlevel"].valueOf() == this.level - 1) {
                    checkLocation("Goal");
                }
            }
            ++this.level;
            this.computeNextGoal();
            this.root.signals.storyGoalCompleted.dispatch(this.level - 1, "no_reward");
        });
        this.modInterface.replaceMethod(shapez.HubGoals, "tryUnlockUpgrade", function (upgradeId) {
            if (!this.canUnlockUpgrade(upgradeId)) {
                return false;
            }
            const upgradeTiers = this.root.gameMode.getUpgrades()[upgradeId];
            const currentLevel = this.getUpgradeLevel(upgradeId);
            const tierData = upgradeTiers[currentLevel];
            if (!tierData) {
                return false;
            }
            for (let i = 0; i < tierData.required.length; ++i) {
                const requirement = tierData.required[i];
                this.storedShapes[requirement.shape] -= requirement.amount;
            }
            this.upgradeLevels[upgradeId] = (this.upgradeLevels[upgradeId] || 0) + 1;
            const upgradeNames = ["Routing", "Extracting", "Shape Processing", "Color Processing"];
            checkLocation(upgradeNames[upgradeId] + " Upgrade Tier " + roman(currentLevel));
            this.root.signals.upgradePurchased.dispatch(upgradeId);
            this.root.app.gameAnalytics.handleUpgradeUnlocked(upgradeId, currentLevel);
        });
        if (!loadedOnce) {
            this.modInterface.runAfterMethod(shapez.AchievementCollection, "add", function (key, options) {
                achievements.set(key, this.map.get(key));
            });
            this.modInterface.runBeforeMethod(shapez.AchievementCollection, "unlock", function (key, data) {
                const a = achievements.get(key);
                if (a.isValid(data)) {
                    checkLocation(achievementNames[key]);
                }
            });
            setShapesanityHubGoal(root.hubGoals);
            root.signals.shapeDelivered.add(shapesanityAnalyser);
            root.signals.shapeDelivered.add(function (shape) {
                return goal == 3
                && root.productionAnalytics.getCurrentShapeRateRaw(
                    enumAnalyticsDataSource.delivered, root.shapeDefinitionMgr.getShapeFromShortKey("CbCbCbRb:CwCwCwCw")
                ) / 10 >= 500;
            });
            loadedOnce = true;
            root.signals.upgradePurchased.add(function (upgrade) {
                if (goal == 2) {
                    var finaltier = client.data.slotData["finaltier"].valueOf();
                    if (root.hubGoals.getUpgradeLevel("belt") == finaltier 
                    && root.hubGoals.getUpgradeLevel("miner") == finaltier 
                    && root.hubGoals.getUpgradeLevel("processors") == finaltier 
                    && root.hubGoals.getUpgradeLevel("painting") == finaltier) {
                        checkLocation("Goal");
                    }
                }
            });
        }
    }
    
    addInputContainer(modImpl) {
        modImpl.signals.stateEntered.add(state => {
            if (state.key === "MainMenuState") {
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
                playerContainer.appendChild(playerLabel);
                playerContainer.appendChild(playerInput);
                const addressLabel = document.createElement("h4");
                const addressInput = document.createElement("input");
                addressLabel.innerText = "Address";
                addressInput.type = "text";
                addressInput.className = "addressInput";
                addressContainer.appendChild(addressLabel);
                addressContainer.appendChild(addressInput);
                const portLabel = document.createElement("h4");
                const portInput = document.createElement("input");
                portLabel.innerText = "Port";
                portInput.type = "number";
                portContainer.appendChild(portLabel);
                portContainer.appendChild(portInput);
                const passwordLabel = document.createElement("h4");
                const passwordInput = document.createElement("input");
                passwordLabel.innerText = "Password";
                passwordInput.type = "password";
                passwordContainer.appendChild(passwordLabel);
                passwordContainer.appendChild(passwordInput);
                const statusLabel = document.createElement("h4");
                const statusButton = document.createElement("button");
                statusLabel.innerText = "Not Connected";
                statusButton.innerText = "Connect";
                statusButton.classList.add("styledButton", "statusButton");
                statusButton.addEventListener("click", () => {
                    if (!connected) {
                        var connectInfo = {
                            hostname: addressInput.value, // Replace with the actual AP server hostname.
                            port: portInput.valueAsNumber, // Replace with the actual AP server port.
                            game: "shapez", // Replace with the game name for this player.
                            name: playerInput.value, // Replace with the player slot name.
                            items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL,
                            password: passwordInput.value
                        };
                        client.connect(connectInfo)
                            .then(() => {
                                console.log("Connected to the server");
                                connected = true;
                                statusLabel.innerText = "Connected";
                                statusButton.innerText = "Disconnect";
                            })
                            .catch((error) => {
                                console.error("Failed to connect:", error);
                                statusLabel.innerText = "Connection failed";
                            });
                    } else {
                        client.disconnect();
                        console.log("Disconnected from the server");
                        connected = false;
                        statusLabel.innerText = "Disconnected";
                        statusButton.innerText = "Connect";
                    }
                    
                });
                statusContainer.appendChild(statusLabel);
                statusContainer.appendChild(statusButton);
            }
        });
        modImpl.modInterface.registerCss(`
                #state_MainMenuState .inputContainer {
                    display: flex;
                    width: 90%;
                    flex-direction: column;
                    grid-gap: calc(5px*var(--ui-scale));
                    background: #65a4b3;
                    border-radius: calc(6px*var(--ui-scale));
                    justify-content: center;
                    align-items: flex-start;
                    padding: calc(10px * var(--ui-scale));
                    box-shadow: 0 calc(5px * var(--ui-scale)) calc(15px * var(--ui-scale)) rgba(0, 0, 0, 0.2);
                }
                #state_MainMenuState .playerContainer {
                    display: flex;
                    width: 100%;
                    flex-direction: row;
                    grid-gap: calc(5px*var(--ui-scale));
                    background: #65a4b3;
                    align-items: center;
                    justify-content: flex-end;
                }
                #state_MainMenuState .addressContainer {
                    display: flex;
                    width: 100%;
                    flex-direction: row;
                    grid-gap: calc(5px*var(--ui-scale));
                    background: #65a4b3;
                    align-items: center;
                    justify-content: flex-end;
                }
                #state_MainMenuState .portContainer {
                    display: flex;
                    width: 100%;
                    flex-direction: row;
                    grid-gap: calc(5px*var(--ui-scale));
                    background: #65a4b3;
                    align-items: center;
                    justify-content: flex-end;
                }
                #state_MainMenuState .passwordContainer {
                    display: flex;
                    width: 100%;
                    flex-direction: row;
                    grid-gap: calc(5px*var(--ui-scale));
                    background: #65a4b3;
                    align-items: center;
                    justify-content: flex-end;
                }
                #state_MainMenuState .statusContainer {
                    display: flex;
                    width: 100%;
                    flex-direction: row;
                    grid-gap: calc(5px*var(--ui-scale));
                    background: #65a4b3;
                    align-items: center;
                    justify-content: flex-end;
                }
                #state_MainMenuState .playerInput {
                    color: #000;
                    padding: calc(1px * var(--ui-scale)) calc(3px * var(--ui-scale));
                    margin: calc(0px * var(--ui-scale)) calc(0px * var(--ui-scale));
                }
                #state_MainMenuState .addressInput {
                    color: #000;
                    padding: calc(1px * var(--ui-scale)) calc(3px * var(--ui-scale));
                    margin: calc(0px * var(--ui-scale)) calc(0px * var(--ui-scale));
                }
                #state_MainMenuState .portInput {
                    padding: calc(1px * var(--ui-scale)) calc(3px * var(--ui-scale));
                    margin: calc(0px * var(--ui-scale)) calc(0px * var(--ui-scale));
                }
                #state_MainMenuState .passwordInput {
                    padding: calc(1px * var(--ui-scale)) calc(3px * var(--ui-scale));
                    margin: calc(0px * var(--ui-scale)) calc(0px * var(--ui-scale));
                }
                #state_MainMenuState .statusButton {
                    padding: calc(1px * var(--ui-scale)) calc(3px * var(--ui-scale));
                    margin: calc(0px * var(--ui-scale)) calc(0px * var(--ui-scale));
                    background-color: red;
                }
            `);
    }
}
export function checkLocation(name) {
    if (name === "Goal") {
        client.updateStatus(CLIENT_STATUS.GOAL);
    } else {
        client.locations.check(gamePackage.location_name_to_id[name]);
    }
}
const translate = [
    {key: 1000, val: "M"},
    {key: 900, val: "CM"},
    {key: 500, val: "D"},
    {key: 400, val: "CD"},
    {key: 100, val: "C"},
    {key: 90, val: "XC"},
    {key: 50, val: "L"},
    {key: 40, val: "XL"},
    {key: 10, val: "X"},
    {key: 9, val: "IX"},
    {key: 5, val: "V"},
    {key: 4, val: "IV"},
    {key: 1, val: "I"}
];
function roman(number) {
    var rom = "";
    for (var i = 0; i < translate.length; i++) {
        while (number >= translate[i].key) {
            rom = rom + translate[i].val;
            number = number - translate[i].key;
        }
    }
    return rom;
}

