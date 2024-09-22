import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // Send the image to the backend
      console.log(formData);
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Display the response from the server (e.g., recipe suggestions)
      setResponse(res.data);
    } catch (error) {
        console.log("SPONGEBOB");
        console.error("Error uploading the image:", error);
    }
  };

  return (
    <div>
      <h1>Upload an Image for Recipe Suggestions</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload Image</button>
      </form>

      {response && <div><h3>Recipe Suggestions:</h3><p>{response}</p></div>}
    </div>
  );
};

export default ImageUpload;
