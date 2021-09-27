require("dotenv").config();
const { spawn } = require("child_process");

const args = ["synpress", "run"].concat(process.argv.slice(2));
const app = spawn("yarn", args);

app.stdout.on("data", data => {
  console.log(`${data}`);
});

app.stderr.on("data", data => {
  console.error(`${data}`);
});
