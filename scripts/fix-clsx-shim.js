const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "node_modules", "clsx", "dist");
const source = path.join(distDir, "clsx.mjs");
const target = path.join(distDir, "clsx.m.js");

try {
  if (fs.existsSync(source) && !fs.existsSync(target)) {
    fs.copyFileSync(source, target);
    console.log("postinstall: created clsx compatibility shim (clsx.m.js)");
  }
} catch (error) {
  console.warn("postinstall: unable to create clsx shim:", error.message);
}
