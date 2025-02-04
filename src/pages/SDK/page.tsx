import "../../styles/global.css";
import "./styles.css";

function SDKPage() {
  return (
    <iframe
      allow="fullscreen;camera;geolocation"
      allowFullScreen
      src="http://localhost:3050/sdk"
      style={{ width: "100vw", height: "100vh", border: "none" }}
    ></iframe>
  );
}

export default SDKPage;
