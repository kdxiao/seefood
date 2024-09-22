import boto3
import openai

# AWS Rekognition Configuration
aws_access_key_id = 'YOUR_AWS_ACCESS_KEY_ID'
aws_secret_access_key = 'YOUR_AWS_SECRET_ACCESS_KEY'
region_name = 'YOUR_AWS_REGION'

rekognition_client = boto3.client(
    'rekognition',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=region_name
)

# OpenAI API Configuration
openai.api_key = 'YOUR_OPENAI_API_KEY'

def detect_ingredients(image_path):
    with open(image_path, 'rb') as image:
        image_bytes = image.read()

    response = rekognition_client.detect_labels(
        Image={'Bytes': image_bytes},
        MaxLabels=20,
        MinConfidence=70
    )

    ingredients = [label['Name'] for label in response['Labels']]
    return ingredients

def generate_recipes(ingredients):
    prompt = f"Suggest three recipes using the following ingredients: {', '.join(ingredients)}."

    response = openai.Completion.create(
        engine='text-davinci-003',
        prompt=prompt,
        max_tokens=250,
        n=1,
        stop=None,
        temperature=0.7
    )

    recipes = response.choices[0].text.strip()
    return recipes

def main():
    image_path = 'path_to_your_refrigerator_image.jpg'  # Update this path

    print("Detecting ingredients...")
    ingredients = detect_ingredients(image_path)
    print(f"Ingredients detected: {', '.join(ingredients)}\n")

    print("Generating recipes...")
    recipes = generate_recipes(ingredients)
    print(f"Recipes:\n{recipes}")

if __name__ == "__main__":
    main()
