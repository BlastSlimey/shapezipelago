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
    "Cutter": (root) => {customRewards.reward_cutter = 1},
    "Rotator": (root) => {root.hubGoals.gainedRewards["reward_rotater"] = 1},
    "Painter": (root) => {root.hubGoals.gainedRewards["reward_painter"] = 1},
    "Rotator (CCW)": (root) => {root.hubGoals.gainedRewards["reward_rotater_ccw"] = 1},
    "Color Mixer": (root) => {root.hubGoals.gainedRewards["reward_mixer"] = 1},
    "Stacker": (root) => {root.hubGoals.gainedRewards["reward_stacker"] = 1},
    "Quad Cutter": (root) => {root.hubGoals.gainedRewards["reward_cutter_quad"] = 1},
    "Double Painter": (root) => {root.hubGoals.gainedRewards["reward_painter_double"] = 1},
    "Rotator (180°)": (root) => {root.hubGoals.gainedRewards["reward_rotater_180"] = 1},
    "Quad Painter": (root) => {customRewards.reward_painter_quad = 1},
    "Balancer": (root) => {root.hubGoals.gainedRewards["reward_balancer"] = 1},
    "Tunnel": (root) => {root.hubGoals.gainedRewards["reward_tunnel"] = 1},
    "Compact Merger": (root) => {root.hubGoals.gainedRewards["reward_merger"] = 1},
    "Tunnel Tier II": (root) => {root.hubGoals.gainedRewards["reward_underground_belt_tier_2"] = 1},
    "Compact Splitter": (root) => {root.hubGoals.gainedRewards["reward_splitter"] = 1},
    "Trash": (root) => {customRewards.reward_trash = 1},
    "Chaining Extractor": (root) => {root.hubGoals.gainedRewards["reward_miner_chainable"] = 1},
    "Belt Reader": (root) => {root.hubGoals.gainedRewards["reward_belt_reader"] = 1},
    "Storage": (root) => {root.hubGoals.gainedRewards["reward_storage"] = 1},
    "Item Filter": (root) => {root.hubGoals.gainedRewards["reward_filter"] = 1},
    "Display": (root) => {root.hubGoals.gainedRewards["reward_display"] = 1},
    "Wires": (root) => {customRewards.reward_wires = 1},
    "Constant Signal": (root) => {root.hubGoals.gainedRewards["reward_constant_signal"] = 1},
    "Logic Gates": (root) => {root.hubGoals.gainedRewards["reward_logic_gates"] = 1},
    "Virtual Processing": (root) => {root.hubGoals.gainedRewards["reward_virtual_processing"] = 1},
    "Blueprints": (root) => {root.hubGoals.gainedRewards["reward_blueprints"] = 1},
    "Big Routing Upgrade": (root) => {root.hubGoals.upgradeImprovements["belt"] += 1},
    "Big Extraction Upgrade": (root) => {root.hubGoals.upgradeImprovements["miner"] += 1},
    "Big Shape Processing Upgrade": (root) => {root.hubGoals.upgradeImprovements["processors"] += 1},
    "Big Color Processing Upgrade": (root) => {root.hubGoals.upgradeImprovements["painting"] += 1},
    "Small Routing Upgrade": (root) => {root.hubGoals.upgradeImprovements["belt"] += 0.1},
    "Small Extraction Upgrade": (root) => {root.hubGoals.upgradeImprovements["miner"] += 0.1},
    "Small Shape Processing Upgrade": (root) => {root.hubGoals.upgradeImprovements["processors"] += 0.1},
    "Small Color Processing Upgrade": (root) => {root.hubGoals.upgradeImprovements["painting"] += 0.1},
    "Blueprint Shapes Bundle": (root) => {root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] = (root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] || 0) + 1000},
    "Inventory Draining Trap": (root) => {
        var storedBlueprint = root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] || 0;
        root.hubGoals.storedShapes["CbCbCbRb:CwCwCwCw"] = storedBlueprint / 2;
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