import { apdebuglog, aptry, connection, currentIngame, modImpl } from "./global_data";
import { checkLocation, receiveItemFunctions } from "./server_communication";

export function addCommands() {
    apdebuglog("Calling addCommands");
    globalThis.AP = {};
    // Objects
    globalThis.AP.connenction = () => {return connection};
    globalThis.AP.currentIngame = () => {return currentIngame};
    globalThis.AP.receiveItemFunctions = () => {return receiveItemFunctions};
    globalThis.AP.shapez = () => {return shapez};
    globalThis.AP.modImpl = () => {return modImpl};
    // Commands
    globalThis.AP.printLevels = (level = null) => {
        let text = "";
        if (level) {
            let def = currentIngame.levelDefs[level-1];
            text += `${def.required}x ${def.shape}${def.throughputOnly ? " throughput" : ""}`;
        } else {
            let count = 1;
            for (let def of currentIngame.levelDefs) {
                text += `Level ${count++}: ${def.required}x ${def.shape}${def.throughputOnly ? " throughput" : ""}<br />`;
            }
        }
        modImpl.dialogs.showInfo("Levels debug", text);
    };
    globalThis.AP.sendAPMessage = (message) => {
        connection.client.say(message);
    };
    globalThis.AP.enableDebug = (password) => {
        connection.debug -= password;
    };
    globalThis.AP.debugCheck = (name, goal = false) => {
        if (!connection.debug) {
            checkLocation("Debugged", goal, name);
        } else {
            connection.client.say("Oops");
        }
    };
    globalThis.AP.testError = () => {
        aptry("Test error", () => {throw Error("Bottom text.")});
    };
    globalThis.AP.setDebugSetting = (name, value) => {
        aptry("Debug settings error", () => {
            modImpl.dialogs.showInfo("Important", `Are you sure what you're doing!? Set ${name} to ${value}`);
            modImpl.settings[name] = value;
            modImpl.saveSettings();
        });
    }
}
