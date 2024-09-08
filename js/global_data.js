import { Client } from "archipelago.js";

export const client = new Client();
export var connected = false;
export var processedItemCount = 0;
export const customRewards = {
    reward_cutter: 0,
    reward_trash: 0,
    reward_wires: 0,
    reward_painter_quad: 0,
    reward_switch: 0,
    reward_belt: 0,
    reward_extractor: 0
};
export var upgradeDefs = null;
export var leveldefs = null;
export var gamePackage = null;
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
    "darkMode": "My eyes no longer hurt"
};
export const softlockAchievementNames = {
    "speedrunBp30": "Speedrun Master",
    "speedrunBp60": "Speedrun Novice",
    "speedrunBp120": "Not an idle game",
    "noBeltUpgradesUntilBp": "It's so slow",
    "noInverseRotater": "King of Inefficiency"
};
export const longAchievementNames = {
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
};
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
};
export const trapMalfunction = {
    cutter: false,
    cutter_quad: false,
    rotator: false,
    rotator_ccw: false,
    rotator_180: false,
    stacker: false,
    painter: false,
    painter_quad: false
};
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
export const getIsUnlockedForTrap = {
    belt: (root) => {return customRewards.reward_belt != 0},
    balancer: (root) => {return root.hubGoals.isRewardUnlocked("reward_balancer")},
    tunnel: (root) => {return root.hubGoals.isRewardUnlocked("reward_tunnel")},
    extractor: (root) => {return customRewards.reward_extractor != 0},
    cutter: (root) => {return customRewards.reward_cutter != 0},
    cutter_quad: (root) => {return root.hubGoals.isRewardUnlocked("reward_cutter_quad")},
    rotator: (root) => {return root.hubGoals.isRewardUnlocked("reward_rotater")},
    rotator_ccw: (root) => {return root.hubGoals.isRewardUnlocked("reward_rotater_ccw")},
    rotator_180: (root) => {return root.hubGoals.isRewardUnlocked("reward_rotater_180")},
    stacker: (root) => {return root.hubGoals.isRewardUnlocked("reward_stacker")},
    painter: (root) => {return root.hubGoals.isRewardUnlocked("reward_painter")},
    painter_quad: (root) => {return customRewards.reward_painter_quad != 0},
    mixer: (root) => {return root.hubGoals.isRewardUnlocked("reward_mixer")},
    trash: (root) => {return customRewards.reward_trash != 0}
}
export var shapesanityCache = {
    "CuCuCuCu:CuCuCuCu": true
};

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
 * @param {import("archipelago.js").GamePackage} pack 
 */
export function setGamePackage(pack) {
    gamePackage = pack;
}

/**
 * @param {string[]} messages
 */
export function aplog(...messages) {
    for (var m of messages) {
        console.log("%c[AP] " + m, "background: #dddddd; color: #0044ff");
    }
}
