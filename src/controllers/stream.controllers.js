const fs = require("fs");
const path = require("path");

const readLogsStream = fs.createReadStream(path.join(__dirname, "..", "logs", "accessLogs.log"), {encoding: "utf-8"});
const writeFileStream = fs.createWriteStream(path.join(__dirname, "fichier.txt"))

// readLogsStream.on("data", (chunk)=> {
//   console.log("Data: ", chunk)
// })

// readLogsStream.on("end", ()=> {
//   console.log("Lecture de fichiers termine")
// })

readLogsStream.pipe(writeFileStream)
