import { Client, CLIENT_PACKET_TYPE, CLIENT_STATUS, SERVER_PACKET_TYPE } from "archipelago.js";
import { Dialog } from "shapez/core/modal_dialog_elements";
import { Signal } from "shapez/core/signal";
import { GameRoot } from "shapez/game/root";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { Mod } from "shapez/mods/mod";

export const methodNames = {
    metaBuildings: {
        getAvailableVariants: "getAvailableVariants",
        getIsUnlocked: "getIsUnlocked",
        getAdditionalStatistics: "getAdditionalStatistics"
    }
}

export const customRewards = {
    belt: "reward_belt",
    extractor: "reward_extractor",
    cutter: "reward_cutter",
    wires: "reward_wires",
    switch: "reward_switch",
    trash: "reward_trash",
    painter_quad: "reward_painter_quad",
    ap: "reward_ap",
    easter_egg: "reward_easter_egg"
}

export const upgradeIdNames = {
    belt: "Belt",
    miner: "Miner",
    processors: "Processors",
    painting: "Painting"
};

export const achievementNames = {
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
    "oldLevel17": "Memories from the past",
    "openWires": "The next dimension",
    "paintShape": "Painter",
    "place5000Wires": "Computer Guy",
    "placeBlueprint": "Now it's easy",
    "placeBp1000": "Copy-Pasta",
    "play1h": "Getting into it",
    "produceLogo": "The logo!",
    "produceMsLogo": "I've seen that before ...",
    "produceRocket": "To the moon",
    "rotateShape": "Rotater",
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
    "upgradesTier8": "Even faster",
    "darkMode": "My eyes no longer hurt",
    "speedrunBp30": "Speedrun Master",
    "speedrunBp60": "Speedrun Novice",
    "speedrunBp120": "Not an idle game",
    "noBeltUpgradesUntilBp": "It's so slow",
    "noInverseRotater": "King of Inefficiency",
    "play10h": "It's been a long time",
    "play20h": "Addicted"
};

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

export const baseBuildingNames = {
    belt: "Belt",
    balancer: "Balancer",
    tunnel: "Tunnel",
    extractor: "Extractor",
    cutter: "Cutter",
    cutter_quad: "Quad Cutter",
    rotator: "Rotator",
    rotator_ccw: "Rotator (CCW)",
    rotator_180: "Rotator (180°)",
    stacker: "Stacker",
    painter: "Painter",
    painter_quad: "Quad Painter",
    mixer: "Color Mixer",
    trash: "Trash"
};

export const subShapeNames = {
    rect: "Square",
    circle: "Circle",
    star: "Star",
    windmill: "Windmill",
};

export const colorNames = {
    red: "Red",
    green: "Green",
    blue: "Blue",

    yellow: "Yellow",
    purple: "Purple",
    cyan: "Cyan",

    white: "White",
    uncolored: "Uncolored",
};

export const getIsUnlockedForTrap = {
    belt: (root) => {return root.hubGoals.isRewardUnlocked(customRewards.belt) && !currentIngame.trapLocked.belt},
    balancer: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_balancer) && !currentIngame.trapLocked.balancer},
    tunnel: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_tunnel) && !currentIngame.trapLocked.tunnel},
    extractor: (root) => {return root.hubGoals.isRewardUnlocked(customRewards.extractor) && !currentIngame.trapLocked.extractor},
    cutter: (root) => {return root.hubGoals.isRewardUnlocked(customRewards.cutter) && !currentIngame.trapLocked.cutter},
    cutter_quad: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_cutter_quad) && !currentIngame.trapLocked.cutter},
    rotator: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_rotater) && !currentIngame.trapLocked.rotator},
    rotator_ccw: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_rotater_ccw) && !currentIngame.trapLocked.rotator},
    rotator_180: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_rotater_180) && !currentIngame.trapLocked.rotator},
    stacker: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_stacker) && !currentIngame.trapLocked.stacker},
    painter: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_painter) && !currentIngame.trapLocked.painter},
    painter_quad: (root) => {return root.hubGoals.isRewardUnlocked(customRewards.painter_quad) && !currentIngame.trapLocked.painter},
    mixer: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_mixer) && !currentIngame.trapLocked.mixer},
    trash: (root) => {return root.hubGoals.isRewardUnlocked(customRewards.trash) && !currentIngame.trapLocked.trash}
};

/**
 * @param {number} number
 */
export function roman(number) {
    var rom = "";
    for (var i = 0; i < translate.length; i++) {
        while (number >= translate[i].key) {
            rom = rom + translate[i].val;
            number = number - translate[i].key;
        }
    }
    return rom;
}

/**
 * @param {string} message
 */
export function apuserlog(message) {
    console.log("%c[AP] " + message, "background: #dddddd; color: #0044ff");
}

