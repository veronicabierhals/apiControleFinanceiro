const conexao = require('../bancoDeDados/conexao');

const criarUsuario = async (nome, email, senha) => {
  const result = await conexao.query(
    `INSERT INTO usuarios (nome, email, senha)
    VALUES ($1, $2, $3) RETURNING *`,
    [nome, email, senha]
  );

  return result.rows[0];
}

const buscarUsuarioPorEmail = async (email) => {
  const result = await conexao.query(
    `SELECT id, nome, email, senha 
    FROM usuarios
    WHERE email = $1 LIMIT 1`,
    [email]
  );

  return result.rows[0];
}

const buscarUsuarioPorId = async (id) => {
  const result = await conexao.query(
    `SELECT id, nome, email, senha
    FROM usuarios
    WHERE id = $1 LIMIT 1`,
    [id]
  );

  return result.rows[0]
}

const alterarUsuario = async({ id, nome, email, senha }) => {
  const result = await conexao.query(
    `UPDATE usuarios
    SET nome = $2, email = $3, senha = $4
    WHERE id = $1 RETURNING *`,
    [id, nome, email, senha]
  );

  return result.rows[0];
}

module.exports = {
  criarUsuario,
  buscarUsuarioPorEmail,
  buscarUsuarioPorId,
  alterarUsuario
}