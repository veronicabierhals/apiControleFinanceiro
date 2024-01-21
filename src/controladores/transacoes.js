const {
  obterTransacoesUsuarios,
  criarTransacao,
  atualizarTransacao,
  excluirTransacao,
} = require("../repositorios/transacoes");

const listarTransacoesUsuario = async (req, res) => {
  const { id: usuario_id } = req.usuario;
  const { filtro } = req.query;

  try {
    let transacoes = await obterTransacoesUsuarios(usuario_id);
    if (filtro.length > 0) {
      transacoes = transacoes.filter((transacao) => {
        return filtro
          .map((f) => f.toLowerCase())
          .includes(transacao.categoria_nome.toLowerCase());
      });
    }
    return res.status(200).json(transacoes);
  } catch (error) {
    return res.status(500).json("Erro interno do servidor");
  }
};

const detalharTransacaoDeUsuario = async (req, res) => {
  const transacao = req.transacao;
  try {
    return res.status(200).json(transacao);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro Interno do Servidor.",
    });
  }
};

const cadastrarTransacao = async (req, res) => {
  const { id: usuario_id } = req.usuario;
  const { descricao: categoria_nome } = req.categoria;
  const { tipo, descricao, valor, data, categoria_id } = req.body;
  try {
    const transacao = await criarTransacao(
      tipo,
      descricao,
      valor,
      data,
      categoria_id,
      usuario_id
    );
    return res.status(201).json({
      ...transacao,
      categoria_nome,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro Interno do Servidor.",
    });
  }
};

const atualizarTransacaoUsuario = async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { id: usuario_id } = req.usuario;

  try {
    await atualizarTransacao({
      id,
      descricao,
      valor,
      data,
      categoria_id,
      tipo,
      usuario_id,
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro Interno do Servidor.",
    });
  }
};

const excluirTransacaoUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await excluirTransacao(id);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json("Erro interno do servidor");
  }
};

const obterExtrato = async (req, res) => {
  const { id: usuario_id } = req.usuario;

  try {
    const transacoes = await obterTransacoesUsuarios(usuario_id);
    let entrada = 0;
    let saida = 0;

    for (const { valor, tipo } of transacoes) {
      if (tipo === "entrada") {
        entrada += valor;
      } else {
        saida += valor;
      }
    }
    return res.status(200).json({ entrada, saida });
  } catch (error) {
    return res.status(500).json("Erro interno do servidor");
  }
};

module.exports = {
  listarTransacoesUsuario,
  detalharTransacaoDeUsuario,
  cadastrarTransacao,
  atualizarTransacaoUsuario,
  excluirTransacaoUsuario,
  obterExtrato,
};
