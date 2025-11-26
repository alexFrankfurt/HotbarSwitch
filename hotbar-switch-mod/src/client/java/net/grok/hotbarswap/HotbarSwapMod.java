package net.grok.hotbarswap;

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.minecraft.client.network.ClientPlayerEntity;
import net.minecraft.client.option.KeyBinding;
import net.minecraft.entity.player.PlayerInventory;
import net.minecraft.item.ItemStack;
import net.minecraft.sound.SoundEvents;
import net.minecraft.text.Text;
import net.minecraft.util.Formatting;

import java.util.Locale;

public class HotbarSwapMod implements ClientModInitializer {
    private static long lastSneakPressTime = 0;
    private static boolean prevSneakPressed = false;

    @Override
    public void onInitializeClient() {
        ClientTickEvents.END_CLIENT_TICK.register(client -> {
            if (client.player == null || client.currentScreen != null) return;  // Skip when in GUIs

            KeyBinding sneakKey = client.options.sneakKey;
            boolean currPressed = sneakKey.isPressed();

            if (currPressed && !prevSneakPressed) {
                long now = System.currentTimeMillis();
                if (now - lastSneakPressTime < 400) {
                    performSwap(client.player);
                    lastSneakPressTime = 0;
                } else {
                    lastSneakPressTime = now;
                }
            }
            prevSneakPressed = currPressed;
        });
    }

    private static void performSwap(ClientPlayerEntity player) {
        PlayerInventory inv = player.getInventory();
        int sel = inv.selectedSlot;
        int hotbarSlot = 36 + sel;  // Hotbar slots: 36-44
        int bottomSlot = 27 + sel;  // Bottom row: 27-35

        ItemStack hotbarStack = inv.getStack(hotbarSlot);
        ItemStack bottomStack = inv.getStack(bottomSlot);

        inv.setStack(hotbarSlot, bottomStack);
        inv.setStack(bottomSlot, hotbarStack);

        String msg;
        if (hotbarStack.isEmpty() && bottomStack.isEmpty()) {
            msg = "Nothing to swap";
        } else if (hotbarStack.isEmpty()) {
            msg = "Pulled from bottom";
        } else if (bottomStack.isEmpty()) {
            msg = "Moved to bottom";
        } else {
            msg = String.format(Locale.ROOT, "Swapped %d ↔ bottom %d", sel + 1, sel + 1);
        }
        player.sendMessage(Text.literal(msg).formatted(Formatting.GREEN), true);

        player.playSound(SoundEvents.ENTITY_EXPERIENCE_ORB_PICKUP, 0.8F, 1.5F);
    }
}
