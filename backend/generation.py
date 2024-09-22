from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# Configure your OpenAI API key
openai.api_key = ""

@app.route('/upload', methods=['POST'])
def upload_image():
    print("CALLED THE API")
    if 'image' not in request.files:
        return jsonify({"error": "No image file found"}), 400

    image_file = request.files['image']

    # Read the image content as bytes
    image_content = image_file.read()

    try:
        # Call the GPT-4 Vision API to identify ingredients and suggest recipes
        response = openai.ChatCompletion.create(
            model="gpt-4-vision-0301",  # The GPT-4 vision model identifier
            messages=[
                {
                    "role": "user",
                    "content": "Identify the ingredients in the image and suggest recipes I can make with them.",
                }
            ],
            files=[
                {
                    "name": image_file.filename,
                    "bytes": image_content,
                }
            ],
            max_tokens=1000,
            temperature=0.7,
        )

        # Extract the model's response and return it to the frontend
        recipe_suggestions = response['choices'][0]['message']['content']
        return jsonify(recipe_suggestions), 200

    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return jsonify({"error": "Failed to process image"}), 500

if __name__ == "__main__":
    app.run(debug=True)
