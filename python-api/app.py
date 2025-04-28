from flask import Flask, jsonify, request
from supabase import create_client
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Rota para pegar todos os times
@app.route('/teams', methods=['GET'])
def get_teams():
    try:
        response = supabase.table('teams').select('*').execute()

        if response.data:
            return jsonify(response.data), 200  # Retorna todos os times
        else:
            return jsonify({"error": "Nenhum time encontrado."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rota para pegar um time específico pelo ID
@app.route('/teams/<team_id>', methods=['GET'])
def get_team_by_id(team_id):
    try:
        response = supabase.table('teams').select('*').eq('id', team_id).execute()

        if response.data:
            return jsonify(response.data[0]), 200  # Retorna o time específico
        else:
            return jsonify({"error": "Time não encontrado."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
