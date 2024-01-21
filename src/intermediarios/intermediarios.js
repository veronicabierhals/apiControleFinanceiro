const jwt = require('jsonwebtoken');
require('dotenv').config();
const { buscarUsuarioPorId } = require('../repositorios/usuarios');
const { buscarCategoriaPorId } = require('../repositorios/categorias');
const { buscarTransacaoPorId } = require('../repositorios/transacoes');

const validarNome = async (req, res, next) => {
  const { nome } = req.body;
  try {
    if(!nome || /^\s$/.test(nome)) {
      return res.status(400).json({
        mensagem: "Campo nome é obrigatório."
      })
    }
    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro Interno do Servidor."
    });
  }
}

const validarEmailESenha = async (req, res, next) => {
  const { email, senha } = req.body;
  try {
    if (!email || /^\s$/.test(email)) {
      return res.status(400).json({
        mensagem: "Campo email é obrigatório.",
      });
    }
    if (!senha || /^\s$/.test(senha)) {
      return res.status(400).json({
        mensagem: "Campo senha é obrigatório.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro Interno do Servidor.",
    });
  }
};

const validarToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }
  const [, token ] = authorization.split(" ");

  try {
    const { id } = jwt.verify(token, process.env.API_KEY);
    const usuario = await buscarUsuarioPorId(id);
    if(!usuario) {
      return res.status(401).json({ mensagem: "Não autorizado." });
    }
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Não autorizado." });
  }
}

const validarCamposTransacao = async (req, res, next) => {
  let { tipo, descricao, valor, data, categoria_id } = req.body;
  try {
    if (
      !tipo || /^\s$/.test(tipo) ||
      !descricao || /^\s$/.test(data) ||
      valor == undefined ||
      !data || /^\s$/.test(data) ||
      categoria_id == undefined
    ) {
      return res.status(400).json({
        mensagem: "Todos os campos obrigatórios devem ser informados.",
      });
    }
    const categoria = await buscarCategoriaPorId(categoria_id);
    if(!categoria) {
      return res.status(404).json({
        mensagem: "Cartegoria não encontrada.",
      });
    }
    if(tipo !== "entrada" && tipo !== "saida"){
      return res.status(400).json({
        mensagem: "Campo tipo inválido.",
      });
    }
    valor = parseInt(valor);
    if(isNaN(valor) || valor <= 0){
      return res.status(400).json({
        mensagem: "Campo valor inválido.",
      });
    }
    req.body.valor = valor;
    req.categoria = categoria;
    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro Interno do Servidor.",
    });
  }
}

const validarTransacao = async (req, res, next) =>{
  const { id } = req.params;
  const { id: usuario_id } = req.usuario;
  try {
    const transacao = await buscarTransacaoPorId(id);
    if (!transacao) {
      return res.status(404).json({
        mensagem: "Transação não encontrada.",
      });
    }
    if (transacao.usuario_id !== usuario_id) {
      return res.status(403).json({
        mensagem: "Transação não pertence ao usuário.",
      });
    }
    req.transacao = transacao;
    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro Interno do Servidor.",
    });
  }
}

module.exports = {
  validarNome,
  validarEmailESenha,
  validarToken,
  validarCamposTransacao,
  validarTransacao
}