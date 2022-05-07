const watch = require("node-watch");
const { exec } = require("child_process");

const run = () => {
  
  exec("npx gulp less", function (error, stdout, stderr) {
    
    if (error) {}
    if (stderr) {}
  });
};


watch("./src/themes", { recursive: true }, function (evt, name) {
  
  run();
});
run();
