export async function getCosineSimilarity() {
    const url = "http://127.0.0.1:5000/api/get-cosine-similarity";

    try {
        const response = await fetch(
            url,
            { method: "GET" }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const featureData = await response.json(); 
        return featureData;

    } catch (error) {
        console.error("Error fetching feature explain:", error);
        return {}; 
    }
}

export async function getFeatureExplains(feature_id) {
    const url = "http://127.0.0.1:5000/api/get-feature-explains";

    try {
        const response = await fetch(
            url + "?feature_id=" + feature_id,
            { method: "GET" }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const featureData = await response.json();         
        return featureData;

    } catch (error) {
        console.error("Error fetching feature explain:", error);
        return {}; 
    }
}
