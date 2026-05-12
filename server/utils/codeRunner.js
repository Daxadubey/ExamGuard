const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const runCode = (language, code, input) => {
  return new Promise((resolve) => {
    const fileName = `temp_${Date.now()}`;
    const filePath = path.join(__dirname, `${fileName}`);

    let command = "";

    try {
      // Write code to file
      if (language === "python") {
        fs.writeFileSync(`${filePath}.py`, code);
        command = `python ${filePath}.py`;
      } else if (language === "c") {
        fs.writeFileSync(`${filePath}.c`, code);
        command = `gcc ${filePath}.c -o ${filePath}.out && ${filePath}.out`;
      } else if (language === "cpp") {
        fs.writeFileSync(`${filePath}.cpp`, code);
        command = `g++ ${filePath}.cpp -o ${filePath}.out && ${filePath}.out`;
      } else if (language === "java") {
        fs.writeFileSync(`${filePath}.java`, code);
        command = `javac ${filePath}.java && java ${fileName}`;
      }

      const process = exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) {
          resolve({ error: stderr || error.message });
        } else {
          resolve({ output: stdout.trim() });
        }

        // Cleanup
        try {
          fs.unlinkSync(`${filePath}.${language}`);
        } catch {}
      });

      if (input) {
        process.stdin.write(input);
        process.stdin.end();
      }

    } catch (err) {
      resolve({ error: err.message });
    }
  });
};

module.exports = runCode;