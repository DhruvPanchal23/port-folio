const http = require('http');

http.get('http://localhost:3001/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    let index = 0;
    while (true) {
      const idx = data.toLowerCase().indexOf('error', index);
      if (idx === -1) break;
      console.log(`Match at ${idx}: ...${data.slice(Math.max(0, idx - 40), Math.min(data.length, idx + 40))}...`);
      index = idx + 5;
    }
  });
});
