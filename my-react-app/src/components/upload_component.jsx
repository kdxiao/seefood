import React, { useState } from 'react';
import axios from 'axios';
import foodBackground from '../images/pennapps_img.jpg';
import './upload_component.css';

const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [responseImg, setResponseImg] = useState("");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("image", selectedFile);

        setLoading(true);

        try {
            const res = await axios.post("/upload", formData);
            setResponse(res.data.recipe_suggestions);
            setResponseImg(res.data.recipe_img);
        } catch (error) {
            console.error("Error uploading the image:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setSelectedFile(null);
        setResponse("");
        setResponseImg("");
    };

    return (
        <div>
            {loading ? (
                <div className="loading-overlay">
                    <div className="loading-spinner">
                        <p>Loading...</p>
                    </div>
                </div>
            ) : response ? (
                <div>
                    <img src={responseImg} alt="Description of image" style={{ width: '200px', height: 'auto' }} />
                    <h3>Recipe Suggestion:</h3>
                    <div style={{ textAlign: 'center', padding: '0 20px' }}>
                        <p className="small-text">{response}</p>
                    </div>
                    <button className="styled-button" onClick={handleBack}>Back</button>
                </div>
            ) : (
                <div>
                    <img src={foodBackground} alt="Food background" className="food-background" />
                    <h1>Upload an Image for Recipe Suggestions</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <button type="submit" className="styled-button">Upload Image</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
