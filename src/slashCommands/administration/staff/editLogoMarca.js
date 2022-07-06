const Database = require('../../../../modules/classes/Database')
const client = require('../../../../index')
const { e } = require('../../../../JSON/emojis.json')

async function editLogoMarca(interaction) {

    const { options } = interaction
    const logoData = Database.Logomarca.get('LogoMarca') || []
    const logoChoice = options.getString('select_logo_marca')
    const logo = logoData.find(data => data.name[0] === logoChoice)

    if (!logo)
        return await interaction.reply({
            content: `${e.Deny} | Logo/Marca não encontrada.`,
            ephemeral: true
        })

    const subCommand = options.getSubcommand()

    switch (subCommand) {
        case 'remove_sinonimo': remove(); break;
    }

    /*
    {
                            name: 'add_sinonimo',
                            description: 'Adicionar um novo sinônimo',
                            type: 3
                        },
                        {
                            name: 'remove_sinonimo',
                            description: 'Adicionar um novo sinônimo',
                            type: 3,
                            autocomplete: true
                        },
                        {
                            name: 'editar_imagem_com_censura',
                            description: 'Editar imagem da logo/marca',
                            type: 3
                        },
                        {
                            name: 'editar_imagem_sem_censura',
                            description: 'Editar imagem da logo/marca',
                            type: 3
                        }
    */
}

module.exports = editLogoMarca