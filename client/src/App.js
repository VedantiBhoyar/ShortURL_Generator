import React, { useState } from 'react';
import Login from './Login';
import UrlList from './components/UrlList';
import AddUrl from './components/AddUrl';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userType, setUserType] = useState(localStorage.getItem('userType'));

    const handleLogin = (jwtToken, userType) => {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('userType', userType);
        setToken(jwtToken);
        setUserType(userType);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setToken(null);
        setUserType(null);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
                {userType === 'Admin' ? 'Admin Dashboard' : 'User Dashboard'}
            </h1>

            {token ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <AddUrl token={token} />

                        <button
                            onClick={handleLogout}
                            style={{
                                height: '40px',
                                background: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                    <UrlList token={token} userType={userType} />
                </>
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;