export function apdebuglog(message) {
    console.log("%c[AP] " + message, "color: #8d07b6");
}

/**
 * @param {boolean} condition
 * @param {string} message
 */
export function apassert(condition, message) {
    if (!condition) {
        alert(message);
    }
    throw new Error(message);
}

/**
 * @param {string} title
 * @param {() => any} code
 */
export function aptry(title, code) { // TODO use this instead
    try {
        return code();
    } catch (error) {
        const text = (
            title + "<br />---<br />" + 
            error.stack.replaceAll("<", "").replaceAll(">", "").replaceAll("    at ", "<br />- at ")
        );
        if (document.body.getElementsByClassName("gameLoadingOverlay").length) {
            const gameLoadingOverlay = document.body.getElementsByClassName("gameLoadingOverlay").item(0);
            const prefab_GameHint = gameLoadingOverlay.getElementsByClassName("prefab_GameHint").item(0);
            prefab_GameHint.innerHTML = ("ERROR " + shapez.T.mods.shapezipelago.infoBox.aptry.title + "<br />" + text);
        } else {
            modImpl.dialogs.showInfo(shapez.T.mods.shapezipelago.infoBox.aptry.title, text);
        }
        throw error;
    }
}

/**
 * @type {Mod}
 */
export var modImpl;

/**
 * @param {Mod} m
 */
export function setModImpl(m) {
    modImpl = m;
}

/**
 * @type {Connection}
 */
export var connection;

export class Connection {

    client = new Client();

