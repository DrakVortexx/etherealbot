const express = require('express');
const mineflayer = require('mineflayer');

const app = express();
const PORT = process.env.PORT || 3000;

// Keep Render service alive
app.get('/', (req, res) => {
    res.send('Mineflayer bot is running!');
});

app.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startBot() {
    console.log('Starting bot...');

    const bot = mineflayer.createBot({
        host: 'ethereal.mov',
        port: 25565,
        username: 'DrakVortexx_alt',
        version: '1.20.1'
    });

    let disconnected = false;
    let sellInterval = null; // Track the 10-minute sell timer

    bot.on('login', () => {
        console.log('Successfully connected to Minecraft.');
    });

    bot.on('spawn', async () => {
        console.log('Bot spawned.');

        try {
            // Wait for server to fully load
            await sleep(10000);

            // Login
            bot.chat(`/login ${process.env.MC_PASSWORD}`);
            console.log('Sent login command.');

            // Wait for login to complete
            await sleep(5000);

            if (disconnected) {
                console.log('Bot disconnected before actions started.');
                return;
            }

            console.log('Walking to NPC...');

            // Move right (~3 blocks)
            bot.setControlState('right', true);
            await sleep(1350);
            bot.setControlState('right', false);
            await sleep(500);

            // Move forward (~3 blocks)
            bot.setControlState('forward', true);
            await sleep(1350);
            bot.setControlState('forward', false);
            await sleep(1000);

            console.log('Scanning for NPC...');

            // Find nearest player entity
            const npc = Object.values(bot.entities)
                .filter(entity =>
                    entity.type === 'player' &&
                    entity.username &&
                    entity.username !== bot.username
                )
                .sort((a, b) =>
                    bot.entity.position.distanceTo(a.position) -
                    bot.entity.position.distanceTo(b.position)
                )[0];

            if (npc) {
                console.log(`Found NPC: ${npc.username}`);

                // Look at NPC's head
                await bot.lookAt(npc.position.offset(0, 1.6, 0));
                await sleep(500);

                // Right-click NPC
                bot.activateEntity(npc);
                console.log('Clicked NPC.');

                // Wait for teleport/server transfer
                await sleep(5000);
            } else {
                console.log('No NPC found.');
            }

            // Setup the 10-minute automated selling interval
            if (sellInterval) clearInterval(sellInterval);
            console.log('Starting automated sell loop (10-minute interval)...');
            sellInterval = setInterval(() => {
                if (disconnected) return;
                bot.chat('/sellall dirt');
                console.log('Executed /sellall dirt command.');
            }, 600000); // 600,000 ms = 10 minutes

            console.log('Starting infinite digging loop...');

            // Asynchronous digging loop that naturally waits for each block to break
            (async function digLoop() {
                while (!disconnected) {
                    try {
                        // Check if the bot is already digging to avoid conflict
                        if (bot.targetDigBlock) {
                            await sleep(50);
                            continue;
                        }

                        // Target the block directly underneath the bot's feet
                        const targetBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));

                        // Ensure block exists, isn't air (type 0), and can actually be dug
                        if (targetBlock && targetBlock.type !== 0 && bot.canDigBlock(targetBlock)) {
                            // 'true' makes the bot look at the block while digging
                            await bot.dig(targetBlock, true); 
                        } else {
                            // If no block is available, wait briefly before checking again
                            await sleep(250);
                        }
                    } catch (err) {
                        if (err.message !== 'Digging interrupted') {
                            console.log('Dig error:', err.message);
                        }
                        // Short safety pause if an error occurs
                        await sleep(250); 
                    }
                }
            })();

        } catch (err) {
            console.error('Spawn sequence error:', err);
        }
    });

    bot.on('message', (message) => {
        console.log('[SERVER]', message.toString());
    });

    bot.on('chat', (username, message) => {
        console.log(`<${username}> ${message}`);
    });

    bot.on('kicked', (reason) => {
        console.log('Kicked:', JSON.stringify(reason, null, 2));
    });

    bot.on('error', (err) => {
        console.error('Bot error:', err);
    });

    bot.on('end', () => {
        disconnected = true;
        if (sellInterval) clearInterval(sellInterval); // Clear sell timer on disconnect
        console.log('Disconnected from server.');
        console.log('Reconnecting in 30 seconds...');

        setTimeout(startBot, 30000);
    });
}

startBot();
