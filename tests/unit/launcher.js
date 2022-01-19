require("dotenv").config();
const { spawn } = require("child_process");

const NODE_PORT = 8545;
const NODE_HOST = "127.0.0.1";
const FORK_BLOCK = 13377190;
// Fork network
console.log("Starting Hardhat");
const app_node = spawn("npx", [
  "hardhat",
  "node",
  "--fork",
  "https://eth-mainnet.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
  "--fork-block-number",
  FORK_BLOCK,
  "--hostname",
  NODE_HOST,
  "--port",
  NODE_PORT,
]);

app_node.stdout.on("data", data => {
  // console.log(`${data}`); // Uncomment this to see hardhat logging
  // Launch tests
  if (data.includes("Account #19")) {
    console.log("Starting Tests");
    process.env["REACT_APP_SELF_HOSTED_NODE"] = `http://${NODE_HOST}:${NODE_PORT}`;
    const app_test = spawn("npx", ["react-scripts", "test"].concat(process.argv.slice(2)));
    app_test.stdout.on("data", data => {
      console.error(`${data}`);
    });
    app_test.stderr.on("data", data => {
      console.error(`${data}`);
    });
    app_test.on("close", code => {
      console.log(`Tests ended with code ${code}`);
      process.exit(code);
    });
  }
});

app_node.stderr.on("data", data => {
  console.error(`${data}`);
});

app_node.on("close", code => {
  console.log(`Network fork ended with code ${code}`);
});