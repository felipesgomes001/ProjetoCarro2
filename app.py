from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import requests  # usado para enviar comandos ao ESP32

app = Flask(__name__)
CORS(app)

# IP do ESP32 na rede Wi-Fi — troca quando tiver o ESP32
ESP32_IP = "http://192.168.0.107"

def conectar():
    conn = sqlite3.connect("usuarios.db")
    return conn

def inicializar_banco():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS usuarios (
        usuario TEXT UNIQUE,
        senha TEXT
    )""")
    cursor.execute("INSERT OR IGNORE INTO usuarios (usuario, senha) VALUES (?, ?)", ("Admin", "1234"))
    conn.commit()
    conn.close()

inicializar_banco()

@app.route('/login', methods=['POST'])
def login():
    dados = request.json
    usuario = dados['usuario']
    senha = dados['senha']

    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE usuario = ? AND senha = ?", (usuario, senha))
    resultado = cursor.fetchone()
    conn.close()

    if resultado:
        return jsonify({'sucesso': True})
    else:
        return jsonify({'sucesso': False})
    
@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    dados = request.json
    usuario = dados['usuario']
    senha = dados['senha']

    conn = conectar()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO usuarios (usuario, senha) VALUES (?, ?)", (usuario, senha))
        conn.commit()
        conn.close()
        return jsonify({'sucesso': True})
    except:
        conn.close()
        return jsonify({'sucesso': False, 'erro': 'Usuário já existe'})

@app.route('/comando/<direcao>')
def comando(direcao):
    comandos_validos = ['frente', 'tras', 'esquerda', 'direita', 'parar']

    if direcao not in comandos_validos:
        return jsonify({'erro': 'Comando inválido'}), 400

    print(f"Comando recebido: {direcao}")

    return jsonify({'comando': direcao, 'status': 'enviado'})

if __name__ == '__main__':
    app.run(debug=True)