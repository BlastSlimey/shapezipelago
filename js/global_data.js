import { Client, CLIENT_PACKET_TYPE, CLIENT_STATUS, SERVER_PACKET_TYPE } from "archipelago.js";
import { GameRoot } from "shapez/game/root";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { Mod } from "shapez/mods/mod";

export const methodNames = {
    metaBuildings: {
        getAvailableVariants: "getAvailableVariants",
        getIsUnlocked: "getIsUnlocked"
    }
}

export const customRewards = {
    belt: "reward_belt",
    extractor: "reward_extractor",
    cutter: "rewards_cutter",
    wires: "reward_wires",
    switch: "reward_switch",
    trash: "reward_trash",
    painter_quad: "reward_painter_quad"
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
    belt: (root) => {return root.hubGoals.isRewardUnlocked(customRewards.belt)},
    balancer: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_balancer)},
    tunnel: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_tunnel)},
    extractor: (root) => {return root.hubGoals.isRewardUnlocked(customRewards.extractor)},
    cutter: (root) => {return root.hubGoals.isRewardUnlocked(customRewards.cutter)},
    cutter_quad: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_cutter_quad)},
    rotator: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_rotater)},
    rotator_ccw: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_rotater_ccw)},
    rotator_180: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_rotater_180)},
    stacker: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_stacker)},
    painter: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_painter)},
    painter_quad: (root) => {return root.hubGoals.isRewardUnlocked(customRewards.painter_quad)},
    mixer: (root) => {return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_mixer)},
    trash: (root) => {return root.hubGoals.isRewardUnlocked(customRewards.trash)}
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
     * @param {() => void} updateHUD
     */
    tryConnect(connectinfo, processItemsPacket, updateHUD) {
        apdebuglog("Trying to connect to server");
        this.client.connect(connectinfo)
            .then(() => {

                apuserlog("Connected to the server");
                connection = this;
                this.reportStatusToServer(CLIENT_STATUS.CONNECTED);
                updateHUD();

                this.client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, (packet, message) => {
                    apuserlog(message);
                });
                this.client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, processItemsPacket);
                
                this.gamepackage = this.client.data.package.get("shapez");

                const slotData = this.client.data.slotData;
                var datacache = null;

                datacache = slotData["shapesanity"];
                if (datacache) datacache = datacache.valueOf();
                if (datacache instanceof Array) this.shapesanityNames = datacache;

                datacache = slotData["goal"].valueOf().toString();
                if (datacache === "0") this.goal = "vanilla";
                else if (datacache === "1") this.goal = "mam";
                else if (datacache === "2") this.goal = "even_fasterer";
                else if (datacache === "3") this.goal = "efficiency_iii";
                else this.goal = datacache;

                datacache = Number(slotData["maxlevel"].valueOf());
                if (this.goal === "vanilla" || this.goal === "mam") this.levelsToGenerate = datacache+1;
                else this.levelsToGenerate = datacache;

                this.tiersToGenerate = Number(slotData["finaltier"].valueOf());

                this.slotId = this.client.data.slot;

                this.randomStepsLength = new Array(5);
                for (var phasenumber = 0; phasenumber < 5; phasenumber++) {
                    datacache = slotData[`Phase ${phasenumber} length`];
                    if (datacache) this.randomStepsLength[phasenumber] = Number(datacache.valueOf());
                    else this.randomStepsLength[phasenumber] = 1;
                }

                for (var phasenumber = 1; phasenumber <= 5; phasenumber++) {
                    this.positionOfLevelBuilding[slotData[`Level building ${phasenumber}`].valueOf().toString()] = phasenumber;
                    this.positionOfUpgradeBuilding[slotData[`Upgrade building ${phasenumber}`].valueOf().toString()] = phasenumber;
                }

                datacache = slotData["throughput_levels_ratio"];
                if (datacache) this.throughputLevelsRatio = Number(datacache.valueOf());
                else this.throughputLevelsRatio = -1;

                datacache = slotData["randomize_level_logic"].valueOf().toString();
                if (datacache === "0" || datacache === "1") this.levelsLogic = "vanilla";
                else if (datacache === "2" || datacache === "3") this.levelsLogic = "stretched";
                else if (datacache === "4") this.levelsLogic = "hardcore";
                else this.levelsLogic = datacache;

                datacache = slotData["randomize_upgrade_logic"].valueOf().toString();
                if (datacache === "0") this.upgradesLogic = "vanilla_like";
                else if (datacache === "1") this.upgradesLogic = "linear";
                else if (datacache === "2") this.upgradesLogic = "hardcore";
                else this.upgradesLogic = datacache;

                this.clientSeed = Number(slotData["seed"].valueOf());

                this.requiredShapesMultiplier = Number(slotData["required_shapes_multiplier"].valueOf());

                this.israndomizedLevels = Boolean(slotData["randomize_level_requirements"].valueOf());

                this.isRandomizedUpgrades = Boolean(slotData["randomize_upgrade_requirements"].valueOf());

                for (var cat of ["belt", "miner", "processors", "painting"]) {
                    datacache = slotData[`${cat} category buildings amount`];
                    if (datacache) this.categoryRandomBuildingsAmounts[cat] = Number(datacache.valueOf());
                }

                this.isSameLate = Boolean(slotData["same_late_upgrade_requirements"].valueOf());

                datacache = slotData["lock_belt_and_extractor"];
                if (datacache) this.isBeltExtractorLocked = Boolean(datacache.valueOf());
                else this.isBeltExtractorLocked = false;

            })
            .catch((error) => {
                apuserlog("Failed to connect: " + error);
                updateHUD();
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
    /**
     * @type {boolean}
     */
    isBeltExtractorLocked;
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

    constructor() {
        apdebuglog("Constructing Ingame object");
        currentIngame = this;
        if (connection) connection.reportStatusToServer(CLIENT_STATUS.PLAYING);
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
