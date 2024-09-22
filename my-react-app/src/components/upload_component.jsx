import React, { useState } from 'react';

function ImageUploadBox() {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    setError(null); // Reset error state
    const file = event.target.files[0];
    if (file) {
      // Generate a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload the image to the backend API
      uploadImage(file);
    }
  };

  const uploadImage = (file) => {
    // EDIT HERE FOR CAlling the api
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    console.log('passed in an image');
    fetch('http://localhost:5000/api/process-image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error processing image');
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        setRecipes(data.recipes);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
        console.error('Error processing image:', error);
      });
  };

  const handleBoxClick = () => {
    document.getElementById('imageUploadInput').click();
  };

  return (
    <div>
      <div
        onClick={handleBoxClick}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          width: '300px',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: '#f9f9f9',
          position: 'relative',
          overflow: 'hidden',
          margin: '0 auto', // Center the box
        }}
      >
        <input
          type="file"
          accept="image/*"
          id="imageUploadInput"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Uploaded"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <p style={{ color: '#aaa', fontSize: '16px', textAlign: 'center' }}>
            Click to upload a photo
          </p>
        )}
      </div>

      {loading && <p>Processing image, please wait...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {recipes && (
        <div style={{ marginTop: '20px' }}>
          <h2>Suggested Recipes:</h2>
          <pre>{recipes}</pre>
        </div>
      )}
    </div>
  );
}

export default ImageUploadBox;
