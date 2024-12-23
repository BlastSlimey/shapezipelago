import { RandomNumberGenerator } from "shapez/core/rng";
import { apdebuglog, baseBuildingNames, connection, currentIngame, customRewards, modImpl } from "./global_data";

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
        {shape: "CrCwCrCw:CwCrCwCr:CrCwCrCw:CwCrCwCr", required: Math.ceil(25000*multiplier/10), 
            reward: customRewards.ap, throughputOnly: false},
        {shape: "Cg----Cr:Cw----Cw:Sy------:Cy----Cy", required: Math.ceil(25000*multiplier/10), 
            reward: customRewards.ap, throughputOnly: false},
        {shape: "CcSyCcSy:SyCcSyCc:CcSyCcSy", required: Math.ceil(25000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "CcRcCcRc:RwCwRwCw:Sr--Sw--:CyCyCyCy", required: Math.ceil(25000*multiplier/10), 
            reward: customRewards.ap, throughputOnly: false},
        {shape: "Rg--Rg--:CwRwCwRw:--Rg--Rg", required: Math.ceil(25000*multiplier/10), reward: customRewards.ap, throughputOnly: false},
        {shape: "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw", required: Math.ceil(50000*multiplier/10), 
            reward: customRewards.ap, throughputOnly: false}
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
                randomizer, getGrowingComplexity(1, i-2), phase[baseBuildingNames.cutter] == 1, 
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
                randomizer, getGrowingComplexity(2, i-5), phase[baseBuildingNames.cutter] <= 2, 
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
                randomizer, getGrowingComplexity(3, i-7), phase[baseBuildingNames.cutter] <= 3, 
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
                randomizer, getGrowingComplexity(4, i-9), phase[baseBuildingNames.cutter] <= 4, 
                phase[baseBuildingNames.rotator] <= 4, phase[baseBuildingNames.stacker] <= 4, 
                phase[baseBuildingNames.painter] <= 4, phase[baseBuildingNames.mixer] <= 4
            ), 
            required: getAmountByLevel(i), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        };
    }
    for (var i = 11; i <= 26; i++) {
        levelsdefs[i-1] = {
            shape: calcRandomShape(randomizer, getGrowingComplexity(5, i-11), true, true, true, true, true), 
            required: getAmountByLevel(i), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        };
    }
    if (throughputratio == -1) levelsdefs[13].throughputOnly = true;
    levelsdefs[19].reward = customRewards.easter_egg;
    for (var i = 27; i <= connection.levelsToGenerate; i++) {
        levelsdefs.push({
            shape: calcRandomShape(randomizer, getGrowingComplexity(5, i-11), true, true, true, true, true), 
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
        levelsdefs.push({shape: calcRandomShape(randomizer, getGrowingComplexity(0, i), false, false, false, false, false), 
            required: getAmountByLevel(i+1), reward: customRewards.ap,
                throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (let i = phaselength; i < phaselength*2; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, getGrowingComplexity(1, i-phaselength), 
            phase[baseBuildingNames.cutter] == 1, 
            phase[baseBuildingNames.rotator] == 1, 
            phase[baseBuildingNames.stacker] == 1, 
            phase[baseBuildingNames.painter] == 1, 
            phase[baseBuildingNames.mixer] == 1), 
            required: getAmountByLevel(i+1), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (let i = phaselength*2; i < phaselength*3; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, getGrowingComplexity(2, i-phaselength*2), 
            phase[baseBuildingNames.cutter] <= 2, 
            phase[baseBuildingNames.rotator] <= 2, 
            phase[baseBuildingNames.stacker] <= 2, 
            phase[baseBuildingNames.painter] <= 2, 
            phase[baseBuildingNames.mixer] <= 2), 
            required: getAmountByLevel(i+1), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (let i = phaselength*3; i < phaselength*4; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, getGrowingComplexity(3, i-phaselength*3), 
            phase[baseBuildingNames.cutter] <= 3, 
            phase[baseBuildingNames.rotator] <= 3, 
            phase[baseBuildingNames.stacker] <= 3, 
            phase[baseBuildingNames.painter] <= 3, 
            phase[baseBuildingNames.mixer] <= 3), 
            required: getAmountByLevel(i+1), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (let i = phaselength*4; i < phaselength*5; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, getGrowingComplexity(4, i-phaselength*4), 
            phase[baseBuildingNames.cutter] <= 4, 
            phase[baseBuildingNames.rotator] <= 4, 
            phase[baseBuildingNames.stacker] <= 4, 
            phase[baseBuildingNames.painter] <= 4, 
            phase[baseBuildingNames.mixer] <= 4), 
            required: getAmountByLevel(i+1), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (let ii = levelsdefs.length+1; ii <= levelstogenerate; ii++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, getGrowingComplexity(5, ii-1-phaselength*5), true, true, true, true, true), 
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
                randomizer, i_phases, phase[baseBuildingNames.cutter] <= i_phases, 
                phase[baseBuildingNames.rotator] <= i_phases, phase[baseBuildingNames.stacker] <= i_phases, 
                phase[baseBuildingNames.painter] <= i_phases, phase[baseBuildingNames.mixer] <= i_phases
            ), 
            required: getAmountByLevel(i_phases+1), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        };
    }
    for (var i = 6; i <= 26; i++) {
        levelsdefs[i-1] = {
            shape: calcRandomShape(randomizer, getGrowingComplexity(5, i-6), true, true, true, true, true), 
            required: getAmountByLevel(i), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        };
    }
    if (throughputratio == -1) levelsdefs[13].throughputOnly = true;
    levelsdefs[19].reward = customRewards.easter_egg;
    for (var i = 27; i <= levelstogenerate; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, getGrowingComplexity(5, i-6), true, true, true, true, true), 
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
                    randomizer, getGrowingComplexity(i_phases, i), 
                    phase[baseBuildingNames.cutter] <= i_phases, 
                    phase[baseBuildingNames.rotator] <= i_phases, phase[baseBuildingNames.stacker] <= i_phases, 
                    phase[baseBuildingNames.painter] <= i_phases, phase[baseBuildingNames.mixer] <= i_phases
                ), 
                required: getAmountByLevel(levelsdefs.length+1), reward: customRewards.ap,
                throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
            });
        }
    }
    let startAllBuildings = levelsdefs.length;
    for (var ii = startAllBuildings+1; ii <= levelstogenerate; ii++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, getGrowingComplexity(5, ii-startAllBuildings-1), true, true, true, true, true), 
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

