const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Welcome csatorna ID
const WELCOME_CHANNEL_ID = "1520774673212903424";

// Imgur kép link
const IMGUR_LINK = "https://i.imgur.com/ddZEOQ8.png";

client.on("ready", () => {
    console.log(`Bejelentkezve: ${client.user.tag}`);
});

// Új tag érkezik
client.on("guildMemberAdd", async (member) => {
    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!channel) return;

    channel.send({
        content: `<@${member.id}> csatlakozott a szerverhez! 👋`,
        files: [IMGUR_LINK]
    });
});

client.login(process.env.TOKEN);
