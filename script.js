
const usuarios = { "Admin": "1234" };

  function mostrarTela(tela) {
    document.getElementById('tela-login').style.display    = tela === 'login'    ? 'block' : 'none';
    document.getElementById('tela-cadastro').style.display = tela === 'cadastro' ? 'block' : 'none';
    document.getElementById('tela-bemvindo').style.display = tela === 'bemvindo' ? 'block' : 'none';
    document.getElementById('erro-login').classList.remove('visible');
    document.getElementById('erro-cadastro').classList.remove('visible');
  }

 function fazerLogin() {
  const usuario = document.getElementById('usuario').value.trim();
  const senha   = document.getElementById('senha').value;

  fetch('http://127.0.0.1:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  })
  .then(res => res.json())
  .then(data => {
    if (data.sucesso) {
      window.location.href = 'bemvindo.html';
    } else {
      document.getElementById('erro-login').classList.add('visible');
    }
  });
}
function fazerCadastro() {
  const usuario = document.getElementById('novo-usuario').value.trim();
  const senha   = document.getElementById('nova-senha').value;

  if (!usuario || !senha) {
    document.getElementById('erro-cadastro').classList.add('visible');
    return;
  }

  fetch('http://127.0.0.1:5000/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  })
  .then(res => res.json())
  .then(data => {
    if (data.sucesso) {
      mostrarTela('login');
    } else {
      document.getElementById('erro-cadastro').classList.add('visible');
    }
  });
}

  function sair() { mostrarTela('login'); }

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const telaLogin = document.getElementById('tela-login').style.display !== 'none';
      telaLogin ? fazerLogin() : fazerCadastro();
    }
  });

  mostrarTela('login');