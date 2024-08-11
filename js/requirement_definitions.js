import { RandomNumberGenerator } from "shapez/core/rng";

export function vanillaShapes(multiplier) {
    return [
        {shape: "CuCuCuCu", required: Math.ceil(30*multiplier/10), reward: "no_reward",},
        {shape: "----CuCu", required: Math.ceil(40*multiplier/10), reward: "no_reward",},
        {shape: "RuRuRuRu", required: Math.ceil(70*multiplier/10), reward: "no_reward",},
        {shape: "RuRu----", required: Math.ceil(70*multiplier/10), reward: "no_reward",},
        {shape: "Cu----Cu", required: Math.ceil(170*multiplier/10), reward: "no_reward",},
        {shape: "Cu------", required: Math.ceil(270*multiplier/10), reward: "no_reward",},
        {shape: "CrCrCrCr", required: Math.ceil(300*multiplier/10), reward: "no_reward",},
        {shape: "RbRb----", required: Math.ceil(480*multiplier/10), reward: "no_reward",},
        {shape: "CpCpCpCp", required: Math.ceil(600*multiplier/10), reward: "no_reward",},
        {shape: "ScScScSc", required: Math.ceil(800*multiplier/10), reward: "no_reward",},
        {shape: "CgScScCg", required: Math.ceil(1000*multiplier/10), reward: "no_reward",},
        {shape: "CbCbCbRb:CwCwCwCw", required: Math.ceil(1000*multiplier/10), reward: "no_reward",},
        {shape: "RpRpRpRp:CwCwCwCw", required: Math.ceil(3800*multiplier/10), reward: "no_reward",},
        {shape: "--Cg----:--Cr----", required: Math.ceil(8*multiplier/10), reward: "no_reward", throughputOnly: true,},
        {shape: "SrSrSrSr:CyCyCyCy", required: Math.ceil(10000*multiplier/10), reward: "no_reward",},
        {shape: "SrSrSrSr:CyCyCyCy:SwSwSwSw", required: Math.ceil(6000*multiplier/10), reward: "no_reward",},
        {shape: "CbRbRbCb:CwCwCwCw:WbWbWbWb", required: Math.ceil(20000*multiplier/10), reward: "no_reward",},
        {shape: "Sg----Sg:CgCgCgCg:--CyCy--", required: Math.ceil(20000*multiplier/10), reward: "no_reward",},
        {shape: "CpRpCp--:SwSwSwSw", required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
        {shape: "RuCw--Cw:----Ru--", required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
        {shape: "CrCwCrCw:CwCrCwCr:CrCwCrCw:CwCrCwCr", required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
        {shape: "Cg----Cr:Cw----Cw:Sy------:Cy----Cy", required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
        {shape: "CcSyCcSy:SyCcSyCc:CcSyCcSy", required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
        {shape: "CcRcCcRc:RwCwRwCw:Sr--Sw--:CyCyCyCy", required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
        {shape: "Rg--Rg--:CwRwCwRw:--Rg--Rg", required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
        {shape: "CbCuCbCu:Sr------:--CrSrCr:CwCwCwCw", required: Math.ceil(50000*multiplier/10), reward: "no_reward",}
    ];
}

export function randomizedVanillaStepsShapes(randomizer, maxlevel, multiplier, building1, building2, building3, building4, building5) {
    var phase = {"Cutter": 0, "Rotator": 0, "Stacker": 0, "Painter": 0, "Color Mixer": 0};
    phase[building1] = 1;
    phase[building2] = 2;
    phase[building3] = 3;
    phase[building4] = 4;
    phase[building5] = 5;
    var levelsdefs = [
        {shape: calcRandomShape(randomizer, false, false, false, false, false), 
            required: Math.ceil(30*multiplier/10), reward: "no_reward",},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] == 1, 
            phase["Rotator"] == 1, 
            phase["Stacker"] == 1, 
            phase["Painter"] == 1, 
            phase["Color Mixer"] == 1), 
            required: Math.ceil(40*multiplier/10), reward: "no_reward",},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] == 1, 
            phase["Rotator"] == 1, 
            phase["Stacker"] == 1, 
            phase["Painter"] == 1, 
            phase["Color Mixer"] == 1), 
            required: Math.ceil(70*multiplier/10), reward: "no_reward",},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] == 1, 
            phase["Rotator"] == 1, 
            phase["Stacker"] == 1, 
            phase["Painter"] == 1, 
            phase["Color Mixer"] == 1), 
            required: Math.ceil(70*multiplier/10), reward: "no_reward",},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 2, 
            phase["Rotator"] <= 2, 
            phase["Stacker"] <= 2, 
            phase["Painter"] <= 2, 
            phase["Color Mixer"] <= 2), 
            required: Math.ceil(170*multiplier/10), reward: "no_reward",},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 2, 
            phase["Rotator"] <= 2, 
            phase["Stacker"] <= 2, 
            phase["Painter"] <= 2, 
            phase["Color Mixer"] <= 2), 
            required: Math.ceil(270*multiplier/10), reward: "no_reward",},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 3, 
            phase["Rotator"] <= 3, 
            phase["Stacker"] <= 3, 
            phase["Painter"] <= 3, 
            phase["Color Mixer"] <= 3), 
            required: Math.ceil(300*multiplier/10), reward: "no_reward",},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 3, 
            phase["Rotator"] <= 3, 
            phase["Stacker"] <= 3, 
            phase["Painter"] <= 3, 
            phase["Color Mixer"] <= 3), 
            required: Math.ceil(480*multiplier/10), reward: "no_reward",},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 4, 
            phase["Rotator"] <= 4, 
            phase["Stacker"] <= 4, 
            phase["Painter"] <= 4, 
            phase["Color Mixer"] <= 4), 
            required: Math.ceil(600*multiplier/10), reward: "no_reward",},
        {shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 4, 
            phase["Rotator"] <= 4, 
            phase["Stacker"] <= 4, 
            phase["Painter"] <= 4, 
            phase["Color Mixer"] <= 4), 
            required: Math.ceil(800*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(1000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(1000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(3800*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(8*multiplier/10), reward: "no_reward", throughputOnly: true,},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(10000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(6000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(20000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(20000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(25000*multiplier/10), reward: "no_reward",},
            {shape: calcRandomShape(randomizer, true, true, true, true, true), 
                required: Math.ceil(50000*multiplier/10), reward: "no_reward",}
    ];
    for (var i = 27; i <= maxlevel+1; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil((4+0.25*(i-27))*multiplier/10), reward: "no_reward", throughputOnly: true});
    };
    return levelsdefs;
}

export function randomizedStretchedShapes(randomizer, maxlevel, multiplier, building1, building2, building3, building4, building5) {
    var levelsdefs = {};
    var phase = {"Cutter": 0, "Rotator": 0, "Stacker": 0, "Painter": 0, "Color Mixer": 0};
    phase[building1] = 1;
    phase[building2] = 2;
    phase[building3] = 3;
    phase[building4] = 4;
    phase[building5] = 5;
    const phaselength = Math.floor(maxlevel/26);
    for (var i = 0; i < phaselength; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, false, false, false, false, false), 
            required: Math.ceil((30+30*i)*multiplier/10), reward: "no_reward"});
    }
    for (var i = 0; i < phaselength; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 
            phase["Cutter"] == 1, 
            phase["Rotator"] == 1, 
            phase["Stacker"] == 1, 
            phase["Painter"] == 1, 
            phase["Color Mixer"] == 1), 
            required: Math.ceil((40+10*i)*multiplier/10), reward: "no_reward"});
    }
    for (var i = 0; i < phaselength; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 2, 
            phase["Rotator"] <= 2, 
            phase["Stacker"] <= 2, 
            phase["Painter"] <= 2, 
            phase["Color Mixer"] <= 2), 
            required: Math.ceil((170+30*i)*multiplier/10), reward: "no_reward"});
    }
    for (var i = 0; i < phaselength; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 3, 
            phase["Rotator"] <= 3, 
            phase["Stacker"] <= 3, 
            phase["Painter"] <= 3, 
            phase["Color Mixer"] <= 3), 
            required: Math.ceil((300+60*i)*multiplier/10), reward: "no_reward"});
    }
    for (var i = 0; i < phaselength; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, 
            phase["Cutter"] <= 4, 
            phase["Rotator"] <= 4, 
            phase["Stacker"] <= 4, 
            phase["Painter"] <= 4, 
            phase["Color Mixer"] <= 4), 
            required: Math.ceil((600+120*i)*multiplier/10), reward: "no_reward"});
    }
    for (var ii = levelsdefs.length; ii <= maxlevel; ii++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil(((ii+1)*50*1000/(maxlevel+1))*multiplier/10), reward: "no_reward"});
    };
    return levelsdefs;
}

