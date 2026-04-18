import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Key } from 'lucide-react';

const JwtDecoder = () => {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState('');

  const parseJwt = (t) => {
    try {
      const base64Url = t.split('.')[1];
      if (!base64Url) throw new Error('Invalid token format');
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      throw new Error('Failed to decode JWT');
    }
  };

  const handleDecode = (e) => {
    const val = e.target.value;
    setToken(val);
    if (!val.trim()) {
      setDecoded(null);
      setError('');
      return;
    }
    try {
      const payload = parseJwt(val);
      setDecoded(payload);
      setError('');
    } catch (err) {
      setError(err.message);
      setDecoded(null);
    }
  };

  return (
    <Card className="h-full border-white/5 relative overflow-hidden group">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-glow text-white/90">
          <Key className="w-5 h-5 text-primary" /> JWT Decoder
        </CardTitle>
        <p className="text-xs text-muted font-mono mt-2">Decode JSON Web Tokens instantly.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          value={token}
          onChange={handleDecode}
          placeholder="Paste JWT here..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-primary/50 transition-colors h-24 resize-none custom-scrollbar"
        />
        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
        {decoded && (
          <div className="bg-black/60 p-4 rounded-xl border border-white/10 overflow-auto max-h-48 custom-scrollbar">
            <pre className="text-xs text-tertiary font-mono break-all whitespace-pre-wrap">
              {JSON.stringify(decoded, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JwtDecoder;
