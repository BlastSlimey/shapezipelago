# shapezipelago
Client mod for the Archipelago multiworld randomizer.

## TODO list
### Bugs

### Technicalities 
- Build input box in HUD class
- storing reoccuring strings in global data to prevent errors:
  - "Shapesanity" and its different types, put together with [].join(" ")
- merge level requirement generation using phases
- Rework building overrides for future mod compatibility
- Convert to TypeScript
- Update archipelago.js to 2.0 (need fix for `structuredClone()`)

### Client QoL
- meantime offline playing
  - connecting in main menu and loading save overwrites login data, but not gameplay altering data
  - Save all slot data in save file
  - when connected replace ap inventory, else load from save file
- Text box (read only), received non-progression items only there
- Details when checking Level location, override hud
 
### APWorld Qol

### Gameplay
- Something with energy link
- Add bounty goal: collect mcguffins, enough of them reveal bounty (always fully randomized shape with up to 4 layers), checking that sends goal (not without enough mcguffins)
- Add Maximum goal: all other goals combined
  - All levels up to goal_amount
  - All upgrades up to goal_amount
  - If also added: Deliver bounty shape
  - 256 blueprint shapes per second to send goal (not saved if reached earlier)
- Need some ideas for expanding upgrade requirements
- producer with 100 "producable shape" items, options: no producer, yes producer, replace extractor
- Expand shapesanity to 4 layers (blacklist needed!!!)
- Option for how to unlock building variants, choice: individual, progressive, progressive backwards
- Inflation Trap
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
- Option: Include whacky upgrades
  - +10 
  - x2 multiplier (sort of gamble item, the later you receive it the better)
  - -3 trap
  - x0.5 trap (the later you receive it the worse) 
  - Disable traps on efficiency_iii goal
  - random category +0.2 or +2
- Option: additional upgrade categories, needs another datapackage setting

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
  - Toolbar ordering
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
