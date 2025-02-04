const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.post("/", (req, res) => {
  const { code, language, inputData } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required." });
  }

  // Define file names and commands based on the language
  let fileName, compileCmd, runCmd, filePath;

  const timestamp = Date.now();
  filePath = path.join(__dirname, `${timestamp}`);

  if (language === "cpp") {
    fileName = path.join(filePath, "main.cpp");
    compileCmd = `g++ ${fileName} -o ${filePath}/main`;
    runCmd = `${filePath}/main`;
  } else if (language === "java") {
    fileName = path.join(filePath, "Main.java");
    compileCmd = `javac ${fileName}`;
    runCmd = `java -cp ${filePath} Main`;
  } else if (language === "python") {
    fileName = path.join(filePath, "main.py");
    runCmd = `python ${fileName}`;
  } else {
    return res.status(400).json({ error: "Unsupported language." });
  }

  fs.mkdir(filePath, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory:", err);
      return res.status(500).json({ error: "Error creating directory." });
    }

    // Write code to the file
    fs.writeFile(fileName, code, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).json({ error: "Error writing file." });
      }

      // If compilation is required (for C++ or Java), compile the code
      if (compileCmd) {
        exec(compileCmd, (err, stdout, stderr) => {
          if (err) {
            console.error("Compilation error:", stderr);
            return res.status(400).json({ error: stderr });
          }
          execute(runCmd);
        });
      } else {
        execute(runCmd);
      }
    });
  });

  // Function to execute the code and handle input
  function execute(cmd) {
    const process = exec(cmd, { encoding: 'utf8' });

    if (inputData) {
      // If there's input from the frontend, send it to the program's stdin
      process.stdin.write(inputData + '\n');  // Send input for C++ or Python
      process.stdin.end();
    }

    let output = '';
    process.stdout.on('data', (data) => {
      output += data;
    });

    process.stderr.on('data', (data) => {
      output += data;
    });

    process.on('close', (code) => {
      res.json({ output: output });

      // Clean up the generated files after execution
      cleanup(filePath);
    });
  }

  // Function to clean up the generated files
  function cleanup(directory) {
    fs.rm(directory, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error("Error cleaning up files:", err);
      } else {
        console.log("Files cleaned up successfully.");
      }
    });
  }
});

module.exports = router;
