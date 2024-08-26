import { Mod } from "shapez/mods/mod";
import { connected, customRewards, processedItemCount, setProcessedItems } from "./global_data";

/**
 * 
 * @param {Mod} modImpl 
 */
export function registerSavingData(modImpl) {
    modImpl.signals.gameSerialized.add((root, data) => {
        if (connected) {
            data.modExtraData["reward_cutter"] = customRewards.reward_cutter;
            data.modExtraData["reward_trash"] = customRewards.reward_trash;
            data.modExtraData["reward_wires"] = customRewards.reward_wires;
            data.modExtraData["reward_painter_quad"] = customRewards.reward_painter_quad;
            data.modExtraData["reward_belt"] = customRewards.reward_belt;
            data.modExtraData["reward_extractor"] = customRewards.reward_extractor;
            data.modExtraData["reward_rotater"] = root.hubGoals.gainedRewards["reward_rotater"];
            data.modExtraData["reward_painter"] = root.hubGoals.gainedRewards["reward_painter"];
            data.modExtraData["reward_rotater_ccw"] = root.hubGoals.gainedRewards["reward_rotater_ccw"];
            data.modExtraData["reward_mixer"] = root.hubGoals.gainedRewards["reward_mixer"];
            data.modExtraData["reward_stacker"] = root.hubGoals.gainedRewards["reward_stacker"];
            data.modExtraData["reward_cutter_quad"] = root.hubGoals.gainedRewards["reward_cutter_quad"];
            data.modExtraData["reward_painter_double"] = root.hubGoals.gainedRewards["reward_painter_double"];
            data.modExtraData["reward_rotater_180"] = root.hubGoals.gainedRewards["reward_rotater_180"];
            data.modExtraData["reward_balancer"] = root.hubGoals.gainedRewards["reward_balancer"];
            data.modExtraData["reward_tunnel"] = root.hubGoals.gainedRewards["reward_tunnel"];
            data.modExtraData["reward_merger"] = root.hubGoals.gainedRewards["reward_merger"];
            data.modExtraData["reward_underground_belt_tier_2"] = root.hubGoals.gainedRewards["reward_underground_belt_tier_2"];
            data.modExtraData["reward_splitter"] = root.hubGoals.gainedRewards["reward_splitter"];
            data.modExtraData["reward_miner_chainable"] = root.hubGoals.gainedRewards["reward_miner_chainable"];
            data.modExtraData["reward_belt_reader"] = root.hubGoals.gainedRewards["reward_belt_reader"];
            data.modExtraData["reward_storage"] = root.hubGoals.gainedRewards["reward_storage"];
            data.modExtraData["reward_filter"] = root.hubGoals.gainedRewards["reward_filter"];
            data.modExtraData["reward_display"] = root.hubGoals.gainedRewards["reward_display"];
            data.modExtraData["reward_constant_signal"] = root.hubGoals.gainedRewards["reward_constant_signal"];
            data.modExtraData["reward_logic_gates"] = root.hubGoals.gainedRewards["reward_logic_gates"];
            data.modExtraData["reward_virtual_processing"] = root.hubGoals.gainedRewards["reward_virtual_processing"];
            data.modExtraData["reward_blueprints"] = root.hubGoals.gainedRewards["reward_blueprints"];
            data.modExtraData["improvement_belt"] = root.hubGoals.upgradeImprovements["belt"];
            data.modExtraData["improvement_miner"] = root.hubGoals.upgradeImprovements["miner"];
            data.modExtraData["improvement_processors"] = root.hubGoals.upgradeImprovements["processors"];
            data.modExtraData["improvement_painting"] = root.hubGoals.upgradeImprovements["painting"];
            data.modExtraData["processedItemCount"] = processedItemCount;
            console.log("[Archipelago] Serialized");
        }
    });
    modImpl.signals.gameDeserialized.add((root, data) => {
        if (connected) {
            customRewards.reward_cutter = data.modExtraData["reward_cutter"];
            customRewards.reward_trash = data.modExtraData["reward_trash"];
            customRewards.reward_wires = data.modExtraData["reward_wires"];
            customRewards.reward_painter_quad = data.modExtraData["reward_painter_quad"];
            customRewards.reward_belt = data.modExtraData["reward_belt"];
            customRewards.reward_extractor = data.modExtraData["reward_extractor"];
            root.hubGoals.gainedRewards["reward_rotater"]  =   data.modExtraData["reward_rotater"] ;
            root.hubGoals.gainedRewards["reward_painter"]   =   data.modExtraData["reward_painter"] ;
            root.hubGoals.gainedRewards["reward_rotater_ccw"] =  data.modExtraData["reward_rotater_ccw"] ;
            root.hubGoals.gainedRewards["reward_mixer"] =   data.modExtraData["reward_mixer"] ;
            root.hubGoals.gainedRewards["reward_stacker"] =   data.modExtraData["reward_stacker"];
            root.hubGoals.gainedRewards["reward_cutter_quad"] =  data.modExtraData["reward_cutter_quad"] ;
            root.hubGoals.gainedRewards["reward_painter_double"] = data.modExtraData["reward_painter_double"] ;
            root.hubGoals.gainedRewards["reward_rotater_180"] = data.modExtraData["reward_rotater_180"] ;
            root.hubGoals.gainedRewards["reward_balancer"] =  data.modExtraData["reward_balancer"];
            root.hubGoals.gainedRewards["reward_tunnel"]=  data.modExtraData["reward_tunnel"] ;
            root.hubGoals.gainedRewards["reward_merger"] = data.modExtraData["reward_merger"];
            root.hubGoals.gainedRewards["reward_underground_belt_tier_2"] =   data.modExtraData["reward_underground_belt_tier_2"] ;
            root.hubGoals.gainedRewards["reward_splitter"] = data.modExtraData["reward_splitter"];
            root.hubGoals.gainedRewards["reward_miner_chainable"]  =  data.modExtraData["reward_miner_chainable"];
            root.hubGoals.gainedRewards["reward_belt_reader"]  =  data.modExtraData["reward_belt_reader"] ;
            root.hubGoals.gainedRewards["reward_storage"]   =  data.modExtraData["reward_storage"] ;
            root.hubGoals.gainedRewards["reward_filter"]    =  data.modExtraData["reward_filter"] ;
            root.hubGoals.gainedRewards["reward_display"]  =  data.modExtraData["reward_display"] ;
            root.hubGoals.gainedRewards["reward_constant_signal"] =  data.modExtraData["reward_constant_signal"] ;
            root.hubGoals.gainedRewards["reward_logic_gates"]  =   data.modExtraData["reward_logic_gates"] ;
            root.hubGoals.gainedRewards["reward_virtual_processing"]    =  data.modExtraData["reward_virtual_processing"];
            root.hubGoals.gainedRewards["reward_blueprints"]   =  data.modExtraData["reward_blueprints"];
            root.hubGoals.upgradeImprovements["belt"] = data.modExtraData["improvement_belt"];
            root.hubGoals.upgradeImprovements["miner"] = data.modExtraData["improvement_miner"];
            root.hubGoals.upgradeImprovements["processors"] = data.modExtraData["improvement_processors"];
            root.hubGoals.upgradeImprovements["painting"] = data.modExtraData["improvement_painting"];
            setProcessedItems(data.modExtraData["processedItemCount"]);
            console.log("[Archipelago] Deserialized");
        }
    });
}