"""
Flask API backend for managing teams with Supabase.
"""

from flask import Flask, jsonify, request
from supabase import create_client
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_KEY in environment")

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Routes

@app.route('/teams', methods=['GET'])
def get_teams():
    """
    Return all teams from the 'teams' table.
    """
    try:
        response = supabase.from_('teams').select('*').execute()
        print("Resposta do Supabase (GET /teams):", response)

        if response.data and isinstance(response.data, list):
            return jsonify(response.data), 200
        else:
            return jsonify([]), 200

    except Exception as e:
        print("Erro inesperado (GET):", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/teams/<int:team_id>', methods=['GET'])
def get_team_by_id(team_id):
    """
    Return a specific team by its ID.
    """
    try:
        response = supabase.from_('teams').select('*').eq('id', team_id).execute()
        if response.data:
            return jsonify(response.data[0]), 200
        return jsonify({"error": "Time não encontrado."}), 404
    except Exception as e:
        print("Erro inesperado (GET ID):", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/teams', methods=['POST'])
def create_team():
    """
    Create a new team in the 'teams' table.
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Nenhum dado enviado."}), 400

        # Insert into Supabase
        response = supabase.from_('teams').insert({
            "name": data['name'],
            "coach": data['coach'],
            "value": float(data['value']),
            "founded": int(data['founded']),
        }).execute()

        print("Resposta do Supabase (POST /teams):", response)

        if response.data:
            return jsonify({"message": "Time criado com sucesso", "team": response.data}), 201
        else:
            return jsonify({"error": "Erro ao criar time"}), 500

    except Exception as e:
        print("Erro inesperado (POST):", str(e))
        return jsonify({"error": str(e)}), 500

# Start server
if __name__ == '__main__':
    print(f"Conectado ao Supabase: {SUPABASE_URL}")
    app.run(debug=True, port=5000)
