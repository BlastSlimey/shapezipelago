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
- TECHNICAL:    getIsUnlocked definition in global data to reuse for locking trap
- TECHNICAL:    Build input box in HUD class
- TECHNICAL:    storing reoccuring string in global data to prevent errors:
  - buildings names in requirement_definitions
  - "Shapesanity" and it's different types, put together with [].join(" ")
### Both
- FEATURE:      Add bounty goal: collect mcguffins, enough of them give a hint towards bounty (always shapesanity stitched mixed), checking that gives bounty item, which sends goal
- FEATURE:      Need some ideas for expanding upgrade requirements
- FEATURE:      Buildings functionality randomization, like malfunctioning trap, but permanent
- FEATURE:      Add music tracks to item pool
- FEATURE:      Producer mode: shapes are items, producer replaces extractor
- FEATURE:      Expand shapesanity to 4 layers
### Labels
- IMPORTANT:    Text
- GOOD LOOKING: Text
- FEATURE:      Text
- BEFORE PR:    Text
- TECHNICAL:    Text

