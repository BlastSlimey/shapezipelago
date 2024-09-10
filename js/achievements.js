import { GameRoot } from "shapez/game/root";
import { AchievementCollection, AchievementProviderInterface } from "shapez/platform/achievement_provider";
import { achievementNames, aplog, client, connected, longAchievementNames, softlockAchievementNames } from "./global_data";
import { checkLocation } from "./server_communication";
import { AchievementProxy } from "shapez/game/achievement_proxy";

export class AchievementLocationProxy extends AchievementProxy {

    /**
     * @param {GameRoot} root
     */
    constructor(root) {
        root.app.achievementProvider = new AchievementLocationProvider(root.app);
        super(root);
    }

}

export class AchievementLocationProvider extends AchievementProviderInterface {

    constructor(app) {
        super(app);
        this.initialized = false;
        this.collection = new AchievementCollection(this.activate.bind(this));
        aplog("Collection created with " + this.collection.map.size + " achievements");
    }

    initialize() {
        return Promise.resolve();
    }

    onLoad(root) {
        this.root = root;
        try {
            this.collection = new AchievementCollection(this.activate.bind(this));
            this.collection.initialize(root);
            aplog("Initialized " + this.collection.map.size + " relevant achievements");
            return Promise.resolve();
        } catch (err) {
            aplog("Failed to initialize the collection");
            return Promise.reject(err);
        }
    }

    activate(key) {
        if (connected) {
            if (client.data.slotData["include_achievements"].valueOf()) {
                if (achievementNames[key]) {
                    checkLocation("Checked", false, achievementNames[key]);
                } else if (!client.data.slotData["exclude_softlock_achievements"].valueOf() && softlockAchievementNames[key]) {
                    checkLocation("Checked", false, softlockAchievementNames[key]);
                } else if (!client.data.slotData["exclude_long_playtime_achievements"].valueOf() && longAchievementNames[key]) {
                    checkLocation("Checked", false, longAchievementNames[key]);
                }
            }
        }
        return Promise.resolve();
    }

    hasAchievements() {
        return true;
    }

}
