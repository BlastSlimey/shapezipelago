import { Mod } from "shapez/mods/mod";
import { connected, setConnected, setGamePackage } from "./global_data";
import { ITEMS_HANDLING_FLAGS, Client } from "archipelago.js";

/**
 * @param {Mod} modImpl
 * @param {Client} client
 * @param {string} autoPlayer
 * @param {string} autoAddress
 * @param {string} autoPort
 * @param {string} autoPassword
 */
export function addInputContainer(modImpl, client, autoPlayer, autoAddress, autoPort, autoPassword) {
    modImpl.signals.stateEntered.add(state => {
        if (state.key === "MainMenuState") {
            const mainWrapper = document.body.getElementsByClassName("mainWrapper").item(0);
            const sideContainer = mainWrapper.getElementsByClassName("sideContainer").item(0);
            const inputContainer = document.createElement("div");
            inputContainer.className = "inputContainer";
            sideContainer.appendChild(inputContainer);
            const playerContainer = document.createElement("div");
            const addressContainer = document.createElement("div");
            const portContainer = document.createElement("div");
            const passwordContainer = document.createElement("div");
            const statusContainer = document.createElement("div");
            playerContainer.className = "playerContainer";
            addressContainer.className = "addressContainer";
            portContainer.className = "portContainer";
            passwordContainer.className = "passwordContainer";
            statusContainer.className = "statusContainer";
            inputContainer.appendChild(playerContainer);
            inputContainer.appendChild(addressContainer);
            inputContainer.appendChild(portContainer);
            inputContainer.appendChild(passwordContainer);
            inputContainer.appendChild(statusContainer);
            const playerLabel = document.createElement("h4");
            const playerInput = document.createElement("input");
            playerLabel.innerText = "Player";
            playerInput.type = "text";
            playerInput.className = "playerInput";
            playerInput.value = autoPlayer;
            playerContainer.appendChild(playerLabel);
            playerContainer.appendChild(playerInput);
            const addressLabel = document.createElement("h4");
            const addressInput = document.createElement("input");
            addressLabel.innerText = "Address";
            addressInput.type = "text";
            addressInput.className = "addressInput";
            addressInput.value = autoAddress;
            addressContainer.appendChild(addressLabel);
            addressContainer.appendChild(addressInput);
            const portLabel = document.createElement("h4");
            const portInput = document.createElement("input");
            portLabel.innerText = "Port";
            portInput.type = "number";
            portInput.value = autoPort;
            portContainer.appendChild(portLabel);
            portContainer.appendChild(portInput);
            const passwordLabel = document.createElement("h4");
            const passwordInput = document.createElement("input");
            passwordLabel.innerText = "Password";
            passwordInput.type = "password";
            passwordInput.value = autoPassword;
            passwordContainer.appendChild(passwordLabel);
            passwordContainer.appendChild(passwordInput);
            const statusLabel = document.createElement("h4");
            const statusButton = document.createElement("button");
            statusLabel.innerText = connected ? "Connected" : "Not Connected";
            statusButton.innerText = connected ? "Disconnected" : "Connect";
            statusButton.classList.add("styledButton", "statusButton");
            statusButton.addEventListener("click", () => {
                if (!connected) {
                    var connectInfo = {
                        hostname: addressInput.value, // Replace with the actual AP server hostname.
                        port: portInput.valueAsNumber, // Replace with the actual AP server port.
                        game: "shapez", // Replace with the game name for this player.
                        name: playerInput.value, // Replace with the player slot name.
                        items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL,
                        password: passwordInput.value
                    };
                    client.connect(connectInfo)
                        .then(() => {
                            console.log("[Archipelago] Connected to the server");
                            setConnected(true);
                            setGamePackage(client.data.package.get("shapez"));
                            statusLabel.innerText = "Connected";
                            statusButton.innerText = "Disconnect";
                        })
                        .catch((error) => {
                            console.error("[Archipelago] Failed to connect:", error);
                            statusLabel.innerText = "Connection failed";
                        });
                } else {
                    client.disconnect();
                    console.log("[Archipelago] Disconnected from the server");
                    setConnected(false);
                    statusLabel.innerText = "Disconnected";
                    statusButton.innerText = "Connect";
                }
                
            });
            statusContainer.appendChild(statusLabel);
            statusContainer.appendChild(statusButton);
        }
    });
    modImpl.modInterface.registerCss(`
            #state_MainMenuState .inputContainer {
                display: flex;
                width: 90%;
                flex-direction: column;
                grid-gap: calc(5px*var(--ui-scale));
                background: #65a4b3;
                border-radius: calc(6px*var(--ui-scale));
                justify-content: center;
                align-items: flex-start;
                padding: calc(10px * var(--ui-scale));
                box-shadow: 0 calc(5px * var(--ui-scale)) calc(15px * var(--ui-scale)) rgba(0, 0, 0, 0.2);
            }
            #state_MainMenuState .playerContainer {
                display: flex;
                width: 100%;
                flex-direction: row;
                grid-gap: calc(5px*var(--ui-scale));
                background: #65a4b3;
                align-items: center;
                justify-content: flex-end;
            }
            #state_MainMenuState .addressContainer {
                display: flex;
                width: 100%;
                flex-direction: row;
                grid-gap: calc(5px*var(--ui-scale));
                background: #65a4b3;
                align-items: center;
                justify-content: flex-end;
            }
            #state_MainMenuState .portContainer {
                display: flex;
                width: 100%;
                flex-direction: row;
                grid-gap: calc(5px*var(--ui-scale));
                background: #65a4b3;
                align-items: center;
                justify-content: flex-end;
            }
            #state_MainMenuState .passwordContainer {
                display: flex;
                width: 100%;
                flex-direction: row;
                grid-gap: calc(5px*var(--ui-scale));
                background: #65a4b3;
                align-items: center;
                justify-content: flex-end;
            }
            #state_MainMenuState .statusContainer {
                display: flex;
                width: 100%;
                flex-direction: row;
                grid-gap: calc(5px*var(--ui-scale));
                background: #65a4b3;
                align-items: center;
                justify-content: flex-end;
            }
            #state_MainMenuState .playerInput {
                color: #000;
                padding: calc(1px * var(--ui-scale)) calc(3px * var(--ui-scale));
                margin: calc(0px * var(--ui-scale)) calc(0px * var(--ui-scale));
            }
            #state_MainMenuState .addressInput {
                color: #000;
                padding: calc(1px * var(--ui-scale)) calc(3px * var(--ui-scale));
                margin: calc(0px * var(--ui-scale)) calc(0px * var(--ui-scale));
            }
            #state_MainMenuState .portInput {
                padding: calc(1px * var(--ui-scale)) calc(3px * var(--ui-scale));
                margin: calc(0px * var(--ui-scale)) calc(0px * var(--ui-scale));
            }
            #state_MainMenuState .passwordInput {
                padding: calc(1px * var(--ui-scale)) calc(3px * var(--ui-scale));
                margin: calc(0px * var(--ui-scale)) calc(0px * var(--ui-scale));
            }
            #state_MainMenuState .statusButton {
                padding: calc(1px * var(--ui-scale)) calc(3px * var(--ui-scale));
                margin: calc(0px * var(--ui-scale)) calc(0px * var(--ui-scale));
                background-color: red;
            }
        `);
}