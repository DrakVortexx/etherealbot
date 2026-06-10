const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'ethereal.mov',
  port: 25565,
  username: 'DrakVortexx_alt',
  version: false
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

bot.once('spawn', async () => {
  console.log('Bot spawned.');

  // Wait for the server to load
  await sleep(5000);

  // Login
  bot.chat('/login bobbybenson');
  console.log('Logged in.');

  await sleep(5000);

  // Move right
  bot.setControlState('right', true);
  await sleep(1800);
  bot.setControlState('right', false);

  await sleep(500);

  // Move forward
  bot.setControlState('forward', true);
  await sleep(1800);
  bot.setControlState('forward', false);

  await sleep(500);

  // Right click
  bot.activateItem();

  console.log('Starting infinite mining...');

  // Mine forever
  while (true) {
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
});

bot.on('chat', (username, message) => {
  console.log(`<${username}> ${message}`);
});

bot.on('kicked', reason => {
  console.log('Kicked:', reason);
});

bot.on('error', err => {
  console.log('Error:', err);
});

bot.on('end', () => {
  console.log('Disconnected from server.');
});const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'ethereal.mov',
  port: 25565,
  username: 'DrakVortexx_alt',
  version: false
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

bot.once('spawn', async () => {
  console.log('Spawned.');

  // Wait for the server to finish loading
  await sleep(5000);

  // Login
  bot.chat('/login bobbybenson');
  console.log('Logged in.');

  await sleep(5000);

  // Move 3 blocks right
  bot.setControlState('right', true);
  await sleep(1800);
  bot.setControlState('right', false);

  await sleep(500);

  // Move 3 blocks forward
  bot.setControlState('forward', true);
  await sleep(1800);
  bot.setControlState('forward', false);

  await sleep(500);

  // Right click
  bot.activateItem();

  await sleep(1000);

  // Start mining forever
  while (true) {
    try {
      const block = bot.blockAtCursor(4);

      if (block && bot.canDigBlock(block)) {
        console.log(`Mining ${block.name}`);
        await bot.dig(block);
      } else {
        await sleep(500);
      }
    } catch (err) {
      console.log('Dig error:', err.message);
      await sleep(1000);
    }
  }
});

bot.on('kicked', reason => {
  console.log('Kicked:', reason);
});

bot.on('error', err => {
  console.log('Error:', err);
});

bot.on('end', () => {
  console.log('Disconnected.');
});
