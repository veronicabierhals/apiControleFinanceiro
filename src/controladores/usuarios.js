const { criarUsuario, buscarUsuarioPorEmail, alterarUsuario } = require('../repositorios/usuarios');
const { hash, compare } = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const cadastrarUsuario = async (req, res) => {
  let { nome, email, senha } = req.body;
  try {
    const usuarioComMesmoEmail = await buscarUsuarioPorEmail(email);
    if(usuarioComMesmoEmail) {
      return res.status(400).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }

    senha = await hash(senha, 10); 
    const { senha: _, ...usuario } = await criarUsuario(nome, email, senha);

    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro Interno do Servidor."
    })
  }
}

const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await buscarUsuarioPorEmail(email);
    if(!usuario) {
      return res.status(401).json({
        mensagem: "Usuário e/ou senha inválido(s)."
      })
    }

    const senhaValida = await compare(senha, usuario.senha)
    if(!senhaValida) {
      return res.status(401).json({
        mensagem: "Usuário e/ou senha inválido(s)."
      })
    }

    const token = jwt.sign({ id: usuario.id }, process.env.API_KEY, { expiresIn: '8h' })

    const {senha: _, ...usuarioLogado} = usuario

    return res.status(200).json({usuario: usuarioLogado, token})

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro Interno do Servidor."
    })
  }
}

const detalharUsuario = async (req, res) => {
  try {
    const { senha: _, ...usuario} = req.usuario;
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro Interno do Servidor.",
    });   
  }
}

const atualizarUsuario = async (req, res) => {
  const { id } = req.usuario;
  const { nome, email, senha } = req.body;
  try {
    const usuarioComMesmoEmail = await buscarUsuarioPorEmail(email);
    if(usuarioComMesmoEmail && usuarioComMesmoEmail.id !== id) {
      return res.status(400).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }
    await alterarUsuario({
      id,
      nome,
      email,
      senha: await hash(senha, 10)
    });

    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro Interno do Servidor.",
    });
  }
}

module.exports = {
  cadastrarUsuario,
  loginUsuario,
  detalharUsuario,
  atualizarUsuario
}