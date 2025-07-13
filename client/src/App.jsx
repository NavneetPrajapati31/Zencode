import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Button } from "./components/ui/button";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    </>
  );
}

export default App;