export function randomizedHardcoreShapes(randomizer, maxlevel, multiplier) {
    var levelsdefs = [
        {shape: calcRandomShape(randomizer, false, false, false, false, false), 
            required: Math.ceil(30*multiplier/10), reward: "no_reward",}
    ];
    for (var i = 2; i <= maxlevel+1; i++) {
        levelsdefs.push({shape: calcRandomShape(randomizer, true, true, true, true, true), 
            required: Math.ceil((50*i*1000/(maxlevel+1))*multiplier/10), reward: "no_reward"});
    };
    return levelsdefs;
}

export function vanillaUpgradeShapes(multiplier, finaltier) {
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
    return constructUpgradeShapes(multiplier, finaltier, beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function vanillaLikeUpgradeShapes(multiplier, randomizer, finaltier, samelate, building1, building2, building3, building4, building5) {
    var phase = {"Cutter": 0, "Rotator": 0, "Stacker": 0, "Painter": 0, "Color Mixer": 0};
    phase[building1] = 1;
    phase[building2] = 2;
    phase[building3] = 3;
    phase[building4] = 4;
    phase[building5] = 5;
    const beltshapes = [
        calcRandomShape(randomizer, false, false, false, false, false),
        calcRandomShape(randomizer, phase["Cutter"] <= 2, phase["Rotator"] <= 2, phase["Painter"] <= 2, phase["Color Mixer"] <= 2, phase["Stacker"] <= 2),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true)
    ];
    const minershapes = [
        calcRandomShape(randomizer, false, false, false, false, false),
        calcRandomShape(randomizer, phase["Cutter"] <= 2, phase["Rotator"] <= 2, phase["Painter"] <= 2, phase["Color Mixer"] <= 2, phase["Stacker"] <= 2),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true)
    ];
    const processorsshapes = [
        calcRandomShape(randomizer, false, false, false, false, false),
        calcRandomShape(randomizer, phase["Cutter"] <= 1, phase["Rotator"] <= 1, phase["Painter"] <= 1, phase["Color Mixer"] <= 1, phase["Stacker"] <= 1),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true)
    ];
    const paintingshapes = [
        calcRandomShape(randomizer, phase["Cutter"] <= 3, phase["Rotator"] <= 3, phase["Painter"] <= 3, phase["Color Mixer"] <= 3, phase["Stacker"] <= 3),
        calcRandomShape(randomizer, phase["Cutter"] <= 3, phase["Rotator"] <= 3, phase["Painter"] <= 3, phase["Color Mixer"] <= 3, phase["Stacker"] <= 3),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true)
    ];
    if (samelate) {
        var late1 = calcRandomShape(randomizer, true, true, true, true, true);
        var late2 = calcRandomShape(randomizer, true, true, true, true, true);
        var late3 = calcRandomShape(randomizer, true, true, true, true, true);
        beltshapes.push(late1, late2, late3);
        minershapes.push(late1, late2, late3);
        processorsshapes.push(late1, late2, late3);
        paintingshapes.push(late1, late2, late3);
    } else {
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true));
    }
    return constructUpgradeShapes(multiplier, finaltier, beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function linearUpgradeShapes(multiplier, randomizer, finaltier, samelate, building1, building2, building3, building4, building5) {
    var phase = {"Cutter": 0, "Rotator": 0, "Stacker": 0, "Painter": 0, "Color Mixer": 0};
    phase[building1] = 1;
    phase[building2] = 2;
    phase[building3] = 3;
    phase[building4] = 4;
    phase[building5] = 5;
    const beltshapes = [
        calcRandomShape(randomizer, false, false, false, false, false),
        calcRandomShape(randomizer, phase["Cutter"] <= 1, phase["Rotator"] <= 1, phase["Painter"] <= 1, phase["Color Mixer"] <= 1, phase["Stacker"] <= 1),
        calcRandomShape(randomizer, phase["Cutter"] <= 2, phase["Rotator"] <= 2, phase["Painter"] <= 2, phase["Color Mixer"] <= 2, phase["Stacker"] <= 2),
        calcRandomShape(randomizer, phase["Cutter"] <= 3, phase["Rotator"] <= 3, phase["Painter"] <= 3, phase["Color Mixer"] <= 3, phase["Stacker"] <= 3),
        calcRandomShape(randomizer, phase["Cutter"] <= 4, phase["Rotator"] <= 4, phase["Painter"] <= 4, phase["Color Mixer"] <= 4, phase["Stacker"] <= 4)
    ];
    const minershapes = [
        calcRandomShape(randomizer, false, false, false, false, false),
        calcRandomShape(randomizer, phase["Cutter"] <= 1, phase["Rotator"] <= 1, phase["Painter"] <= 1, phase["Color Mixer"] <= 1, phase["Stacker"] <= 1),
        calcRandomShape(randomizer, phase["Cutter"] <= 2, phase["Rotator"] <= 2, phase["Painter"] <= 2, phase["Color Mixer"] <= 2, phase["Stacker"] <= 2),
        calcRandomShape(randomizer, phase["Cutter"] <= 3, phase["Rotator"] <= 3, phase["Painter"] <= 3, phase["Color Mixer"] <= 3, phase["Stacker"] <= 3),
        calcRandomShape(randomizer, phase["Cutter"] <= 4, phase["Rotator"] <= 4, phase["Painter"] <= 4, phase["Color Mixer"] <= 4, phase["Stacker"] <= 4)
    ];
    const processorsshapes = [
        calcRandomShape(randomizer, false, false, false, false, false),
        calcRandomShape(randomizer, phase["Cutter"] <= 1, phase["Rotator"] <= 1, phase["Painter"] <= 1, phase["Color Mixer"] <= 1, phase["Stacker"] <= 1),
        calcRandomShape(randomizer, phase["Cutter"] <= 2, phase["Rotator"] <= 2, phase["Painter"] <= 2, phase["Color Mixer"] <= 2, phase["Stacker"] <= 2),
        calcRandomShape(randomizer, phase["Cutter"] <= 3, phase["Rotator"] <= 3, phase["Painter"] <= 3, phase["Color Mixer"] <= 3, phase["Stacker"] <= 3),
        calcRandomShape(randomizer, phase["Cutter"] <= 4, phase["Rotator"] <= 4, phase["Painter"] <= 4, phase["Color Mixer"] <= 4, phase["Stacker"] <= 4)
    ];
    const paintingshapes = [
        calcRandomShape(randomizer, false, false, false, false, false),
        calcRandomShape(randomizer, phase["Cutter"] <= 1, phase["Rotator"] <= 1, phase["Painter"] <= 1, phase["Color Mixer"] <= 1, phase["Stacker"] <= 1),
        calcRandomShape(randomizer, phase["Cutter"] <= 2, phase["Rotator"] <= 2, phase["Painter"] <= 2, phase["Color Mixer"] <= 2, phase["Stacker"] <= 2),
        calcRandomShape(randomizer, phase["Cutter"] <= 3, phase["Rotator"] <= 3, phase["Painter"] <= 3, phase["Color Mixer"] <= 3, phase["Stacker"] <= 3),
        calcRandomShape(randomizer, phase["Cutter"] <= 4, phase["Rotator"] <= 4, phase["Painter"] <= 4, phase["Color Mixer"] <= 4, phase["Stacker"] <= 4)
    ];
    if (samelate) {
        var late1 = calcRandomShape(randomizer, true, true, true, true, true);
        var late2 = calcRandomShape(randomizer, true, true, true, true, true);
        var late3 = calcRandomShape(randomizer, true, true, true, true, true);
        beltshapes.push(late1, late2, late3);
        minershapes.push(late1, late2, late3);
        processorsshapes.push(late1, late2, late3);
        paintingshapes.push(late1, late2, late3);
    } else {
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true));
    }
    return constructUpgradeShapes(multiplier, finaltier, beltshapes, minershapes, processorsshapes, paintingshapes);
}

