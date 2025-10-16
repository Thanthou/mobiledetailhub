// scripts/find-free-port.js
import net from "net";
import fs from "fs";

const basePort = 5175;
const maxTries = 10;

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once("error", (err) => {
        console.log(`⚠️ Port ${port} in use: ${err.code}`);
        resolve(false);
      })
      .once("listening", () => {
        server.close(() => {
          console.log(`🟢 Port ${port} is free`);
          resolve(true);
        });
      })
      .listen(port, '0.0.0.0');
  });
}

(async () => {
  let port = basePort;
  for (let i = 0; i < maxTries; i++) {
    const free = await checkPort(port);
    if (free) {
      fs.writeFileSync(".frontend-port.json", JSON.stringify({ port }));
      console.log(`🟢 Using port ${port}`);
      process.exit(0);
    }
    port++;
  }

  console.error(`❌ No free port found between ${basePort} and ${basePort + maxTries}`);
  process.exit(1);
})();
