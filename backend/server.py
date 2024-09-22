import base64
from flask import Flask, request, jsonify # type: ignore
from openai import OpenAI # type: ignore
import openai # type: ignore

app = Flask(__name__)

# Configure your OpenAI API key

client = OpenAI(
    # This is the default and can be omitted
    api_key=""
)

@app.route('/upload', methods=['POST'])
def upload_image():
    print("CALLED THE API NEW")
    print(request.files)
    
    if 'image' not in request.files:
        print("cp0")
        return jsonify({"error": "No image file found"}), 400

    image_file = request.files['image']
    
    try:
        # Read the image content and encode it to base64
        image_content = base64.b64encode(image_file.read()).decode('utf-8')
        
        # Example request to DALL·E or image generation endpoint (this is not real GPT-4 Vision support)
        # OpenAI does not yet process images in this format for GPT-4 models

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Generate a recipe using the ingredients in my fridge. Return only the recipe; do not pad with any meta-commentary."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_content}"
                            }
                        }
                    ]
                }
            ]
        )
        print('checkpoint')
        print(response.choices[0].message.content)
        print('now done')
        result = response.choices[0].message.content
        response = client.images.generate(
            model = "dall-e-3",
            prompt="Generate an image of the following recipe: " + result,
            size="1024x1024",
            n=1,
            quality = "standard",
        )
        print('hahaha 1')

        image_url = response.data[0].url
        print('lmao')
        return jsonify({"recipe_suggestions": result, "recipe_img": image_url}), 200 
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return jsonify({"error": "Failed to process image"}), 500

if __name__ == "__main__":
    app.run(debug=True)