    /**
     * @param {{hostname: string;port: number;game: string;name: string;items_handling: number;password: string;protocol?: "ws" | "wss";version?: {major: number;minor: number;build: number;};uuid?: string;tags?: string[];}} connectinfo
     * @param {{(packet: import("archipelago.js").ReceivedItemsPacket): void;(packet: import("archipelago.js").ReceivedItemsPacket): void;}} processItemsPacket
     * @returns {Promise}
     */
    tryConnect(connectinfo, processItemsPacket) {
        apdebuglog("Trying to connect to server");
        return this.client.connect(connectinfo)
            .then(() => {

                apuserlog("Connected to the server");
                connection = this;
                this.reportStatusToServer(CLIENT_STATUS.CONNECTED);
                this.connectionInformation = connectinfo;

                this.client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, (packet, message) => {
                    apuserlog(message);
                });
                this.client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, processItemsPacket);
                
                this.gamepackage = this.client.data.package.get("shapez");

                const slotData = this.client.data.slotData;
                var datacache = null;

                // Earliest slotData version: 0.5.3

                // Always string array, but javascript
                datacache = slotData["shapesanity"].valueOf();
                if (datacache instanceof Array) {
                    this.shapesanityNames = datacache;
                    apdebuglog(`Loaded slotData shapesanity (length=${datacache.length})`);
                } else {
                    apuserlog(`Error on loading shapesanity from slotData: class=${datacache.constructor.name}`);
                    modImpl.dialogs.showInfo(shapez.T.mods.shapezipelago.infoBox.impossible.title, 
                        `${shapez.T.mods.shapezipelago.infoBox.impossible.report}<br />${
                            shapez.T.mods.shapezipelago.infoBox.impossible.shapesanitySlotData}`);
                }

                // Always string
                this.goal = slotData["goal"].toString();
                apdebuglog(`Loaded slotData goal=${this.goal}`);

                // Always integer, equals location count (without goal)
                this.levelsToGenerate = Number(slotData["maxlevel"]);
                apdebuglog(`Loaded slotData maxlevel=${this.levelsToGenerate}`);
                if (this.goal === "vanilla" || this.goal === "mam") this.levelsToGenerate++;

                // Always integer
                this.tiersToGenerate = Number(slotData["finaltier"]);
                apdebuglog(`Loaded slotData finaltier=${this.tiersToGenerate}`);

                this.slotId = this.client.data.slot;
                apdebuglog(`Loaded slotId=${this.slotId}`);

                this.randomStepsLength = new Array(5);
                for (var phasenumber = 0; phasenumber < 5; phasenumber++) {
                    // Always integer
                    this.randomStepsLength[phasenumber] = Number(slotData[`Phase ${phasenumber} length`]);
                    apdebuglog(`Loaded slotData randomStepsLength[${phasenumber}]: ${this.randomStepsLength[phasenumber]}`);
                }

                for (var phasenumber = 1; phasenumber <= 5; phasenumber++) {
                    // both always string
                    this.positionOfLevelBuilding[slotData[`Level building ${phasenumber}`]] = phasenumber;
                    this.positionOfUpgradeBuilding[slotData[`Upgrade building ${phasenumber}`]] = phasenumber;
                }
                for (var buildingname in this.positionOfLevelBuilding) {
                    apdebuglog(`Initialized phase number ${this.positionOfLevelBuilding[buildingname]} for level and ${
                        this.positionOfUpgradeBuilding[buildingname]} for upgrade building ${buildingname}`);
                }

                // Always integer
                this.throughputLevelsRatio = Number(slotData["throughput_levels_ratio"]);
                apdebuglog(`Loaded slotData throughput_levels_ratio=${this.throughputLevelsRatio}`);

                // Always string
                this.levelsLogic = slotData["randomize_level_logic"].toString();
                apdebuglog(`Loaded slotData randomize_level_logic=${this.levelsLogic}`);

                // Always string
                this.upgradesLogic = slotData["randomize_upgrade_logic"].toString();
                apdebuglog(`Loaded slotData randomize_upgrade_logic=${this.upgradesLogic}`);

                // Always integer
                this.clientSeed = Number(slotData["seed"]);
                apdebuglog(`Loaded slotData seed=${this.clientSeed}`);

                // Always integer
                this.requiredShapesMultiplier = Number(slotData["required_shapes_multiplier"]);
                apdebuglog(`Loaded slotData required_shapes_multiplier=${this.requiredShapesMultiplier}`);

                // Always boolean
                this.israndomizedLevels = Boolean(slotData["randomize_level_requirements"]);
                apdebuglog(`Loaded slotData randomize_level_requirements=${this.israndomizedLevels}`);

                // Always boolean
                this.isRandomizedUpgrades = Boolean(slotData["randomize_upgrade_requirements"]);
                apdebuglog(`Loaded slotData randomize_upgrade_requirements=${this.isRandomizedUpgrades}`);

                for (var cat of ["belt", "miner", "processors", "painting"]) {
                    // Always number
                    this.categoryRandomBuildingsAmounts[cat] = Number(slotData[`${cat} category buildings amount`]);
                    apdebuglog(`Loaded slotData "${cat} category buildings amount"=${this.categoryRandomBuildingsAmounts[cat]}`);
                }

                // Always boolean
                this.isSameLate = Boolean(slotData["same_late_upgrade_requirements"]);
                apdebuglog(`Loaded slotData same_late_upgrade_requirements=${this.isSameLate}`);

                // undefined until 0.5.5, boolean since 0.5.6
                // Boolean(undefined) => false
                this.isFloatingLayersAllowed = Boolean(slotData["allow_floating_layers"]);
                apdebuglog(`Loaded slotData allow_floating_layers=${slotData["allow_floating_layers"]}`);

                // undefined until 0.5.10, float since 0.5.11
                datacache = slotData["complexity_growth_gradient"];
                this.complexityGrowthGradient = datacache == null ? 0.5 : Number(datacache);
                apdebuglog(`Loaded slotData complexity_growth_gradient=${slotData["complexity_growth_gradient"]}`);

            })
            .catch((error) => {
                apuserlog("Failed to connect: " + error.name + ", " + error.message);
            });
    }

    disconnect() {
        apuserlog("Disconnecting from the server");
        this.client.disconnect();
        connection = null;
    }

    /**
     * @type {String}
     */
    goal;
    /**
     * @type {number}
     */
    levelsToGenerate;
    /**
     * @type {number}
     */
    tiersToGenerate;
    /**
     * @type {number} 
     */
    requiredShapesMultiplier;
    /**
     * @type {boolean}
     */
    israndomizedLevels;
    /**
     * @type {boolean}
     */
    isRandomizedUpgrades;
    /**
     * @type {string}
     */
    levelsLogic;
    /**
     * @type {string}
     */
    upgradesLogic;
    /**
     * @type {number}
     */
    throughputLevelsRatio;
    /**
     * @type {boolean}
     */
    isSameLate;
    positionOfLevelBuilding = {
        "Cutter": 0,
        "Rotator": 0,
        "Stacker": 0,
        "Painter": 0,
        "Color Mixer": 0
    };
    positionOfUpgradeBuilding = {
        "Cutter": 0,
        "Rotator": 0,
        "Stacker": 0,
        "Painter": 0,
        "Color Mixer": 0
    };
    /**
     * @type {number[]}
     */
    randomStepsLength;
    categoryRandomBuildingsAmounts = {
        belt: 0,
        miner: 0,
        processors: 0,
        painting: 0
    };
    /**
     * @type {number}
     */
    clientSeed;
    /**
     * @type {string[]}
     */
    shapesanityNames;
    /**
     * @type {import("archipelago.js").GamePackage}
     */
    gamepackage;
    /**
     * @type {{[x:string]: boolean}}
     */
    shapesanityCache = {};
    /**
     * @type {number}
     */
    slotId;
    blueprintShape = "CbCbCbRb:CwCwCwCw";
    /**
     * @type {{ hostname: string; port: number; game: string; name: string; items_handling: number; password: string; protocol?: "ws" | "wss"; version?: { major: number; minor: number; build: number; }; uuid?: string; tags?: string[]; }}
     */
    connectionInformation;
    /**
     * @type {boolean}
     */
    isFloatingLayersAllowed;
    // This was never intended to be private, but to catch cheaters
    debug = 20010707;
    /**
     * @type {number}
     */
    complexityGrowthGradient;

    /**
     * 
     * @returns {String[]}
     */
    getCheckedLocationNames() {
        var names = [];
        const checkedList = this.client.locations.checked;
        for (var checkedId of checkedList)
            names.push(this.client.locations.name(this.slotId, checkedId));
        return names;
    }

    requestItemPackage() {
        this.client.send({cmd: CLIENT_PACKET_TYPE.SYNC});
    }

    /**
     * @param {import("archipelago.js").ClientStatus} status
     */
    reportStatusToServer(status) {
        this.client.updateStatus(status);
    }

    /**
     * @param {number[]} locids
     */
    sendLocationChecks(locids) {
        this.client.send({cmd: CLIENT_PACKET_TYPE.LOCATION_CHECKS, locations: locids});
    }

    /**
     * @param {number} id
     */
    getItemName(id) {
        return this.client.items.name("shapez", id);
    }

    /**
     * @param {number} id
     */
    getPlayername(id) {
        return this.client.players.name(id);
    }

    /**
     * @param {number} playerid
     * @param {number} locid
     */
    getLocationName(playerid, locid) {
        return connection.client.locations.name(playerid, locid);
    }

}

