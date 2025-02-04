import React from "react";
import { Route, Routes } from "react-router-dom";

import SDK from "./pages/SDK";
import Home from "./pages/Home";
import SDKPage from "./pages/SDK/page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sdk" element={<SDK />} />
      <Route path="/sdk-frame" element={<SDKPage />} />
    </Routes>
  );
}

export default App;
