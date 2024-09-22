import logo from './logo.svg';
import './App.css';
import ImageUploadBox from './components/upload_component.jsx';
import foodBackground from './images/pennapps_img.jpg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={foodBackground} alt="Food background image" className="food-background"/>
        <p>
          Upload a pic of your fridge for some recipes!
        </p>
        <ImageUploadBox></ImageUploadBox>

      </header>
    </div>
  );
}

export default App;
