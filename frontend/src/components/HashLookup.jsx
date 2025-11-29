import React, {useState} from 'react';
export default function HashLookup(){
  const [hash, setHash] = useState('');
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  async function doLookup(){
    setLoading(true);
    const r = await fetch(`http://localhost:5000/api/files/${encodeURIComponent(hash)}`);
    setRes(await r.json());
    setLoading(false);
  }
  return (
    <div>
      <h2>Get file report by hash</h2>
      <input value={hash} onChange={e=>setHash(e.target.value)} placeholder="md5 | sha1 | sha256" style={{width:400}} />
      <button onClick={doLookup} disabled={loading || !hash}>Get report</button>
      <pre>{res ? JSON.stringify(res, null, 2) : 'No result'}</pre>
    </div>
  );
}
