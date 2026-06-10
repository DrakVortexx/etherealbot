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
  let digInterval = null;

  bot.on('login', () => {
    console.log('Successfully connected to Minecraft.');
  });

  bot.once('spawn', async () => {
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

      // Find nearest player entity (Citizens NPCs usually appear as players)
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

      console.log('Starting infinite digging loop...');

      // Non-blocking loop to target and dig blocks safely
      digInterval = setInterval(async () => {
        // Stop if disconnected or if already currently digging a block
        if (disconnected || bot.targetDigBlock) return;

        // Target the block directly underneath the bot's feet
        // Change the offset (e.g., 0, 0, 1 for in front) depending on the farm setup
        const targetBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));

        if (targetBlock && targetBlock.type !== 0) { // type 0 is air
          try {
            // Mineflayer automatically looks at the block and starts digging
            await bot.dig(targetBlock, true); 
          } catch (err) {
            // Ignore common minor errors like "Digging interrupted" from fast-breaking blocks
            if (err.message !== 'Digging interrupted') {
              console.log('Dig error:', err.message);
            }
          }
        }
      }, 250); // Checks for a target block every 250ms

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
    disconnected = true;const express = require('express');
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
  let digInterval = null;

  bot.on('login', () => {
    console.log('Successfully connected to Minecraft.');
  });

  bot.once('spawn', async () => {
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

      // Find nearest player entity (Citizens NPCs usually appear as players)
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

      console.log('Starting infinite digging loop...');

      // Non-blocking loop to target and dig blocks safely
      digInterval = setInterval(async () => {
        // Stop if disconnected or if already currently digging a block
        if (disconnected || bot.targetDigBlock) return;

        // Target the block directly underneath the bot's feet
        // Change the offset (e.g., 0, 0, 1 for in front) depending on the farm setup
        const targetBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));

        if (targetBlock && targetBlock.type !== 0) { // type 0 is air
          try {
            // Mineflayer automatically looks at the block and starts digging
            await bot.dig(targetBlock, true); 
          } catch (err) {
            // Ignore common minor errors like "Digging interrupted" from fast-breaking blocks
            if (err.message !== 'Digging interrupted') {
              console.log('Dig error:', err.message);
            }
          }
        }
      }, 250); // Checks for a target block every 250ms

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
    if (digInterval) clearInterval(digInterval);

    console.log('Disconnected from server.');
    console.log('Reconnecting in 30 seconds...');

    setTimeout(startBot, 30000);
  });
}

startBot();
    if (digInterval) clearInterval(digInterval);

    console.log('Disconnected from server.');
    console.log('Reconnecting in 30 seconds...');

    setTimeout(startBot, 30000);
  });
}

startBot();
