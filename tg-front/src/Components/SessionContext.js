import React, { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext(undefined);

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession deve essere utilizzato all\'interno di un SessionProvider');
    }
    return context;
}

export function SessionProvider({ children }) {
    const [token, setToken] = useState(() => sessionStorage.getItem('token'));
    const [clusterIdPrivate, setClusterIdPrivate] = useState(() => sessionStorage.getItem('cluster_id_private'));
    const [clusterIdPublic, setClusterIdPublic] = useState(() => sessionStorage.getItem('cluster_id_public'));

    const login = (newToken, newClusterIdPrivate, newClusterIdPublic) => {
        setToken(newToken);
        setClusterIdPrivate(newClusterIdPrivate);
        setClusterIdPublic(newClusterIdPublic);
        sessionStorage.setItem('token', newToken);
        sessionStorage.setItem('cluster_id_private', newClusterIdPrivate);
        sessionStorage.setItem('cluster_id_public', newClusterIdPublic);
    };

    const logout = () => {
        setToken(null);
        setClusterIdPrivate(null);
        setClusterIdPublic(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('cluster_id_private');
        sessionStorage.removeItem('cluster_id_public');
    };

    const isAuthenticated = !!token;

    return (
        <SessionContext.Provider value={{ token, clusterIdPrivate, clusterIdPublic, login, logout, isAuthenticated }}>
            {children}
        </SessionContext.Provider>
    );
}
