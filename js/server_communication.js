import { client, gamePackage, increaseProcessedItems, processedItemCount, receiveItemFunctions } from "./global_data";
import { CLIENT_STATUS } from "archipelago.js";

var storedRoot = null;
var storedModImpl = null;

export function setRootAndModImpl(root, modImpl) {
    storedModImpl = modImpl;
    storedRoot = root;
}

/**
 * 
 * @param {string} name 
 */
export function checkLocation(name) {
    if (name === "Goal") {
        client.updateStatus(CLIENT_STATUS.GOAL);
    } else {
        client.locations.check(gamePackage.location_name_to_id[name]);
        console.log("[Archipelago] Checked location " + name)
    }
}

/**
 * 
 * @param {import("archipelago.js").NetworkItem[]} items 
 */
export function processItemsPacket(items) {
    for (var i = processedItemCount; i < items.length; i++) {
        receiveItem(items[i]);
        increaseProcessedItems();
    }
}

/**
 * 
 * @param {import("archipelago.js").NetworkItem} item 
 */
function receiveItem(item) {
    const itemName = client.items.name("shapez", item.item);
    receiveItemFunctions[itemName](storedRoot);
    storedModImpl.dialogs.showInfo("Item received!", itemName);
}