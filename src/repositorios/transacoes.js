const conexao = require("../bancoDeDados/conexao");

const obterTransacoesUsuarios = async (usuario_id) => {
  const { rows } = await conexao.query(
    `SELECT t.*, c.descricao AS categoria_nome 
    FROM transacoes t 
    LEFT JOIN categorias c ON t.categoria_id = c.id
    WHERE t.usuario_id = $1;`,
    [usuario_id]
  );
  return rows;
};

const buscarTransacaoPorId = async (id) => {
  const { rows } = await conexao.query(
    `SELECT t.*, c.descricao AS categoria_nome 
    FROM transacoes t 
    LEFT JOIN categorias c ON t.categoria_id = c.id
    WHERE t.id = $1 LIMIT 1;`,
    [id]
  );
  return rows[0];
};

const criarTransacao = async (
  tipo,
  descricao,
  valor,
  data,
  categoria_id,
  usuario_id
) => {
  const { rows } = await conexao.query(
    `INSERT INTO transacoes (tipo, descricao, valor, data, categoria_id, usuario_id)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [tipo, descricao, valor, data, categoria_id, usuario_id]
  );

  return rows[0];
};

const atualizarTransacao = async ({
  id,
  descricao,
  valor,
  data,
  categoria_id,
  tipo,
  usuario_id,
}) => {
  const result = await conexao.query(
    `UPDATE transacoes
        SET descricao = $2, valor = $3, data = $4, categoria_id = $5, tipo = $6, usuario_id = $7
        WHERE id = $1`,
    [id, descricao, valor, data, categoria_id, tipo, usuario_id]
  );

  return result.rows[0];
};

const excluirTransacao = async (id) => {
  const result = await conexao.query(
    `DELETE FROM transacoes
      WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  obterTransacoesUsuarios,
  buscarTransacaoPorId,
  criarTransacao,
  atualizarTransacao,
  excluirTransacao,
};
