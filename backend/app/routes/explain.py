# explain.py
from flask import Blueprint, request, jsonify
import json

explain_bp = Blueprint('explain', __name__)

def get_data():
    try:
        with open('data.json', 'r') as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        print("Error: 'data.json' not found.")
    except json.JSONDecodeError:
        print("Error: Invalid JSON format in 'data.json'")

def get_average_cosine_similarity():
    data = get_data()
    features = data["features"]
    new_features = []

    for feature in features:
        all_similarities = []
        if feature["explanations"] == None:
            continue
        for explanation in feature["explanations"]:
            for similarity_pair in explanation["pairwise_semantic_similarity"]:
                all_similarities.append(similarity_pair["cosine_similarity"])
        if all_similarities:
            average = sum(all_similarities) / len(all_similarities)
            new_features.append({"feature_id": feature["feature_id"], "cosine_average": average}) 

    return {
        "sae_id": data["sae_id"],
        "features": new_features
    }

def get_explains(feature_id):
    data = get_data()
    explanation = None
    for feature in data["features"]:
        if feature.get("feature_id") == feature_id:
            explanation = feature.get("explanations")
            
            break
    transformed_data = []
    if explanation == None:
        new_item = {
            "llm_explainer": "",
            "detection": 0,
            "embedding": 0,
            "fuzz": 0,
            "Text": ""
        }
        transformed_data.append(new_item)
        new_item = {
            "llm_explainer": "",
            "detection": 0,
            "embedding": 0,
            "fuzz": 0,
            "Text": ""
        }
        transformed_data.append(new_item)
        new_item = {
            "llm_explainer": "",
            "detection": 0,
            "embedding": 0,
            "fuzz": 0,
            "Text": ""
        }
        transformed_data.append(new_item)
        return transformed_data

    for item in explanation:
        scores = item.get("scores", {})
        
        new_item = {
            "llm_explainer": item.get("llm_explainer"),
            "detection": scores.get("detection"),
            "embedding": scores.get("embedding"),
            "fuzz": scores.get("fuzz"),
            "Text": item.get("text")
        }
        
        transformed_data.append(new_item)
    
    return transformed_data


    
@explain_bp.route("/api/get-cosine-similarity")
def get_cosine_similarity():
    response = jsonify(get_average_cosine_similarity())
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@explain_bp.route("/api/get-feature-explains")
def get_feature_explains():
    feature_id = request.args.get('feature_id', default=0, type=int)
    print(feature_id)
    response = jsonify(get_explains(feature_id))
    response.headers['Access-Control-Allow-Origin'] = '*' 
    return response