export function hardcoreUpgradeShapes(multiplier, randomizer, finaltier, samelate) {
    const beltshapes = [
        calcRandomShape(randomizer, false, false, false, false, false),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true)
    ];
    const minershapes = [
        calcRandomShape(randomizer, false, false, false, false, false),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true)
    ];
    const processorsshapes = [
        calcRandomShape(randomizer, false, false, false, false, false),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true)
    ];
    const paintingshapes = [
        calcRandomShape(randomizer, false, false, false, false, false),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true),
        calcRandomShape(randomizer, true, true, true, true, true)
    ];
    if (samelate) {
        var late1 = calcRandomShape(randomizer, true, true, true, true, true);
        var late2 = calcRandomShape(randomizer, true, true, true, true, true);
        var late3 = calcRandomShape(randomizer, true, true, true, true, true);
        beltshapes.push(late1, late2, late3);
        minershapes.push(late1, late2, late3);
        processorsshapes.push(late1, late2, late3);
        paintingshapes.push(late1, late2, late3);
    } else {
        beltshapes.push(calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true));
        minershapes.push(calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true));
        processorsshapes.push(calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true));
        paintingshapes.push(calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true), calcRandomShape(randomizer, true, true, true, true, true));
    }
    return constructUpgradeShapes(multiplier, finaltier, beltshapes, minershapes, processorsshapes, paintingshapes);
}

