(function () {
      window.lpPromptLibrary_start = function () {
        var root = document.getElementById("linkedinPromptLibrary");
        if (!root || root.getAttribute("data-lp-ready") === "true") {
          return;
        }
        root.setAttribute("data-lp-ready", "true");

        var topicInput = root.querySelector("#lpTopic");
        var categorySelect = root.querySelector("#lpCategory");
        var toneSelect = root.querySelector("#lpTone");
        var list = root.querySelector("#lpPromptList");
        var showMore = root.querySelector("#lpShowMore");
        var injectButton = root.querySelector("#lpGenerate");
        var clearButton = root.querySelector("#lpClear");
        var expandedList = false;

        var categories = {
          any: "Storytelling",
          professional_advice: "Professional Advice",
          explanation_analysis: "Analysis",
          personal_story: "Storytelling",
          personal_opinion: "Thought Leadership",
          case_study_client: "Client Case Study",
          case_study_personal: "Personal Case Study",
          list_of_tips: "Educational"
        };

        var categoryDirection = {
          any: "Choose the strongest LinkedIn angle for this topic.",
          professional_advice: "Frame it as practical advice from an experienced professional.",
          explanation_analysis: "Explain the idea clearly, then analyze why it matters now.",
          personal_story: "Make it feel like a credible first-person story with a lesson.",
          personal_opinion: "Give it a clear point of view that invites thoughtful discussion.",
          case_study_client: "Use a client-style case study without inventing confidential details.",
          case_study_personal: "Use a personal case study with before, action, and after moments.",
          list_of_tips: "Make it a structured list of useful, specific tips."
        };

        var prompts = [
          {
            title: "Problem-Agitate-Solution",
            tag: "Storytelling",
            desc: "Highlight a common challenge, its impact, and how the right move helps solve it.",
            text: "Write a LinkedIn post using the Problem-Agitate-Solution framework about [TOPIC]. Start with a relatable problem, explain why it matters, and end with how the solution can help the reader save time, reduce stress, or grow. Use a [TONE] tone."
          },
          {
            title: "Listicle / Tips",
            tag: "Educational",
            desc: "Share a list of actionable tips or tools in a structured format.",
            text: "Write a LinkedIn post with a list of 5 practical tips about [TOPIC]. Keep each tip specific, useful, and easy to apply. Add a short intro, use clear formatting, and end with one question that invites comments. Use a [TONE] tone."
          },
          {
            title: "Before-After-Bridge",
            tag: "Transformation",
            desc: "Show a transformation from struggle to success.",
            text: "Write a LinkedIn post showing the before and after of [TOPIC]. Highlight the bridge that made the transformation possible. Make the change feel realistic, not exaggerated, and keep the tone [TONE]."
          },
          {
            title: "Myth vs Fact",
            tag: "Thought Leadership",
            desc: "Address a common misconception and provide the truth.",
            text: "Write a LinkedIn post debunking a common myth about [TOPIC]. Present the myth, explain the fact, and share the real benefit or lesson readers should remember. Use a [TONE] tone."
          },
          {
            title: "Personal Lesson",
            tag: "Personal Story",
            desc: "Turn the topic into a relatable lesson from experience.",
            text: "Write a first-person LinkedIn post about [TOPIC]. Open with a specific moment, explain what changed your thinking, and close with the lesson you would share with someone one step behind you. Keep it [TONE]."
          },
          {
            title: "Contrarian Angle",
            tag: "Opinion",
            desc: "Challenge a common belief with nuance.",
            text: "Write a LinkedIn post about [TOPIC] with a thoughtful contrarian angle. State the common belief, explain where it falls short, and give a more useful perspective. Use a [TONE] tone and avoid being provocative just for attention."
          },
          {
            title: "Client Case Snapshot",
            tag: "Case Study",
            desc: "Show context, challenge, approach, and result.",
            text: "Create a LinkedIn client case study post about [TOPIC]. Use this structure: context, challenge, approach, result, and lesson. Do not invent numbers or confidential details. Use a [TONE] tone."
          },
          {
            title: "Framework Builder",
            tag: "How-To",
            desc: "Teach a simple repeatable method.",
            text: "Write a LinkedIn post teaching a simple framework for [TOPIC]. Give the framework a short name, break it into 3 to 5 steps, and include one example of how a professional would use it. Keep the tone [TONE]."
          },
          {
            title: "Debate Starter",
            tag: "Conversation",
            desc: "Invite thoughtful comments without rage bait.",
            text: "Write a LinkedIn post about [TOPIC] that starts a respectful debate. Present two sides fairly, explain your view, include one caveat, and close with a question that is easy to answer. Use a [TONE] tone."
          },
          {
            title: "Checklist Post",
            tag: "Save-Worthy",
            desc: "Create a post people want to save.",
            text: "Create a LinkedIn checklist post about [TOPIC]. Start with who the checklist is for, then provide 8 concise checklist items that begin with action verbs. Add the biggest mistake to avoid. Use a [TONE] tone."
          },
          {
            title: "Executive Observation",
            tag: "Authority",
            desc: "Open with a sharp business insight.",
            text: "Write a LinkedIn post about [TOPIC]. Open with a sharp executive-level observation, explain the hidden mistake most people make, and give 3 recommendations with short examples. Use a [TONE] tone."
          },
          {
            title: "Simple Explanation",
            tag: "Analysis",
            desc: "Make a complex idea feel clear.",
            text: "Create a LinkedIn post that explains [TOPIC] in simple terms. Start with why people are confused, explain the idea in plain language, then show one practical example. Keep the tone [TONE]."
          }
        ];

        function lpPromptLibrary_escapeHtml(value) {
          return String(value).replace(/[&<>"']/g, function (character) {
            var map = {
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#039;"
            };
            return map[character];
          });
        }

        function lpPromptLibrary_currentTopic() {
          var value = topicInput.value.replace(/^\s+|\s+$/g, "");
          return value || "your topic";
        }

        function lpPromptLibrary_selectedTone() {
          return toneSelect.options[toneSelect.selectedIndex].text.toLowerCase();
        }

        function lpPromptLibrary_selectedCategoryTag(item) {
          if (categorySelect.value === "any") {
            return item.tag;
          }
          return categories[categorySelect.value] || item.tag;
        }

        function lpPromptLibrary_buildPrompt(item) {
          var prompt = item.text.split("[TOPIC]").join(lpPromptLibrary_currentTopic());
          prompt = prompt.split("[TONE]").join(lpPromptLibrary_selectedTone());
          prompt += " Category direction: " + categoryDirection[categorySelect.value];
          return prompt;
        }

        function lpPromptLibrary_copyText(value, done) {
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(value).then(done, done);
            return;
          }

          var textarea = document.createElement("textarea");
          textarea.value = value;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand("copy");
          } catch (error) {}
          document.body.removeChild(textarea);
          done();
        }

        function lpPromptLibrary_cardHtml(item, index, promptText) {
          var hiddenClass = !expandedList && index > 3 ? " is-hidden" : "";
          return ''
            + '<article class="lp-prompt-card is-collapsed' + hiddenClass + '">'
            + '<div class="lp-number">' + (index + 1) + '</div>'
            + '<div class="lp-card-main">'
            + '<div class="lp-card-head">'
            + '<h3>' + lpPromptLibrary_escapeHtml(item.title) + '</h3>'
            + '<span class="lp-pill">' + lpPromptLibrary_escapeHtml(lpPromptLibrary_selectedCategoryTag(item)) + '</span>'
            + '</div>'
            + '<p class="lp-card-desc">' + lpPromptLibrary_escapeHtml(item.desc) + '</p>'
            + '<div class="lp-card-details">'
            + '<div class="lp-prompt-text" data-prompt-text="' + lpPromptLibrary_escapeHtml(promptText) + '">'
            + '<span class="lp-quote">&quot;</span>'
            + lpPromptLibrary_escapeHtml(promptText)
            + '</div>'
            + '</div>'
            + '</div>'
            + '<div class="lp-card-actions">'
            + '<button class="lp-copy" type="button" aria-label="Copy prompt">'
            + '<svg class="lp-icon lp-copy-symbol" viewBox="0 0 24 24" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>'
            + '<span>Copy</span>'
            + '</button>'
            + '<button class="lp-toggle" type="button" aria-label="Expand prompt">'
            + '<svg class="lp-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 15l-6-6-6 6"></path></svg>'
            + '</button>'
            + '</div>'
            + '</article>';
        }

        function lpPromptLibrary_bindCardActions() {
          var cards = list.querySelectorAll(".lp-prompt-card");
          for (var i = 0; i < cards.length; i += 1) {
            (function (card) {
              var toggle = card.querySelector(".lp-toggle");
              var copy = card.querySelector(".lp-copy");
              var promptBox = card.querySelector(".lp-prompt-text");
              if (toggle) {
                toggle.onclick = function () {
                  if (card.className.indexOf("is-collapsed") === -1) {
                    card.className += " is-collapsed";
                    toggle.setAttribute("aria-label", "Expand prompt");
                  } else {
                    card.className = card.className.replace(/\s?is-collapsed/g, "");
                    toggle.setAttribute("aria-label", "Collapse prompt");
                  }
                };
              }
              if (copy && promptBox) {
                copy.onclick = function () {
                  var label = copy.querySelector("span");
                  var icon = copy.querySelector(".lp-copy-symbol");
                  var promptValue = promptBox.getAttribute("data-prompt-text");
                  var promptClone;
                  var quote;
                  if (!promptValue) {
                    promptClone = promptBox.cloneNode(true);
                    quote = promptClone.querySelector(".lp-quote");
                    if (quote) {
                      quote.parentNode.removeChild(quote);
                    }
                    promptValue = (promptClone.textContent || "").replace(/^\s+|\s+$/g, "");
                  }
                  lpPromptLibrary_copyText(promptValue, function () {
                    if (icon) {
                      icon.innerHTML = '<path d="M20 6L9 17l-5-5"></path>';
                    }
                    if (label) {
                      label.innerHTML = "Copied!";
                    }
                    copy.className = copy.className.replace(/\s?is-copied/g, "") + " is-copied";
                    setTimeout(function () {
                      if (icon) {
                        icon.innerHTML = '<rect width="14" height="14" x="8" y="8" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>';
                      }
                      if (label) {
                        label.innerHTML = "Copy";
                      }
                      copy.className = copy.className.replace(/\s?is-copied/g, "");
                    }, 1300);
                  });
                };
              }
            })(cards[i]);
          }
        }

        function lpPromptLibrary_render() {
          var activeTopic = lpPromptLibrary_currentTopic();
          var html = "";
          var i;

          for (i = 0; i < prompts.length; i += 1) {
            html += lpPromptLibrary_cardHtml(prompts[i], i, lpPromptLibrary_buildPrompt(prompts[i]));
          }

          list.innerHTML = html;
          showMore.style.display = prompts.length > 4 ? "inline-flex" : "none";
          showMore.querySelector("span").innerHTML = expandedList ? "Show Fewer Prompts" : "Show 8 More Prompts";
          lpPromptLibrary_bindCardActions();
        }

        injectButton.onclick = function () {
          expandedList = false;
          lpPromptLibrary_render();
        };

        clearButton.onclick = function () {
          topicInput.value = "";
          categorySelect.value = "any";
          toneSelect.value = "professional";
          expandedList = false;
          lpPromptLibrary_render();
          topicInput.focus();
        };

        showMore.onclick = function () {
          expandedList = !expandedList;
          lpPromptLibrary_render();
        };

        lpPromptLibrary_bindCardActions();
      };

      function lpPromptLibrary_boot() {
        var attempts = 0;

        function tryStart() {
          if (document.getElementById("linkedinPromptLibrary")) {
            window.lpPromptLibrary_start();
            return;
          }
          if (attempts < 100) {
            attempts += 1;
            setTimeout(tryStart, 100);
          }
        }

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", tryStart);
        } else {
          tryStart();
        }
      }

      lpPromptLibrary_boot();
    })();
