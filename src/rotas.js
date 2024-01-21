const express = require("express");
const {
  cadastrarUsuario,
  loginUsuario,
  detalharUsuario,
  atualizarUsuario,
} = require("./controladores/usuarios");
const {
  validarNome,
  validarEmailESenha,
  validarToken,
  validarCamposTransacao,
  validarTransacao
} = require("./intermediarios/intermediarios");
const {
  listarCategoria
} = require("./controladores/categorias");
const {
  listarTransacoesUsuario,
  detalharTransacaoDeUsuario,
  cadastrarTransacao,
  atualizarTransacaoUsuario,
  excluirTransacaoUsuario,
  obterExtrato
} = require("./controladores/transacoes");

const rotas = express();

rotas.post(
  "/usuario",
  validarNome,
  validarEmailESenha,
  cadastrarUsuario
);
rotas.post("/login", validarEmailESenha, loginUsuario);

rotas.use(validarToken);

rotas.get("/usuario", detalharUsuario);

rotas.put(
  "/usuario", 
  validarNome, 
  validarEmailESenha, 
  atualizarUsuario
);

rotas.get("/categoria", listarCategoria);
rotas.post("/transacao", validarCamposTransacao, cadastrarTransacao);
rotas.get("/transacao", listarTransacoesUsuario);

rotas.get("/transacao/extrato", obterExtrato);

rotas.get("/transacao/:id", validarTransacao, detalharTransacaoDeUsuario);
rotas.put(
  "/transacao/:id",
  validarTransacao,
  validarCamposTransacao,
  atualizarTransacaoUsuario
);
  rotas.delete("/transacao/:id", validarTransacao, excluirTransacaoUsuario);
  

module.exports = rotas;
