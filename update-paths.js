const fs = require("fs/promises");
const path = require("path");

async function getFiles(dir, exts) {
  let files = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const d of list) {
      if (d.name.startsWith("node_modules") || d.name.startsWith(".next"))
        continue;
      const res = path.resolve(dir, d.name);
      if (d.isDirectory()) {
        files = files.concat(await getFiles(res, exts));
      } else {
        if (exts.some((ext) => res.endsWith(ext))) {
          files.push(res);
        }
      }
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(err);
    }
  }
  return files;
}

async function run() {
  const dirsToScan = ["app", "components", "lib"];
  const exts = [".ts", ".tsx", ".js", ".jsx"];

  for (const dir of dirsToScan) {
    const absDir = path.resolve(__dirname, dir);
    const files = await getFiles(absDir, exts);

    for (const file of files) {
      const content = await fs.readFile(file, "utf8");

      // We want to replace all occurrences of "/doces/" with "/"
      // and "/doces" (if it's an exact href or at end of string) with "/"
      // Regex replace:
      let newContent = content.replace(/"\/doces\//g, '"/');
      newContent = newContent.replace(/'\/doces\//g, "'/");
      newContent = newContent.replace(/`\/doces\//g, "`/");

      // Exact matches for endpoints
      newContent = newContent.replace(/"\/doces"/g, '"/"');
      newContent = newContent.replace(/'\/doces'/g, "'/'");
      newContent = newContent.replace(/`\/doces`/g, '`/"');

      if (newContent !== content) {
        await fs.writeFile(file, newContent, "utf8");
        console.log(`Updated ${file}`);
      }
    }
  }

  // Attempt to remove app/doces again, node can sometimes force delete even if locked by IDE
  try {
    await fs.rm(path.resolve(__dirname, "app/doces"), {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 1000,
    });
    console.log("Successfully removed app/doces directory");
  } catch (e) {
    console.error("Failed to remove app/doces: " + e.message);
  }
}

run();
