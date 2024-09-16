import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Pages/Login";
import Drive from "./Pages/Drive2";
import { Toaster } from "sonner";
import { SessionProvider } from './Components/SessionContext';

function App() {
    return (
        <SessionProvider>
            <Router>
                <div>
                    <Toaster position={"bottom-center"} richColors />
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/drive" element={<Drive />} />
                    </Routes>
                </div>
            </Router>
        </SessionProvider>
    );
}

export default App;
