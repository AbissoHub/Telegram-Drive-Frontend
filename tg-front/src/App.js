import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Pages/Login";
import Drive from "./Pages/Login2.tsx";
import { Toaster } from "sonner";

function App() {
    return (
        <Router>
            <div>
                <Toaster position={"bottom-center"} richColors/>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/drive" element={<Drive />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