function constructUpgradeShapes(multiplier, finaltier, beltshapes, minershapes, processorsshapes, paintingshapes) {
    var upgradedefs = {
        belt: [
            {required: [
                { shape: beltshapes[0], amount: Math.ceil(30*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: beltshapes[0], amount: Math.ceil(75*multiplier/10) },
                { shape: beltshapes[1], amount: Math.ceil(500*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: beltshapes[0], amount: Math.ceil(180*multiplier/10) },
                { shape: beltshapes[1], amount: Math.ceil(1200*multiplier/10) },
                { shape: beltshapes[2], amount: Math.ceil(1000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: beltshapes[0], amount: Math.ceil(440*multiplier/10) },
                { shape: beltshapes[1], amount: Math.ceil(3000*multiplier/10) },
                { shape: beltshapes[2], amount: Math.ceil(2500*multiplier/10) },
                { shape: beltshapes[3], amount: Math.ceil(6000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: beltshapes[0], amount: Math.ceil(1100*multiplier/10) },
                { shape: beltshapes[1], amount: Math.ceil(7000*multiplier/10) },
                { shape: beltshapes[2], amount: Math.ceil(6000*multiplier/10) },
                { shape: beltshapes[3], amount: Math.ceil(15000*multiplier/10) },
                { shape: beltshapes[4], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: beltshapes[5], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: beltshapes[5], amount: Math.ceil(25000*multiplier/10) },
                { shape: beltshapes[6], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true}
        ],
        miner: [
            {required: [
                { shape: minershapes[0], amount: Math.ceil(300*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: minershapes[0], amount: Math.ceil(740*multiplier/10) },
                { shape: minershapes[1], amount: Math.ceil(800*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: minershapes[0], amount: Math.ceil(1800*multiplier/10) },
                { shape: minershapes[1], amount: Math.ceil(2000*multiplier/10) },
                { shape: minershapes[2], amount: Math.ceil(3500*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: minershapes[0], amount: Math.ceil(4500*multiplier/10) },
                { shape: minershapes[1], amount: Math.ceil(5000*multiplier/10) },
                { shape: minershapes[2], amount: Math.ceil(8000*multiplier/10) },
                { shape: minershapes[3], amount: Math.ceil(23000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: minershapes[0], amount: Math.ceil(11000*multiplier/10) },
                { shape: minershapes[1], amount: Math.ceil(12000*multiplier/10) },
                { shape: minershapes[2], amount: Math.ceil(20000*multiplier/10) },
                { shape: minershapes[3], amount: Math.ceil(50000*multiplier/10) },
                { shape: minershapes[4], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: minershapes[5], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: minershapes[5], amount: Math.ceil(25000*multiplier/10) },
                { shape: minershapes[6], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true}
        ],
        processors: [
            {required: [
                { shape: processorsshapes[0], amount: Math.ceil(500*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: processorsshapes[0], amount: Math.ceil(1200*multiplier/10) },
                { shape: processorsshapes[1], amount: Math.ceil(600*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: processorsshapes[0], amount: Math.ceil(3000*multiplier/10) },
                { shape: processorsshapes[1], amount: Math.ceil(1500*multiplier/10) },
                { shape: processorsshapes[2], amount: Math.ceil(3500*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: processorsshapes[0], amount: Math.ceil(7000*multiplier/10) },
                { shape: processorsshapes[1], amount: Math.ceil(3500*multiplier/10) },
                { shape: processorsshapes[2], amount: Math.ceil(8000*multiplier/10) },
                { shape: processorsshapes[3], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: processorsshapes[0], amount: Math.ceil(17000*multiplier/10) },
                { shape: processorsshapes[1], amount: Math.ceil(8000*multiplier/10) },
                { shape: processorsshapes[2], amount: Math.ceil(20000*multiplier/10) },
                { shape: processorsshapes[3], amount: Math.ceil(60000*multiplier/10) },
                { shape: processorsshapes[4], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: processorsshapes[5], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: processorsshapes[5], amount: Math.ceil(25000*multiplier/10) },
                { shape: processorsshapes[6], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true}
        ],
        painting: [
            {required: [
                { shape: paintingshapes[0], amount: Math.ceil(600*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: paintingshapes[0], amount: Math.ceil(1500*multiplier/10) },
                { shape: paintingshapes[1], amount: Math.ceil(3800*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: paintingshapes[0], amount: Math.ceil(3500*multiplier/10) },
                { shape: paintingshapes[1], amount: Math.ceil(9000*multiplier/10) },
                { shape: paintingshapes[2], amount: Math.ceil(6500*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: paintingshapes[0], amount: Math.ceil(8000*multiplier/10) },
                { shape: paintingshapes[1], amount: Math.ceil(20000*multiplier/10) },
                { shape: paintingshapes[2], amount: Math.ceil(16000*multiplier/10) },
                { shape: paintingshapes[3], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: paintingshapes[0], amount: Math.ceil(20000*multiplier/10) },
                { shape: paintingshapes[1], amount: Math.ceil(50000*multiplier/10) },
                { shape: paintingshapes[2], amount: Math.ceil(40000*multiplier/10) },
                { shape: paintingshapes[3], amount: Math.ceil(60000*multiplier/10) },
                { shape: paintingshapes[4], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: paintingshapes[5], amount: Math.ceil(25000*multiplier/10) }
            ], excludePrevious: true},
            {required: [
                { shape: paintingshapes[5], amount: Math.ceil(25000*multiplier/10) },
                { shape: paintingshapes[6], amount: Math.ceil(50000*multiplier/10) }
            ], excludePrevious: true}
        ]
    };
    for (var i = 9; i <= finaltier; i++) {
        upgradedefs.belt.push({required: [
            { shape: beltshapes[5], amount: Math.ceil((-60000 + i * 10000)*multiplier/10) },
            { shape: beltshapes[6], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) },
            { shape: beltshapes[7], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) }
        ], excludePrevious: true});
        upgradedefs.miner.push({required: [
            { shape: minershapes[5], amount: Math.ceil((-60000 + i * 10000)*multiplier/10) },
            { shape: minershapes[6], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) },
            { shape: minershapes[7], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) }
        ], excludePrevious: true});
        upgradedefs.processors.push({required: [
            { shape: processorsshapes[5], amount: Math.ceil((-60000 + i * 10000)*multiplier/10) },
            { shape: processorsshapes[6], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) },
            { shape: processorsshapes[7], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) }
        ], excludePrevious: true});
        upgradedefs.painting.push({required: [
            { shape: paintingshapes[5], amount: Math.ceil((-60000 + i * 10000)*multiplier/10) },
            { shape: paintingshapes[6], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) },
            { shape: paintingshapes[7], amount: Math.ceil((-25000 + i * 5000)*multiplier/10) }
        ], excludePrevious: true});
    }
    return upgradedefs;
}

/**
 * 
 * @param {RandomNumberGenerator} randomizer 
 * @returns {string} full shape
 */
function calcRandomShape(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer) {
    var hash = calcRandomLayer(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer);
    if (hasStacker) {
        if (randomizer.nextIntRange(0, 2) == 0) {
            hash = stackLayers(hash, calcRandomLayer(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer));
            if (randomizer.nextIntRange(0, 2) == 0) {
                hash = stackLayers(hash, calcRandomLayer(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer));
                if (randomizer.nextIntRange(0, 2) == 0) {
                    hash = stackLayers(hash, calcRandomLayer(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer));
                }
            }
        }
    }
    return hash;
}

/**
 * 
 * @param {string} bottom 
 * @param {string} newlayer 
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
    if (!hasCutter) {
        layer = calcRandomPart(randomizer, hasPainter, hasMixer);
        layer += layer + layer + layer;
    } else {
        layer = calcRandomHalf(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer);
        if (hasStacker && randomizer.nextIntRange(0, 2) == 0) {
            layer += calcRandomHalf(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer);
        } else {
            if (randomizer.nextIntRange(0, 2) == 0) {
                layer = layer + "----";
            } else {
                layer = "----" + layer;
            }
        }
        if (hasRotator) {
            layer = layer.substring(2, 8) + layer.substring(0, 2);
        }
    }
    return layer;
}

/**
 * hasCutter == true
 * @param {RandomNumberGenerator} randomizer 
 * @returns {string}
 */
function calcRandomHalf(randomizer, hasCutter, hasRotator, hasStacker, hasPainter, hasMixer) {
    var part = calcRandomPart(randomizer, hasPainter, hasMixer);
    if (hasCutter && hasRotator && hasStacker) {
        part += calcRandomPart(randomizer, hasPainter, hasMixer);
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
function calcRandomPart(randomizer, hasPainter, hasMixer) {
    const subshapes = ["C", "R", "W", "S"];
    const colors = ["r", "g", "b", "y", "p", "c", "w", "u"];
    if (hasPainter) {
        if (hasMixer) {
            return subshapes[randomizer.nextIntRange(0, 4)] + colors[randomizer.nextIntRange(0, 8)];
        } else {
            return subshapes[randomizer.nextIntRange(0, 4)] + colors[randomizer.nextIntRange(0, 3)];
        }
    } else {
        return subshapes[randomizer.nextIntRange(0, 4)] + "u";
    }
}
