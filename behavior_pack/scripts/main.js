import { system } from "@minecraft/server";

system.beforeEvents.startup.subscribe((event) => {
  const reg = event.customCommandRegistry;

  reg.registerCommand({
    name: "hotbar:swap",
    description: "Swap selected hotbar slot with the item directly above it",
    permissionLevel: 0   // Any
  }, (origin, input) => {
    const player = origin.sourceEntity;
    if (!player || player.typeId !== "minecraft:player") return;

    // Делаем всё с небольшой задержкой — гарантирует, что контейнер уже «готов»
    system.run(() => {
      const selected = player.selectedSlotIndex;           // 0–8
      const inv = player.getComponent("minecraft:inventory");
      if (!inv) return;

      const container = inv.container;
      const aboveSlot = selected + 9;                       // 9–17

      const itemAbove = container.getItem(aboveSlot);
      if (!itemAbove) {
        player.sendMessage("§cNo item above this hotbar slot!");
        return;
      }

      const itemHotbar = container.getItem(selected);

      container.setItem(selected, itemAbove);
      container.setItem(aboveSlot, itemHotbar);

      player.sendMessage(`§aSwapped slot ${selected + 1} ↔ ${aboveSlot + 1}`);
    });
  });
});