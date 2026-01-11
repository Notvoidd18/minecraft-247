const mineflayer = require('mineflayer');

const settings = {
    host: 'Land_of_block.aternos.me',
    port: 49567,
    username: 'Server',
    version: false
};

let bot;

// 🔁 Create bot function (for reconnect)
function createBot() {
    bot = mineflayer.createBot(settings);

    bot.on('spawn', () => {
        console.log(`[${settings.username}] joined the server`);
        bot.chat('Hello! I am online.');

        startJumping();
        startMoving();
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;

        const msg = message.toLowerCase();

        if (msg === 'hi') {
            bot.chat(`Hello ${username}!`);
        }

        if (msg === 'whats time' || msg === "what's time") {
            bot.chat('/time query day');

            bot.once('message', (jsonMsg) => {
                const text = jsonMsg.toString();
                const match = text.match(/\d+/);
                if (!match) return;

                const day = match[0];
                bot.chat(`/title @a title {"text":"Day ${day}","color":"gold"}`);
            });
        }
    });

    // ❌ If kicked
    bot.on('kicked', (reason) => {
        console.log('Kicked:', reason);
        reconnect();
    });

    // ❌ If disconnected
    bot.on('end', () => {
        console.log('Disconnected from server');
        reconnect();
    });

    bot.on('error', err => console.log('Error:', err.message));
}

// 🦘 Jump every 10 seconds (FIXED)
function startJumping() {
    setInterval(() => {
        if (!bot.entity || !bot.entity.onGround) return;

        bot.setControlState('jump', true);
        setTimeout(() => {
            bot.setControlState('jump', false);
        }, 800); // longer hold = reliable jump
    }, 10000);
}

// 🚶 Random movement
function startMoving() {
    setInterval(() => {
        bot.clearControlStates();

        const moves = ['forward', 'left', 'right'];
        const move = moves[Math.floor(Math.random() * moves.length)];

        bot.setControlState(move, true);

        setTimeout(() => {
            bot.setControlState(move, false);
        }, 3000);
    }, 6000);
}

// 🔁 Reconnect logic
function reconnect() {
    console.log('Rejoining in 10 seconds...');
    setTimeout(() => {
        createBot();
    }, 10000);
}

// 🚀 Start bot
createBot();
