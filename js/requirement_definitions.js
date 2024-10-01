import { RandomNumberGenerator } from "shapez/core/rng";
import { connection } from "./global_data";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";

export function vanillaShapes() {
    const multiplier = connection.requiredShapesMultiplier;
    return [
        {shape: "CuCuCuCu", required: Math.ceil(30*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "----CuCu", required: Math.ceil(40*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "RuRuRuRu", required: Math.ceil(70*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "RuRu----", required: Math.ceil(70*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "Cu----Cu", required: Math.ceil(170*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "Cu------", required: Math.ceil(270*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "CrCrCrCr", required: Math.ceil(300*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "RbRb----", required: Math.ceil(480*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "CpCpCpCp", required: Math.ceil(600*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "ScScScSc", required: Math.ceil(800*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "CgScScCg", required: Math.ceil(1000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "CbCbCbRb:CwCwCwCw", required: Math.ceil(1000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "RpRpRpRp:CwCwCwCw", required: Math.ceil(3800*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "--Cg----:--Cr----", required: Math.ceil(8*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: true},
        {shape: "SrSrSrSr:CyCyCyCy", required: Math.ceil(10000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "SrSrSrSr:CyCyCyCy:SwSwSwSw", required: Math.ceil(6000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "CbRbRbCb:CwCwCwCw:WbWbWbWb", required: Math.ceil(20000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "Sg----Sg:CgCgCgCg:--CyCy--", required: Math.ceil(20000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "CpRpCp--:SwSwSwSw", required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "RuCw--Cw:----Ru--", required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "CrCwCrCw:CwCrCwCr:CrCwCrCw:CwCrCwCr", required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "Cg----Cr:Cw----Cw:Sy------:Cy----Cy", required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "CcSyCcSy:SyCcSyCc:CcSyCcSy", required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "CcRcCcRc:RwCwRwCw:Sr--Sw--:CyCyCyCy", required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "Rg--Rg--:CwRwCwRw:--Rg--Rg", required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false},
        {shape: "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw", required: Math.ceil(50000*multiplier/10), reward: enumHubGoalRewards.no_reward, throughputOnly: false}
    ];
}

/**
 * 
 * @param {RandomNumberGenerator} randomizer
 */
export function randomizedVanillaStepsShapes(randomizer) {
    const multiplier = connection.requiredShapesMultiplier;
    const throughputratio = connection.throughputLevelsRatio;
    const phase = connection.positionOfLevelBuilding;
    var levelsdefs = [
        {shape: calcRandomShape(randomizer, false, false, false, false, false), 
            required: Math.ceil(30*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] == 1, 
            phase["Rotator"] == 1, 
            phase["Stacker"] == 1, 
            phase["Painter"] == 1, 
            phase["Color Mixer"] == 1), 
            required: Math.ceil(40*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] == 1, 
            phase["Rotator"] == 1, 
            phase["Stacker"] == 1, 
            phase["Painter"] == 1, 
            phase["Color Mixer"] == 1), 
            required: Math.ceil(70*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] == 1, 
            phase["Rotator"] == 1, 
            phase["Stacker"] == 1, 
            phase["Painter"] == 1, 
            phase["Color Mixer"] == 1), 
            required: Math.ceil(70*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 2, 
            phase["Rotator"] <= 2, 
            phase["Stacker"] <= 2, 
            phase["Painter"] <= 2, 
            phase["Color Mixer"] <= 2), 
            required: Math.ceil(170*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 2, 
            phase["Rotator"] <= 2, 
            phase["Stacker"] <= 2, 
            phase["Painter"] <= 2, 
            phase["Color Mixer"] <= 2), 
            required: Math.ceil(270*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 3, 
            phase["Rotator"] <= 3, 
            phase["Stacker"] <= 3, 
            phase["Painter"] <= 3, 
            phase["Color Mixer"] <= 3), 
            required: Math.ceil(300*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 3, 
            phase["Rotator"] <= 3, 
            phase["Stacker"] <= 3, 
            phase["Painter"] <= 3, 
            phase["Color Mixer"] <= 3), 
            required: Math.ceil(480*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 4, 
            phase["Rotator"] <= 4, 
            phase["Stacker"] <= 4, 
            phase["Painter"] <= 4, 
            phase["Color Mixer"] <= 4), 
            required: Math.ceil(600*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 4, 
            phase["Rotator"] <= 4, 
            phase["Stacker"] <= 4, 
            phase["Painter"] <= 4, 
            phase["Color Mixer"] <= 4), 
            required: Math.ceil(800*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(1000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(1000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(3800*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(5000*multiplier/10), reward: enumHubGoalRewards.no_reward, // Default required is 8 throughput
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio || throughputratio == -1},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(10000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(6000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(20000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(20000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(50000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio}
    ];
    for (var i = 27; i <= connection.levelsToGenerate; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil((4+0.25*(i-27))*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio || throughputratio == -1});
    };
    for (var i = 0; i < 26; i++) {
        if (levelsdefs[i].throughputOnly) {
            levelsdefs[i].required = Math.ceil((3.333+i*0.333)*multiplier/10);
        }
    }
    for (var i = 26; i < levelsdefs.length; i++) {
        if (!levelsdefs[i].throughputOnly) {
            levelsdefs[i].required = Math.ceil(50000*multiplier/10);
        }
    }
    return levelsdefs;
}

export function randomizedStretchedShapes(randomizer) {
    var levelsdefs = [];
    const levelstogenerate = connection.levelsToGenerate;
    const phaselength = Math.floor(levelstogenerate/6);
    const multiplier = connection.requiredShapesMultiplier;
    const throughputratio = connection.throughputLevelsRatio;
    const phase = connection.positionOfLevelBuilding;
    for (var i = 0; i < phaselength; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, false, false, false, false, false), 
            required: Math.ceil((30+30*i)*multiplier/10), reward: enumHubGoalRewards.no_reward,
                throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (var i = 0; i < phaselength; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 
            phase["Cutter"] == 1, 
            phase["Rotator"] == 1, 
            phase["Stacker"] == 1, 
            phase["Painter"] == 1, 
            phase["Color Mixer"] == 1), 
            required: Math.ceil((40+10*i)*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (var i = 0; i < phaselength; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 2, 
            phase["Rotator"] <= 2, 
            phase["Stacker"] <= 2, 
            phase["Painter"] <= 2, 
            phase["Color Mixer"] <= 2), 
            required: Math.ceil((170+30*i)*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (var i = 0; i < phaselength; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 3, 
            phase["Rotator"] <= 3, 
            phase["Stacker"] <= 3, 
            phase["Painter"] <= 3, 
            phase["Color Mixer"] <= 3), 
            required: Math.ceil((300+60*i)*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (var i = 0; i < phaselength; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 4, 
            phase["Rotator"] <= 4, 
            phase["Stacker"] <= 4, 
            phase["Painter"] <= 4, 
            phase["Color Mixer"] <= 4), 
            required: Math.ceil((600+120*i)*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (var ii = levelsdefs.length+1; ii <= levelstogenerate; ii++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(((ii)*50*1000/(levelstogenerate))*multiplier/10), reward: enumHubGoalRewards.no_reward,
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
            levelsdefs[i].required = Math.ceil((3.25+i*0.25)*multiplier/10);
        }
    }
    return levelsdefs;
}

export function randomizedQuickShapes(randomizer) {
    const multiplier = connection.requiredShapesMultiplier;
    const throughputratio = connection.throughputLevelsRatio;
    const phase = connection.positionOfLevelBuilding;
    const levelstogenerate = connection.levelsToGenerate;
    var levelsdefs = [
        {shape: calcRandomShape(randomizer, false, false, false, false, false), 
            required: Math.ceil(30*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] == 1, 
            phase["Rotator"] == 1, 
            phase["Stacker"] == 1, 
            phase["Painter"] == 1, 
            phase["Color Mixer"] == 1), 
            required: Math.ceil(40*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 2, 
            phase["Rotator"] <= 2, 
            phase["Stacker"] <= 2, 
            phase["Painter"] <= 2, 
            phase["Color Mixer"] <= 2), 
            required: Math.ceil(70*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 3, 
            phase["Rotator"] <= 3, 
            phase["Stacker"] <= 3, 
            phase["Painter"] <= 3, 
            phase["Color Mixer"] <= 3), 
            required: Math.ceil(70*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 4, 
            phase["Rotator"] <= 4, 
            phase["Stacker"] <= 4, 
            phase["Painter"] <= 4, 
            phase["Color Mixer"] <= 4), 
            required: Math.ceil(170*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(270*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(300*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(480*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(600*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(800*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(1000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(1000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(3800*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(5000*multiplier/10), reward: enumHubGoalRewards.no_reward, // Default required is 8 throughput
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio || throughputratio == -1},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(10000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(6000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(20000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(20000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(25000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio},
        {shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(50000*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio}
    ];
    for (var i = 27; i <= levelstogenerate; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil((4+0.25*(i-27))*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio || throughputratio == -1});
    };
    for (var i = 0; i < 26; i++) {
        if (levelsdefs[i].throughputOnly) {
            levelsdefs[i].required = Math.ceil((3.333+i*0.333)*multiplier/10);
        }
    }
    for (var i = 26; i < levelsdefs.length; i++) {
        if (!levelsdefs[i].throughputOnly) {
            levelsdefs[i].required = Math.ceil(50000*multiplier/10);
        }
    }
    return levelsdefs;
}

export function randomizedRandomStepsShapes(randomizer) {
    var levelsdefs = [];
    const multiplier = connection.requiredShapesMultiplier;
    const throughputratio = connection.throughputLevelsRatio;
    const phase = connection.positionOfLevelBuilding;
    const phaselength = connection.randomStepsLength;
    const levelstogenerate = connection.levelsToGenerate;
    for (var i = 0; i <= phaselength[0]; i++) { // "<=" phase[0] because first level always no building and potentially phase0 == 0
        levelsdefs.push({shape: calcRandomShape(randomizer, false, false, false, false, false), 
            required: Math.ceil((30+30*i)*multiplier/10), reward: enumHubGoalRewards.no_reward,
                throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (var i = 0; i < phaselength[1]; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 
            phase["Cutter"] == 1, 
            phase["Rotator"] == 1, 
            phase["Stacker"] == 1, 
            phase["Painter"] == 1, 
            phase["Color Mixer"] == 1), 
            required: Math.ceil((40+10*i)*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (var i = 0; i < phaselength[2]; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 2, 
            phase["Rotator"] <= 2, 
            phase["Stacker"] <= 2, 
            phase["Painter"] <= 2, 
            phase["Color Mixer"] <= 2), 
            required: Math.ceil((170+30*i)*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (var i = 0; i < phaselength[3]; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 3, 
            phase["Rotator"] <= 3, 
            phase["Stacker"] <= 3, 
            phase["Painter"] <= 3, 
            phase["Color Mixer"] <= 3), 
            required: Math.ceil((300+60*i)*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (var i = 0; i < phaselength[4]; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 4, 
            phase["Rotator"] <= 4, 
            phase["Stacker"] <= 4, 
            phase["Painter"] <= 4, 
            phase["Color Mixer"] <= 4), 
            required: Math.ceil((600+120*i)*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio});
    }
    for (var ii = levelsdefs.length+1; ii <= levelstogenerate; ii++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(((ii)*50*1000/(levelstogenerate))*multiplier/10), reward: enumHubGoalRewards.no_reward,
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
            levelsdefs[i].required = Math.ceil((3.25+i*0.25)*multiplier/10);
        }
    }
    return levelsdefs;
}

export function randomizedHardcoreShapes(randomizer) {
    const multiplier = connection.requiredShapesMultiplier;
    const throughputratio = connection.throughputLevelsRatio;
    const levelstogenerate = connection.levelsToGenerate;
    var levelsdefs = [
        {shape: calcRandomShape(randomizer, false, false, false, false, false), 
            required: Math.ceil(30*multiplier/10), reward: enumHubGoalRewards.no_reward,
            throughputOnly: randomizer.nextIntRange(0, 100) < throughputratio}
    ];
    for (var i = 2; i <= levelstogenerate; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil((50*i*1000/(levelstogenerate))*multiplier/10), reward: enumHubGoalRewards.no_reward,
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
            levelsdefs[i].required = Math.ceil((3.25+i*0.25)*multiplier/10);
        }
    }
    return levelsdefs;
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
    return constructUpgradeShapes(beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function vanillaLikeUpgradeShapes(randomizer) {
    const phase = connection.positionOfUpgradeBuilding;
    const beltshapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    beltshapes.push(calcRandomShape(randomizer, phase["Cutter"] <= 2, phase["Rotator"] <= 2, phase["Stacker"] <= 2, phase["Painter"] <= 2, phase["Color Mixer"] <= 2, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, beltshapes));
    const minershapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    minershapes.push(calcRandomShape(randomizer, phase["Cutter"] <= 2, phase["Rotator"] <= 2, phase["Stacker"] <= 2, phase["Painter"] <= 2, phase["Color Mixer"] <= 2, minershapes));
    minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, minershapes));
    minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, minershapes));
    minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, minershapes));
    const processorsshapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    processorsshapes.push(calcRandomShape(randomizer, phase["Cutter"] <= 1, phase["Rotator"] <= 1, phase["Stacker"] <= 1, phase["Painter"] <= 1, phase["Color Mixer"] <= 1, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, processorsshapes));
    const paintingshapes = [calcRandomShape(randomizer, phase["Cutter"] <= 3, phase["Rotator"] <= 3, phase["Stacker"] <= 3, phase["Painter"] <= 3, phase["Color Mixer"] <= 3)];
    paintingshapes.push(calcRandomShape(randomizer, phase["Cutter"] <= 3, phase["Rotator"] <= 3, phase["Stacker"] <= 3, phase["Painter"] <= 3, phase["Color Mixer"] <= 3, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, paintingshapes));
    if (connection.isSameLate) {
        const late1 = calcRandomShape(randomizer, true, true, true, true, true);
        const late2 = calcRandomShape(randomizer, true, true, true, true, true, [late1]);
        const late3 = calcRandomShape(randomizer, true, true, true, true, true, [late1, late2]);
        beltshapes.push(late1, late2, late3);
        minershapes.push(late1, late2, late3);
        processorsshapes.push(late1, late2, late3);
        paintingshapes.push(late1, late2, late3);
    } else {
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [beltshapes[5]]));
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [beltshapes[5], beltshapes[6]]));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, [minershapes[5]]));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, [minershapes[5], minershapes[6]]));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [processorsshapes[5]]));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [processorsshapes[5], processorsshapes[6]]));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [paintingshapes[5]]));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [paintingshapes[5], paintingshapes[6]]));
    }
    return constructUpgradeShapes(beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function linearUpgradeShapes(randomizer) {
    const phase = connection.positionOfUpgradeBuilding;
    const beltshapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    for (var nextindex = 1; nextindex < 5; nextindex++) {
        beltshapes.push(calcRandomShape(randomizer, phase["Cutter"] <= nextindex, phase["Rotator"] <= nextindex, phase["Stacker"] <= nextindex, phase["Painter"] <= nextindex, phase["Color Mixer"] <= nextindex, beltshapes));
    }
    const minershapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    for (var nextindex = 1; nextindex < 5; nextindex++) {
        minershapes.push(calcRandomShape(randomizer, phase["Cutter"] <= nextindex, phase["Rotator"] <= nextindex, phase["Stacker"] <= nextindex, phase["Painter"] <= nextindex, phase["Color Mixer"] <= nextindex, minershapes));
    }
    const processorsshapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    for (var nextindex = 1; nextindex < 5; nextindex++) {
        processorsshapes.push(calcRandomShape(randomizer, phase["Cutter"] <= nextindex, phase["Rotator"] <= nextindex, phase["Stacker"] <= nextindex, phase["Painter"] <= nextindex, phase["Color Mixer"] <= nextindex, processorsshapes));
    }
    const paintingshapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    for (var nextindex = 1; nextindex < 5; nextindex++) {
        paintingshapes.push(calcRandomShape(randomizer, phase["Cutter"] <= nextindex, phase["Rotator"] <= nextindex, phase["Stacker"] <= nextindex, phase["Painter"] <= nextindex, phase["Color Mixer"] <= nextindex, paintingshapes));
    }
    if (connection.isSameLate) {
        const late1 = calcRandomShape(randomizer, true, true, true, true, true);
        const late2 = calcRandomShape(randomizer, true, true, true, true, true, [late1]);
        const late3 = calcRandomShape(randomizer, true, true, true, true, true, [late1, late2]);
        beltshapes.push(late1, late2, late3);
        minershapes.push(late1, late2, late3);
        processorsshapes.push(late1, late2, late3);
        paintingshapes.push(late1, late2, late3);
    } else {
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [beltshapes[5]]));
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [beltshapes[5], beltshapes[6]]));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, [minershapes[5]]));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, [minershapes[5], minershapes[6]]));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [processorsshapes[5]]));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [processorsshapes[5], processorsshapes[6]]));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [paintingshapes[5]]));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [paintingshapes[5], paintingshapes[6]]));
    }
    return constructUpgradeShapes(beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function categoryUpgradeShapes(randomizer) {
    const beltshapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    beltshapes.push(calcRandomShape(randomizer, false, false, false, false, false, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, false, false, false, false, false, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, beltshapes));
    const minershapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    minershapes.push(calcRandomShape(randomizer, false, false, false, false, false, minershapes));
    minershapes.push(calcRandomShape(randomizer, false, false, false, false, false, minershapes));
    minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, minershapes));
    minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, minershapes));
    const processorsshapes = [calcRandomShape(randomizer, true, false, false, false, false)];
    processorsshapes.push(calcRandomShape(randomizer, true, false, false, false, false, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, true, true, false, false, false, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, true, true, false, false, false, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, true, true, true, false, false, processorsshapes));
    const paintingshapes = [calcRandomShape(randomizer, true, true, true, true, false)];
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, false, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, false, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, paintingshapes));
    if (connection.isSameLate) {
        const late1 = calcRandomShape(randomizer, true, true, true, true, true);
        const late2 = calcRandomShape(randomizer, true, true, true, true, true, [late1]);
        const late3 = calcRandomShape(randomizer, true, true, true, true, true, [late1, late2]);
        beltshapes.push(late1, late2, late3);
        minershapes.push(late1, late2, late3);
        processorsshapes.push(late1, late2, late3);
        paintingshapes.push(late1, late2, late3);
    } else {
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [beltshapes[5]]));
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [beltshapes[5], beltshapes[6]]));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, [minershapes[5]]));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, [minershapes[5], minershapes[6]]));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [processorsshapes[5]]));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [processorsshapes[5], processorsshapes[6]]));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [paintingshapes[5]]));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [paintingshapes[5], paintingshapes[6]]));
    }
    return constructUpgradeShapes(beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function categoryRandomUpgradeShapes(randomizer) {
    const phase = connection.positionOfUpgradeBuilding;
    const amountBelt = connection.categoryRandomBuildingsAmounts.belt;
    const amountMiner = connection.categoryRandomBuildingsAmounts.miner;
    const amountProcessors = connection.categoryRandomBuildingsAmounts.processors;
    const amountPainting = connection.categoryRandomBuildingsAmounts.painting;
    const beltshapes = [calcRandomShape(randomizer, phase["Cutter"] <= amountBelt, phase["Rotator"] <= amountBelt, phase["Stacker"] <= amountBelt, phase["Painter"] <= amountBelt, phase["Color Mixer"] <= amountBelt)];
    beltshapes.push(calcRandomShape(randomizer, phase["Cutter"] <= amountBelt, phase["Rotator"] <= amountBelt, phase["Stacker"] <= amountBelt, phase["Painter"] <= amountBelt, phase["Color Mixer"] <= amountBelt, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, phase["Cutter"] <= amountBelt, phase["Rotator"] <= amountBelt, phase["Stacker"] <= amountBelt, phase["Painter"] <= amountBelt, phase["Color Mixer"] <= amountBelt, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, beltshapes));
    const minershapes = [calcRandomShape(randomizer, phase["Cutter"] <= amountMiner, phase["Rotator"] <= amountMiner, phase["Stacker"] <= amountMiner, phase["Painter"] <= amountMiner, phase["Color Mixer"] <= amountMiner)];
    minershapes.push(calcRandomShape(randomizer, phase["Cutter"] <= amountMiner, phase["Rotator"] <= amountMiner, phase["Stacker"] <= amountMiner, phase["Painter"] <= amountMiner, phase["Color Mixer"] <= amountMiner, minershapes));
    minershapes.push(calcRandomShape(randomizer, phase["Cutter"] <= amountMiner, phase["Rotator"] <= amountMiner, phase["Stacker"] <= amountMiner, phase["Painter"] <= amountMiner, phase["Color Mixer"] <= amountMiner, minershapes));
    minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, minershapes));
    minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, minershapes));
    const processorsshapes = [calcRandomShape(randomizer, phase["Cutter"] <= amountProcessors, phase["Rotator"] <= amountProcessors, phase["Stacker"] <= amountProcessors, phase["Painter"] <= amountProcessors, phase["Color Mixer"] <= amountProcessors)];
    processorsshapes.push(calcRandomShape(randomizer, phase["Cutter"] <= amountProcessors, phase["Rotator"] <= amountProcessors, phase["Stacker"] <= amountProcessors, phase["Painter"] <= amountProcessors, phase["Color Mixer"] <= amountProcessors, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, phase["Cutter"] <= amountProcessors, phase["Rotator"] <= amountProcessors, phase["Stacker"] <= amountProcessors, phase["Painter"] <= amountProcessors, phase["Color Mixer"] <= amountProcessors, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, processorsshapes));
    const paintingshapes = [calcRandomShape(randomizer, phase["Cutter"] <= amountPainting, phase["Rotator"] <= amountPainting, phase["Stacker"] <= amountPainting, phase["Painter"] <= amountPainting, phase["Color Mixer"] <= amountPainting)];
    paintingshapes.push(calcRandomShape(randomizer, phase["Cutter"] <= amountPainting, phase["Rotator"] <= amountPainting, phase["Stacker"] <= amountPainting, phase["Painter"] <= amountPainting, phase["Color Mixer"] <= amountPainting, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, phase["Cutter"] <= amountPainting, phase["Rotator"] <= amountPainting, phase["Stacker"] <= amountPainting, phase["Painter"] <= amountPainting, phase["Color Mixer"] <= amountPainting, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, paintingshapes));
    if (connection.isSameLate) {
        const late1 = calcRandomShape(randomizer, true, true, true, true, true);
        const late2 = calcRandomShape(randomizer, true, true, true, true, true, [late1]);
        const late3 = calcRandomShape(randomizer, true, true, true, true, true, [late1, late2]);
        beltshapes.push(late1, late2, late3);
        minershapes.push(late1, late2, late3);
        processorsshapes.push(late1, late2, late3);
        paintingshapes.push(late1, late2, late3);
    } else {
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [beltshapes[5]]));
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [beltshapes[5], beltshapes[6]]));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, [minershapes[5]]));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, [minershapes[5], minershapes[6]]));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [processorsshapes[5]]));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [processorsshapes[5], processorsshapes[6]]));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [paintingshapes[5]]));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [paintingshapes[5], paintingshapes[6]]));
    }
    return constructUpgradeShapes(beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function hardcoreUpgradeShapes(randomizer) {
    const beltshapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, beltshapes));
    beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, beltshapes));
    const minershapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, minershapes));
    minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, minershapes));
    minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, minershapes));
    minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, minershapes));
    const processorsshapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, processorsshapes));
    processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, processorsshapes));
    const paintingshapes = [calcRandomShape(randomizer, false, false, false, false, false)];
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, paintingshapes));
    paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, paintingshapes));
    if (connection.isSameLate) {
        const late1 = calcRandomShape(randomizer, true, true, true, true, true);
        const late2 = calcRandomShape(randomizer, true, true, true, true, true, [late1]);
        const late3 = calcRandomShape(randomizer, true, true, true, true, true, [late1, late2]);
        beltshapes.push(late1, late2, late3);
        minershapes.push(late1, late2, late3);
        processorsshapes.push(late1, late2, late3);
        paintingshapes.push(late1, late2, late3);
    } else {
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [beltshapes[5]]));
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [beltshapes[5], beltshapes[6]]));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, [minershapes[5]]));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true, [minershapes[5], minershapes[6]]));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [processorsshapes[5]]));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [processorsshapes[5], processorsshapes[6]]));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [paintingshapes[5]]));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true, [paintingshapes[5], paintingshapes[6]]));
    }
    return constructUpgradeShapes(beltshapes, minershapes, processorsshapes, paintingshapes);
}

