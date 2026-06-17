(function () {
  window.hsPromptLibrary_start = function () {
    var root = document.getElementById("headshotPromptLibrary");
    if (!root || root.getAttribute("data-hs-ready") === "true") {
      return;
    }
    root.setAttribute("data-hs-ready", "true");

    var styleSelect = root.querySelector("#hsStyle");
    var poseSelect = root.querySelector("#hsPose");
    var backgroundSelect = root.querySelector("#hsBackground");
    var outfitSelect = root.querySelector("#hsOutfit");
    var moodSelect = root.querySelector("#hsMood");
    var list = root.querySelector("#hsPromptList");
    var showMore = root.querySelector("#hsShowMore");
    var generateButton = root.querySelector("#hsGenerate");
    var clearButton = root.querySelector("#hsClear");
    var poseTrack = root.querySelector("#hsPoseTrack");
    var posePrev = root.querySelector("#hsPosePrev");
    var poseNext = root.querySelector("#hsPoseNext");
    var expandedList = false;

    var referencePoses = [
      {
        title: "Executive Seated",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=320&h=400&fit=crop&crop=faces",
        download: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&fit=crop&crop=faces"
      },
      {
        title: "Arms Crossed Executive",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=320&h=400&fit=crop&crop=faces",
        download: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&fit=crop&crop=faces"
      },
      {
        title: "Standing Executive",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=320&h=400&fit=crop&crop=faces",
        download: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&fit=crop&crop=faces"
      },
      {
        title: "Confident Lean",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=400&fit=crop&crop=faces",
        download: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&fit=crop&crop=faces"
      },
      {
        title: "Hands Together Executive",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&h=400&fit=crop&crop=faces",
        download: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&fit=crop&crop=faces"
      },
      {
        title: "Looking Away Executive",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=320&h=400&fit=crop&crop=faces",
        download: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&fit=crop&crop=faces"
      },
      {
        title: "CEO at Desk Pose",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&h=400&fit=crop&crop=faces",
        download: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&fit=crop&crop=faces"
      },
      {
        title: "Window Light Portrait",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=320&h=400&fit=crop&crop=faces",
        download: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&fit=crop&crop=faces"
      }
    ];

    var prompts = [
      {
        title: "Corporate Executive Headshot",
        tag: "Professional",
        tagClass: "hs-pill-pro",
        desc: "High-end executive portrait with a confident and authoritative presence.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop&crop=faces",
        text: "Professional headshot of a confident executive, wearing a [OUTFIT], [POSE] pose, [BACKGROUND] background, [MOOD] expression, [STYLE] lighting, sharp focus on face, natural skin texture, corporate photography quality, 85mm lens look."
      },
      {
        title: "LinkedIn Professional",
        tag: "Essential",
        tagClass: "hs-pill-essential",
        desc: "Clean, approachable portrait optimized for LinkedIn and professional profiles.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=faces",
        text: "LinkedIn-ready professional headshot, [OUTFIT], [POSE] pose, [BACKGROUND] background, [MOOD] and approachable expression, [STYLE] style, soft flattering light, crisp detail, neutral color grading, suitable for business profile photo."
      },
      {
        title: "Startup Founder Portrait",
        tag: "Founder",
        tagClass: "hs-pill-founder",
        desc: "Modern founder look that feels visionary, credible, and investor-ready.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=faces",
        text: "Startup founder headshot, [OUTFIT], [POSE] pose, [BACKGROUND] background, [MOOD] energy, [STYLE] aesthetic, contemporary business portrait, authentic and polished, subtle depth of field, premium editorial quality."
      },
      {
        title: "TED Speaker Portrait",
        tag: "Speaking",
        tagClass: "hs-pill-speaking",
        desc: "Dynamic speaker portrait with presence, warmth, and stage-ready charisma.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=faces",
        text: "Professional speaker headshot, [OUTFIT], [POSE] pose, [BACKGROUND] background, [MOOD] charisma, [STYLE] lighting, engaging eye contact, polished yet human, conference speaker portrait style."
      },
      {
        title: "Creative Director Portrait",
        tag: "Creative",
        tagClass: "hs-pill-creative",
        desc: "Stylish creative professional portrait with editorial flair.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces",
        text: "Creative director headshot, [OUTFIT], [POSE] pose, [BACKGROUND] background, [MOOD] expression, [STYLE] mood, fashion-forward business portrait, refined styling, magazine-quality finish."
      },
      {
        title: "Tech Leader Headshot",
        tag: "Tech",
        tagClass: "hs-pill-tech",
        desc: "Sharp, modern portrait for engineering and product leadership roles.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces",
        text: "Technology leader headshot, [OUTFIT], [POSE] pose, [BACKGROUND] background, [MOOD] confidence, [STYLE] lighting, clean modern aesthetic, minimal distractions, high clarity facial detail."
      },
      {
        title: "Medical Professional",
        tag: "Healthcare",
        tagClass: "hs-pill-health",
        desc: "Trustworthy clinical portrait with warmth and professional credibility.",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&h=160&fit=crop&crop=faces",
        text: "Medical professional headshot, [OUTFIT], [POSE] pose, [BACKGROUND] background, [MOOD] reassuring expression, [STYLE] style, trustworthy and compassionate, clinic or hospital portrait quality."
      },
      {
        title: "Real Estate Agent",
        tag: "Sales",
        tagClass: "hs-pill-sales",
        desc: "Friendly, polished portrait that builds instant client trust.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces",
        text: "Real estate professional headshot, [OUTFIT], [POSE] pose, [BACKGROUND] background, [MOOD] welcoming smile, [STYLE] lighting, approachable and successful, bright clean portrait for marketing materials."
      },
      {
        title: "Lawyer Portrait",
        tag: "Legal",
        tagClass: "hs-pill-legal",
        desc: "Authoritative legal portrait with gravitas and polish.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop&crop=faces",
        text: "Attorney headshot, [OUTFIT], [POSE] pose, [BACKGROUND] background, [MOOD] composure, [STYLE] style, prestigious law firm portrait, sharp suit details, confident professional demeanor."
      },
      {
        title: "Author & Speaker",
        tag: "Author",
        tagClass: "hs-pill-author",
        desc: "Thoughtful portrait for book covers, podcasts, and personal brands.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=faces",
        text: "Author headshot, [OUTFIT], [POSE] pose, [BACKGROUND] background, [MOOD] thoughtful expression, [STYLE] lighting, literary portrait aesthetic, subtle storytelling mood, premium publishing quality."
      },
      {
        title: "Remote Worker Casual Pro",
        tag: "Remote",
        tagClass: "hs-pill-remote",
        desc: "Relaxed yet professional look for remote teams and modern workplaces.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=faces",
        text: "Remote professional headshot, [OUTFIT], [POSE] pose, [BACKGROUND] background, [MOOD] friendly energy, [STYLE] style, smart casual business portrait, natural and authentic, home-office ready."
      },
      {
        title: "Board Member Portrait",
        tag: "Board",
        tagClass: "hs-pill-board",
        desc: "Elite boardroom portrait with understated power and sophistication.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=faces",
        text: "Board member headshot, [OUTFIT], [POSE] pose, [BACKGROUND] background, [MOOD] gravitas, [STYLE] lighting, executive boardroom portrait, refined and timeless, premium corporate photography."
      }
    ];

    function hsPromptLibrary_escapeHtml(value) {
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

    function hsPromptLibrary_selectedText(select) {
      return select.options[select.selectedIndex].text;
    }

    function hsPromptLibrary_buildPrompt(item) {
      var prompt = item.text;
      prompt = prompt.split("[STYLE]").join(hsPromptLibrary_selectedText(styleSelect).toLowerCase());
      prompt = prompt.split("[POSE]").join(hsPromptLibrary_selectedText(poseSelect).toLowerCase());
      prompt = prompt.split("[BACKGROUND]").join(hsPromptLibrary_selectedText(backgroundSelect).toLowerCase());
      prompt = prompt.split("[OUTFIT]").join(hsPromptLibrary_selectedText(outfitSelect).toLowerCase());
      prompt = prompt.split("[MOOD]").join(hsPromptLibrary_selectedText(moodSelect).toLowerCase());
      return prompt;
    }

    function hsPromptLibrary_copyText(value, done) {
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

    function hsPromptLibrary_cardHtml(item, index, promptText) {
      var hiddenClass = !expandedList && index > 3 ? " is-hidden" : "";
      var tagClass = item.tagClass || "hs-pill-pro";
      return ""
        + '<article class="hs-prompt-card' + hiddenClass + '">'
        + '<div class="hs-card-thumb"><img src="' + hsPromptLibrary_escapeHtml(item.image) + '" alt="" loading="lazy" width="88" height="88"></div>'
        + '<div class="hs-card-main">'
        + '<div class="hs-card-head">'
        + '<span class="hs-number">' + (index + 1) + "</span>"
        + "<h3>" + hsPromptLibrary_escapeHtml(item.title) + "</h3>"
        + '<span class="hs-pill ' + tagClass + '">' + hsPromptLibrary_escapeHtml(item.tag) + "</span>"
        + "</div>"
        + '<p class="hs-card-desc">' + hsPromptLibrary_escapeHtml(item.desc) + "</p>"
        + '<div class="hs-prompt-text" data-prompt-text="' + hsPromptLibrary_escapeHtml(promptText) + '">'
        + '<span class="hs-quote">&quot;</span>'
        + hsPromptLibrary_escapeHtml(promptText)
        + "</div>"
        + "</div>"
        + '<div class="hs-card-actions">'
        + '<button class="hs-copy" type="button" aria-label="Copy prompt">'
        + '<svg class="hs-icon hs-copy-symbol" viewBox="0 0 24 24" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>'
        + "</button>"
        + '<button class="hs-toggle" type="button" aria-label="Collapse prompt">'
        + '<svg class="hs-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 15l-6-6-6 6"></path></svg>'
        + "</button>"
        + "</div>"
        + "</article>";
    }

    function hsPromptLibrary_poseHtml(pose) {
      return ""
        + '<article class="hs-pose-card">'
        + '<div class="hs-pose-image"><img src="' + hsPromptLibrary_escapeHtml(pose.image) + '" alt="' + hsPromptLibrary_escapeHtml(pose.title) + '" loading="lazy" width="160" height="200"></div>'
        + "<h4>" + hsPromptLibrary_escapeHtml(pose.title) + "</h4>"
        + '<a class="hs-pose-download" href="' + hsPromptLibrary_escapeHtml(pose.download) + '" download target="_blank" rel="noopener">'
        + '<svg class="hs-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="M7 10l5 5 5-5"></path><path d="M12 15V3"></path></svg>'
        + "Download reference image"
        + "</a>"
        + "</article>";
    }

    function hsPromptLibrary_bindCardActions() {
      var cards = list.querySelectorAll(".hs-prompt-card");
      for (var i = 0; i < cards.length; i += 1) {
        (function (card) {
          var toggle = card.querySelector(".hs-toggle");
          var copy = card.querySelector(".hs-copy");
          var promptBox = card.querySelector(".hs-prompt-text");
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
              var promptValue = promptBox.getAttribute("data-prompt-text");
              var promptClone;
              var quote;
              if (!promptValue) {
                promptClone = promptBox.cloneNode(true);
                quote = promptClone.querySelector(".hs-quote");
                if (quote) {
                  quote.parentNode.removeChild(quote);
                }
                promptValue = (promptClone.textContent || "").replace(/^\s+|\s+$/g, "");
              }
              hsPromptLibrary_copyText(promptValue, function () {
                copy.className = copy.className.replace(/\s?is-copied/g, "") + " is-copied";
                setTimeout(function () {
                  copy.className = copy.className.replace(/\s?is-copied/g, "");
                }, 1300);
              });
            };
          }
        })(cards[i]);
      }
    }

    function hsPromptLibrary_renderPoses() {
      var html = "";
      var i;
      for (i = 0; i < referencePoses.length; i += 1) {
        html += hsPromptLibrary_poseHtml(referencePoses[i]);
      }
      poseTrack.innerHTML = html;
    }

    function hsPromptLibrary_scrollPoses(direction) {
      var amount = Math.max(poseTrack.clientWidth * 0.75, 240);
      poseTrack.scrollBy({ left: direction * amount, behavior: "smooth" });
    }

    function hsPromptLibrary_render() {
      var html = "";
      var i;

      for (i = 0; i < prompts.length; i += 1) {
        html += hsPromptLibrary_cardHtml(prompts[i], i, hsPromptLibrary_buildPrompt(prompts[i]));
      }

      list.innerHTML = html;
      showMore.style.display = prompts.length > 4 ? "inline-flex" : "none";
      showMore.querySelector("span").innerHTML = expandedList ? "Show Fewer Prompts" : "Show 8 More Prompts";
      hsPromptLibrary_bindCardActions();
    }

    generateButton.onclick = function () {
      expandedList = false;
      hsPromptLibrary_render();
    };

    clearButton.onclick = function () {
      styleSelect.value = "cinematic";
      poseSelect.value = "executive";
      backgroundSelect.value = "studio_dark";
      outfitSelect.value = "suit_blazer";
      moodSelect.value = "confident";
      expandedList = false;
      hsPromptLibrary_render();
    };

    showMore.onclick = function () {
      expandedList = !expandedList;
      hsPromptLibrary_render();
    };

    if (posePrev) {
      posePrev.onclick = function () {
        hsPromptLibrary_scrollPoses(-1);
      };
    }

    if (poseNext) {
      poseNext.onclick = function () {
        hsPromptLibrary_scrollPoses(1);
      };
    }

    hsPromptLibrary_renderPoses();
    hsPromptLibrary_render();
  };

  function hsPromptLibrary_boot() {
    var attempts = 0;

    function tryStart() {
      if (document.getElementById("headshotPromptLibrary")) {
        window.hsPromptLibrary_start();
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

  hsPromptLibrary_boot();
})();
