const express = require('express');
const mineflayer = require('mineflayer');

const app = express();
const PORT = process.env.PORT || 3000;

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
    version: '1.21.4'
  });

  bot.on('login', () => {
    console.log('Successfully connected to Minecraft.');
  });

  bot.once('spawn', async () => {
    console.log('Bot spawned.');

    try {
      // Wait for the server to finish loading
      await sleep(10000);

      // Login
      bot.chat('/login bobbybenson');
      console.log('Sent login command.');

      // Wait after logging in
      await sleep(30000);

      // Stop if disconnected
      if (bot._client.ended) {
        console.log('Bot disconnected before actions started.');
        return;
      }

      console.log('Beginning actions...');

      // Move right
      bot.setControlState('right', true);
      await sleep(1800);
      bot.setControlState('right', false);

      await sleep(1000);

      // Move forward
      bot.setControlState('forward', true);
      await sleep(1800);
      bot.setControlState('forward', false);

      await sleep(1000);

      // Right click
      bot.activateItem();
      console.log('Right-clicked.');

      await sleep(1000);

      console.log('Starting infinite mining...');

      // Mine forever
      while (!bot._client.ended) {
        try {
          const block = bot.blockAtCursor(4);

          if (block && bot.canDigBlock(block)) {
            console.log(`Mining ${block.name}`);
            await bot.dig(block);
          } else {
            await sleep(500);
          }
        } catch (err) {
          console.log('Mining error:', err.message);
          await sleep(1000);
        }
      }
    } catch (err) {
      console.error('Spawn sequence error:', err);
    }
  });

  bot.on('chat', (username, message) => {
    console.log(`<${username}> ${message}`);
  });

  bot.on('kicked', reason => {
    console.log('Kicked:', reason);
  });

  bot.on('error', err => {
    console.error('Bot error:', err);
  });

  bot.on('end', () => {
    console.log('Disconnected from server.');
    console.log('Reconnecting in 30 seconds...');

    setTimeout(() => {
      startBot();
    }, 30000);
  });
}

// Start the first bot instance
startBot();
