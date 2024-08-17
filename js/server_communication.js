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
export function checkLocation(name, another = null) {
    if (name === "Goal") {
        client.updateStatus(CLIENT_STATUS.GOAL);
    } else {
        if (another) {
            client.locations.check(gamePackage.location_name_to_id[name], gamePackage.location_name_to_id[another]);
            console.log("[Archipelago] Checked location " + name);
            console.log("[Archipelago] Checked location " + another)
        } else {
            client.locations.check(gamePackage.location_name_to_id[name]);
            console.log("[Archipelago] Checked location " + name);
        }
    }
}

/**
 * 
 * @param {import("archipelago.js").NetworkItem[]} items 
 */
export function processItemsPacket(items) {
    if (processedItemCount + 1 >= items.length) {
        for (var i = processedItemCount; i < items.length; i++) {
            receiveItem(items[i], true);
            increaseProcessedItems();
        }
    } else {
        var itemCounting = [];
        for (var i = processedItemCount; i < items.length; i++) {
            itemCounting.push(receiveItem(items[i], false));
            increaseProcessedItems();
        }
        storedModImpl.dialogs.showInfo("Items received!", itemCounting.join("<br />"));
    }
}

/**
 * 
 * @param {import("archipelago.js").NetworkItem} item 
 */
function receiveItem(item, showInfo) {
    const itemName = client.items.name("shapez", item.item);
    const message = receiveItemFunctions[itemName](storedRoot);
    if (showInfo) {
        storedModImpl.dialogs.showInfo("Item received!", itemName + message);
        return "";
    } else {
        return itemName + message;
    }
}