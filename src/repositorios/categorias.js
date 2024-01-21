const conexao = require("../bancoDeDados/conexao");

const exibirCategorias = async () => {
  const result = await conexao.query(
    `SELECT * FROM categorias
    `
  );
  return result.rows;
};

const buscarCategoriaPorId = async (id) => {
  const { rows } = await conexao.query(
    `SELECT * FROM categorias WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0]; 
};

module.exports = {
  exibirCategorias,
  buscarCategoriaPorId
};
