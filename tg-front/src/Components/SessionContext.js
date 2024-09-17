import React, { createContext, useContext, useState, useEffect } from 'react';

// Creazione del contesto per la sessione
const SessionContext = createContext(undefined);

// Hook personalizzato per utilizzare il contesto della sessione
export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession deve essere utilizzato all\'interno di un SessionProvider');
    }
    return context;
}

// Provider per fornire il contesto della sessione ai componenti
export function SessionProvider({ children }) {
    // Inizializza il token dal sessionStorage se presente
    const [token, setToken] = useState(() => sessionStorage.getItem('token'));

    // Funzione per impostare il token di sessione
    const login = (newToken) => {
        setToken(newToken);
        sessionStorage.setItem('token', newToken); // Salva il token in sessionStorage
    };

    // Funzione per terminare la sessione
    const logout = () => {
        setToken(null);
        sessionStorage.removeItem('token'); // Rimuovi il token da sessionStorage
    };

    const isAuthenticated = !!token; // L'utente è autenticato se c'è un token

    return (
        <SessionContext.Provider value={{ token, login, logout, isAuthenticated }}>
            {children}
        </SessionContext.Provider>
    );
}