function constructUpgradeShapes(beltshapes, minershapes, processorsshapes, paintingshapes) {
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

/**
 * @param {RandomNumberGenerator} randomizer
 * @returns {string} full shape
 * @param {boolean} hasCutter
 * @param {boolean} hasRotator
 * @param {boolean} hasStacker
 * @param {boolean} hasPainter
 * @param {boolean} hasMixer
 * @param {Array<string>} exclude
 */
function calcRandomShape(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer, exclude = []) {
    var hash = "";
    do {
        hash = calcRandomLayer(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer);
        if (hasStacker) {
            if (randomizer.nextIntRange(0, 2) == 0) {
                var bottom = calcRandomLayer(randomizer, 
                    randomizer.choice([hasCutter, false]), 
                    randomizer.choice([hasRotator, false]), 
                    randomizer.choice([hasStacker, false]), hasPainter, hasMixer);
                if (randomizer.nextIntRange(0, 2) == 0) {
                    bottom = stackLayers(hash, calcRandomLayer(randomizer, 
                        randomizer.choice([hasCutter, false]), 
                        randomizer.choice([hasRotator, false]), 
                        randomizer.choice([hasStacker, false]), hasPainter, hasMixer));
                    if (randomizer.nextIntRange(0, 2) == 0) {
                        bottom = stackLayers(hash, calcRandomLayer(randomizer, 
                            randomizer.choice([hasCutter, false]), 
                            randomizer.choice([hasRotator, false]), 
                            randomizer.choice([hasStacker, false]), hasPainter, hasMixer));
                    }
                }
                hash = stackLayers(bottom, hash);
            }
        }
    } while (exclude.includes(hash));
    return hash;
}

/**
 * 
 * @param {string} bottom 
 * @param {string} newlayer 
 * @returns {string} bottom:newlayer or newlayer merged with top layer of bottom
 */
function stackLayers(bottom, newlayer) {
    var copy = bottom.substring(0, bottom.length-8);
    for (var i = 8; i > 0; i -= 2) {
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
 * 
 * @param {RandomNumberGenerator} randomizer 
 * @returns {string} XxXxXxXx
 */
function calcRandomLayer(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer) {
    var layer = "";
    if (hasCutter && randomizer.choice([true, true, true, false])) {
        layer = calcRandomHalf(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer);
        if (hasStacker) {
            layer += calcRandomHalf(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer);
        } else {
            var r = randomizer.nextIntRange(0, 3);
            if (r == 0 || isWindmillHalf(layer)) {
                layer = "----" + layer;
            } else if (r == 1 && !hasRotator) {
                layer += layer;
            } else {
                layer = layer + "----";
            }
        }
        if (hasRotator && randomizer.choice([true, false])) {
            layer = layer.substring(2, 8) + layer.substring(0, 2);
        }
    } else {
        layer = calcRandomPart(randomizer, hasPainter, hasMixer, false);
        layer += layer + layer + layer;
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
 * hasCutter == true
 * @param {RandomNumberGenerator} randomizer 
 * @returns {string} XxXx
 */
function calcRandomHalf(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer) {
    var part = calcRandomPart(randomizer, hasPainter, hasMixer, true);
    if (hasRotator && hasStacker && randomizer.choice([true, false])) {
        part += calcRandomPart(randomizer, hasPainter, hasMixer, true, part.charAt(1));
    } else if (hasRotator && randomizer.choice([true, false])) {
        if (randomizer.choice([true, false])) {
            part += "--"
        } else {
            part = "--" + part
        }
    } else {
        part += part;
    }
    return part;
}

/**
 * 
 * @param {RandomNumberGenerator} randomizer 
 * @returns {string} Xx
 */
function calcRandomPart(randomizer, hasPainter, hasMixer, windmillAllowed, preferredColor = null) {
    const subshapes = ["C", "R", "S"];
    if (windmillAllowed) {
        subshapes.push("W");
    }
    const colors = ["u"];
    if (hasPainter) {
        colors.push("r", "g", "b");
        if (hasMixer) {
            colors.push("y", "p", "c", "w");
            if (preferredColor) colors.push(
                preferredColor, preferredColor, 
                preferredColor, preferredColor, 
                preferredColor, preferredColor);
        } else {
            if (preferredColor) colors.push(preferredColor, preferredColor);
        }
    }
    return randomizer.choice(subshapes) + randomizer.choice(colors);
}
