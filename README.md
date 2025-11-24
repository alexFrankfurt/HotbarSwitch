# Hotbar Switch Addon for Minecraft Bedrock Edition

This addon allows you to swap the item in your currently selected hotbar slot with the item directly above it in your inventory by using the `/hotbar_swap` command.

## Installation

1. Download `HotbarSwitch.mcpack`.
2. Double-click the file to import it into Minecraft Bedrock, or place it in the behavior packs folder and activate in Settings > Global Resources.
3. Activate the pack in your world.
4. Enable "Experimental Scripting" in World Settings if required (for scripting features).

## Usage

1. In Minecraft, go to Settings > Controls.
2. Add a new key binding:
   - Key: Middle Mouse Button
   - Command: `/hotbar_swap`
3. In-game, select a hotbar slot (1-9 keys).
4. Press middle mouse to swap the item in that slot with the item above it in the inventory.
   - If there is no item above, nothing happens.

## How It Works

- The addon registers a custom command `/hotbar_swap`.
- When executed, it checks the player's selected hotbar slot.
- Swaps the item in that slot with the item in the inventory slot 9 positions higher (above it).
- Only swaps if an item exists above; otherwise, no action.

## Requirements

- Minecraft Bedrock Edition 1.19.0 or later.
- Experimental Scripting enabled.

## Notes

- Direct middle mouse detection is not supported in Bedrock addons, so a key binding is used as a workaround.
- The inventory layout assumes the standard 3x9 grid above the hotbar.

## Files

- `manifest.json`: Addon metadata.
- `behavior_pack/scripts/main.js`: Server-side script for the swap logic.