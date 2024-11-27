# shapezipelago
Client mod for the Archipelago multiworld randomizer.

## TODO list
### APWorld
### Client mod
- FEATURE:      meantime offline playing
  - connecting in main menu and loading save overwrites login data, but not gameplay altering data
  - Save all slot data in save file
  - when connected replace ap inventory, else load from save file
- FEATURE:      Text box (read only), received non-progression items only there
- FEATURE:      Details when checking Level location, custom hubGoal reward, override hud
- FEATURE:      Something with energy link
- TECHNICAL:    Build input box in HUD class
- TECHNICAL:    storing reoccuring strings in global data to prevent errors:
  - "Shapesanity" and its different types, put together with [].join(" ")
- TECHNICAL:    merge level requirement generation using phases
- TECHNICAL:    Rework building overrides for future mod compatibility
- TECHNICAL:    Rework item receiving from "only index 0" to expected behavior
- TECHNICAL:    Convert to TypeScript
### Both
- FEATURE:      Add bounty goal: collect mcguffins, enough of them reveal bounty (always fully randomized shape with up to 4 layers), checking that sends goal (not without enough mcguffins)
- FEATURE:      Add Maximum goal: all other goals combined
  - All levels up to goal_amount
  - All upgrades up to goal_amount
  - If also added: Deliver bounty shape
  - 256 blueprint shapes per second to send goal (not saved if reached earlier)
- FEATURE:      Randomize blueprint shape
- FEATURE:      Need some ideas for expanding upgrade requirements
- FEATURE:      Buildings functionality randomization, like malfunctioning trap, but permanent
- FEATURE:      Add music tracks to item pool (is that even possible?)
- FEATURE:      producer with 100 "producable shape" items, options: no producer, yes producer, replace extractor
- FEATURE:      Expand shapesanity to 4 layers (blacklist needed!!!)
- FEATURE:      Option for how to unlock building variants, choice: individual, progressive, progressive lenient
- FEATURE:      Inflation Trap
- FEATURE:      Mod compatibility and including some features in generation
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
- FEATURE:      Cosmetic randomization (togglable)
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
- TECHNICAL:    Option to make items with random effect dependent on receiveditems index
- FEATURE:      Produce and send products to other games via gifting api
- FEATURE:      Online shop to order gifts as expansion to gifting api, can be disabled
  - Example:
    ```
    "Shops;[teamNumber]": {
        "[slotNumber]": {
            "ShopDataVersion": 1, // Like gift data version in case anything changes later on
            "ShopVersion": 1, // Increment if shop is updated mid-run
            "ShopName": "Player1's factory",
            "Payment": "Send anything", // Information for customers on how to pay
            "Offers": [
                {
                    "ItemName": "Copper Plate", // Should be unique within the shop
                    "Traits": [], // See GiftTrait Specification
                    "Price": 10 // in AP currency
                }, {
                    "ItemName": "Coffee",
                    "Traits": [],
                    "Price": 420
                }
            ]
        }
    }
    "ShopOrders;[teamNumber];[slotName]": {
        "[unique ID]": {
            "ID": "[unique ID]", // Could be the id of the gift later on, maybe better to use something like shop_order_72093872137
            "CustomerSlot": 1,
            "CustomerTeam": 0,
            "ShopVersion": 1, // In case the shop is updated mid-run, so the seller knows the correct price
            "ItemName": "Copper Plate",
            "Amount": 7
        }
    }
    ```
  - Base price is calculated with amount of operations to create the shape, with mulitplier option ranging 0.0-3.0
  - Make sure item list only contains what is currently producable (=> update shop when receiving more progression items)
- FEATURE:      Upgrade speed x2 multiplier (sort of gamble item, the later you receive it the better)
### Labels
- IMPORTANT:    Text
- GOOD LOOKING: Text
- FEATURE:      Text
- BEFORE PR:    Text
- TECHNICAL:    Text

