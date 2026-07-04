const fs = require("fs");
const path = require("path");

const dir = __dirname;
const dataJs = fs.readFileSync(path.join(dir, "email-templates-data.js"), "utf8").trim();
const altJs = fs.readFileSync(path.join(dir, "email-alt-subjects-data.js"), "utf8").trim();
const logicJs = fs.readFileSync(path.join(dir, "email-prompt-library.embed.js"), "utf8").trim();
const js = dataJs + "\n\n" + altJs + "\n\n" + logicJs;

const sourceLines = fs.readFileSync(path.join(dir, "email-prompt-library.html"), "utf8").split(/\r?\n/);
const markup = sourceLines.slice(8, -5).join("\n");
const singleHead = sourceLines.slice(0, -5).join("\n");

const scriptUrl =
  "https://raw.githubusercontent.com/ShanuSaini/static-js-files/refs/heads/main/email-prompts-functions.js";
const scriptTag = '<script src="' + scriptUrl + '"></script>';

const embed = markup + "\n" + scriptTag + "\n";
const single = singleHead + "\n" + scriptTag + "\n</body>\n</html>\n";

const builderGuide = [
  "Email Template Library - builder install",
  "",
  "Recommended (single paste):",
  "Paste email-prompt-library-embed.html into your Custom HTML block.",
  "It loads JS from GitHub via an external script tag.",
  "",
  "Script URL:",
  scriptUrl,
  "",
  "Note: Upload email-templates-data.js + email-alt-subjects-data.js + email-prompt-library.embed.js combined as email-prompts-functions.js",
  "",
  "Fallback (if external script is blocked):",
  "1) Paste email-prompt-library-markup-only.html into Custom HTML",
  "2) Paste email-prompt-library-custom-js.js into Custom JS / Footer",
  "",
  "================================================================",
  "EMBED HTML (widget + external script)",
  "================================================================",
  "",
  embed,
  ""
].join("\n");

fs.writeFileSync(path.join(dir, "email-prompt-library-embed.html"), embed, "utf8");
fs.writeFileSync(path.join(dir, "email-prompt-library-markup-only.html"), markup + "\n", "utf8");
fs.writeFileSync(path.join(dir, "email-prompt-library-custom-js.js"), js + "\n", "utf8");
fs.writeFileSync(path.join(dir, "email-prompt-library-single.html"), single, "utf8");
fs.writeFileSync(path.join(dir, "email-prompt-library-for-builder.html"), builderGuide, "utf8");

console.log("custom-js lines:", js.split(/\n/).length);
console.log("embed lines:", embed.split(/\n/).length);
console.log("script url:", scriptUrl);
