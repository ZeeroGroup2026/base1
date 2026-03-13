const Discord = require("discord.js")
const { JsonDatabase } = require("wio.db")
const dbp = new JsonDatabase({ databasePath: "./json/perms.json"})
const dbe = new JsonDatabase({ databasePath: "./json/emojis.json"})
const dbc = new JsonDatabase({ databasePath: "./json/botconfig.json"})
const dono = new JsonDatabase({ databasePath: "./config.json"})

module.exports = {
    name: "perms", // Coloque o nome do comando
    description: "🤖 | Adicione ou remova e veja a lista de pessoas com perms.", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (interaction.user.id !== dono.get(`dono`)) {
            interaction.reply({ ephemeral:true, content: `${dbe.get(`13`)} | Você não tem permissão para usar este comando!`})
            return;
        }

        var perms = '';
        dbp.all().map((entry, index) => {perms += `${index +1} - <@${entry.data}>\n`;});

        const embed = new Discord.EmbedBuilder()
        .setTitle(`Configurando Perms`)
        .setDescription(`Veja a lista de pessoas com permissão de gerenciar o seu bot à seguir e também interaja com os botões abaixo da lista para **ADICIONAR** ou **REMOVER** permissões.\n\n${perms}`)
        .setColor(dbc.get(`color`) || "Default")

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
            .setStyle(3)
            .setCustomId(`add_perm`)
            .setLabel(`Adicionar Usuário`)
            .setEmoji(dbe.get(`20`)),
            new Discord.ButtonBuilder()
            .setStyle(4)
            .setCustomId(`sub_perm`)
            .setLabel(`Remover Usuário`)
            .setEmoji(dbe.get(`21`)),
        )

        interaction.reply({ embeds: [embed], components: [row], ephemeral:true }).then(msg => {
            const interação = interaction.channel.createMessageComponentCollector({
                componentType: Discord.ComponentType.Button,
            })
    
            interação.on("collect", async (interaction) => {
                if (interaction.user.id != interaction.user.id) {
                    return;
                }
                if (interaction.customId === "add_perm") {
                    interaction.reply({ content: `${dbe.get(`16`)} | Mande o id do usuário que ganhará a perm...`, ephemeral:true}).then(msg12 => {
                        const filter = m => m.author.id === interaction.user.id;
                        const collector = interaction.channel.createMessageCollector({ filter, max: 1 });
                        collector.on("collect", message => {
                            const newt = message.content
                            message.delete()
                            const user = interaction.guild.members.cache.get(newt)

                            if (!user) {
                                msg12.edit({ content: `${dbe.get(`13`)} | Usuário não encontrado!`, ephemeral:true })
                                return;
                            }

                            if (dbp.has(`${user}`)) {
                                msg12.edit({ content: `${dbe.get(`1`)} | O usário ${user} já tem perm para usar os meus comandos!`, ephemeral:true })
                                return;
                            }
                            if (user) {
                                dbp.set(`${newt}`, newt)
                                var perms = '';
                                dbp.all().map((entry, index) => {perms += `${index +1} - <@${entry.data}>\n`;});
                        
                                const embed = new Discord.EmbedBuilder()
                                .setTitle(`Configurando Perms`)
                                .setDescription(`Veja a lista de pessoas com permissão de gerenciar o seu bot à seguir e também interaja com os botões abaixo da lista para **ADICIONAR** ou **REMOVER** permissões.\n\n${perms}`)
                                .setColor(dbc.get(`color`) || "Default")
                        
                                const row = new Discord.ActionRowBuilder()
                                .addComponents(
                                    new Discord.ButtonBuilder()
                                    .setStyle(3)
                                    .setCustomId(`add_perm`)
                                    .setLabel(`Adicionar Usuário`)
                                    .setEmoji(dbe.get(`20`)),
                                    new Discord.ButtonBuilder()
                                    .setStyle(4)
                                    .setCustomId(`sub_perm`)
                                    .setLabel(`Remover Usuário`)
                                    .setEmoji(dbe.get(`21`)),
                                )
                                msg.edit({ embeds: [embed], components: [row], ephemeral:true })
                                msg12.edit({content: `${dbe.get(`6`)} | Perm adicionada ao usuário ${user}!`, ephemeral:true })
                            }
                        })
                    })
                }
                if (interaction.customId === "sub_perm") {
                    interaction.reply({content: `${dbe.get(`16`)} | Mande o id do usuário que perderá a perm...`, ephemeral:true }).then(msg12 => {
                        const filter = m => m.author.id === interaction.user.id;
                        const collector = interaction.channel.createMessageCollector({ filter, max: 1 });
                        collector.on("collect", message => {
                            const newt = message.content
                            message.delete()
                            const user = interaction.guild.members.cache.get(newt)

                            
                            if (!user) {
                                msg12.edit({ content: `${dbe.get(`13`)} | Usuário não encontrado!`, ephemeral:true })
                                return;
                            }

                            if (!dbp.get(`${newt}`)) {
                                msg12.edit({content: `${dbe.get(`13`)} | O usário ${user} já não tinha perm para usar os meus comandos!`, ephemeral:true })
                                return;
                            }

                            if (user) {
                                dbp.delete(`${newt}`)
                                var perms = '';
                                dbp.all().map((entry, index) => {perms += `${index +1} - <@${entry.data}>\n`;});
                        
                                const embed = new Discord.EmbedBuilder()
                                .setTitle(`Configurando Perms`)
                                .setDescription(`Veja a lista de pessoas com permissão de gerenciar o seu bot à seguir e também interaja com os botões abaixo da lista para **ADICIONAR** ou **REMOVER** permissões.\n\n${perms}`)
                                .setColor(dbc.get(`color`) || "Default")
                        
                                const row = new Discord.ActionRowBuilder()
                                .addComponents(
                                    new Discord.ButtonBuilder()
                                    .setStyle(3)
                                    .setCustomId(`add_perm`)
                                    .setLabel(`Adicionar Usuário`)
                                    .setEmoji(dbe.get(`20`)),
                                    new Discord.ButtonBuilder()
                                    .setStyle(4)
                                    .setCustomId(`sub_perm`)
                                    .setLabel(`Remover Usuário`)
                                    .setEmoji(dbe.get(`21`)),
                                )
                                
                                msg.edit({ embeds: [embed], components: [row], ephemeral:true })
                                msg12.edit({ content: `${dbe.get(`6`)} | Perm removida do usuário ${user}!`, ephemeral:true })
                            }
                        })
                    })
                }
            })
        })
    }
}