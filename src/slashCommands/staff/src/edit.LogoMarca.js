const Database = require('../../../../modules/classes/Database')
const client = require('../../../../index')
const { e } = require('../../../../JSON/emojis.json')
const { formatString } = require('../../../../src/commands/games/plugins/gamePlugins')

async function editLogoMarca(interaction) {

    const { options } = interaction
    const logoData = Database.Logomarca.get('LogoMarca') || []
    const logoChoice = options.getString('select_logo_marca')
    const logoIndex = logoData.findIndex(data => data.name[0].toLowerCase() === logoChoice.toLowerCase())
    const logo = logoData[logoIndex]

    if (!logo)
        return await interaction.reply({
            content: `${e.Deny} | Logo/Marca não encontrada.`,
            ephemeral: true
        })

    const command = []

    for (let optionName of ['add_sinonimo', 'remove_sinonimo', 'editar_imagem_com_censura', 'editar_imagem_sem_censura'])
        if (options.get(optionName))
            command.push(options.get(optionName)?.name)

    switch (command[0]) {
        case 'add_sinonimo': add_sinonimo(); break;
        case 'remove_sinonimo': remove_sinonimo(); break;
        case 'editar_imagem_com_censura': editImage(); break;
        case 'editar_imagem_sem_censura': editImage(true); break;
        default:
            await interaction.reply({
                content: `${e.Deny} | Nenhuma função foi encontrada.`,
                ephemeral: true
            })
    }

    return

    async function editImage(noCensor = false) {

        const optionsId = noCensor ? 'editar_imagem_sem_censura' : 'editar_imagem_com_censura'
        const censor = noCensor ? 'uncensored' : 'censored'
        const censorString = noCensor ? 'sem censura' : 'censurada'
        const url = options.getString(optionsId) === 'null' ? null : options.getString(optionsId)

        if (!url && optionsId === 'editar_imagem_sem_censura')
            return await interaction.reply({
                content: `${e.Deny} | Imagens sem censura não podem ser deletadas, apenas editadas.`,
                ephemeral: true
            })

        if (!url && !logo?.images[censor])
            return await interaction.reply({
                content: `${e.Deny} | Esta logo/marca não tem imagem ${censorString}.`,
                ephemeral: true
            })

        if (logo?.images[censor] === url)
            return await interaction.reply({
                content: `${e.Deny} | Esta já é a imagem ${censorString} desta logo/marca.`,
                ephemeral: true
            })

        if (url && (!url?.isURL() || !url?.includes('https://media.discordapp.net/attachments/')))
            return await interaction.reply({
                content: `${e.Deny} | Este não é um link válido.`,
                ephemeral: true
            })

        let alreadyHas = logoData?.find(data => data.images[censor]?.includes(url))
        if (url && alreadyHas)
            return await interaction.reply({
                content: `${e.Deny} | Esta imagem já foi registrada na logo/marca ${formatString(alreadyHas.name[0])}.`,
                ephemeral: true
            })

        logoData[logoIndex].images[censor] = url
        Database.Logomarca.set('LogoMarca', logoData)
        return await interaction.reply({
            content: `${e.Check} | A imagem ${censorString} da logo/marca ${formatString(logo.name[0])} foi ${url ? 'alterada' : 'deletada'} com sucesso.`,
            ephemeral: true
        })
    }

    async function remove_sinonimo() {

        const synToRemove = options.getString('remove_sinonimo')

        logoData[logoIndex].name = logoData[logoIndex].name.filter(name => name !== synToRemove)
        Database.Logomarca.set('LogoMarca', logoData)
        return await interaction.reply({
            content: `${e.Check} | O sinônimo ${formatString(synToRemove)} foi removido da logo/marca ${formatString(logo.name[0])}`,
            ephemeral: true
        })

    }

    async function add_sinonimo() {

        const newSinonimo = options.getString('add_sinonimo')

        for (let logo of logoData)
            if (logo?.name?.find(logoName => logoName?.toLowerCase() === newSinonimo.toLowerCase()))
                return await interaction.reply({
                    content: `${e.Deny} | Este nome ou sinônimo de logo/marca já existe no banco de dados.`,
                    ephemeral: true
                })

        logoData[logoIndex].name.push(newSinonimo)
        Database.Logomarca.set('LogoMarca', logoData)
        return await interaction.reply({
            content: `${e.Check} | O sinônimo ${newSinonimo} foi adicionado a logo/marca ${formatString(logo.name[0])}`,
            ephemeral: true
        })
    }

}

module.exports = editLogoMarca