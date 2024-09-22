import os
from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# Set up OpenAI API key
openai.api_key = os.environ.get('OPENAI_API_KEY')

@app.route('/upload', methods=['POST'])
def upload_image():
    # Check if an image was uploaded
    if 'image' not in request.files:
        return jsonify({'error': 'No image file uploaded.'}), 400

    image_file = request.files['image']

    # Read image content
    image_content = image_file.read()

    # Prepare the OpenAI API request
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-vision-0301",  # Use the appropriate model identifier for GPT-4V
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
        recipes = response.choices[0].message.content.strip()
    except Exception as e:
        return jsonify({'error': f'Error generating recipes: {str(e)}'}), 500

    # Return the recipes
    return jsonify({'recipes': recipes})

if __name__ == '__main__':
    app.run(debug=True)
