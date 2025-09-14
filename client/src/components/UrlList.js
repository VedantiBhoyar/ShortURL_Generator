import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

function UrlList({ token, userType }) {
    const [urls, setUrls] = useState([]);
    const [selectedStats, setSelectedStats] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState({});
    const [error, setError] = useState(null);
    const [qrCodes, setQrCodes] = useState({});

    const BASE_SHORT_URL = "http://localhost:3000/";

    // Fetch all URLs
    const fetchUrls = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${BASE_SHORT_URL}urls`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();

            const formattedUrls = data.map(item => ({
                id: item.id,
                short_code: item.shortId,
                long_url: item.originalUrl,
                creation_date: item.createdAt,
                expiration_date: item.expires_at,
                usage_count: item.clickCount,
                createdBy: item.createdBy,
            }));

            setUrls(formattedUrls);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Generate QR codes whenever URLs change
    useEffect(() => {
        const generateQRCodes = async () => {
            const qrCodeMap = {};
            for (const url of urls) {
                const shortUrl = `${BASE_SHORT_URL}${url.short_code}`;
                try {
                    const dataUrl = await QRCode.toDataURL(shortUrl);
                    qrCodeMap[url.short_code] = dataUrl;
                } catch (err) {
                    console.error('Failed to generate QR code for', shortUrl);
                }
            }
            setQrCodes(qrCodeMap);
        };

        if (urls.length > 0) {
            generateQRCodes();
        }
    }, [urls]);  // Runs after `urls` is set

    useEffect(() => {
        fetchUrls();
    }, []);

    const handleExpire = async (shortCode) => {
        const newExpiry = prompt("Enter new expiration date (YYYY-MM-DD)");
        if (!newExpiry) return;

        setActionLoading(prev => ({ ...prev, [shortCode]: true }));
        try {
            const res = await fetch(
                `http://localhost:3000/update/expiry/${shortCode}?expiry=${newExpiry}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            await fetchUrls();
        } catch {
            alert('Failed to update expiration.');
        } finally {
            setActionLoading(prev => ({ ...prev, [shortCode]: false }));
        }
    };

    const handleDelete = async (shortCode) => {
        setActionLoading(prev => ({ ...prev, [shortCode]: true }));
        try {
            const res = await fetch(`http://localhost:3000/delete/${shortCode}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            await fetchUrls();
        } catch {
            alert('Failed to delete URL.');
        } finally {
            setActionLoading(prev => ({ ...prev, [shortCode]: false }));
        }
    };

    const fetchStats = async (shortCode) => {
        setActionLoading(prev => ({ ...prev, [shortCode]: true }));
        try {
            const res = await fetch(`http://localhost:3000/stats/${shortCode}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            setSelectedStats({
                short_code: data.response.shortId,
                long_url: data.response.originalUrl,
                creation_date: data.response.createdAt,
                expiration_date: data.response.expires_at,
                usage_count: data.response.clickCount,
                user_agents: JSON.parse(data.response.user_agents || '[]'),
                ip_addresses: JSON.parse(data.response.ip_addresses || '[]'),
                createdBy: data.response.createdBy,
            });
            setShowStats(true);
        } catch {
            alert('Failed to fetch stats.');
        } finally {
            setActionLoading(prev => ({ ...prev, [shortCode]: false }));
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>URL Dashboard</h2>
            {error && <p style={styles.error}>{error}</p>}
            {loading ? (
                <p>Loading URLs...</p>
            ) : (
                <div style={styles.tableWrapper}>
                    {urls.map(url => (
                        <div key={url.id || url.short_code} style={styles.row}>
                            <div style={styles.info}>
                                <p>
                                    <strong>Short URL:</strong>{" "}
                                    <a
                                        href={`${BASE_SHORT_URL}${url.short_code}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={styles.link}
                                    >
                                        {BASE_SHORT_URL}{url.short_code}
                                    </a>
                                </p>

                                <p><strong>Created:</strong> {new Date(url.creation_date).toLocaleString()}</p>
                                <p><strong>Expires:</strong> {url.expiration_date ? new Date(url.expiration_date).toLocaleString() : 'N/A'}</p>
                                <p><strong>Clicks:</strong> {url.usage_count}</p>

                                <p><strong>QR Code:</strong></p>
                                {qrCodes[url.short_code] ? (
                                    <img
                                        src={qrCodes[url.short_code]}
                                        alt={`QR for ${BASE_SHORT_URL}${url.short_code}`}
                                        style={{ width: '128px', height: '128px', border: '1px solid #ddd' }}
                                    />
                                ) : (
                                    <p>Generating QR code...</p>
                                )}
                            </div>

                            {userType === 'Admin' && (
                                <div style={styles.actions}>
                                    <button
                                        onClick={() => handleExpire(url.short_code)}
                                        disabled={actionLoading[url.short_code]}
                                        style={{ ...styles.button, backgroundColor: '#ff9800' }}
                                    >
                                        Expire
                                    </button>
                                    <button
                                        onClick={() => handleDelete(url.short_code)}
                                        disabled={actionLoading[url.short_code]}
                                        style={{ ...styles.button, backgroundColor: '#f44336' }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => fetchStats(url.short_code)}
                                        disabled={actionLoading[url.short_code]}
                                        style={{ ...styles.button, backgroundColor: '#4caf50' }}
                                    >
                                        Stats
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showStats && selectedStats && (
                <div style={styles.modalBackdrop} onClick={() => setShowStats(false)}>
                    <div
                        style={styles.modalCard}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Stats for shortId {selectedStats.short_code}</h3>
                        <p><strong>Original URL:</strong> <a href={selectedStats.long_url} target="_blank" rel="noreferrer">{selectedStats.long_url}</a></p>
                        <p><strong>Clicks:</strong> {selectedStats.usage_count}</p>
                        <p><strong>Created:</strong> {new Date(selectedStats.creation_date).toLocaleString()}</p>
                        <p><strong>Expires:</strong> {selectedStats.expiration_date ? new Date(selectedStats.expiration_date).toLocaleString() : 'N/A'}</p>
                        <p><strong>User Agents:</strong> {selectedStats.user_agents.join(', ')}</p>
                        <p><strong>IP Addresses:</strong> {selectedStats.ip_addresses.join(', ')}</p>
                        <p><strong>Created By :</strong> {selectedStats.createdBy}</p>
                        <button onClick={() => setShowStats(false)} style={styles.closeButton}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: '900px', margin: '40px auto', fontFamily: 'Arial, sans-serif' },
    title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
    error: { color: 'red', textAlign: 'center' },
    tableWrapper: { display: 'flex', flexDirection: 'column', gap: '15px' },
    row: {
        display: 'flex',
        gap: '20px',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #ddd',
        backgroundColor: '#fafafa',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        alignItems: 'flex-start',
    },
    info: { flex: 1, minWidth: 0 },
    link: { color: '#1976d2', textDecoration: 'none' },
    actions: {
        width: '150px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    button: { padding: '10px', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    closeButton: { marginTop: '15px', padding: '10px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#1976d2', color: '#fff', cursor: 'pointer' },
    modalBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalCard: {
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '10px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    },
};

export default UrlList;
