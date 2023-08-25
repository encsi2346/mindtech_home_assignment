import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PokemonPage from "./pages/PokemonPage";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/home" element={<HomePage />}/>
                <Route path="/pokemon/:id" element={<PokemonPage />}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
