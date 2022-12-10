const fs = require("fs");
const coverageFinalFilename = "coverage-final.json";
const outputFile = process.argv[2] && process.argv[2] === "--outputFile" ? process.argv[3] : "report.json";
const cwd = process.cwd();
const reportJsonFilepath = `${cwd}/${outputFile}`;
const coverageFinalFilepath = `${cwd}/coverage/${coverageFinalFilename}`;
let reportJsonFile;
let coverageFinalJsonFile;
if (fs.existsSync(reportJsonFilepath)) {
  reportJsonFile = require(reportJsonFilepath);
}
if (fs.existsSync(coverageFinalFilepath)) {
  coverageFinalJsonFile = require(coverageFinalFilepath);
}
console.log("Files exists?", { outputFilename: !!reportJsonFile, coverageFinalFilename: !!coverageFinalJsonFile });
if (reportJsonFile && coverageFinalJsonFile) {
  if (!reportJsonFile.coverageMap) {
    console.log(`Adding coverageMap property to ${outputFile} based on ${coverageFinalFilename}`);
    reportJsonFile.coverageMap = coverageFinalJsonFile;
    fs.writeFileSync(reportJsonFilepath, JSON.stringify(reportJsonFile), err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  } else {
    console.log(`coverageMap already exists in ${outputFile}, not doing anything...`);
    process.exit(0);
  }
} else {
  console.log("Not doing anything...");
  process.exit(0);
}
