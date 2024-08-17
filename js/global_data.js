import { Client } from "archipelago.js";

export const client = new Client();
export var connected = false;
export var initializedOnce = false;
export var processedItemCount = 0;
export const customRewards = {
    reward_cutter: 0,
    reward_trash: 0,
    reward_wires: 0,
    reward_painter_quad: 0
};
export var upgradeDefs = null;
export var leveldefs = null;
export var gamePackage = null;
const upgradeIdNames = {
    belt: "Routing",
    miner: "Extraction",
    processors: "Shape Processing",
    painting: "Color Processing"
}
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
export const receiveItemFunctions = {
    "Cutter": (root) => {customRewards.reward_cutter = 1; return "";},
    "Rotator": (root) => {root.hubGoals.gainedRewards["reward_rotater"] = 1; return "";},
    "Painter": (root) => {root.hubGoals.gainedRewards["reward_painter"] = 1; return "";},
    "Rotator (CCW)": (root) => {root.hubGoals.gainedRewards["reward_rotater_ccw"] = 1; return "";},
    "Color Mixer": (root) => {root.hubGoals.gainedRewards["reward_mixer"] = 1; return "";},
    "Stacker": (root) => {root.hubGoals.gainedRewards["reward_stacker"] = 1; return "";},
    "Quad Cutter": (root) => {root.hubGoals.gainedRewards["reward_cutter_quad"] = 1; return "";},
    "Double Painter": (root) => {root.hubGoals.gainedRewards["reward_painter_double"] = 1; return "";},
    "Rotator (180°)": (root) => {root.hubGoals.gainedRewards["reward_rotater_180"] = 1; return "";},
    "Quad Painter": (root) => {customRewards.reward_painter_quad = 1; return "";},
    "Balancer": (root) => {root.hubGoals.gainedRewards["reward_balancer"] = 1; return "";},
    "Tunnel": (root) => {root.hubGoals.gainedRewards["reward_tunnel"] = 1; return "";},
    "Compact Merger": (root) => {root.hubGoals.gainedRewards["reward_merger"] = 1; return "";},
    "Tunnel Tier II": (root) => {root.hubGoals.gainedRewards["reward_underground_belt_tier_2"] = 1; return "";},
    "Compact Splitter": (root) => {root.hubGoals.gainedRewards["reward_splitter"] = 1; return "";},
    "Trash": (root) => {customRewards.reward_trash = 1; return "";},
    "Chaining Extractor": (root) => {root.hubGoals.gainedRewards["reward_miner_chainable"] = 1; return "";},
    "Belt Reader": (root) => {root.hubGoals.gainedRewards["reward_belt_reader"] = 1; return "";},
    "Storage": (root) => {root.hubGoals.gainedRewards["reward_storage"] = 1; return "";},
    "Item Filter": (root) => {root.hubGoals.gainedRewards["reward_filter"] = 1; return "";},
    "Display": (root) => {root.hubGoals.gainedRewards["reward_display"] = 1; return "";},
    "Wires": (root) => {customRewards.reward_wires = 1; return "";},
    "Constant Signal": (root) => {root.hubGoals.gainedRewards["reward_constant_signal"] = 1; return "";},
    "Logic Gates": (root) => {root.hubGoals.gainedRewards["reward_logic_gates"] = 1; return "";},
    "Virtual Processing": (root) => {root.hubGoals.gainedRewards["reward_virtual_processing"] = 1; return "";},
    "Blueprints": (root) => {root.hubGoals.gainedRewards["reward_blueprints"] = 1; return "";},
    "Big Routing Upgrade": (root) => {root.hubGoals.upgradeImprovements["belt"] += 1; return "";},
    "Big Extraction Upgrade": (root) => {root.hubGoals.upgradeImprovements["miner"] += 1; return "";},
    "Big Shape Processing Upgrade": (root) => {root.hubGoals.upgradeImprovements["processors"] += 1; return "";},
    "Big Color Processing Upgrade": (root) => {root.hubGoals.upgradeImprovements["painting"] += 1; return "";},
    "Small Routing Upgrade": (root) => {root.hubGoals.upgradeImprovements["belt"] += 0.1; return "";},
    "Small Extraction Upgrade": (root) => {root.hubGoals.upgradeImprovements["miner"] += 0.1; return "";},
    "Small Shape Processing Upgrade": (root) => {root.hubGoals.upgradeImprovements["processors"] += 0.1; return "";},
    "Small Color Processing Upgrade": (root) => {root.hubGoals.upgradeImprovements["painting"] += 0.1; return "";},
    "Blueprint Shapes Bundle": (root) => {root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] = (root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] || 0) + 1000; return ": 1000";},
    "Level Shapes Bundle": (root) => {
        const levelShape = root.hubGoals.currentGoal.definition.getHash();
        const requiredLevelShapes = root.hubGoals.currentGoal.required;
        const storedLevelShapes = root.hubGoals.storedShapes[levelShape] || 0;
        const addedAmount = Math.floor((requiredLevelShapes - storedLevelShapes) / 2);
        root.hubGoals.storedShapes[levelShape] = (storedLevelShapes || 0) + addedAmount;
        return ": " + addedAmount.toString();
    },
    "Upgrade Shapes Bundle": (/** @type {import("shapez/game/root").GameRoot} */ root) => {
        const upgradeIds = ["belt", "miner", "processors", "painting"];
        const randomID = upgradeIds[Math.floor(Math.random()*4)];
        const requiredShapes = upgradeDefs[randomID][root.hubGoals.getUpgradeLevel(randomID)].required;
        const requirement = requiredShapes[Math.floor(Math.random()*requiredShapes.length)];
        const stored = root.hubGoals.storedShapes[requirement.shape] || 0;
        var addedAmount = Math.floor((requirement.amount - stored) / 2);
        if (addedAmount < 0) {
            addedAmount = 100;
        }
        root.hubGoals.storedShapes[requirement.shape] = (stored || 0) + addedAmount;
        return `: ${addedAmount} ${requirement.shape} in ${upgradeIdNames[randomID]} Upgrades`;
    },
    "Inventory Draining Trap": (root) => {
        const r = Math.random()*3;
        if (r < 1) {
            var storedBlueprint = root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] || 0;
            root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] = Math.floor(storedBlueprint / 2);
            return ": Blueprint shapes";
        } else if (r < 2) {
            const levelShape = root.hubGoals.currentGoal.definition.getHash();
            const storedLevelShapes = root.hubGoals.storedShapes[levelShape] || 0;
            root.hubGoals.storedShapes[levelShape] = Math.floor((storedLevelShapes || 0) / 2);
            return ": Current level shapes";
        } else {
            const upgradeIds = ["belt", "miner", "processors", "painting"];
            const randomID = upgradeIds[Math.floor(Math.random()*4)];
            const requiredShapes = upgradeDefs[randomID][root.hubGoals.getUpgradeLevel(randomID)].required;
            const requirement = requiredShapes[Math.floor(Math.random()*requiredShapes.length)];
            const stored = root.hubGoals.storedShapes[requirement.shape] || 0;
            root.hubGoals.storedShapes[requirement.shape] = Math.floor((stored || 0) / 2);
            return `: ${requirement.shape} from ${upgradeIdNames[randomID]} Upgrades`;
        }
    },
    "Locked Building Trap": (root) => {
        const randomBuilding = Object.keys(trapLocked)[Math.floor(Math.random()*10)];
        const randomTimeSec = Math.floor(Math.random()*46) + 15;
        trapLocked[randomBuilding] = true;
        setTimeout(() => {
            trapLocked[randomBuilding] = false;
        }, randomTimeSec*1000);
        return `: ${baseBuildingNames[randomBuilding]} for ${randomTimeSec} seconds`;
    },
    "Throttled Building Trap": (root) => {
        const randomBuilding = Object.keys(trapThrottled)[Math.floor(Math.random()*9)];
        const randomTimeSec = Math.floor(Math.random()*46) + 15;
        trapThrottled[randomBuilding] = true;
        setTimeout(() => {
            trapThrottled[randomBuilding] = false;
        }, randomTimeSec*1000);
        return `: ${baseBuildingNames[randomBuilding]} for ${randomTimeSec} seconds`;
    },
    "Malfunctioning Trap": (root) => {
        const randomBuilding = Object.keys(trapMalfunction)[Math.floor(Math.random()*8)];
        const randomTimeSec = Math.floor(Math.random()*46) + 15;
        trapMalfunction[randomBuilding] = true;
        setTimeout(() => {
            trapMalfunction[randomBuilding] = false;
        }, randomTimeSec*1000);
        return `: ${baseBuildingNames[randomBuilding]} for ${randomTimeSec} seconds`;
    }
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
export const trapLocked = {
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
}
export const trapThrottled = {
    belt: false,
    balancer: false,
    tunnel: false,
    extractor: false,
    cutter: false,
    rotator: false,
    stacker: false,
    painter: false,
    mixer: false
}
export const trapMalfunction = {
    cutter: false,
    cutter_quad: false,
    rotator: false,
    rotator_ccw: false,
    rotator_180: false,
    stacker: false,
    painter: false,
    painter_quad: false
}
const baseBuildingNames = {
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
}

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

export function setUpgredeDefs(defs) {
    upgradeDefs = defs;
}

export function setLevelDefs(defs) {
    leveldefs = defs;
}

/**
 * 
 * @param {boolean} con 
 */
export function setConnected(con) {
    connected = con;
}

/**
 * 
 * @param {number} amount 
 */
export function setProcessedItems(amount) {
    processedItemCount = amount;
}

export function increaseProcessedItems() {
    processedItemCount++;
}

/**
 * 
 * @param {boolean} initialized 
 */
export function setInitializedOnce(initialized) {
    initializedOnce = initialized;
}

/**
 * 
 * @param {import("archipelago.js").GamePackage} pack 
 */
export function setGamePackage(pack) {
    gamePackage = pack;
}