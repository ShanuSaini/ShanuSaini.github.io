const fs = require("fs");
const path = require("path");

const dir = __dirname;
const js = fs.readFileSync(path.join(dir, "linkedin-prompt-library.embed.js"), "utf8").trim();
const sourceLines = fs.readFileSync(path.join(dir, "linkedin-prompt-library.html"), "utf8").split(/\r?\n/);
const markup = sourceLines.slice(8, 975).join("\n");
const singleHead = sourceLines.slice(0, 976).join("\n");

const scriptUrl =
  "https://raw.githubusercontent.com/ShanuSaini/static-js-files/refs/heads/main/linkedin-prompts-functions.js";
const scriptTag =
  '<script src="' + scriptUrl + '"></script>';

const embed = markup + "\n" + scriptTag + "\n";
const single = singleHead + "\n" + scriptTag + "\n</body>\n</html>\n";

const builderGuide = [
  "LinkedIn Prompt Library - builder install",
  "",
  "Recommended (single paste):",
  "Paste linkedin-prompt-library-embed.html into your Custom HTML block.",
  "It loads JS from GitHub via an external script tag.",
  "",
  "Script URL:",
  scriptUrl,
  "",
  "Fallback (if external script is blocked):",
  "1) Paste linkedin-prompt-library-markup-only.html into Custom HTML",
  "2) Paste linkedin-prompt-library-custom-js.js into Custom JS / Footer",
  "",
  "================================================================",
  "EMBED HTML (widget + external script)",
  "================================================================",
  "",
  embed,
  ""
].join("\n");

fs.writeFileSync(path.join(dir, "linkedin-prompt-library-embed.html"), embed, "utf8");
fs.writeFileSync(path.join(dir, "linkedin-prompt-library-markup-only.html"), markup + "\n", "utf8");
fs.writeFileSync(path.join(dir, "linkedin-prompt-library-custom-js.js"), js + "\n", "utf8");
fs.writeFileSync(path.join(dir, "linkedin-prompt-library-single.html"), single, "utf8");
fs.writeFileSync(path.join(dir, "linkedin-prompt-library-for-builder.html"), builderGuide, "utf8");

console.log("embed lines:", embed.split(/\n/).length);
console.log("script url:", scriptUrl);
