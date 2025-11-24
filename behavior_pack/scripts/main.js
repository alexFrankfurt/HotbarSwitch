import { system } from "@minecraft/server";

system.beforeEvents.startup.subscribe((event) => {
  const commandRegistry = event.customCommandRegistry;

  const hotbarSwapCommand = {
    name: "hotbar:swap",
    description: "Swap selected hotbar slot with item above in inventory",
    permissionLevel: 0  // 0 = Any (fallback for older beta; use CustomCommandPermissionLevel.Any in 2.5.0+)
  };

  commandRegistry.registerCommand(hotbarSwapCommand, (origin, input) => {
    const player = origin.sourceEntity;
    if (!player || player.typeId !== "minecraft:player") return;

    system.run(() => {
      const selectedSlot = player.selectedSlotIndex;
      const inventoryComponent = player.getComponent("minecraft:inventory");
      if (!inventoryComponent) {
        player.sendMessage("§cInventory error!");
        return;
      }

      const container = inventoryComponent.container;
      const aboveSlot = selectedSlot + 9;

      if (aboveSlot >= container.size) {
        player.sendMessage("§cInvalid slot!");
        return;
      }

      const itemAbove = container.getItem(aboveSlot);
      if (!itemAbove) {
        player.sendMessage("§cNo item above!");
        return;
      }

      const itemHotbar = container.getItem(selectedSlot);
      container.setItem(selectedSlot, itemAbove);
      container.setItem(aboveSlot, itemHotbar);

      player.sendMessage(`§aSwapped slot ${selectedSlot + 1}!`);
    });
  });
});