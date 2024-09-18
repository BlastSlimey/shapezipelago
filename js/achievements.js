import { GameRoot } from "shapez/game/root";
import { AchievementCollection, AchievementProviderInterface } from "shapez/platform/achievement_provider";
import { achievementNames, apdebuglog, connection } from "./global_data";
import { checkLocation } from "./server_communication";
import { AchievementProxy } from "shapez/game/achievement_proxy";

export class AchievementLocationProxy extends AchievementProxy {

    /**
     * @param {GameRoot} root
     */
    constructor(root) {
        apdebuglog("Constructing AchievementLocationProxy");
        root.app.achievementProvider = new AchievementLocationProvider(root.app);
        super(root);
    }

}

export class AchievementLocationProvider extends AchievementProviderInterface {

    constructor(app) {
        super(app);
        this.initialized = false;
        this.collection = new AchievementCollection(this.activate.bind(this));
        apdebuglog("Collection created with " + this.collection.map.size + " achievements");
    }

    initialize() {
        return Promise.resolve();
    }

    onLoad(root) {
        this.root = root;
        try {
            this.collection = new AchievementCollection(this.activate.bind(this));
            this.collection.initialize(root);
            apdebuglog("Initialized " + this.collection.map.size + " relevant achievements");
            return Promise.resolve();
        } catch (err) {
            apdebuglog("Failed to initialize the collection");
            return Promise.reject(err);
        }
    }

    activate(key) {
        if (connection) {
            if (achievementNames[key]) {
                checkLocation("Checked", false, achievementNames[key]);
            }
        }
        return Promise.resolve();
    }

    hasAchievements() {
        return true;
    }

}
