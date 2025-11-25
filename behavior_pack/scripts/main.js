import { world, system, InputButton } from "@minecraft/server";

world.afterEvents.playerButtonInput.subscribe((ev) => {
  const player = ev.player;
  if (ev.button !== InputButton.Sneak) return;

  const now = Date.now();
  const timeSinceLast = player.lastSneakTime ? now - player.lastSneakTime : Infinity;

  if (timeSinceLast < 400) {
    ev.cancel = true;
    player.lastSneakTime = null;

    system.run(() => {
      const selected = player.selectedSlotIndex;
      const inv = player.getComponent("minecraft:inventory");
      if (!inv) return;

      const container = inv.container;
      const bottomSlot = selected + 27;

      // ALWAYS SWAP: Get both items (null = empty)
      const itemBottom = container.getItem(bottomSlot);
      const itemHotbar = container.getItem(selected);

      // Perform swap (setItem accepts null to clear)
      container.setItem(selected, itemBottom);
      container.setItem(bottomSlot, itemHotbar);

      // Feedback: Check what happened
      let msg = `§aSwapped ${selected + 1} ↔ bottom ${bottomSlot - 26}!`;
      if (!itemBottom && !itemHotbar) {
        msg = `§7Nothing to swap (both empty)`;
      } else if (!itemBottom) {
        msg = `§eMoved hotbar item to bottom!`;
      } else if (!itemHotbar) {
        msg = `§ePulled bottom item to hotbar!`;
      }
      player.sendMessage(msg);

      // Sound only if something moved
      if (itemBottom || itemHotbar) {
        player.playSound("random.orb", { pitch: 1.5 });
      }
    });
  } else {
    player.lastSneakTime = now;
  }
});
