# shapezipelago
Client mod for the Archipelago multiworld randomizer.

## TODO list
### APWorld
- TECHNICAL:    Overhaul item classifications, make dynamic based on player options
### Client mod
- FEATURE:      meantime offline playing
  - connecting in main menu and loading save overwrites login data, but not gameplay altering data
  - Save all slot data in save file
  - when connected replace ap inventory, else load from save file
- FEATURE:      Text box (read only), received non-progression items only there
- FEATURE:      Randomize blueprint shape
- FEATURE:      Details when checking Level location, custom hubGoal reward, override hud
- FEATURE:      Something with energy link
- TECHNICAL:    Build input box in HUD class
- TECHNICAL:    storing reoccuring strings in global data to prevent errors:
  - "Shapesanity" and its different types, put together with [].join(" ")
- FEATURE:      complexity for generating shapes, complexity is determined by level/tier, certain randomizer calls while creating different parts need certain complexity
- TECHNICAL:    merge level requirement generation using phases
- TECHNICAL:    Rework building overrides for future mod compatibility
- FEATURE:      Settings for default connect info
- FEATURE:      Setting "Auto disconnect when returning to main menu"
### Both
- FEATURE:      Add bounty goal: collect mcguffins, enough of them reveal bounty (always fully randomized shape with up to 4 layers), checking that sends goal (not without enough mcguffins)
- FEATURE:      Add Maximum goal: all other goals combined
  - All levels up to goal_amount
  - All upgrades up to goal_amount
  - If also added: Deliver bounty shape
  - 256 blueprint shapes per second to send goal (not saved if reached earlier)
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
- FEATURE:      include floating shapes option
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
- FEATURE:      Gifting mechanic for other games by making certain shapes, only filler/including useful/including progression
### Labels
- IMPORTANT:    Text
- GOOD LOOKING: Text
- FEATURE:      Text
- BEFORE PR:    Text
- TECHNICAL:    Text

