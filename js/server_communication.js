import { GameRoot } from "shapez/game/root";
import { client, gamePackage, increaseProcessedItems, processedItemCount, receiveItemFunctions } from "./global_data";
import { CLIENT_STATUS } from "archipelago.js";

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
export function processItemsPacket(items, root, modImpl) {
    for (var i = processedItemCount; i < items.length; i++) {
        receiveItem(items[i], root, modImpl);
        increaseProcessedItems();
    }
}

export function processItemsReconnectPacket(root, modImpl) {
    for (var i = 0; i < client.items.received.length-processedItemCount; i++) {
        receiveItem(client.items.received[i], root, modImpl);
        increaseProcessedItems();
    }
}

/**
 * 
 * @param {GameRoot} root
 * @param {import("archipelago.js").NetworkItem} item 
 */
function receiveItem(item, root, modImpl) {
    const itemName = client.items.name("shapez", item.item);
    receiveItemFunctions[itemName](root);
    modImpl.dialogs.showInfo("Item received!", itemName);
}