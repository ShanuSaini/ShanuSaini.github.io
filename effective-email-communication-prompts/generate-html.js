const fs = require("fs");
const path = require("path");

const dir = __dirname;
const src = fs.readFileSync(
  path.join(dir, "..", "linkedIn-content-prompts", "linkedin-prompt-library.html"),
  "utf8"
);

let html = src
  .replace(/LinkedIn Prompt Library/g, "Email Prompt Library")
  .replace(/linkedinPromptLibrary/g, "emailPromptLibrary")
  .replace(/lpPromptLibrary/g, "eePromptLibrary")
  .replace(/data-lp-ready/g, "data-ee-ready")
  .replace(/\blp-/g, "ee-")
  .replace(/--lp-/g, "--ee-")
  .replace(/@keyframes lpCopied/g, "@keyframes eeCopied")
  .replace(/#0a66c2/g, "#0d9488")
  .replace(/#2878ff/g, "#14b8a6")
  .replace(/#2f8cff/g, "#2dd4bf")
  .replace(/#075fc4/g, "#0f766e")
  .replace(/#126de0/g, "#0d9488")
  .replace(/#0866ff/g, "#0d9488")
  .replace(/#6258ff, #0268d8/g, "#0d9488, #14b8a6")
  .replace(
    /LinkedIn Content <span>Prompts<\/span>/g,
    "Effective Email <span>Prompts</span>"
  )
  .replace(
    /Generate sharper LinkedIn posts from one topic\./g,
    "Write polished professional emails for any situation."
  )
  .replace(
    /Enter a topic, choose a content angle and tone, then copy a ready-to-use prompt for your favorite AI writing tool\./g,
    "Describe your situation, choose a category and tone, then copy a ready-to-use prompt for your favorite AI writing tool."
  )
  .replace(/<div class="ee-mark">in<\/div>/g, '<div class="ee-mark">@</div>')
  .replace(/<div class="ee-mini-in">in<\/div>/g, '<div class="ee-mini-in">@</div>')
  .replace(
    /aria-label="LinkedIn prompt generator"/g,
    'aria-label="Email prompt generator"'
  )
  .replace(/for="lpTopic"/g, 'for="eeContext"')
  .replace(/id="lpTopic"/g, 'id="eeContext"')
  .replace(/#lpTopic/g, "#eeContext")
  .replace(/for="lpCategory"/g, 'for="eeCategory"')
  .replace(/id="lpCategory"/g, 'id="eeCategory"')
  .replace(/#lpCategory/g, "#eeCategory")
  .replace(/for="lpTone"/g, 'for="eeTone"')
  .replace(/id="lpTone"/g, 'id="eeTone"')
  .replace(/#lpTone/g, "#eeTone")
  .replace(/id="lpPromptList"/g, 'id="eePromptList"')
  .replace(/#lpPromptList/g, "#eePromptList")
  .replace(/id="lpShowMore"/g, 'id="eeShowMore"')
  .replace(/id="lpGenerate"/g, 'id="eeGenerate"')
  .replace(/id="lpClear"/g, 'id="eeClear"')
  .replace(
    /<label for="eeContext">Topic<\/label>/g,
    '<label for="eeContext">Situation</label>'
  )
  .replace(
    /value="AI tools for small business owners"/g,
    'value="requesting a promotion discussion with my manager"'
  )
  .replace(
    /placeholder="e.g. hiring lessons, email marketing, remote leadership"/g,
    'placeholder="e.g. follow-up after a conference, salary review request, client delay"'
  )
  .replace(
    /<strong>Tip:<\/strong> For better output, replace vague topics with a specific audience, situation, or lesson. Example: "how solo consultants can use AI to qualify inbound leads."/g,
    '<strong>Tip:</strong> Be specific about who you are emailing, the relationship, and the desired outcome. Example: "follow-up with a prospect I met at SaaStr after they asked about pricing."'
  )
  .replace(/Show 8 More Prompts/g, "Show 26 More Prompts");

const catNew = `<select id="eeCategory">
              <option value="any">Any</option>
              <option value="career_growth">Career growth</option>
              <option value="personal_branding">Personal branding</option>
              <option value="networking">Networking</option>
              <option value="leadership">Leadership</option>
              <option value="opportunity">Opportunity</option>
              <option value="reputation">Reputation</option>
              <option value="prospecting">Prospecting &amp; lead generation</option>
              <option value="client_management">Project &amp; client management</option>
              <option value="money_matters">Money matters</option>
              <option value="relationships">Building relationships</option>
              <option value="conflict_resolution">Conflict resolution</option>
              <option value="influence">Influence building</option>
            </select>`;

html = html.replace(/<select id="eeCategory">[\s\S]*?<\/select>/, catNew);

const cards = [
  {
    n: 1,
    title: "Promotion Discussion Request",
    tag: "Career Growth",
    desc: "Ask your manager for a promotion conversation with confidence and clarity.",
    text:
      "Write a professional email asking my manager for a promotion discussion about requesting a promotion discussion with my manager. Open with appreciation for recent wins, briefly summarize my contributions and impact, and request a dedicated meeting to discuss growth and next steps. Include a clear subject line. Use a professional tone."
  },
  {
    n: 2,
    title: "Request Additional Responsibilities",
    tag: "Career Growth",
    desc: "Signal readiness for stretch work without overstepping.",
    text:
      "Write a professional email requesting additional responsibilities related to requesting a promotion discussion with my manager. Explain why I am ready, what value I can add, and how this aligns with team goals. Propose 1-2 specific areas where I can contribute more. Use a professional tone."
  },
  {
    n: 3,
    title: "Salary Review Request",
    tag: "Career Growth",
    desc: "Ask for a salary review professionally and factually.",
    text:
      "Write a professional email requesting a salary review regarding requesting a promotion discussion with my manager. Reference my contributions, market context, and tenure without being demanding. Request a conversation to discuss compensation alignment. Include a subject line and a respectful close. Use a professional tone."
  },
  {
    n: 4,
    title: "Mentorship Request",
    tag: "Career Growth",
    desc: "Request mentorship from an industry expert respectfully.",
    text:
      "Write a professional email requesting mentorship from an industry expert about requesting a promotion discussion with my manager. Explain why I admire their work, what I hope to learn, and propose a low-commitment format (e.g., one 20-minute call). Make it easy to say yes or no. Use a professional tone."
  }
];

function cardMarkup(c) {
  return `<article class="ee-prompt-card">
          <div class="ee-number">${c.n}</div>
          <div class="ee-card-main">
            <div class="ee-card-head">
              <h3>${c.title}</h3>
              <span class="ee-pill">${c.tag}</span>
            </div>
            <p class="ee-card-desc">${c.desc}</p>
            <div class="ee-prompt-text">
              <span class="ee-quote">&quot;</span>
              ${c.text}
            </div>
          </div>
          <div class="ee-card-actions">
            <button class="ee-copy" type="button" aria-label="Copy prompt">
              <svg class="ee-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
              <span>Copy</span>
            </button>
            <button class="ee-toggle" type="button" aria-label="Collapse prompt">
              <svg class="ee-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 15l-6-6-6 6"></path></svg>
            </button>
          </div>
        </article>`;
}

const listNew =
  `<div class="ee-list" id="eePromptList" aria-live="polite">\n        ` +
  cards.map(cardMarkup).join("\n\n        ") +
  `\n      </div>\n\n      <div class="ee-show-wrap">`;

html = html.replace(
  /<div class="ee-list" id="eePromptList"[\s\S]*?<div class="ee-show-wrap">/,
  listNew
);

html = html.replace(
  /\s*<script src="data:text\/javascript[\s\S]*?<\/script>/,
  '\n  <script src="email-prompt-library-custom-js.js"></script>'
);

html = html.replace(/ee-float-chat/g, "ee-float-mail");
html = html.replace(/ee-float-comment/g, "ee-float-reply");
html = html.replace(/ee-float-growth/g, "ee-float-send");

fs.writeFileSync(path.join(dir, "email-prompt-library.html"), html, "utf8");
console.log("Generated email-prompt-library.html");
