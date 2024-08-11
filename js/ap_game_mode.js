import { IS_MOBILE } from "shapez/core/config";
import { MetaBlockBuilding } from "shapez/game/buildings/block";
import { MetaConstantProducerBuilding } from "shapez/game/buildings/constant_producer";
import { MetaGoalAcceptorBuilding } from "shapez/game/buildings/goal_acceptor";
import { MetaItemProducerBuilding } from "shapez/game/buildings/item_producer";
import { enumGameModeTypes, GameMode } from "shapez/game/game_mode";
import { HUDConstantSignalEdit } from "shapez/game/hud/parts/constant_signal_edit";
import { HUDGameMenu } from "shapez/game/hud/parts/game_menu";
import { HUDInteractiveTutorial } from "shapez/game/hud/parts/interactive_tutorial";
import { HUDKeybindingOverlay } from "shapez/game/hud/parts/keybinding_overlay";
import { HUDLayerPreview } from "shapez/game/hud/parts/layer_preview";
import { HUDLeverToggle } from "shapez/game/hud/parts/lever_toggle";
import { HUDMassSelector } from "shapez/game/hud/parts/mass_selector";
import { HUDMinerHighlight } from "shapez/game/hud/parts/miner_highlight";
import { HUDNotifications } from "shapez/game/hud/parts/notifications";
import { HUDPinnedShapes } from "shapez/game/hud/parts/pinned_shapes";
import { HUDScreenshotExporter } from "shapez/game/hud/parts/screenshot_exporter";
import { HUDShapeViewer } from "shapez/game/hud/parts/shape_viewer";
import { HUDShop } from "shapez/game/hud/parts/shop";
import { HUDStandaloneAdvantages } from "shapez/game/hud/parts/standalone_advantages";
import { HUDStatistics } from "shapez/game/hud/parts/statistics";
import { HUDPartTutorialHints } from "shapez/game/hud/parts/tutorial_hints";
import { HUDTutorialVideoOffer } from "shapez/game/hud/parts/tutorial_video_offer";
import { HUDUnlockNotification } from "shapez/game/hud/parts/unlock_notification";
import { HUDWatermark } from "shapez/game/hud/parts/watermark";
import { HUDWaypoints } from "shapez/game/hud/parts/waypoints";
import { HUDWireInfo } from "shapez/game/hud/parts/wire_info";
import { HUDWiresOverlay } from "shapez/game/hud/parts/wires_overlay";
import { HUDWiresToolbar } from "shapez/game/hud/parts/wires_toolbar";
import { MetaBuilding } from "shapez/game/meta_building";
import { RegularGameMode } from "shapez/game/modes/regular";

var levelDefinitions = null;
var upgrades = null;

export class APGameMode extends GameMode {
    adjustZone(w, h) {
        return;
    }
    static getId() {
        return "apMode";
    }
    static getType() {
        return enumGameModeTypes.default;
    }
    constructor(root) {
        super(root);
        this.additionalHudParts = {
            wiresToolbar: HUDWiresToolbar,
            unlockNotification: HUDUnlockNotification,
            massSelector: HUDMassSelector,
            shop: HUDShop,
            statistics: HUDStatistics,
            waypoints: HUDWaypoints,
            wireInfo: HUDWireInfo,
            leverToggle: HUDLeverToggle,
            pinnedShapes: HUDPinnedShapes,
            notifications: HUDNotifications,
            screenshotExporter: HUDScreenshotExporter,
            wiresOverlay: HUDWiresOverlay,
            shapeViewer: HUDShapeViewer,
            layerPreview: HUDLayerPreview,
            minerHighlight: HUDMinerHighlight,
            tutorialVideoOffer: HUDTutorialVideoOffer,
            gameMenu: HUDGameMenu,
            constantSignalEdit: HUDConstantSignalEdit,
        };
        if (!IS_MOBILE) {
            this.additionalHudParts.keybindingOverlay = HUDKeybindingOverlay;
        }
        if (this.root.app.restrictionMgr.getIsStandaloneMarketingActive()) {
            this.additionalHudParts.watermark = HUDWatermark;
            this.additionalHudParts.standaloneAdvantages = HUDStandaloneAdvantages;
        }
        if (this.root.app.settings.getAllSettings().offerHints) {
            this.additionalHudParts.tutorialHints = HUDPartTutorialHints;
            this.additionalHudParts.interactiveTutorial = HUDInteractiveTutorial;
        }
        /** @type {(typeof MetaBuilding)[]} */
        this.hiddenBuildings = [
            MetaConstantProducerBuilding,
            MetaGoalAcceptorBuilding,
            MetaBlockBuilding,
            MetaItemProducerBuilding,
        ];
    }
    get difficultyMultiplicator() {
        return 1;
    }
    getUpgrades() {
        return upgrades;
    }
    getLevelDefinitions() {
        return levelDefinitions
    }
    getIsFreeplayAvailable() {
        return true;
    }
    hasAchievements() {
        return true;
    }
    setDefinitions(definitions, ups) {
        levelDefinitions = definitions;
        upgrades = ups;
        return this;
    }
}