const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Bot is alive"));
app.listen(3000);

require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.on("ready", () => {
    console.log(`Bejelentkezve: ${client.user.tag}`);
});

// IDE ÍRD BE A CSATORNA ID-T
const WELCOME_CHANNEL_ID = "IDE_IRD_A_CSATORNA_IDT";

// IDE ÍRD BE AZ IMGUR LINKET
const IMGUR_LINK = "https://i.imgur.com/valami.png";

client.on("guildMemberAdd", (member) => {
    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setTitle(`Szia ${member.user.username}!`)
        .setDescription("Üdvözlünk a **Veamx PvP Discord Szerverén!**")
        .setColor("Green")
        .setImage(IMGUR_LINK);

    channel.send({ embeds: [embed] });
});

client.login(process.env.TOKEN);
