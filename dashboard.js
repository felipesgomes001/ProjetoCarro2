const FLASK_URL = 'http://127.0.0.1:5000';

function trocarAba(aba) {
  document.getElementById('tela-controles').style.display = aba === 'controles' ? 'block' : 'none';
  document.getElementById('tela-tutorial').style.display  = aba === 'tutorial'  ? 'block' : 'none';

  document.querySelectorAll('.aba').forEach(btn => btn.classList.remove('ativa'));
  event.target.classList.add('ativa');
}

function enviar(comando) {
  const status = document.getElementById('status-msg');
  const mensagens = {
    frente:   '▲ Indo para frente...',
    tras:     '▼ Indo para trás...',
    esquerda: '◄ Virando à esquerda...',
    direita:  '► Virando à direita...',
    parar:    '■ Parado.'
  };

  status.textContent = mensagens[comando];

  fetch(`${FLASK_URL}/comando/${comando}`)
    .then(res => res.json())
    .then(data => console.log('Resposta Flask:', data))
    .catch(err => console.error('Erro ao enviar comando:', err));
}

function sair() {
  window.location.href = 'login.html';
}

// Teclado
document.addEventListener('keydown', e => {
  const mapa = {
    ArrowUp:    'frente',
    ArrowDown:  'tras',
    ArrowLeft:  'esquerda',
    ArrowRight: 'direita',
    ' ':        'parar'
  };
  if (mapa[e.key]) {
    e.preventDefault();
    enviar(mapa[e.key]);
  }
});

document.addEventListener('keyup', e => {
  const teclas = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  if (teclas.includes(e.key)) enviar('parar');
});