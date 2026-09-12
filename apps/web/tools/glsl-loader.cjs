// Build-time GLSL minifier. Turbopack runs it on `*.glsl` imports (see
// next.config.ts) and the module exports the shader as a string. Bun and
// Turbopack leave template-literal contents alone, so without this every
// comment and indent in a shader ships to the browser.
//
// Deliberately conservative: comments and whitespace only, no identifier
// renaming, because uniform and attribute names are looked up from JS.

const PUNCT = /\s?([{}()[\];,])\s?/g;
const OP = "=<>!&|?:*/+\\-%^";
const WORD = "A-Za-z0-9_.";
const OP_WORD = new RegExp(`([${OP}]) ([${WORD}])`, "g");
const WORD_OP = new RegExp(`([${WORD}]) ([${OP}])`, "g");

function squeeze(code) {
  return code
    .replace(/\s+/g, " ")
    .replace(PUNCT, "$1")
    // Spaces between an operator and a word can go. Spaces between two
    // operators stay, so `a - -b` never becomes `a--b`.
    .replace(OP_WORD, "$1$2")
    .replace(WORD_OP, "$1$2")
    .trim();
}

function minifyGlsl(source) {
  const stripped = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
  const out = [];
  let buf = "";
  for (const raw of stripped.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) {
      // Preprocessor lines keep their own line.
      if (buf) out.push(squeeze(buf));
      buf = "";
      out.push(line.replace(/\s+/g, " "));
    } else {
      buf += (buf ? " " : "") + line;
    }
  }
  if (buf) out.push(squeeze(buf));
  return out.join("\n");
}

module.exports = function glslLoader(source) {
  return `export default ${JSON.stringify(minifyGlsl(String(source)))};`;
};
module.exports.minifyGlsl = minifyGlsl;
