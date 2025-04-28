"""
Flask API backend for retrieving teams from Supabase.
"""

from flask import Flask, jsonify
from supabase import create_client
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from python-api/.env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_KEY in environment")

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app)


@app.route('/teams', methods=['GET'])
def get_teams():
    """
    Return all teams from the 'teams' table.
    """
    try:
        response = supabase.from_('teams').select('*').execute()
        if response.data:
            return jsonify(response.data), 200
        return jsonify({"error": "Nenhum time encontrado."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/teams/<team_id>', methods=['GET'])
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
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
