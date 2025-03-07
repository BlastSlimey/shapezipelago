# shapezipelago
Client mod for the Archipelago multiworld randomizer.

## TODO list

### Bugs
- shapesanity cheat sheet broken
- logic error for floating shapes with quad cutter but no half cutter

### Technicalities 
- Build input box in HUD class
- storing reoccuring strings in global data to prevent errors:
  - "Shapesanity" and its different types, put together with [].join(" ")
- merge level requirement generation using phases
- Rework building overrides for future mod compatibility
- Convert to TypeScript
- Update archipelago.js to 2.0 (need fix for `structuredClone()`)
- Rework shapesanity data transfer and processing

### Client QoL
- meantime offline playing
  - connecting in main menu and loading save overwrites login data, but not gameplay altering data
  - Save all slot data in save file
  - when connected replace ap inventory, else load from save file
- Text box (read only), received non-progression items only there
- Details when checking Level location, override hud
- Automatic reconnecting if connection lost
- make even_fasterer goal collaborytive using datastorage
- More splash tips
  - something about random yamls and even_fasterer goal
  - something about the bucket
 
### APWorld Qol
- Make list of compatible utility mods
- Add cosmetic randomization to game info

### Gameplay
- Something with energy link
  - idea: blueprint shape
  - idea: AP logo resembling shape (Dragion)
  - idea: building for sending and receiving energy (Dragion)
  - idea: disable blueprint achievements when energy link active
- Add bounty goal: collect mcguffins, enough of them reveal bounty (always fully randomized shape with up to 4 layers), checking that sends goal (not without enough mcguffins)
  - idea: mcguffins are called customer requirements (Boo)
- Add Maximum goal: all other goals combined
  - All levels up to goal_amount
  - All upgrades up to goal_amount
  - If also added: Deliver bounty shape
  - 256 blueprint shapes per second to send goal (not saved if reached earlier)
- Need some ideas for expanding upgrade requirements
  - idea: patterns per category (Dragion)
  - Idea: Amount of early phases (1-10, standard 1)
  - Important: Look out for collisions with goal_amount
  - Idea: Amount of shapes in late phase(s) (1-5, standard 3)
  - Idea: Amount of shapes in early phase(s) (1-5, standard 5)
  - Idea: Different modes:
    - Standard (x early phase(s), 1 late phase)
    - Alternate (x <early, late>)
- producer with 100 "producable shape" items, options: no producer, yes producer, replace extractor
- Expand shapesanity to 4 layers (blacklist needed!!!)
- Option for how to unlock building variants, choice: individual, progressive, backwards
- Add option to automatically complete and skip checked levels and upgrades
- Mod compatibility and including some features in generation
  - Portable Micro Hub Receiver
  - Quad Stacker
  - SkUpdate
  - Shapez Expanded Buildings/Shapes
    - Flowers and gems generate weirdly
  - Packaging
  - Edge Rotation
  - Lazer Cutting
  - Buy Land
  - Wrexcavator
  - Plantz
  - Hexagonal
  - Diamond shape (original)
  - Non-constant signal (original) 
- Option: additional upgrade categories, needs another datapackage setting
- task-based read-only implementation
- Long belt helper hotkey as an item
- Time trials
  - trials to build a factory for a random shape in a limited time frame
  - adjustable punishment
  - different difficulties based on available buildings and complexity
  - new tab in AP box with button for each trial to start and reveal the shape
  - New goal requiring all trials to be completed

### More Randomization
- Randomize blueprint shape
- Buildings functionality randomization, like malfunctioning trap, but permanent
- Add music tracks to item pool (is that even possible?)
- Cosmetic randomization (togglable)
  - Shape drawings
  - Tooltips
    - Image
    - Name
    - Description
  - silhouette color
  - building variants
  - sound effects
  - shop order

### Gifting API
- Produce and send products to other games via gifting api
- Online shop to order gifts as expansion to gifting api, can be disabled
  - Example:
    ```
    "Shops;[teamNumber]": {
        "[slotNumber]": {
            "DataVersion": 2, // Same as gift data version
            "ShopVersion": 1, // Increment if shop is updated mid-run
            "ShopName": "Player1's factory",
            "Payment": "Send anything", // Information for customers on how to pay
            "Offers": [
                {
                    "ItemName": "Copper Plate", // Should be unique within the shop
                    "Traits": [...], // See GiftTrait Specification
                    "Price": 288000 // in AP currency
                }, {
                    "ItemName": "Coffee",
                    "Traits": [...],
                    "Price": 1500000000
                }
            ]
        }
    }
    "ShopOrders;[teamNumber];[slotName]": {
        "[unique ID]": {
            "ID": "[unique ID]", // Will also be the id of the delivered gift
            "CustomerSlot": 1,
            "CustomerTeam": 0,
            "ShopVersion": 1, // In case the shop is updated mid-run, so the seller knows the correct price
            "ItemName": "Copper Plate",
            "Amount": 15
        }
    }
    ```
  - Base price is calculated with amount of operations to create the shape, with mulitplier option ranging 0.0-3.0
  - Make sure item list only contains what is currently producable (=> update shop when receiving more progression items)
  - Shop items can consist of multiple shapes (so they are not restricted by 4 corners)
- Goal "Customer satisfaction": Deliver certain amount of certain shop orders (minimum 5?), goal shape should be cheap and requiring all buildings, requires other players to take part
- Add host setting to force disable gift shop (without error, only info in log) 

### Labels (Deprecated)
- IMPORTANT:    Text
- GOOD LOOKING: Text
- FEATURE:      Text
- BEFORE PR:    Text
- TECHNICAL:    Text
