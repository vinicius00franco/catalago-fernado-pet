#!/bin/bash

# Inicializa o banco de dados
function start_database() {
    echo "Iniciando o banco de dados..."
    docker compose up -d db
}

# Inicializa o backend
function start_backend() {
    echo "Iniciando o backend..."
    source env/bin/activate
    python3 -m backend.app
}

# Inicializa o frontend
function start_frontend() {
    echo "Iniciando o frontend..."
    npm run dev
}

# Menu de inicialização
function main() {
    echo "Escolha uma opção para inicializar:"
    echo "1. Banco de dados"
    echo "2. Backend"
    echo "3. Frontend"
    echo "4. Todos"

    read -p "Digite o número da opção: " option

    case $option in
        1)
            start_database
            ;;
        2)
            start_backend
            ;;
        3)
            start_frontend
            ;;
        4)
            start_database
            start_backend &
            start_frontend
            ;;
        *)
            echo "Opção inválida."
            ;;
    esac
}

main
