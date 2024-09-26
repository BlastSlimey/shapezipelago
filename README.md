# shapezipelago
Client mod for the Archipelago multiworld randomizer.

## TODO list
### APWorld
### Client mod
- FEATURE:      Auto connect & meantime offline playing
  - Disconnect from AP server when returning to main menu
  - Save login details in save files and automatically connect
  - connecting in main menu and loading save overwrites login data, but not gameplay altering data
  - Save all slot data in save file
  - when connected replace ap inventory, else load from save file
- FEATURE:      Text box (read only), received non-progression items only there
- FEATURE:      Randomize blueprint shape
- FEATURE:      Details when checking Level location, custom hubGoal reward, override hud
- FEATURE:      Translations
- FEATURE:      Something with energy link
- TECHNICAL:    getIsUnlocked definition in global data to reuse for locking trap
- TECHNICAL:    Build input box in HUD class
- TECHNICAL:    storing reoccuring string in global data to prevent errors:
  - buildings names in requirement_definitions
  - "Shapesanity" and its different types, put together with [].join(" ")
### Both
- FEATURE:      Add bounty goal: collect mcguffins, enough of them reveal bounty (always fully randomized shape with up to 4 layers), checking that sends goal (not without enough mcguffins)
- FEATURE:      Add Maximum goal: all other goals combined
  - All levels up to goal_amount
  - All upgrades up to goal_amount
  - If also added: Deliver bounty shape
  - 256 blueprint shapes per second to send goal (not saved if reached earlier)
- FEATURE:      Need some ideas for expanding upgrade requirements
- FEATURE:      Buildings functionality randomization, like malfunctioning trap, but permanent
- FEATURE:      Add music tracks to item pool
- FEATURE:      producer with 100 "producable shape" items, options: no producer, yes producer, replace extractor
- FEATURE:      Expand shapesanity to 4 layers (blacklist needed!!!)
- FEATURE:      Option for progressive building variant unlocks
- FEATURE:      Inflation Trap
### Labels
- IMPORTANT:    Text
- GOOD LOOKING: Text
- FEATURE:      Text
- BEFORE PR:    Text
- TECHNICAL:    Text

