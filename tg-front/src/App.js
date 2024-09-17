import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from "./Pages/Login";
import Drive from "./Pages/Drive2";
import { Toaster } from "sonner";
import { SessionProvider, useSession } from './Components/SessionContext';

const BASE_URL = 'http://0.0.0.0:5000';

function App() {
    const { token } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        } else {
            navigate('/drive');
        }
    }, [token, navigate]);

    return (
        <div>
            <Toaster position={"bottom-center"} richColors />
            <Routes>
                <Route path="/" element={<Login baseUrl={BASE_URL} />} />
                <Route path="/drive" element={<Drive />} />
            </Routes>
        </div>
    );
}

function AppWithProvider() {
    return (
        <SessionProvider>
            <Router>
                <App />
            </Router>
        </SessionProvider>
    );
}

export default AppWithProvider;
