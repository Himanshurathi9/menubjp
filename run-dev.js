const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = fs.openSync(path.join(__dirname, 'dev.log'), 'a');
const logStream = fs.createWriteStream(path.join(__dirname, 'dev.log'), { flags: 'a' });

function startServer() {
  const child = spawn('node', [path.join(__dirname, 'node_modules/.bin/next'), 'dev', '-p', '3000'], {
    detached: true,
    stdio: ['ignore', logFile, logFile],
    env: { ...process.env }
  });
  
  child.unref();
  logStream.write(`\n[${new Date().toISOString()}] Dev server started (PID: ${child.pid})\n`);
  
  child.on('exit', (code) => {
    logStream.write(`\n[${new Date().toISOString()}] Dev server exited (code: ${code}), restarting in 3s...\n`);
    setTimeout(startServer, 3000);
  });
}

startServer();
