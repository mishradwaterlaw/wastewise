from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Load data on startup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

with open(os.path.join(DATA_DIR, "waste_actions.json"), encoding="utf-8") as f:
    WASTE_ACTIONS = json.load(f)

with open(os.path.join(DATA_DIR, "disposal_sites.json"), encoding="utf-8") as f:
    DISPOSAL_SITES = json.load(f)


@app.route("/api/action/<waste_type>", methods=["GET"])
def get_action(waste_type):
    """Return action plan for a given waste type."""
    waste_type = waste_type.lower()
    if waste_type not in WASTE_ACTIONS:
        return jsonify({"error": f"Unknown waste type: {waste_type}"}), 404
    return jsonify(WASTE_ACTIONS[waste_type])


@app.route("/api/sites", methods=["GET"])
def get_sites():
    """Return all disposal sites. Optional ?type= filter."""
    waste_type = request.args.get("type", "").lower()
    if waste_type:
        filtered = [
            s for s in DISPOSAL_SITES
            if waste_type in s.get("accepts", []) or s.get("type") == waste_type
        ]
        return jsonify(filtered)
    return jsonify(DISPOSAL_SITES)


@app.route("/api/posts", methods=["GET"])
def get_posts():
    """
    Community posts (waste offers) are stored in Firebase Realtime DB.
    This endpoint exists for future server-side filtering. 
    Currently the frontend reads Firebase directly for real-time updates.
    """
    return jsonify({
        "message": "Community posts are served live from Firebase. Use the Firebase SDK on the frontend.",
        "firebase_path": "/community_posts"
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "categories": list(WASTE_ACTIONS.keys()), "sites": len(DISPOSAL_SITES)})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)
