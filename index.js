const { 
    Client, 
    GatewayIntentBits, 
    Partials,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle 
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

// Welcome csatorna ID
const WELCOME_CHANNEL_ID = "1520774673212903424";

// Verify csatorna ID
const VERIFY_CHANNEL_ID = "1520837724930834622";

// Imgur kép
const IMGUR_LINK = "https://i.imgur.com/ddZEOQ8.png";

// Verify role ID
const VERIFY_ROLE_ID = "1520770892869927084";

client.on("ready", () => {
    console.log(`Bejelentkezve: ${client.user.tag}`);
});

// Új tag érkezik → welcome üzenet + kép
client.on("guildMemberAdd", async (member) => {
    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!channel) return;

    channel.send({
        content: `<@${member.id}> csatlakozott a szerverhez! 👋`,
        files: [IMGUR_LINK]
    });
});

// Verify üzenet elküldése induláskor
client.on("ready", async () => {
    const verifyChannel = await client.channels.fetch(VERIFY_CHANNEL_ID);
    if (!verifyChannel) return;

    const embed = new EmbedBuilder()
        .setTitle("✔️ Verify")
        .setDescription("Nyomd meg a gombot a belépéshez!")
        .setColor("Green")
        .setImage(IMGUR_LINK);

    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("verify_button")
            .setLabel("✔️ Verify")
            .setStyle(ButtonStyle.Success)
    );

    verifyChannel.send({ embeds: [embed], components: [button] });
});

// Verify gomb megnyomása → role adás
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "verify_button") {
        try {
            await interaction.member.roles.add(VERIFY_ROLE_ID);
            await interaction.reply({ content: "Sikeresen verifikáltad magad! ✔️", ephemeral: true });
        } catch (err) {
            console.error("Verify hiba:", err);
        }
    }
});

client.login(process.env.TOKEN);
