const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField
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

// Welcome csatorna
const WELCOME_CHANNEL_ID = "1520774673212903424";

// Verify csatorna
const VERIFY_CHANNEL_ID = "1520837724930834622";

// Ticket panel csatorna
const TICKET_PANEL_CHANNEL_ID = "1521143067472560158";

// Verify role
const VERIFY_ROLE_ID = "1520770892869927084";

// Staff role
const STAFF_ROLE_ID = "1520843125357019307";

// Képek
const VERIFY_IMG = "https://i.imgur.com/ddZEOQ8.png";
const TICKET_IMG = "https://i.imgur.com/wFeneqy.jpeg";

client.on("ready", async () => {
    console.log(`Bejelentkezve: ${client.user.tag}`);

    // VERIFY PANEL csak egyszer
    const verifyChannel = await client.channels.fetch(VERIFY_CHANNEL_ID);
    const verifyMessages = await verifyChannel.messages.fetch({ limit: 10 });
    const verifyExists = verifyMessages.find(m => m.author.id === client.user.id);

    if (!verifyExists) {
        const embed = new EmbedBuilder()
            .setTitle("✔️ Verify")
            .setDescription("Nyomd meg a gombot a belépéshez!")
            .setColor("Green")
            .setImage(VERIFY_IMG);

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("verify_button")
                .setLabel("✔️ Verify")
                .setStyle(ButtonStyle.Success)
        );

        verifyChannel.send({ embeds: [embed], components: [button] });
    }

    // TICKET PANEL csak egyszer
    const ticketChannel = await client.channels.fetch(TICKET_PANEL_CHANNEL_ID);
    const ticketMessages = await ticketChannel.messages.fetch({ limit: 10 });
    const ticketExists = ticketMessages.find(m => m.author.id === client.user.id);

    if (!ticketExists) {
        const embed = new EmbedBuilder()
            .setTitle("📩 Ticket Nyitása")
            .setDescription("Ha segítségre van szükséged, nyiss egy ticketet!")
            .setColor("Blue")
            .setImage(TICKET_IMG);

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("ticket_open")
                .setLabel("📩 Ticket Nyitása")
                .setStyle(ButtonStyle.Primary)
        );

        ticketChannel.send({ embeds: [embed], components: [button] });
    }
});

// Welcome üzenet
client.on("guildMemberAdd", async (member) => {
    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!channel) return;

    channel.send({
        content: `<@${member.id}> csatlakozott a szerverhez! 👋`,
        files: [VERIFY_IMG]
    });
});

// 🔥 EGYETLEN interactionCreate BLOKK – minden itt van
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    // VERIFY GOMB
    if (interaction.customId === "verify_button") {
        await interaction.member.roles.add(VERIFY_ROLE_ID);
        await interaction.reply({ content: "Sikeresen verifikáltad magad! ✔️", ephemeral: true });
    }

    // TICKET NYITÁS
    if (interaction.customId === "ticket_open") {
        const guild = interaction.guild;

        const channelName = `ticket-${interaction.user.username}`;

        const ticketChannel = await guild.channels.create({
            name: channelName,
            type: 0,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory
                    ]
                },
                {
                    id: STAFF_ROLE_ID,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory
                    ]
                }
            ]
        });

        const embed = new EmbedBuilder()
            .setTitle("📩 Új Ticket Nyílt")
            .setDescription(`Szia <@${interaction.user.id}>! Miben segíthetünk?`)
            .setColor("Blue")
            .setImage(TICKET_IMG);

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("ticket_close")
                .setLabel("Bezárás")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("ticket_handle")
                .setLabel("Ticket Intézése")
                .setStyle(ButtonStyle.Success)
        );

        await ticketChannel.send({
            content: `<@&${STAFF_ROLE_ID}>`,
            embeds: [embed],
            components: [buttons]
        });

        await interaction.reply({ content: "Ticket sikeresen megnyitva! 📩", ephemeral: true });
    }

    // TICKET BEZÁRÁS
    if (interaction.customId === "ticket_close") {
        try {
            await interaction.user.send({
                content: "A ticketed sikeresen lezárva! ✔️",
                files: ["https://i.imgur.com/wFeneqy.jpeg"]
            });

            await interaction.channel.delete();
        } catch (err) {
            console.error("Ticket bezárási hiba:", err);
        }
    }

    // TICKET INTÉZÉSE
    if (interaction.customId === "ticket_handle") {
        await interaction.reply({
            content: "A ticketet intézzük! ✔️",
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);