/**
 * @type {Ingame}
 */
export var currentIngame;

export class Ingame {

    /**
     * @type {GameRoot}
     */
    root;
    /**
     * @type {boolean}
     */
    isAPSave;
    /**
     * @type {number}
     */
    processedItemCount = 0;
    /**
     * @type {NodeJS.Timer}
     */
    efficiency3Interval;
    trapLocked = {
        belt: false,
        balancer: false,
        tunnel: false,
        extractor: false,
        cutter: false,
        rotator: false,
        stacker: false,
        painter: false,
        mixer: false,
        trash: false
    };
    trapThrottled = {
        belt: false,
        balancer: false,
        tunnel: false,
        extractor: false,
        cutter: false,
        rotator: false,
        stacker: false,
        painter: false,
        mixer: false
    };
    trapMalfunction = {
        cutter: false,
        cutter_quad: false,
        rotator: false,
        rotator_ccw: false,
        rotator_180: false,
        stacker: false,
        painter: false,
        painter_quad: false
    };
    /**
     * @type {{shape: string; required: number; reward: string; throughputOnly: boolean;}[]}
     */
    levelDefs;
    /**
     * @type {{belt: {required: {shape: any; amount: number;}[]; excludePrevious: boolean; improvement: number;}[]; miner: {required: {shape: any; amount: number;}[]; excludePrevious: boolean; improvement: number;}[]; processors: {required: {shape: any; amount: number;}[]; excludePrevious: boolean; improvement: number;}[]; painting: {required: {shape: any; amount: number;}[]; excludePrevious: boolean; improvement: number;}[];}}
     */
    upgradeDefs;
    /**
     * @type {boolean}
     */
    isItemsResynced = false;
    translated = {};
    /**
     * @type {number[]}
     */
    amountByLevelCache;
    /**
     * @type {number[]}
     */
    throughputByLevelCache;
    isTryingToConnect = modImpl.settings.debugTryingToConnectDefault;
    /**
     * @type {boolean[]}
     */
    scoutedShapesanity;
    /**
     * @type {HTMLCanvasElement[]}
     */
    shapesanityExamples = [];
    /**
     * @type {String[]}
     */
    shapesanityExamplesHash = [];
    /**
     * @type {TypedSignal<[]>}
     */
    itemReceiveSignal = new Signal();

    constructor() {
        apdebuglog("Constructing Ingame object");
        currentIngame = this;
        apdebuglog("Ingame object constructed");
    }

    /**
     * @param {GameRoot} root
     */
    afterRootInitialization(root) {
        this.root = root;
        this.isAPSave = !(!connection);
    }

    leave() {
        apdebuglog("Leaving and destroying Ingame object");
        if (connection) connection.reportStatusToServer(CLIENT_STATUS.CONNECTED);
        this.clearEfficiency3Interval();
        currentIngame = null;
    }

    /**
     * @param {() => void} f
     * @param {number} ms
     */
    startEfficiency3Interval(f, ms) {
        apdebuglog("Starting efficiency3Interval");
        this.efficiency3Interval = setInterval(f, ms);
    }

    clearEfficiency3Interval() {
        if (this.efficiency3Interval) {
            window.clearInterval(this.efficiency3Interval);
            this.efficiency3Interval = null;
        }
    }

}
