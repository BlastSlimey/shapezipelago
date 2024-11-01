import { RandomNumberGenerator } from "shapez/core/rng";
import { apdebuglog, baseBuildingNames, connection, currentIngame, customRewards } from "./global_data";

export function vanillaShapes() {
    const multiplier = connection.requiredShapesMultiplier;
    return [
        {shape: "CuCuCuCu", required: Math.ceil(30*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "----CuCu", required: Math.ceil(40*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "RuRuRuRu", required: Math.ceil(70*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "RuRu----", required: Math.ceil(70*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "Cu----Cu", required: Math.ceil(170*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "Cu------", required: Math.ceil(270*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "CrCrCrCr", required: Math.ceil(300*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "RbRb----", required: Math.ceil(480*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "CpCpCpCp", required: Math.ceil(600*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "ScScScSc", required: Math.ceil(800*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "CgScScCg", required: Math.ceil(1000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "CbCbCbRb:CwCwCwCw", required: Math.ceil(1000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "RpRpRpRp:CwCwCwCw", required: Math.ceil(3800*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "--Cg----:--Cr----", required: Math.ceil(8*multiplier/10), reward: customRewards.ap, throughputOnly: true},
        {shape: "SrSrSrSr:CyCyCyCy", required: Math.ceil(10000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "SrSrSrSr:CyCyCyCy:SwSwSwSw", required: Math.ceil(6000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "CbRbRbCb:CwCwCwCw:WbWbWbWb", required: Math.ceil(20000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "Sg----Sg:CgCgCgCg:--CyCy--", required: Math.ceil(20000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "CpRpCp--:SwSwSwSw", required: Math.ceil(25000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "RuCw--Cw:----Ru--", required: Math.ceil(25000*multiplier/10), reward: customRewards.easter_egg, throughputOnly: false},
        {shape: "CrCwCrCw:CwCrCwCr:CrCwCrCw:CwCrCwCr", required: Math.ceil(25000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "Cg----Cr:Cw----Cw:Sy------:Cy----Cy", required: Math.ceil(25000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "CcSyCcSy:SyCcSyCc:CcSyCcSy", required: Math.ceil(25000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "CcRcCcRc:RwCwRwCw:Sr--Sw--:CyCyCyCy", required: Math.ceil(25000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "Rg--Rg--:CwRwCwRw:--Rg--Rg", required: Math.ceil(25000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw", required: Math.ceil(50000*multiplier/10), reward: customRewards.ap, throughputOnly: false}
    ];
}

/**
 * 
 * @param {RandomNumberGenerator} randomizer
 */
export function randomizedVanillaStepsShapes(randomizer) {
    const throughputratio = connection.throughputLevelsRatio;
    const phase = connection.positionOfLevelBuilding;
    var levelsdefs = new Array(26);
    levelsdefs[0] = {
        shape: calcRandomShape(randomizer, 0, false, false, false, false, false), 
        required: getAmountByLevel(1), reward: customRewards.ap,
        throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
    };
    for (var i = 2; i <= 4; i++) {
        levelsdefs[i-1] = {
            shape: calcRandomShape(
                randomizer, Math.ceil(i/2), phase[baseBuildingNames.cutter] == 1, 
                phase[baseBuildingNames.rotator] == 1, phase[baseBuildingNames.stacker] == 1, 
                phase[baseBuildingNames.painter] == 1, phase[baseBuildingNames.mixer] == 1
            ), 
            required: getAmountByLevel(i), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        };
    }
    for (var i = 5; i <= 6; i++) {
        levelsdefs[i-1] = {
            shape: calcRandomShape(
                randomizer, 3, phase[baseBuildingNames.cutter] <= 2, 
                phase[baseBuildingNames.rotator] <= 2, phase[baseBuildingNames.stacker] <= 2, 
                phase[baseBuildingNames.painter] <= 2, phase[baseBuildingNames.mixer] <= 2
            ), 
            required: getAmountByLevel(i), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        };
    }
    for (var i = 7; i <= 8; i++) {
        levelsdefs[i-1] = {
            shape: calcRandomShape(
                randomizer, 4, phase[baseBuildingNames.cutter] <= 3, 
                phase[baseBuildingNames.rotator] <= 3, phase[baseBuildingNames.stacker] <= 3, 
                phase[baseBuildingNames.painter] <= 3, phase[baseBuildingNames.mixer] <= 3
            ), 
            required: getAmountByLevel(i), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        };
    }
    for (var i = 9; i <= 10; i++) {
        levelsdefs[i-1] = {
            shape: calcRandomShape(
                randomizer, 5, phase[baseBuildingNames.cutter] <= 4, 
                phase[baseBuildingNames.rotator] <= 4, phase[baseBuildingNames.stacker] <= 4, 
                phase[baseBuildingNames.painter] <= 4, phase[baseBuildingNames.mixer] <= 4
            ), 
            required: getAmountByLevel(i), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        };
    }
    for (var i = 11; i <= 26; i++) {
        levelsdefs[i-1] = {
            shape: calcRandomShape(randomizer, i-6, true, true, true, true, true), 
            required: getAmountByLevel(i), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        };
    }
    if (throughputratio == -1) levelsdefs[13].throughputOnly = true;
    levelsdefs[19].reward = customRewards.easter_egg;
    for (var i = 27; i <= connection.levelsToGenerate; i++) {
        levelsdefs.push({
            shape: calcRandomShape(randomizer, i-22, true, true, true, true, true), 
            required: getThroughputByLevel(27), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio || throughputratio == -1
        });
    };
    for (var i = 0; i < 26; i++) {
        if (levelsdefs[i].throughputOnly) {
            levelsdefs[i].required = getThroughputByLevel(i+1);
        }
    }
    for (var i = 26; i < levelsdefs.length; i++) {
        if (!levelsdefs[i].throughputOnly) {
            levelsdefs[i].required = getAmountByLevel(i+1);
        }
    }
    return levelsdefs;
}

export function randomizedStretchedShapes(randomizer) {
    let levelsdefs = [];
    const levelstogenerate = connection.levelsToGenerate;
    const phaselength = Math.floor(levelstogenerate/6);
    const throughputratio = connection.throughputLevelsRatio;
    const phase = connection.positionOfLevelBuilding;
    for (let i = 0; i < phaselength; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 0, false, false, false, false, false), 
            required: getAmountByLevel(i+1), reward: customRewards.ap,
                throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (let i = phaselength; i < phaselength*2; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, Math.ceil(i/3), 
            phase[baseBuildingNames.cutter] == 1, 
            phase[baseBuildingNames.rotator] == 1, 
            phase[baseBuildingNames.stacker] == 1, 
            phase[baseBuildingNames.painter] == 1, 
            phase[baseBuildingNames.mixer] == 1), 
            required: getAmountByLevel(i+1), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (let i = phaselength*2; i < phaselength*3; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, Math.ceil(i/2), 
            phase[baseBuildingNames.cutter] <= 2, 
            phase[baseBuildingNames.rotator] <= 2, 
            phase[baseBuildingNames.stacker] <= 2, 
            phase[baseBuildingNames.painter] <= 2, 
            phase[baseBuildingNames.mixer] <= 2), 
            required: getAmountByLevel(i+1), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (let i = phaselength*3; i < phaselength*4; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, Math.ceil(i/2), 
            phase[baseBuildingNames.cutter] <= 3, 
            phase[baseBuildingNames.rotator] <= 3, 
            phase[baseBuildingNames.stacker] <= 3, 
            phase[baseBuildingNames.painter] <= 3, 
            phase[baseBuildingNames.mixer] <= 3), 
            required: getAmountByLevel(i+1), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (let i = phaselength*4; i < phaselength*5; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, Math.ceil(i/1.5), 
            phase[baseBuildingNames.cutter] <= 4, 
            phase[baseBuildingNames.rotator] <= 4, 
            phase[baseBuildingNames.stacker] <= 4, 
            phase[baseBuildingNames.painter] <= 4, 
            phase[baseBuildingNames.mixer] <= 4), 
            required: getAmountByLevel(i+1), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (let ii = levelsdefs.length+1; ii <= levelstogenerate; ii++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, ii, true, true, true, true, true), 
            required: getAmountByLevel(ii), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    };
    if (throughputratio == -1) {
        levelsdefs[13].throughputOnly = true;
        for (let i = 26; i < levelsdefs.length; i++) {
            levelsdefs[i].throughputOnly = true;
        }
    }
    for (let i = 0; i < levelsdefs.length; i++) {
        if (levelsdefs[i].throughputOnly) {
            levelsdefs[i].required = getThroughputByLevel(i+1);
        }
    }
    return levelsdefs;
}

export function randomizedQuickShapes(randomizer) {
    const multiplier = connection.requiredShapesMultiplier;
    const throughputratio = connection.throughputLevelsRatio;
    const phase = connection.positionOfLevelBuilding;
    const levelstogenerate = connection.levelsToGenerate;
    var levelsdefs = new Array(26);
    levelsdefs[0] = {
        shape: calcRandomShape(randomizer, 0, false, false, false, false, false), 
        required: getAmountByLevel(1), reward: customRewards.ap,
        throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
    };
    for (var i_phases = 1; i_phases <= 4; i_phases++) {
        levelsdefs[i_phases] = {
            shape: calcRandomShape(
                randomizer, i_phases+2, phase[baseBuildingNames.cutter] <= i_phases, 
                phase[baseBuildingNames.rotator] <= i_phases, phase[baseBuildingNames.stacker] <= i_phases, 
                phase[baseBuildingNames.painter] <= i_phases, phase[baseBuildingNames.mixer] <= i_phases
            ), 
            required: getAmountByLevel(i_phases+1), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        };
    }
    for (var i = 6; i <= 26; i++) {
        levelsdefs[i-1] = {
            shape: calcRandomShape(randomizer, Math.ceil(i/2)+4, true, true, true, true, true), 
            required: getAmountByLevel(i), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        };
    }
    if (throughputratio == -1) levelsdefs[13].throughputOnly = true;
    levelsdefs[19].reward = customRewards.easter_egg;
    for (var i = 27; i <= levelstogenerate; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, Math.ceil(i/2)+4, true, true, true, true, true), 
            required: getThroughputByLevel(i), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio || throughputratio == -1});
    };
    for (var i = 0; i < 26; i++) {
        if (levelsdefs[i].throughputOnly) {
            levelsdefs[i].required = getThroughputByLevel(i+1);
        }
    }
    for (var i = 26; i < levelsdefs.length; i++) {
        if (!levelsdefs[i].throughputOnly) {
            levelsdefs[i].required = getAmountByLevel(i+1);
        }
    }
    return levelsdefs;
}

export function randomizedRandomStepsShapes(randomizer) {
    const throughputratio = connection.throughputLevelsRatio;
    const phase = connection.positionOfLevelBuilding;
    const phaselength = connection.randomStepsLength;
    const levelstogenerate = connection.levelsToGenerate;
    var levelsdefs = [{
        shape: calcRandomShape(randomizer, 0, false, false, false, false, false), 
        required: getAmountByLevel(1), reward: customRewards.ap,
        throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
    }];
    for (var i_phases = 0; i_phases <= 4; i_phases++) {
        for (var i = 0; i < phaselength[i_phases]; i++) {
            levelsdefs.push({
                shape: calcRandomShape(
                    randomizer, Math.ceil(i_phases*(1.5+1.5*i/phaselength[i_phases])), 
                    phase[baseBuildingNames.cutter] <= i_phases, 
                    phase[baseBuildingNames.rotator] <= i_phases, phase[baseBuildingNames.stacker] <= i_phases, 
                    phase[baseBuildingNames.painter] <= i_phases, phase[baseBuildingNames.mixer] <= i_phases
                ), 
                required: getAmountByLevel(levelsdefs.length+1), reward: customRewards.ap,
                throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
            });
        }
    }
    for (var ii = levelsdefs.length+1; ii <= levelstogenerate; ii++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, Math.ceil(8+(ii-levelsdefs.length)/2), true, true, true, true, true), 
            required: getAmountByLevel(ii), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    };
    if (throughputratio == -1) {
        levelsdefs[13].throughputOnly = true;
        for (var i = 26; i < levelsdefs.length; i++) {
            levelsdefs[i].throughputOnly = true;
        }
    }
    for (var i = 0; i < levelsdefs.length; i++) {
        if (levelsdefs[i].throughputOnly) {
            levelsdefs[i].required = getThroughputByLevel(i+1);
        }
    }
    return levelsdefs;
}

export function randomizedHardcoreShapes(randomizer) {
    const multiplier = connection.requiredShapesMultiplier;
    const throughputratio = connection.throughputLevelsRatio;
    const levelstogenerate = connection.levelsToGenerate;
    var levelsdefs = [
        {shape: calcRandomShape(randomizer, 0, false, false, false, false, false), 
            required: getAmountByLevel(1), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio}
    ];
    for (var i = 2; i <= levelstogenerate; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, i+3, true, true, true, true, true), 
            required: getAmountByLevel(i), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    };
    if (throughputratio == -1) {
        levelsdefs[13].throughputOnly = true;
        for (var i = 26; i < levelsdefs.length; i++) {
            levelsdefs[i].throughputOnly = true;
        }
    }
    for (var i = 0; i < levelsdefs.length; i++) {
        if (levelsdefs[i].throughputOnly) {
            levelsdefs[i].required = getThroughputByLevel(i+1);
        }
    }
    return levelsdefs;
}

/**
 * @param {number} level
 */
function getAmountByLevel(level) {
    if (currentIngame.amountByLevelCache)
        return currentIngame.amountByLevelCache[level-1];
    currentIngame.amountByLevelCache = new Array(connection.levelsToGenerate);
    if (connection.levelsToGenerate <= 120) {
        currentIngame.amountByLevelCache[0] = Math.ceil(30*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[1] = Math.ceil(40*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[2] = Math.ceil(70*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[3] = Math.ceil(70*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[4] = Math.ceil(170*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[5] = Math.ceil(270*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[6] = Math.ceil(300*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[7] = Math.ceil(480*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[8] = Math.ceil(600*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[9] = Math.ceil(800*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[10] = Math.ceil(1000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[11] = Math.ceil(1000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[12] = Math.ceil(3800*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[13] = Math.ceil(5000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[14] = Math.ceil(10000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[15] = Math.ceil(6000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[16] = Math.ceil(20000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[17] = Math.ceil(20000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[18] = Math.ceil(25000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[19] = Math.ceil(25000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[20] = Math.ceil(25000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[21] = Math.ceil(25000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[22] = Math.ceil(25000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[23] = Math.ceil(25000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[24] = Math.ceil(25000*connection.requiredShapesMultiplier/10);
        currentIngame.amountByLevelCache[25] = Math.ceil(50000*connection.requiredShapesMultiplier/10);
        for (var i = 26; i < connection.levelsToGenerate; i++) {
            currentIngame.amountByLevelCache[i] = Math.ceil((25000+(175000*(i+1)/connection.levelsToGenerate))*connection.requiredShapesMultiplier/10);
            currentIngame.amountByLevelCache[i] -= currentIngame.amountByLevelCache[i] % 500;
        }
    } else {
        const earlyLevels = Math.floor(connection.levelsToGenerate*1/5);
        const buildupLevels = Math.floor(connection.levelsToGenerate*3/5);
        const earlyToBuildupLevels = buildupLevels-earlyLevels;
        const remainingAfterBuildup = connection.levelsToGenerate-buildupLevels
        for (var i = 0; i < earlyLevels; i++) {
            currentIngame.amountByLevelCache[i] = Math.ceil((30*(i+1))*connection.requiredShapesMultiplier/10);
        }
        const buildupAmount = currentIngame.amountByLevelCache[earlyLevels-1];
        const buildupNeeded = 50000-buildupAmount;
        for (var i = earlyLevels; i < buildupLevels; i++) {
            currentIngame.amountByLevelCache[i] = Math.ceil((buildupAmount+(buildupNeeded)*(i+1-earlyLevels)/earlyToBuildupLevels)*connection.requiredShapesMultiplier/10);
            currentIngame.amountByLevelCache[i] -= currentIngame.amountByLevelCache[i] % 500;
        }
        const lateAmount = currentIngame.amountByLevelCache[buildupLevels-1];
        const lateNeeded = 200000-lateAmount;
        for (var i = buildupLevels; i < connection.levelsToGenerate; i++) {
            currentIngame.amountByLevelCache[i] = Math.ceil((lateAmount+(lateNeeded)*(i+1-buildupLevels)/remainingAfterBuildup)*connection.requiredShapesMultiplier/10);
            currentIngame.amountByLevelCache[i] -= currentIngame.amountByLevelCache[i] % 500;
        }
    }
    return currentIngame.amountByLevelCache[level-1];
}

/**
 * @param {number} level
 */
function getThroughputByLevel(level) {
    if (currentIngame.throughputByLevelCache)
        return currentIngame.throughputByLevelCache[level-1];
    currentIngame.throughputByLevelCache = new Array(connection.levelsToGenerate);
    for (var i = 0; i < 26; i++) {
        currentIngame.throughputByLevelCache[i] = Math.ceil((2.999+i*0.333)*connection.requiredShapesMultiplier/10);
    }
    for (var i = 26; i < connection.levelsToGenerate; i++) {
        currentIngame.throughputByLevelCache[i] = Math.min((4+(i-26)*0.25)*connection.requiredShapesMultiplier/10, 200);
    }
    return currentIngame.throughputByLevelCache[level-1];
}

export function vanillaUpgradeShapes() {
    const rocketShape = "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw";
    const preparementShape = "CpRpCp--:SwSwSwSw";
    const finalGameShape = "RuCw--Cw:----Ru--";
    const beltshapes = [
        "CuCuCuCu",
        "--CuCu--",
        "CpCpCpCp",
        "SrSrSrSr:CyCyCyCy",
        "SrSrSrSr:CyCyCyCy:SwSwSwSw",
        preparementShape,
        finalGameShape,
        rocketShape
    ];
    const minershapes = [
        "RuRuRuRu",
        "Cu------",
        "ScScScSc",
        "CwCwCwCw:WbWbWbWb",
        "CbRbRbCb:CwCwCwCw:WbWbWbWb",
        preparementShape,
        finalGameShape,
        rocketShape
    ];
    const processorsshapes = [
        "SuSuSuSu",
        "RuRu----",
        "CgScScCg",
        "CwCrCwCr:SgSgSgSg",
        "WrRgWrRg:CwCrCwCr:SgSgSgSg",
        preparementShape,
        finalGameShape,
        rocketShape
    ];
    const paintingshapes = [
        "RbRb----",
        "WrWrWrWr",
        "RpRpRpRp:CwCwCwCw",
        "WpWpWpWp:CwCwCwCw:WpWpWpWp",
        "WpWpWpWp:CwCwCwCw:WpWpWpWp:CwCwCwCw",
        preparementShape,
        finalGameShape,
        rocketShape
    ];
    return constructUpgradeShapes(null, beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function vanillaLikeUpgradeShapes(randomizer) {
    const phase = connection.positionOfUpgradeBuilding;
    const beltshapes = [calcRandomShape(randomizer, 0, false, false, false, false, false)];
    beltshapes.push(calcRandomShape(
        randomizer, 3, phase[baseBuildingNames.cutter] <= 2, phase[baseBuildingNames.rotator] <= 2, 
        phase[baseBuildingNames.stacker] <= 2, phase[baseBuildingNames.painter] <= 2, phase[baseBuildingNames.mixer] <= 2, 
        beltshapes
    ));
    beltshapes.push(calcRandomShape(randomizer, 6, true, true, true, true, true, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, 8, true, true, true, true, true, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, 10, true, true, true, true, true, beltshapes));
    const minershapes = [calcRandomShape(randomizer, 0, false, false, false, false, false)];
    minershapes.push(calcRandomShape(
        randomizer, 3, phase[baseBuildingNames.cutter] <= 2, phase[baseBuildingNames.rotator] <= 2, 
        phase[baseBuildingNames.stacker] <= 2, phase[baseBuildingNames.painter] <= 2, phase[baseBuildingNames.mixer] <= 2, 
        minershapes
    ));
    minershapes.push(calcRandomShape(randomizer, 6, true, true, true, true, true, minershapes));
    minershapes.push(calcRandomShape(randomizer, 8, true, true, true, true, true, minershapes));
    minershapes.push(calcRandomShape(randomizer, 10, true, true, true, true, true, minershapes));
    const processorsshapes = [calcRandomShape(randomizer, 0, false, false, false, false, false)];
    processorsshapes.push(calcRandomShape(
        randomizer, 1, phase[baseBuildingNames.cutter] <= 1, phase[baseBuildingNames.rotator] <= 1, 
        phase[baseBuildingNames.stacker] <= 1, phase[baseBuildingNames.painter] <= 1, phase[baseBuildingNames.mixer] <= 1, 
        processorsshapes
    ));
    processorsshapes.push(calcRandomShape(randomizer, 6, true, true, true, true, true, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, 8, true, true, true, true, true, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, 10, true, true, true, true, true, processorsshapes));
    const paintingshapes = [calcRandomShape(
        randomizer, 3, phase[baseBuildingNames.cutter] <= 3, phase[baseBuildingNames.rotator] <= 3, 
        phase[baseBuildingNames.stacker] <= 3, phase[baseBuildingNames.painter] <= 3, phase[baseBuildingNames.mixer] <= 3
    )];
    paintingshapes.push(calcRandomShape(
        randomizer, 4, phase[baseBuildingNames.cutter] <= 3, phase[baseBuildingNames.rotator] <= 3, 
        phase[baseBuildingNames.stacker] <= 3, phase[baseBuildingNames.painter] <= 3, phase[baseBuildingNames.mixer] <= 3, 
        paintingshapes
    ));
    paintingshapes.push(calcRandomShape(randomizer, 6, true, true, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, 8, true, true, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, 10, true, true, true, true, true, paintingshapes));
    return constructUpgradeShapes(randomizer, beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function linearUpgradeShapes(randomizer) {
    const phase = connection.positionOfUpgradeBuilding;
    const beltshapes = [calcRandomShape(randomizer, 0, false, false, false, false, false)];
    for (var nextindex = 1; nextindex < 5; nextindex++) {
        beltshapes.push(calcRandomShape(randomizer, nextindex+1, 
            phase[baseBuildingNames.cutter] <= nextindex, 
            phase[baseBuildingNames.rotator] <= nextindex, 
            phase[baseBuildingNames.stacker] <= nextindex, 
            phase[baseBuildingNames.painter] <= nextindex, 
            phase[baseBuildingNames.mixer] <= nextindex, 
            beltshapes));
    }
    const minershapes = [calcRandomShape(randomizer, 0, false, false, false, false, false)];
    for (var nextindex = 1; nextindex < 5; nextindex++) {
        minershapes.push(calcRandomShape(randomizer, nextindex+1, 
            phase[baseBuildingNames.cutter] <= nextindex, 
            phase[baseBuildingNames.rotator] <= nextindex, 
            phase[baseBuildingNames.stacker] <= nextindex, 
            phase[baseBuildingNames.painter] <= nextindex, 
            phase[baseBuildingNames.mixer] <= nextindex, 
            minershapes));
    }
    const processorsshapes = [calcRandomShape(randomizer, 0, false, false, false, false, false)];
    for (var nextindex = 1; nextindex < 5; nextindex++) {
        processorsshapes.push(calcRandomShape(randomizer, nextindex+1, 
            phase[baseBuildingNames.cutter] <= nextindex, 
            phase[baseBuildingNames.rotator] <= nextindex, 
            phase[baseBuildingNames.stacker] <= nextindex, 
            phase[baseBuildingNames.painter] <= nextindex, 
            phase[baseBuildingNames.mixer] <= nextindex, 
            processorsshapes));
    }
    const paintingshapes = [calcRandomShape(randomizer, 0, false, false, false, false, false)];
    for (var nextindex = 1; nextindex < 5; nextindex++) {
        paintingshapes.push(calcRandomShape(randomizer, nextindex+1, 
            phase[baseBuildingNames.cutter] <= nextindex, 
            phase[baseBuildingNames.rotator] <= nextindex, 
            phase[baseBuildingNames.stacker] <= nextindex, 
            phase[baseBuildingNames.painter] <= nextindex, 
            phase[baseBuildingNames.mixer] <= nextindex, 
            paintingshapes));
    }
    return constructUpgradeShapes(randomizer, beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function categoryUpgradeShapes(randomizer) {
    const beltshapes = [calcRandomShape(randomizer, 0, false, false, false, false, false)];
    beltshapes.push(calcRandomShape(randomizer, 0, false, false, false, false, false, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, 0, false, false, false, false, false, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, 0, false, false, false, false, false, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, 8, true, true, true, true, true, beltshapes));
    const minershapes = [calcRandomShape(randomizer, 0, false, false, false, false, false)];
    minershapes.push(calcRandomShape(randomizer, 0, false, false, false, false, false, minershapes));
    minershapes.push(calcRandomShape(randomizer, 0, false, false, false, false, false, minershapes));
    minershapes.push(calcRandomShape(randomizer, 0, false, false, false, false, false, minershapes));
    minershapes.push(calcRandomShape(randomizer, 8, true, true, true, true, true, minershapes));
    const processorsshapes = [calcRandomShape(randomizer, 1, true, false, false, false, false)];
    processorsshapes.push(calcRandomShape(randomizer, 1, true, false, false, false, false, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, 2, true, true, false, false, false, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, 3, true, true, false, false, false, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, 6, true, true, true, false, false, processorsshapes));
    const paintingshapes = [calcRandomShape(randomizer, 1, false, false, false, true, false)];
    paintingshapes.push(calcRandomShape(randomizer, 2, true, false, false, true, false, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, 5, true, false, true, true, false, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, 5, false, false, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, 8, true, true, true, true, true, paintingshapes));
    return constructUpgradeShapes(randomizer, beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function categoryRandomUpgradeShapes(randomizer) {
    const phase = connection.positionOfUpgradeBuilding;
    const amountBelt = connection.categoryRandomBuildingsAmounts.belt;
    const amountMiner = connection.categoryRandomBuildingsAmounts.miner;
    const amountProcessors = connection.categoryRandomBuildingsAmounts.processors;
    const amountPainting = connection.categoryRandomBuildingsAmounts.painting;
    const beltshapes = [calcRandomShape(randomizer, amountBelt+1, 
        phase[baseBuildingNames.cutter] <= amountBelt, phase[baseBuildingNames.rotator] <= amountBelt, 
        phase[baseBuildingNames.stacker] <= amountBelt, phase[baseBuildingNames.painter] <= amountBelt, 
        phase[baseBuildingNames.mixer] <= amountBelt)];
    beltshapes.push(calcRandomShape(randomizer, amountBelt+2, 
        phase[baseBuildingNames.cutter] <= amountBelt, phase[baseBuildingNames.rotator] <= amountBelt, 
        phase[baseBuildingNames.stacker] <= amountBelt, phase[baseBuildingNames.painter] <= amountBelt, 
        phase[baseBuildingNames.mixer] <= amountBelt, 
        beltshapes));
    beltshapes.push(calcRandomShape(randomizer, amountBelt+3, 
        phase[baseBuildingNames.cutter] <= amountBelt, phase[baseBuildingNames.rotator] <= amountBelt, 
        phase[baseBuildingNames.stacker] <= amountBelt, phase[baseBuildingNames.painter] <= amountBelt, 
        phase[baseBuildingNames.mixer] <= amountBelt, 
        beltshapes));
    beltshapes.push(calcRandomShape(randomizer, amountBelt+4, 
        phase[baseBuildingNames.cutter] <= amountBelt, phase[baseBuildingNames.rotator] <= amountBelt, 
        phase[baseBuildingNames.stacker] <= amountBelt, phase[baseBuildingNames.painter] <= amountBelt, 
        phase[baseBuildingNames.mixer] <= amountBelt, 
        beltshapes));
    beltshapes.push(calcRandomShape(randomizer, 10, true, true, true, true, true, beltshapes));
    const minershapes = [calcRandomShape(randomizer, amountMiner+1, 
        phase[baseBuildingNames.cutter] <= amountMiner, phase[baseBuildingNames.rotator] <= amountMiner, 
        phase[baseBuildingNames.stacker] <= amountMiner, phase[baseBuildingNames.painter] <= amountMiner, 
        phase[baseBuildingNames.mixer] <= amountMiner)];
    minershapes.push(calcRandomShape(randomizer, amountMiner+2, 
        phase[baseBuildingNames.cutter] <= amountMiner, phase[baseBuildingNames.rotator] <= amountMiner, 
        phase[baseBuildingNames.stacker] <= amountMiner, phase[baseBuildingNames.painter] <= amountMiner, 
        phase[baseBuildingNames.mixer] <= amountMiner, 
        minershapes));
    minershapes.push(calcRandomShape(randomizer, amountMiner+3, 
        phase[baseBuildingNames.cutter] <= amountMiner, phase[baseBuildingNames.rotator] <= amountMiner, 
        phase[baseBuildingNames.stacker] <= amountMiner, phase[baseBuildingNames.painter] <= amountMiner, 
        phase[baseBuildingNames.mixer] <= amountMiner, 
        minershapes));
    minershapes.push(calcRandomShape(randomizer, amountMiner+4, 
        phase[baseBuildingNames.cutter] <= amountMiner, phase[baseBuildingNames.rotator] <= amountMiner, 
        phase[baseBuildingNames.stacker] <= amountMiner, phase[baseBuildingNames.painter] <= amountMiner, 
        phase[baseBuildingNames.mixer] <= amountMiner, 
        minershapes));
    minershapes.push(calcRandomShape(randomizer, 10, true, true, true, true, true, minershapes));
    const processorsshapes = [calcRandomShape(randomizer, amountProcessors+1, 
        phase[baseBuildingNames.cutter] <= amountProcessors, phase[baseBuildingNames.rotator] <= amountProcessors, 
        phase[baseBuildingNames.stacker] <= amountProcessors, phase[baseBuildingNames.painter] <= amountProcessors, 
        phase[baseBuildingNames.mixer] <= amountProcessors)];
    processorsshapes.push(calcRandomShape(randomizer, amountProcessors+2, 
        phase[baseBuildingNames.cutter] <= amountProcessors, phase[baseBuildingNames.rotator] <= amountProcessors, 
        phase[baseBuildingNames.stacker] <= amountProcessors, phase[baseBuildingNames.painter] <= amountProcessors, 
        phase[baseBuildingNames.mixer] <= amountProcessors, 
        processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, amountProcessors+3, 
        phase[baseBuildingNames.cutter] <= amountProcessors, phase[baseBuildingNames.rotator] <= amountProcessors, 
        phase[baseBuildingNames.stacker] <= amountProcessors, phase[baseBuildingNames.painter] <= amountProcessors, 
        phase[baseBuildingNames.mixer] <= amountProcessors, 
        processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, amountProcessors+4, 
        phase[baseBuildingNames.cutter] <= amountProcessors, phase[baseBuildingNames.rotator] <= amountProcessors, 
        phase[baseBuildingNames.stacker] <= amountProcessors, phase[baseBuildingNames.painter] <= amountProcessors, 
        phase[baseBuildingNames.mixer] <= amountProcessors, 
        processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, 10, true, true, true, true, true, processorsshapes));
    const paintingshapes = [calcRandomShape(randomizer, amountPainting+1, 
        phase[baseBuildingNames.cutter] <= amountPainting, phase[baseBuildingNames.rotator] <= amountPainting, 
        phase[baseBuildingNames.stacker] <= amountPainting, phase[baseBuildingNames.painter] <= amountPainting, 
        phase[baseBuildingNames.mixer] <= amountPainting)];
    paintingshapes.push(calcRandomShape(randomizer, amountPainting+2, 
        phase[baseBuildingNames.cutter] <= amountPainting, phase[baseBuildingNames.rotator] <= amountPainting, 
        phase[baseBuildingNames.stacker] <= amountPainting, phase[baseBuildingNames.painter] <= amountPainting, 
        phase[baseBuildingNames.mixer] <= amountPainting, 
        paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, amountPainting+3, 
        phase[baseBuildingNames.cutter] <= amountPainting, phase[baseBuildingNames.rotator] <= amountPainting, 
        phase[baseBuildingNames.stacker] <= amountPainting, phase[baseBuildingNames.painter] <= amountPainting, 
        phase[baseBuildingNames.mixer] <= amountPainting, 
        paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, amountPainting+4, 
        phase[baseBuildingNames.cutter] <= amountPainting, phase[baseBuildingNames.rotator] <= amountPainting, 
        phase[baseBuildingNames.stacker] <= amountPainting, phase[baseBuildingNames.painter] <= amountPainting, 
        phase[baseBuildingNames.mixer] <= amountPainting, 
        paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, 10, true, true, true, true, true, paintingshapes));
    return constructUpgradeShapes(randomizer, beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function hardcoreUpgradeShapes(randomizer) {
    const beltshapes = [calcRandomShape(randomizer, 5, false, false, false, false, false)];
    beltshapes.push(calcRandomShape(randomizer, 6, true, true, true, true, true, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, 7, true, true, true, true, true, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, 8, true, true, true, true, true, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, 9, true, true, true, true, true, beltshapes));
    const minershapes = [calcRandomShape(randomizer, 5, false, false, false, false, false)];
    minershapes.push(calcRandomShape(randomizer, 6, true, true, true, true, true, minershapes));
    minershapes.push(calcRandomShape(randomizer, 7, true, true, true, true, true, minershapes));
    minershapes.push(calcRandomShape(randomizer, 8, true, true, true, true, true, minershapes));
    minershapes.push(calcRandomShape(randomizer, 9, true, true, true, true, true, minershapes));
    const processorsshapes = [calcRandomShape(randomizer, 5, false, false, false, false, false)];
    processorsshapes.push(calcRandomShape(randomizer, 6, true, true, true, true, true, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, 7, true, true, true, true, true, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, 8, true, true, true, true, true, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, 9, true, true, true, true, true, processorsshapes));
    const paintingshapes = [calcRandomShape(randomizer, 5, false, false, false, false, false)];
    paintingshapes.push(calcRandomShape(randomizer, 6, true, true, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, 7, true, true, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, 8, true, true, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, 9, true, true, true, true, true, paintingshapes));
    return constructUpgradeShapes(randomizer, beltshapes, minershapes, processorsshapes, paintingshapes);
}

/**
 * @param {RandomNumberGenerator} randomizer
 * @param {string[]} beltshapes
 * @param {string[]} minershapes
 * @param {string[]} processorsshapes
 * @param {string[]} [paintingshapes]
 */
function constructUpgradeShapes(randomizer, beltshapes, minershapes, processorsshapes, paintingshapes) {
    if (!randomizer) {
        // vanilla late shapes already included
    } else if (connection.isSameLate) {
        const late1 = calcRandomShape(randomizer, 12, true, true, true, true, true);
        const late2 = calcRandomShape(randomizer, 18, true, true, true, true, true, [late1]);
        const late3 = calcRandomShape(randomizer, 30, true, true, true, true, true, [late1, late2]);
        beltshapes.push(late1, late2, late3);
        minershapes.push(late1, late2, late3);
        processorsshapes.push(late1, late2, late3);
        paintingshapes.push(late1, late2, late3);
    } else {
        for (var category of [beltshapes, minershapes, processorsshapes, paintingshapes]) {
            category.push(calcRandomShape(randomizer, 12, true, true, true, true, true));
            category.push(calcRandomShape(randomizer, 18, true, true, true, true, true, [category[5]]));
            category.push(calcRandomShape(randomizer, 30, true, true, true, true, true, [category[5], category[6]]));
        }
    }
    const multiplier = connection.requiredShapesMultiplier;
    var upgradedefs = {
        belt: [
            {required: [
                { shape: beltshapes[0], amount: Math.ceil(30*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: beltshapes[0], amount: Math.ceil(75*multiplier/10) },
                { shape: beltshapes[1], amount: Math.ceil(500*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: beltshapes[0], amount: Math.ceil(180*multiplier/10) },
                { shape: beltshapes[1], amount: Math.ceil(1200*multiplier/10) },
                { shape: beltshapes[2], amount: Math.ceil(1000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: beltshapes[0], amount: Math.ceil(440*multiplier/10) },
                { shape: beltshapes[1], amount: Math.ceil(3000*multiplier/10) },
                { shape: beltshapes[2], amount: Math.ceil(2500*multiplier/10) },
                { shape: beltshapes[3], amount: Math.ceil(6000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: beltshapes[0], amount: Math.ceil(1100*multiplier/10) },
                { shape: beltshapes[1], amount: Math.ceil(7000*multiplier/10) },
                { shape: beltshapes[2], amount: Math.ceil(6000*multiplier/10) },
                { shape: beltshapes[3], amount: Math.ceil(15000*multiplier/10) },
                { shape: beltshapes[4], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: beltshapes[5], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: beltshapes[5], amount: Math.ceil(25000*multiplier/10) },
                { shape: beltshapes[6], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true, improvement: 0}
        ],
        miner: [
            {required: [
                { shape: minershapes[0], amount: Math.ceil(300*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: minershapes[0], amount: Math.ceil(740*multiplier/10) },
                { shape: minershapes[1], amount: Math.ceil(800*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: minershapes[0], amount: Math.ceil(1800*multiplier/10) },
                { shape: minershapes[1], amount: Math.ceil(2000*multiplier/10) },
                { shape: minershapes[2], amount: Math.ceil(3500*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: minershapes[0], amount: Math.ceil(4500*multiplier/10) },
                { shape: minershapes[1], amount: Math.ceil(5000*multiplier/10) },
                { shape: minershapes[2], amount: Math.ceil(8000*multiplier/10) },
                { shape: minershapes[3], amount: Math.ceil(23000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: minershapes[0], amount: Math.ceil(11000*multiplier/10) },
                { shape: minershapes[1], amount: Math.ceil(12000*multiplier/10) },
                { shape: minershapes[2], amount: Math.ceil(20000*multiplier/10) },
                { shape: minershapes[3], amount: Math.ceil(50000*multiplier/10) },
                { shape: minershapes[4], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: minershapes[5], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: minershapes[5], amount: Math.ceil(25000*multiplier/10) },
                { shape: minershapes[6], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true, improvement: 0}
        ],
        processors: [
            {required: [
                { shape: processorsshapes[0], amount: Math.ceil(500*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: processorsshapes[0], amount: Math.ceil(1200*multiplier/10) },
                { shape: processorsshapes[1], amount: Math.ceil(600*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: processorsshapes[0], amount: Math.ceil(3000*multiplier/10) },
                { shape: processorsshapes[1], amount: Math.ceil(1500*multiplier/10) },
                { shape: processorsshapes[2], amount: Math.ceil(3500*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: processorsshapes[0], amount: Math.ceil(7000*multiplier/10) },
                { shape: processorsshapes[1], amount: Math.ceil(3500*multiplier/10) },
                { shape: processorsshapes[2], amount: Math.ceil(8000*multiplier/10) },
                { shape: processorsshapes[3], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: processorsshapes[0], amount: Math.ceil(17000*multiplier/10) },
                { shape: processorsshapes[1], amount: Math.ceil(8000*multiplier/10) },
                { shape: processorsshapes[2], amount: Math.ceil(20000*multiplier/10) },
                { shape: processorsshapes[3], amount: Math.ceil(60000*multiplier/10) },
                { shape: processorsshapes[4], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: processorsshapes[5], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: processorsshapes[5], amount: Math.ceil(25000*multiplier/10) },
                { shape: processorsshapes[6], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true, improvement: 0}
        ],
        painting: [
            {required: [
                { shape: paintingshapes[0], amount: Math.ceil(600*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: paintingshapes[0], amount: Math.ceil(1500*multiplier/10) },
                { shape: paintingshapes[1], amount: Math.ceil(3800*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: paintingshapes[0], amount: Math.ceil(3500*multiplier/10) },
                { shape: paintingshapes[1], amount: Math.ceil(9000*multiplier/10) },
                { shape: paintingshapes[2], amount: Math.ceil(6500*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: paintingshapes[0], amount: Math.ceil(8000*multiplier/10) },
                { shape: paintingshapes[1], amount: Math.ceil(20000*multiplier/10) },
                { shape: paintingshapes[2], amount: Math.ceil(16000*multiplier/10) },
                { shape: paintingshapes[3], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: paintingshapes[0], amount: Math.ceil(20000*multiplier/10) },
                { shape: paintingshapes[1], amount: Math.ceil(50000*multiplier/10) },
                { shape: paintingshapes[2], amount: Math.ceil(40000*multiplier/10) },
                { shape: paintingshapes[3], amount: Math.ceil(60000*multiplier/10) },
                { shape: paintingshapes[4], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: paintingshapes[5], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true, improvement: 0},
            {required: [
                { shape: paintingshapes[5], amount: Math.ceil(25000*multiplier/10) },
                { shape: paintingshapes[6], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true, improvement: 0}
        ]
    };
    for (var i = 9; i <= connection.tiersToGenerate; i++) {
        upgradedefs.belt.push({required: [
            { shape: beltshapes[5], amount: Math.ceil((-60000 + i * 10000)*multiplier/10) },
            { shape: beltshapes[6], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) },
            { shape: beltshapes[7], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) }
        ], excludePrevious: true, improvement: 0});
        upgradedefs.miner.push({required: [
            { shape: minershapes[5], amount: Math.ceil((-60000 + i * 10000)*multiplier/10) },
            { shape: minershapes[6], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) },
            { shape: minershapes[7], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) }
        ], excludePrevious: true, improvement: 0});
        upgradedefs.processors.push({required: [
            { shape: processorsshapes[5], amount: Math.ceil((-60000 + i * 10000)*multiplier/10) },
            { shape: processorsshapes[6], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) },
            { shape: processorsshapes[7], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) }
        ], excludePrevious: true, improvement: 0});
        upgradedefs.painting.push({required: [
            { shape: paintingshapes[5], amount: Math.ceil((-60000 + i * 10000)*multiplier/10) },
            { shape: paintingshapes[6], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) },
            { shape: paintingshapes[7], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) }
        ], excludePrevious: true, improvement: 0});
    }
    return upgradedefs;
}

const NONE = 0;
const VERTICAL = 1;
const HORIZONTAL = 2;

/**
 * @param {RandomNumberGenerator} randomizer
 * @returns {string} full shape
 * @param {number} complexity Amount of operations
 * @param {boolean} hasCutter
 * @param {boolean} hasRotator
 * @param {boolean} hasStacker
 * @param {boolean} hasPainter
 * @param {boolean} hasMixer
 * @param {Array<string>} exclude
 */
function calcRandomShape(randomizer, complexity, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer, exclude = []) {
    // complexity = Math.min(complexity, 40);
    let hash = "";
    do {
        // There should always be at least as many complexity as there are available buildings.
        // !hasCutter because single layer always needs cutting as first processing.
        // complexity < 3 || (complexity == 3 && hasRotator) because single layers need more processing to get to first stacking.
        // 33% chance to still be single layer.
        if (hasStacker && (
            !hasCutter || complexity < 3 || (complexity == 3 && hasRotator) || randomizer.choice([true, true, true, false])
        )) { 
            let available = getBuildingBools(hasCutter, hasRotator, hasStacker, hasPainter, hasMixer);
            let tasked = getBuildingBools(hasCutter, hasRotator, false, hasPainter, hasMixer);
            /** @type {[number]}*/ let floatCutting = [NONE];
            // Randomize layer count while considering that you need to stack layers
            let layercount = Math.min(
                randomizer.choice([2, 2, 2, 3, 3, 4]), complexity+1-addBoolean(hasCutter, hasRotator, hasPainter, hasMixer)
            );
            // Subtract the stacking from complexity
            complexity -= layercount-1;
            // Generate layers
            for (let i = layercount-1; i > 0; i--) {
                let complexityPart = weightedRandomIntRange(randomizer, 0, complexity-addBoolean(
                    tasked.cutter, tasked.rotator, tasked.painter || tasked.mixer, tasked.mixer
                ));
                complexity -= complexityPart;
                let layer = calcRandomLayer(randomizer, complexityPart, available, tasked, getEmptyBuildingBools());
                hash = stackLayers(hash, layer, available, tasked, floatCutting);
            }
            hash = stackLayers(hash, calcRandomLayer(
                randomizer, complexity, available, tasked, copyBuildingBools(tasked)
            ), available, tasked, floatCutting);
        } else {
            let available = getBuildingBools(hasCutter, hasRotator, hasStacker, hasPainter, hasMixer);
            hash = calcRandomLayer(
                randomizer, complexity, available, copyBuildingBools(available), copyBuildingBools(available)
            );
        }
    } while (exclude.includes(hash) || (hash.length > 8 && hash.startsWith("RrRrRrRr")));
    return hash;
}

/**
 * @param {string} bottom
 * @param {string} newlayer
 * @returns {string} bottom:newlayer or newlayer merged with top layer of bottom
 * @param {buildingBools} available
 * @param {buildingBools} tasked
 * @param {[number]} floatCutting
 */
function stackLayers(bottom, newlayer, available, tasked, floatCutting) {
    if (bottom === "") return newlayer;
    if (connection.isFloatingLayersAllowed && available.rotator) { // rotator only ever available if cutter available
        if (floatCutting[0] != HORIZONTAL && 
            !(newlayer.substring(0, 4) !== "----" && bottom.substring(bottom.length-8, bottom.length-4) === "----") && 
            !(newlayer.substring(4) !== "----" && bottom.substring(bottom.length-4) === "----")) {
            floatCutting[0] = VERTICAL;
            tasked.rotator = false;
            tasked.cutter = false;
            return bottom + ":" + newlayer;
        }
        if (floatCutting[0] != VERTICAL && 
            !(newlayer.substring(2, 6) !== "----" && bottom.substring(bottom.length-6, bottom.length-2) === "----") && 
            !((newlayer.charAt(6) !== "-" || newlayer.charAt(0) !== "-") && 
              (bottom.charAt(bottom.length-2) === "-" && bottom.charAt(bottom.length-8) === "-"))) {
            floatCutting[0] = HORIZONTAL;
            tasked.rotator = false;
            tasked.cutter = false;
            return bottom + ":" + newlayer;
        }
    }
    let copy = bottom.substring(0, bottom.length-8);
    for (let i = 8; i > 0; i -= 2) {
        if (bottom.charAt(bottom.length-i) === "-") {
            copy = copy + newlayer.substring(8-i, 10-i);
        } else {
            if (newlayer.charAt(8-i) === "-") {
                copy = copy + bottom.substring(bottom.length-i, bottom.length+2-i);
            } else {
                return bottom + ":" + newlayer;
            }
        }
    }
    return copy;
}

/**
 * @param {RandomNumberGenerator} randomizer
 * @returns {string} XxXxXxXx
 * @param {number} complexity
 * @param {buildingBools} available
 * @param {buildingBools} tasked
 * @param {buildingBools} important
 */
function calcRandomLayer(randomizer, complexity, available, tasked, important) {
    // Save complexities for later if rotator, painter, and mixer is important.
    let savedRotator = addBoolean(important.rotator);
    if (savedRotator) important.rotator = false;
    let savedPainterMixer = important.mixer ? 2 : (important.painter ? 1 : 0);
    complexity -= savedRotator + savedPainterMixer;
    let variant = [8];
    if (available.cutter) {
        if (complexity) variant.push(1, 9);
        if (available.stacker) {
            if (complexity >= 3) variant.push(2, 10);
            if (available.rotator) {
                if (complexity >= 3) variant.push(7);
                if (complexity >= 4) variant.push(3);
                if (complexity >= 5) variant.push(5);
                if (complexity >= 8) variant.push(4);
                if (complexity >= 11) variant.push(6);
            }
        }
        if (addBoolean(important.cutter, important.rotator, important.stacker)) {
            if (!available.stacker) variant = [1, 9];
            else if (!available.rotator) { // stacker available, but not rotator
                variant = [2, 10];
                if (!important.stacker) variant.push(1, 9);
            } else { // stacker and rotator available
                // remove 8, it's always first element
                variant.splice(1);
                if (important.rotator) {
                    // remove 1, 9 if cutterImp or comp < 7
                    if ((important.cutter || complexity < 7) && variant[0] == 1) {
                        variant.splice(2);
                    }
                } else if (important.stacker) {
                    // First remove 1, 2, 9, 10 to then re-add them
                    if (variant[0] == 1) variant.splice(2);
                    if (variant[0] == 2) variant.splice(2);
                    // add 1, 9 if comp >= 7 and 2, 10 if comp >= 9
                    if (complexity >= 7) variant.push(1, 9);
                    if (complexity >= 9) variant.push(2, 10);
                }
            }
        }
    }
    // Bring back needed painter and mixer complexity
    complexity += savedPainterMixer;
    let layer = "";
    switch (randomizer.choice(variant)) {
        case 1:
            tasked.cutter = false;
            important.cutter = false;
            complexity--;
            layer = calcRandomHalf(randomizer, complexity, available, tasked, important);
            if (isWindmillHalf(layer) || randomizer.choice([true, false])) layer = "----" + layer;
            else layer = layer + "----";
            break;
        case 2:
            // There is no point in updating important
            tasked.cutter = false;
            tasked.stacker = false;
            complexity -= 3;
            var complexityPart = weightedRandomIntRange(randomizer, 0, complexity-addBoolean(
                important.rotator, important.painter || important.mixer, important.mixer
            ));
            complexity -= complexityPart;
            /** @type {buildingBools} */var resetTasked;
            do {
                resetTasked = copyBuildingBools(tasked)
                layer = calcRandomHalf(randomizer, complexityPart, available, resetTasked, getEmptyBuildingBools());
            }
            while (isWindmillHalf(layer));
            layer += calcRandomHalf(
                randomizer, complexity, available, resetTasked, updateBuildingBoolCompletions(important, resetTasked)
            );
            break;
        case 3:
            // There is no point in updating painting-unrelated important
            tasked.cutter = false;
            tasked.rotator = false;
            tasked.stacker = false;
            complexity -= 4;
            layer = calcRandomSubShape(randomizer, true) + calcRandomColor(randomizer, complexity, available, tasked, important);
            switch (randomizer.nextIntRange(0, 4)) {
                case 0: layer = "--" + layer + layer + layer; break
                case 1: layer = layer + "--" + layer + layer; break
                case 2: layer = layer + layer + "--" + layer; break
                case 3: layer = layer + layer + layer + "--"; break
            }
            break;
        case 4:
            // There is no point in updating important
            tasked.cutter = false;
            tasked.rotator = false;
            tasked.stacker = false;
            complexity -= 8;
            var complexityPart = weightedRandomIntRange(randomizer, 0, complexity-addBoolean(
                important.painter || important.mixer, important.mixer
            ));
            complexity -= complexityPart;
            layer = calcRandomSubShape(randomizer, true) + calcRandomColor(
                randomizer, complexity, available, tasked, getEmptyBuildingBools()
            );
            let single = calcRandomSubShape(randomizer, true) + calcRandomColor(
                randomizer, complexity, available, tasked, updateBuildingBoolCompletions(important, tasked), layer.charAt(1)
            );
            switch (randomizer.nextIntRange(0, 4)) {
                case 0: layer = single + layer + layer + layer; break
                case 1: layer = layer + single + layer + layer; break
                case 2: layer = layer + layer + single + layer; break
                case 3: layer = layer + layer + layer + single; break
            }
            break;
        case 5:
            // There is no point in updating painting-unrelated important
            tasked.cutter = false;
            tasked.rotator = false;
            tasked.stacker = false;
            complexity -= 5;
            layer = calcRandomSubShape(randomizer, true) + calcRandomColor(randomizer, complexity, available, tasked, important);
            if (randomizer.choice([true, false])) layer = "--" + layer + "--" + layer;
            else layer = layer + "--" + layer + "--";
            break;
        case 6:
            // There is no point in updating painting-unrelated important
            tasked.cutter = false;
            tasked.rotator = false;
            tasked.stacker = false;
            complexity -= 11;
            var color = calcRandomColor(randomizer, complexity, available, tasked, important);
            let shapePool = ["--", "C"+color, "R"+color, "S"+color, "W"+color];
            for (let i = 0; i < 4; i++) {
                let index = randomizer.nextIntRange(0, shapePool.length);
                layer += shapePool[index];
                shapePool.splice(index, 1);
            }
            break;
        case 7:
            tasked.cutter = false;
            important.cutter = false;
            tasked.rotator = false;
            important.rotator = false;
            tasked.stacker = false;
            important.stacker = false;
            complexity -= 3;
            layer = calcRandomHalf(randomizer, complexity, available, tasked, important);
            layer += layer;
            break;
        case 8:
            var color = calcRandomColor(randomizer, complexity, available, tasked, important);
            switch (randomizer.nextIntRange(0, 4)) {
                case 0: layer = "C"+color+"C"+color+"C"+color+"C"+color; break;
                case 1: layer = "R"+color+"R"+color+"R"+color+"R"+color; break;
                case 2: layer = "S"+color+"S"+color+"S"+color+"S"+color; break;
                case 3: layer = "R"+color+"R"+color+"W"+color+"W"+color; break;
            }
            break;
        case 9:
            tasked.cutter = false;
            important.cutter = false;
            complexity--;
            layer = calcRandomHalf(randomizer, complexity, available, tasked, important);
            if (!complexity || randomizer.choice([true, false])) layer = "----" + layer;
            else {
                if (isWindmillHalf(layer)) complexity--;
                layer = layer + "----"
            };
            break;
        case 10:
            // There is no point in updating important
            tasked.cutter = false;
            tasked.stacker = false;
            complexity -= 3;
            var complexityPart = weightedRandomIntRange(randomizer, 0, complexity-addBoolean(
                important.rotator, important.painter || important.mixer, important.mixer
            ));
            complexity -= complexityPart;
            var resetTasked = copyBuildingBools(tasked);
            layer = calcRandomHalf(randomizer, complexityPart, available, resetTasked, getEmptyBuildingBools());
            if (complexity) {
                if (isWindmillHalf(layer)) complexity--;
                layer += calcRandomHalf(
                    randomizer, complexity, available, resetTasked, updateBuildingBoolCompletions(important, resetTasked)
                );
            } else {
                while (isWindmillHalf(layer)) {
                    resetTasked = copyBuildingBools(tasked);
                    layer = calcRandomHalf(randomizer, complexityPart, available, resetTasked, getEmptyBuildingBools());
                }
                layer += calcRandomHalf(randomizer, complexity, available, resetTasked, 
                    updateBuildingBoolCompletions(important, resetTasked)
                );
            }
            break;
    }
    // savedRotator is only 1 if it's important
    if (savedRotator || (available.rotator && complexity && randomizer.choice([true, false]))) {
        layer = layer.substring(2, 8) + layer.substring(0, 2);
    }
    return layer;
}

/**
 * 
 * @param {string} half 
 * @returns {boolean} WxWx
 */
function isWindmillHalf(half) {
    return half.charAt(0) === "W" && half.charAt(2) === "W";
}

/**
 * Only called if hasCutter == true
 * @param {RandomNumberGenerator} randomizer
 * @returns {string} XxXx
 * @param {number} complexity
 * @param {buildingBools} available
 * @param {buildingBools} tasked
 * @param {buildingBools} important
 */
function calcRandomHalf(randomizer, complexity, available, tasked, important) {
    let complexityProcessing = complexity - addBoolean(important.painter || important.mixer, important.mixer);
    let pool = [0];
    let part = "";
    if (available.rotator && complexityProcessing >= 2) pool.push(1);
    if (available.rotator && available.stacker && complexityProcessing >= 6) pool.push(2);
    if (important.rotator || important.stacker) pool.splice(0, 1);
    if (important.stacker && pool[0] == 1) pool.splice(0, 1);
    switch (randomizer.choice(pool)) {
        case 0:
            part = calcRandomSubShape(randomizer, true) + calcRandomColor(randomizer, complexity, available, tasked, important);
            part += part;
            break;
        case 1:
            // There is no point in updating important
            tasked.rotator = false;
            complexity -= 2;
            part = calcRandomSubShape(randomizer, true) + calcRandomColor(randomizer, complexity, available, tasked, important);
            if (randomizer.choice([true, false])) part += "--";
            else part = "--" + part;
            break;
        case 2:
            // There is no point in updating important
            tasked.rotator = false;
            tasked.stacker = false;
            complexity -= 6;
            let complexityPart = weightedRandomIntRange(randomizer, 0, complexity-addBoolean(
                important.painter || important.mixer, important.mixer
            ));
            part = calcRandomSubShape(randomizer, true) + calcRandomColor(
                randomizer, complexityPart, available, tasked, getEmptyBuildingBools()
            );
            part += calcRandomSubShape(randomizer, true) + calcRandomColor(
                randomizer, complexity-complexityPart, available, tasked, 
                updateBuildingBoolCompletions(important, tasked), part.charAt(1)
            );
            break;
    }
    return part;
}

/**
 * @param {RandomNumberGenerator} randomizer
 * @param {boolean} windmillAllowed
 */
function calcRandomSubShape(randomizer, windmillAllowed) {
    let pool = ["C", "R", "S"];
    if (windmillAllowed) pool.push("W");
    return randomizer.choice(pool);
}

/**
 * @param {RandomNumberGenerator} randomizer
 * @param {number} complexity
 * @param {buildingBools} available
 * @param {buildingBools} tasked
 * @param {buildingBools} important
 */
function calcRandomColor(randomizer, complexity, available, tasked, important, preferredColor = null) {
    let pool = ["u"];
    if (available.painter && complexity) pool.push("r", "g", "b");
    if (available.mixer && complexity >= 2) pool.push("y", "p", "c");
    if (available.mixer && complexity >= 3) pool.push("w");
    if (important.painter || important.mixer) pool.splice(0, 1);
    if (important.mixer) pool.splice(0, 3);
    if (preferredColor) {
        let includePreferred = false;
        for (let c of pool) if (c === preferredColor) includePreferred = true;
        if (includePreferred) for (let i = pool.length-2; i > 0; i--) pool.push(preferredColor);
    }
    let ret = randomizer.choice(pool);
    if (ret !== "u") {tasked.painter = false; important.painter = false;}
    if (!["u", "r", "g", "b"].includes(ret)) {tasked.mixer = false; important.mixer = false;}
    return ret;
}

/**
 * @param {RandomNumberGenerator} randomizer
 * @param {number} start inclusive
 * @param {number} end inclusive
 */
function weightedRandomIntRange(randomizer, start, end) {
    return start 
        + randomizer.nextIntRange(0, Math.floor((end-start)/2)+1) 
        + randomizer.nextIntRange(0, Math.ceil((end-start)/2)+1);
}

function addBoolean(... bool) {
    let sum = 0;
    for (let b of bool) if (b) sum++;
    return sum;
}

/**
 * @param {boolean} hasCutter
 * @param {boolean} hasRotator
 * @param {boolean} hasStacker
 * @param {boolean} hasPainter
 * @param {boolean} hasMixer
 * @returns {buildingBools}
 */
function getBuildingBools(hasCutter, hasRotator, hasStacker, hasPainter, hasMixer) {
    return {
        cutter: hasCutter,
        rotator: hasRotator,
        stacker: hasStacker,
        painter: hasPainter,
        mixer: hasMixer
    };
}

/**
 * @returns {buildingBools}
 */
function getEmptyBuildingBools() {
    return {
        cutter: false,
        rotator: false,
        stacker: false,
        painter: false,
        mixer: false
    };
}

/**
 * @param {buildingBools} old
 * @returns {buildingBools}
 */
function copyBuildingBools(old) {
    let copy = getEmptyBuildingBools();
    for (let building in old) copy[building] = old[building];
    return copy;
}

/**
 * @param {buildingBools} toupdate
 * @param {buildingBools} template
 * @returns {buildingBools} toupdate
 */
function updateBuildingBoolCompletions(toupdate, template) {
    for (let building in toupdate) toupdate[building] &= template[building];
    return toupdate
}
