const { exibirCategorias } = require('../repositorios/categorias');

const listarCategoria = async (req, res) => {
try {
    const categorias = await exibirCategorias();

    return res.status(200).json(categorias)

} catch (error) {
    return res.status(500).json({
        mensagem: "Erro Interno do Servidor."
    })
}
}

module.exports = {
    listarCategoria
}