export function randomizedHardcoreDopamineShapes(randomizer, buildingsCount) {
    const multiplier = connection.requiredShapesMultiplier;
    const phase = connection.positionOfLevelBuilding;
    const throughputratio = connection.throughputLevelsRatio;
    const levelstogenerate = connection.levelsToGenerate;
    var levelsdefs = [
        {shape: calcRandomShape(randomizer, 0, false, false, false, false, false), 
            required: getAmountByLevel(1), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio}
    ];
    let lastLevelGoal = connection.goal === "vanilla" || connection.goal === "mam" ? 1 : 0;
    for (let i = 2; i <= levelstogenerate-lastLevelGoal; i++) {
        levelsdefs.push({
            shape: calcRandomShape(
                randomizer, getGrowingComplexity(buildingsCount, i-2), 
                phase[baseBuildingNames.cutter] <= buildingsCount, 
                phase[baseBuildingNames.rotator] <= buildingsCount, phase[baseBuildingNames.stacker] <= buildingsCount, 
                phase[baseBuildingNames.painter] <= buildingsCount, phase[baseBuildingNames.mixer] <= buildingsCount
            ), 
            required: getAmountByLevel(i), reward: customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        });
    };
    if (lastLevelGoal) {
        levelsdefs.push({
            shape: calcRandomShape(
                randomizer, buildingsCount == 5 ? getGrowingComplexity(5, levelstogenerate-2) : 5, true, true, true, true, true
            ),
            required: getAmountByLevel(levelstogenerate), reward:customRewards.ap,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio
        });
    }
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
            currentIngame.amountByLevelCache[i] = Math.ceil(
                (25000+(175000*(i+1)/connection.levelsToGenerate))*connection.requiredShapesMultiplier/10
            );
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
            currentIngame.amountByLevelCache[i] = Math.ceil(
                (buildupAmount+(buildupNeeded)*(i+1-earlyLevels)/earlyToBuildupLevels)*connection.requiredShapesMultiplier/10
            );
            currentIngame.amountByLevelCache[i] -= currentIngame.amountByLevelCache[i] % 500;
        }
        const lateAmount = currentIngame.amountByLevelCache[buildupLevels-1];
        const lateNeeded = 200000-lateAmount;
        for (var i = buildupLevels; i < connection.levelsToGenerate; i++) {
            currentIngame.amountByLevelCache[i] = Math.ceil(
                (lateAmount+(lateNeeded)*(i+1-buildupLevels)/remainingAfterBuildup)*connection.requiredShapesMultiplier/10
            );
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

/**
 * @param {number} base
 * @param {number} step
 */
function getGrowingComplexity(base, step) {
    return Math.floor(base + connection.complexityGrowthGradient * step);
}

export function vanillaUpgradeShapes() {
    const rocketShape = "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw";
    const preparementShape = "CpRpCp--:SwSwSwSw";
    const finalGameShape = "RuCw--Cw:----Ru--";
    const beltshapes = [
        "CuCuCuCu", "--CuCu--", "CpCpCpCp", "SrSrSrSr:CyCyCyCy", "SrSrSrSr:CyCyCyCy:SwSwSwSw",
        preparementShape, finalGameShape, rocketShape
    ];
    const minershapes = [
        "RuRuRuRu", "Cu------", "ScScScSc", "CwCwCwCw:WbWbWbWb", "CbRbRbCb:CwCwCwCw:WbWbWbWb",
        preparementShape, finalGameShape, rocketShape
    ];
    const processorsshapes = [
        "SuSuSuSu", "RuRu----", "CgScScCg", "CwCrCwCr:SgSgSgSg", "WrRgWrRg:CwCrCwCr:SgSgSgSg",
        preparementShape, finalGameShape, rocketShape
    ];
    const paintingshapes = [
        "RbRb----", "WrWrWrWr", "RpRpRpRp:CwCwCwCw", "WpWpWpWp:CwCwCwCw:WpWpWpWp", "WpWpWpWp:CwCwCwCw:WpWpWpWp:CwCwCwCw",
        preparementShape, finalGameShape, rocketShape
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
    const beltshapes = [], minershapes = [], processorsshapes = [], paintingshapes = [];
    for (let shapesarray of [beltshapes, minershapes, processorsshapes, paintingshapes]) {
        shapesarray.push(calcRandomShape(randomizer, 1, false, false, false, false, false));
        for (var nextindex = 1; nextindex < 5; nextindex++) {
            shapesarray.push(calcRandomShape(randomizer, nextindex+2, 
                phase[baseBuildingNames.cutter] <= nextindex, 
                phase[baseBuildingNames.rotator] <= nextindex, 
                phase[baseBuildingNames.stacker] <= nextindex, 
                phase[baseBuildingNames.painter] <= nextindex, 
                phase[baseBuildingNames.mixer] <= nextindex, 
                shapesarray));
        }
    }
    return constructUpgradeShapes(randomizer, beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function categoryUpgradeShapes(randomizer) {
    const beltshapes = [calcRandomShape(randomizer, 0, false, false, false, false, false)];
    beltshapes.push(calcRandomShape(randomizer, 1, false, false, false, false, false, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, 2, false, false, false, false, false, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, 2, false, false, false, false, false, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, 2, false, false, false, false, false, beltshapes));
    const minershapes = [calcRandomShape(randomizer, 0, false, false, false, false, false)];
    minershapes.push(calcRandomShape(randomizer, 1, false, false, false, false, false, minershapes));
    minershapes.push(calcRandomShape(randomizer, 2, false, false, false, false, false, minershapes));
    minershapes.push(calcRandomShape(randomizer, 2, false, false, false, false, false, minershapes));
    minershapes.push(calcRandomShape(randomizer, 2, false, false, false, false, false, minershapes));
    const processorsshapes = [calcRandomShape(randomizer, 1, true, false, false, false, false)];
    processorsshapes.push(calcRandomShape(randomizer, 2, true, true, false, false, false, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, 3, true, true, false, false, false, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, 4, true, true, true, false, false, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, 6, true, true, true, false, false, processorsshapes));
    const paintingshapes = [calcRandomShape(randomizer, 1, false, false, false, true, false)];
    paintingshapes.push(calcRandomShape(randomizer, 3, false, false, false, true, false, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, 4, false, false, false, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, 6, false, false, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, 8, false, false, true, true, true, paintingshapes));
    return constructUpgradeShapes(randomizer, beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function categoryRandomUpgradeShapes(randomizer) {
    const phase = connection.positionOfUpgradeBuilding;
    const amountBelt = connection.categoryRandomBuildingsAmounts.belt;
    const amountMiner = connection.categoryRandomBuildingsAmounts.miner;
    const amountProcessors = connection.categoryRandomBuildingsAmounts.processors;
    const amountPainting = connection.categoryRandomBuildingsAmounts.painting;
    // First shape always amountCategory+0, to have 0 complexity when 0 amountCategory
    const beltshapes = [], minershapes = [], processorsshapes = [], paintingshapes = [];
    let pairs = [
        {"array": beltshapes, "amount": amountBelt},
        {"array": minershapes, "amount": amountMiner},
        {"array": processorsshapes, "amount": amountProcessors},
        {"array": paintingshapes, "amount": amountPainting}
    ];
    for (let pair of pairs) {
        for (let i = 0; i < 5; i++) {
            pair.array.push(calcRandomShape(randomizer, pair.amount+i, 
                phase[baseBuildingNames.cutter] <= pair.amount, phase[baseBuildingNames.rotator] <= pair.amount, 
                phase[baseBuildingNames.stacker] <= pair.amount, phase[baseBuildingNames.painter] <= pair.amount, 
                phase[baseBuildingNames.mixer] <= pair.amount, pair.array
            ));
        }
    }
    return constructUpgradeShapes(randomizer, beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function hardcoreUpgradeShapes(randomizer) {
    const beltshapes = [], minershapes = [], processorsshapes = [], paintingshapes = [];
    for (let shapesarray of [beltshapes, minershapes, processorsshapes, paintingshapes]) {
        shapesarray.push(calcRandomShape(randomizer, 0, false, false, false, false, false));
        for (let i = 6; i < 10; i++) {
            shapesarray.push(calcRandomShape(randomizer, i, true, true, true, true, true, shapesarray));
        }
    }
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
    // Detailed console output for debugging
    if (modImpl.settings.debugGeneratorLogDepth >= 1) apdebuglog(
        `SHAPE comp=${complexity} ` 
        + [hasCutter, hasRotator, hasStacker, hasPainter, hasMixer].join(" ") 
        + (exclude.length ? " EXCLUDE " + exclude.join(" ") : "")
    );
    // Make sure that there is enough complexity to have every operation at least once
    // No (hasPainter || hasMixer) needed, as hasMixer always gets added after hasPainter
    if (complexity < addBoolean(hasCutter, hasRotator, hasStacker, hasPainter, hasMixer)) {
        throw new Error(`Complexity ${complexity} too low for important=${
            [hasCutter, hasRotator, hasStacker, hasPainter, hasMixer].join(",")
        }`);
    }
    // complexity = Math.min(complexity, 40);
    let hash;
    do {
        // There should always be at least as many complexity as there are available buildings.
        // !hasCutter because single layer always needs cutting as first processing.
        // complexity < 3 || (complexity == 3 && hasRotator) because single layers need more processing to get to first stacking.
        // 33% chance to still be single layer.
        let complexityProcessing = complexity - addBoolean(hasPainter, hasMixer);
        if (hasStacker && (
            !hasCutter || complexityProcessing < 3 || (complexityProcessing == 3 && hasRotator) || randomizer.choice([true, true, true, false])
        )) { 
            hash = "";
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
    } while (exclude.includes(hash) || (hash.length > 8 && hash.startsWith("RrRrRrRr"))); // Blacklist
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
    if (modImpl.settings.debugGeneratorLogDepth >= 2) apdebuglog(
        `STACK bottom=${bottom} newlayer=${newlayer} ${JSON.stringify(available)} ${JSON.stringify(tasked)} ${floatCutting}` 
    );
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
    if (modImpl.settings.debugGeneratorLogDepth >= 2) apdebuglog(
        `LAYER comp=${complexity} ${JSON.stringify(available)} ${JSON.stringify(tasked)} ${JSON.stringify(important)}`
    );
    if (complexity < addBoolean(
        important.cutter, important.rotator, important.stacker, important.painter || important.mixer, important.mixer
    )) throw new Error(`Complexity ${complexity} too low for important=${JSON.stringify(important)}`);
    // Save painter and mixer as they are irrelevant for deciding on the variant
    complexity -= important.mixer ? 2 : (important.painter ? 1 : 0);
    // Add everything possible to variant pool
    let variant = new Array(10).fill(false);
    variant[0] = true;
    if (available.cutter) {
        if (complexity) variant[1] = true;
        if (available.rotator && complexity >= 2) variant[2] = true;
        if (available.stacker && complexity >= 3) variant[3] = true;
        if (available.rotator && available.stacker) {
            if (complexity >= 4) variant[4] = true;
            if (complexity >= 4) variant[5] = true;
            if (complexity >= 8) variant[6] = true;
            if (complexity >= 5) variant[7] = true;
            if (complexity >= 15) variant[8] = true;
            if (complexity >= 9) variant[9] = true;
        }
    }
    // Disable everything that would make important things impossible
    if (important.cutter) variant[0] = false;
    if (important.rotator) {
        if (complexity < 3) variant[1] = false;
        if (complexity < 5) variant[3] = false;
    }
    if (important.stacker) {
        variant[0] = false;
        if (complexity < 7 || !available.rotator) variant[1] = false;
        if (complexity < 8) variant[2] = false;
    }
    // Disable some low-complexity variants if high complexity given
    // With available.cutter, there will always
    if (available.cutter && !important.cutter && !important.rotator && !important.stacker) {
        if (complexity > 10) variant[0] = false;
        if (complexity > 12) variant[5] = false;
        if (complexity > 12) variant[7] = false;
    }
    // Restore painter and mixer
    complexity += important.mixer ? 2 : (important.painter ? 1 : 0);
    // Convert variant pool to be useable in randomizer.choice()
    let variantPool = [];
    for (let i = 0; i < variant.length; i++) if (variant[i]) variantPool.push(i);
    // Same scope variables
    let layer = "", single, color1, patterns, complexityPart, shapePool, resetTasked, resetImportant;
    // Get random variant
    switch (randomizer.choice(variantPool)) {
        case 0: // Full (fixed pattern + random color)
            // Save rotator if important
            if (important.rotator) complexity--;
            // Split complexity between painting and rare patterns
            complexityPart = Math.max(important.mixer ? 2 : (important.painter ? 1 : 0), randomizer.nextIntRange(0, complexity+1));
            complexity -= complexityPart;
            color1 = calcRandomColor(randomizer, complexityPart, available, tasked, important);
            // Restore important rotator
            if (important.rotator) complexity++;
            // Base patterns with no complexity barrier
            patterns = [
                "C"+color1+"C"+color1+"C"+color1+"C"+color1,
                "R"+color1+"R"+color1+"R"+color1+"R"+color1
            ];
            // Patterns with some distance and one of them rotatable
            if (complexity) patterns.push(
                "S"+color1+"S"+color1+"S"+color1+"S"+color1,
                "R"+color1+"R"+color1+"W"+color1+"W"+color1
            );
            // Patterns with more distance and rotatable
            if (complexity >= 2) patterns.push(
                "C"+color1+"C"+color1+"R"+color1+"R"+color1,
                "C"+color1+"C"+color1+"S"+color1+"S"+color1,
                "R"+color1+"R"+color1+"C"+color1+"C"+color1,
                "R"+color1+"R"+color1+"S"+color1+"S"+color1,
                "S"+color1+"S"+color1+"C"+color1+"C"+color1,
                "S"+color1+"S"+color1+"R"+color1+"R"+color1
            );
            // Exclude unrotatable if rotator important
            // important.rotator includes having 1 complexity restored
            if (important.rotator) patterns.splice(0, 3);
            // Get random pattern, barrier is not supposed to consume complexity
            layer = randomizer.choice(patterns);
            // Rotate if either important or enough complexity left (only sometimes)
            if (important.rotator || (available.rotator && complexity && randomizer.choice([true, false]))) {
                if (randomizer.choice([true, false])) layer = layer.substring(2, 8) + layer.substring(0, 2);
                else layer = layer.substring(6, 8) + layer.substring(0, 6);
                tasked.rotator = false;
                important.rotator = false;
            }
            return layer;
        case 1: // Vertical half (using calcRandomHalf)
            // Check 1 cutting
            tasked.cutter = false;
            important.cutter = false;
            complexity--;
            // Get random half and use all complexity for that
            layer = calcRandomHalf(randomizer, complexity, available, tasked, important, true);
            complexity = 0;
            // Get random side while being aware of east windmills
            if (isWindmillHalf(layer) && !available.rotator) return "----" + layer;
            else if (randomizer.choice([true, false])) return "----" + layer;
            else return layer + "----";
        case 2: // Horizontal half (using calcRandomHalf)
            // Check 1 cutting and 1 rotating
            tasked.cutter = false;
            important.cutter = false;
            tasked.rotator = false;
            important.rotator = false;
            complexity -= 2;
            // Get random half and use all complexity for that
            layer = calcRandomHalf(randomizer, complexity, available, tasked, important, true);
            complexity = 0;
            // Get random side, windmills don't matter here as it's already rotated
            layer = "--" + layer + "--";
            if (randomizer.choice([true, false])) layer = layer.substring(4, 8) + layer.substring(0, 4);
            return layer;
        case 3: // Vertical half-half (using calcRandomHalf)
            // Check 2 cutting and 1 stacking
            tasked.cutter = false;
            important.cutter = false;
            tasked.stacker = false;
            important.stacker = false;
            complexity -= 3;
            // Split complexity between both halves, while saving some for important 
            // Double important.rotator because rotator needs 2 complexity within calcRandomHalf
            // There will always be at least 2 complexity left if you subtract the 3 minimum and 2 painter&mixer
            complexityPart = weightedRandomIntRange(randomizer, 0, complexity-addBoolean(
                important.rotator, important.rotator, important.painter || important.mixer, important.mixer
            ));
            complexity -= complexityPart;
            // Generate both halves, considering east windmill and important only in second half
            // update instead of copy because what if important is empty from the beginning
            // TODO make both halves not be the same, see variant 9
            layer = calcRandomHalf(randomizer, complexityPart, available, tasked, getEmptyBuildingBools(), available.rotator);
            return layer + calcRandomHalf(
                randomizer, complexity, available, tasked, updateBuildingBoolCompletions(important, tasked), true
            );
        case 4: // Horizontal half-half (using calcRandomHalf)
            // Checking 2 cutting, 1 rotating, and 1 stacking
            tasked.cutter = false;
            important.cutter = false;
            tasked.rotator = false;
            important.rotator = false;
            tasked.stacker = false;
            important.stacker = false;
            complexity -= 4;
            // Split complexity between both halves, while saving some for important 
            complexityPart = weightedRandomIntRange(randomizer, 0, complexity-addBoolean(
                important.painter || important.mixer, important.mixer
            ));
            complexity -= complexityPart;
            // Generate both halves, with important only in second half
            // update instead of copy because what if important is empty from the beginning
            // TODO make both halves not be the same, see variant 9
            layer = calcRandomHalf(randomizer, complexityPart, available, tasked, getEmptyBuildingBools(), true);
            layer += calcRandomHalf(
                randomizer, complexity, available, tasked, updateBuildingBoolCompletions(important, tasked), true
            );
            return layer.substring(6, 8) + layer.substring(0, 6);
        case 5: // Cut-out
            // Checking 2 cutting, 1 rotating, and 1 stacking
            tasked.cutter = false;
            important.cutter = false;
            tasked.rotator = false;
            important.rotator = false;
            tasked.stacker = false;
            important.stacker = false;
            complexity -= 4;
            // Get random shape, color, and rotation
            layer = calcRandomSubShape(randomizer, true) + calcRandomColor(randomizer, complexity, available, tasked, important);
            switch (randomizer.nextIntRange(0, 4)) {
                case 0: return "--" + layer + layer + layer; 
                case 1: return layer + "--" + layer + layer; 
                case 2: return layer + layer + "--" + layer; 
                case 3: return layer + layer + layer + "--"; 
                default: throw new Error("Illegal random value");
            }
        case 6: // 3-1
            // Checking 4 cutting, 2 rotating, and 2 stacking
            tasked.cutter = false;
            important.cutter = false;
            tasked.rotator = false;
            important.rotator = false;
            tasked.stacker = false;
            important.stacker = false;
            complexity -= 8;
            // Split complexity between both sides, while saving some for important 
            complexityPart = weightedRandomIntRange(randomizer, 0, complexity-addBoolean(
                important.painter || important.mixer, important.mixer
            ));
            complexity -= complexityPart;
            // Getting both random shapes and colors
            // Second color should only preferably be the same if shapes are not the same
            layer = calcRandomSubShape(randomizer, true) + calcRandomColor(
                randomizer, complexityPart, available, tasked, getEmptyBuildingBools()
            );
            single = calcRandomSubShape(randomizer, true);
            color1 = layer.charAt(0) === single ? null : layer.charAt(1);
            single += calcRandomColor(
                randomizer, complexity, available, tasked, updateBuildingBoolCompletions(important, tasked), color1
            );
            // Get random rotation
            switch (randomizer.nextIntRange(0, 4)) {
                case 0: return single + layer + layer + layer; 
                case 1: return layer + single + layer + layer; 
                case 2: return layer + layer + single + layer; 
                case 3: return layer + layer + layer + single; 
                default: throw new Error("Illegal random value");
            }
        case 7: // Cornered
            // Checking 2 cutting, 2 rotating, and 1 stacking
            tasked.cutter = false;
            important.cutter = false;
            tasked.rotator = false;
            important.rotator = false;
            tasked.stacker = false;
            important.stacker = false;
            complexity -= 5;
            // Get random shape, color, and rotation
            layer = calcRandomSubShape(randomizer, true) + calcRandomColor(randomizer, complexity, available, tasked, important);
            if (randomizer.choice([true, false])) return "--" + layer + "--" + layer;
            else return layer + "--" + layer + "--";
        case 8: // 4 shapes 1 color
            // Checking 8 cutting, 4 rotating, and 3 stacking
            tasked.cutter = false;
            important.cutter = false;
            tasked.rotator = false;
            important.rotator = false;
            tasked.stacker = false;
            important.stacker = false;
            complexity -= 15;
            // Get random color and random order of shapes
            color1 = calcRandomColor(randomizer, complexity, available, tasked, important);
            shapePool = ["C", "R", "S", "W"];
            for (let i = 0; i < 4; i++) {
                let index = randomizer.nextIntRange(0, shapePool.length);
                layer += shapePool[index] + color1;
                shapePool.splice(index, 1);
            }
            return layer;
        case 9: // Checkered (aka cloned half)
            // Checking 4 cutting, 3 rotating, and 2 stacking
            tasked.cutter = false;
            important.cutter = false;
            tasked.rotator = false;
            important.rotator = false;
            tasked.stacker = false;
            important.stacker = false;
            complexity -= 9;
            // Split complexity between both colors, while saving some for important 
            complexityPart = weightedRandomIntRange(randomizer, 0, complexity-addBoolean(
                important.painter || important.mixer, important.mixer
            ));
            complexity -= complexityPart;
            // Get first random side, with nothing being important yet
            layer = calcRandomSubShape(randomizer, true) + calcRandomColor(
                randomizer, complexityPart, available, tasked, getEmptyBuildingBools()
            );
            // Update important with what is left in tasked tasked
            // If important was empty to begin with, it stays empty
            // If important had something, it was the same as tasked
            updateBuildingBoolCompletions(important, tasked);
            // Get second random side, but repeating if both sides are the same
            do {
                // tasked and important must not update yet in case this has to be repeated
                resetTasked = copyBuildingBools(tasked);
                resetImportant = copyBuildingBools(important);
                layer = layer.substring(0, 2) + calcRandomSubShape(randomizer, true) + calcRandomColor(
                    randomizer, complexity, available, resetTasked, resetImportant
                );
            } while (layer.substring(0, 2) === layer.substring(2, 4));
            // Update tasked and important with what was checked in the last loop iteration
            updateBuildingBoolCompletions(tasked, resetTasked);
            updateBuildingBoolCompletions(important, resetImportant);
            // Clone to get full layer
            return layer + layer;
        default:
            throw new Error("Illegal layer variant");
    }
}

/**
 * 
 * @param {string} half 
 * @returns {boolean} half === WxWx[...]
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
 * @param {boolean} windmillAllowed
 */
function calcRandomHalf(randomizer, complexity, available, tasked, important, windmillAllowed) {
    if (modImpl.settings.debugGeneratorLogDepth >= 3) apdebuglog(
        `HALF comp=${complexity} ${JSON.stringify(available)} ${JSON.stringify(tasked)} ${JSON.stringify(important)}`
    );
    if (complexity < addBoolean(important.cutter, important.rotator, important.stacker, important.painter || important.mixer, important.mixer))
        throw new Error(`Complexity ${complexity} too low for important=${JSON.stringify(important)}`);
    let complexityProcessing = complexity - addBoolean(important.painter || important.mixer, important.mixer);
    let pool = [0];
    let part = "";
    if (available.rotator && complexityProcessing >= 2) pool.push(1);
    if (available.rotator && available.stacker && complexityProcessing >= 6) pool.push(2);
    if (important.rotator || important.stacker) pool.splice(0, 1);
    if (important.stacker && pool[0] == 1) pool.splice(0, 1);
    switch (randomizer.choice(pool)) {
        case 0:
            part = calcRandomSubShape(randomizer, windmillAllowed) + calcRandomColor(randomizer, complexity, available, tasked, important);
            part += part;
            break;
        case 1:
            // There is no point in updating important
            tasked.rotator = false;
            complexity -= 2;
            part = calcRandomSubShape(randomizer, windmillAllowed) + calcRandomColor(randomizer, complexity, available, tasked, important);
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
            part = calcRandomSubShape(randomizer, windmillAllowed) + calcRandomColor(
                randomizer, complexityPart, available, tasked, getEmptyBuildingBools()
            );
            part += calcRandomSubShape(randomizer, windmillAllowed) + calcRandomColor(
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
    if (modImpl.settings.debugGeneratorLogDepth >= 4) apdebuglog(
        `COLOR comp=${complexity} ${JSON.stringify(available)} ${JSON.stringify(tasked)} ${JSON.stringify(important)} ${preferredColor}`
    );
    if (complexity < addBoolean(important.painter || important.mixer, important.mixer))
        throw new Error(`Complexity ${complexity} too low for important=${JSON.stringify(important)}`);
    // Start with uncolored
    let pool = ["u"];
    // Add colors if possible and enough complexity
    // available.mixer always includes available.painter
    if (available.painter && complexity) pool.push("r", "g", "b");
    if (available.mixer && complexity >= 2) pool.push("y", "p", "c");
    if (available.mixer && complexity >= 3) pool.push("w");
    // Remove lower colors if important or too much complexity (so it doesn't waste too much complexity)
    // Important buildings always include enough complexity and availability
    // Check for pool length, so we don't get an empty pool
    if (important.painter || important.mixer || (complexity >= 4 && pool.length > 1)) pool.splice(0, 1);
    if (important.mixer) pool.splice(0, 3);
    // Populate preferred color, but only if it's already included
    if (preferredColor) {
        let includePreferred = false;
        for (let c of pool) if (c === preferredColor) includePreferred = true;
        if (includePreferred) for (let i = pool.length-2; i > 0; i--) pool.push(preferredColor);
    }
    // Get random color
    let ret = randomizer.choice(pool);
    // Check tasked/important if a (mixed) color is chosen
    if (ret !== "u") {tasked.painter = false; important.painter = false;}
    if (!["u", "r", "g", "b"].includes(ret)) {tasked.mixer = false; important.mixer = false;}
    // Return
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

/**
 * @param {boolean[]} bool
 */
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
 * 
 * Creates a buildingBools object with given values.
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
 * 
 * Creates a buildingBools object with everything set to false.
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
 * 
 * Creates a deep copy of old.
 */
function copyBuildingBools(old) {
    let copy = getEmptyBuildingBools();
    for (let building in old) copy[building] = old[building];
    return copy;
}

/**
 * @param {buildingBools} toupdate
 * @param {buildingBools} template
 * 
 * Sets every building in toupdate to true, if it's true in both toupdate and template.
 * 
 * This effectively checks everything in toupdate, if it was checked in template.
 * 
 * @returns {buildingBools} toupdate
 */
function updateBuildingBoolCompletions(toupdate, template) {
    for (let building in toupdate) toupdate[building] &= template[building];
    return toupdate
}
