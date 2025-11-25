import { world, system, InputButton } from "@minecraft/server";

// Per-player last sneak timestamp
world.afterEvents.playerButtonInput.subscribe((ev) => {
  const player = ev.player;
  if (ev.button !== InputButton.Sneak) return;

  const now = Date.now();
  const timeSinceLast = player.lastSneakTime ? now - player.lastSneakTime : Infinity;

  if (timeSinceLast < 400) {  // Double sneak: <400ms between taps
    ev.cancel = true;  // Block 2nd sneak (no actual sneak)
    
    // Reset timer
    player.lastSneakTime = null;

    system.run(() => {
      const selected = player.selectedSlotIndex;
      const inv = player.getComponent("minecraft:inventory");
      if (!inv) return;

      const container = inv.container;
      const bottomSlot = selected + 27;  // Bottom row: 27-35

      const itemBottom = container.getItem(bottomSlot);
      if (!itemBottom) {
        player.sendMessage("§cNo item in bottom row slot!");
        return;
      }

      const itemHotbar = container.getItem(selected);
      container.setItem(selected, itemBottom);
      container.setItem(bottomSlot, itemHotbar);

      player.sendMessage(`§aSwapped ${selected + 1} ↔ bottom ${bottomSlot - 26}!`);
      player.playSound("random.orb", { pitch: 1.5 });
    });
  } else {
    // Single sneak: record time (allow normal sneak)
    player.lastSneakTime = now;
  }
});