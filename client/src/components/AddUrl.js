// components/AddUrl.js
import React, { useState } from 'react';

function AddUrl({ token }) {
    const [originalUrl, setLongUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!originalUrl) return alert('Enter a valid URL');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/shorturl', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ originalUrl })
            });

            if (!res.ok) throw new Error('Failed to shorten URL');

            const data = await res.json();
            alert(`Short URL created: ${data.shortUrl}`);
            setLongUrl('');
        } catch (err) {
            console.error(err);
            alert('Error creating short URL');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            <input 
                type="text" 
                placeholder="Enter long URL" 
                value={originalUrl} 
                onChange={(e) => setLongUrl(e.target.value)}
                style={{ padding: '8px', flex: 1, borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button 
                onClick={handleAdd} 
                disabled={loading} 
                style={{ padding: '8px 16px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                {loading ? 'Creating...' : 'Shorten URL'}
            </button>
        </div>
    );
}

export default AddUrl;
