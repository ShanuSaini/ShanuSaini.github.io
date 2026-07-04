(function () {
  window.eePromptLibrary_start = function () {
    var root = document.getElementById("emailPromptLibrary");
    if (!root || root.getAttribute("data-ee-ready") === "true") {
      return;
    }
    root.setAttribute("data-ee-ready", "true");

    var categorySelect = root.querySelector("#eeCategory");
    var list = root.querySelector("#eePromptList");
    var showMore = root.querySelector("#eeShowMore");
    var countLabel = root.querySelector("#eeTemplateCount");
    var emptyState = root.querySelector("#eeEmptyState");
    var expandedList = false;
    var altSubjectsByTitle = window.eeEmailAltSubjectsByTitle || {};

    var categoryLabels = {
      any: "All categories",
      career_growth: "Career Growth",
      personal_branding: "Personal Branding",
      networking: "Networking",
      leadership: "Leadership",
      opportunity: "Opportunity",
      reputation: "Reputation",
      prospecting: "Prospecting",
      client_management: "Client Management",
      money_matters: "Money Matters",
      relationships: "Relationships",
      conflict_resolution: "Conflict Resolution",
      influence: "Influence Building"
    };

    var templates = window.eeEmailTemplates || [];

    function eePromptLibrary_escapeHtml(value) {
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

    function eePromptLibrary_getAltSubjects(item) {
      if (item.altSubjects && item.altSubjects.length) {
        return item.altSubjects;
      }
      return altSubjectsByTitle[item.title] || [];
    }

    function eePromptLibrary_formatCopyText(item) {
      return "Subject: " + item.subject + "\n\n" + item.body;
    }

    function eePromptLibrary_filteredTemplates() {
      var selected = categorySelect.value;
      if (selected === "any") {
        return templates;
      }
      var filtered = [];
      var i;
      for (i = 0; i < templates.length; i += 1) {
        if (templates[i].category === selected) {
          filtered.push(templates[i]);
        }
      }
      return filtered;
    }

    function eePromptLibrary_copyText(value, done) {
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

    function eePromptLibrary_altSubjectsHtml(item) {
      var alts = eePromptLibrary_getAltSubjects(item);
      var html = "";
      var i;

      if (!alts.length) {
        return "";
      }

      html += '<div class="ee-alt-subjects" hidden>';
      html += '<div class="ee-alt-subjects-label">Alternative subject lines</div>';
      html += '<ul class="ee-alt-subjects-list">';

      for (i = 0; i < alts.length; i += 1) {
        html += '<li><button type="button" class="ee-alt-subject" data-copy-text="'
          + eePromptLibrary_escapeHtml(alts[i])
          + '">'
          + eePromptLibrary_escapeHtml(alts[i])
          + '<span class="ee-copy-tip">Copy</span>'
          + "</button></li>";
      }

      html += "</ul></div>";
      return html;
    }

    function eePromptLibrary_cardHtml(item, index, copyText) {
      var hiddenClass = !expandedList && index > 3 ? " is-hidden" : "";
      var hasAlts = eePromptLibrary_getAltSubjects(item).length > 0;

      return ""
        + '<article class="ee-prompt-card is-collapsed' + hiddenClass + '">'
        + '<div class="ee-number">' + (index + 1) + "</div>"
        + '<div class="ee-card-main">'
        + '<div class="ee-card-head">'
        + "<h3>" + eePromptLibrary_escapeHtml(item.title) + "</h3>"
        + '<span class="ee-pill">' + eePromptLibrary_escapeHtml(categoryLabels[item.category] || item.category) + "</span>"
        + "</div>"
        + '<p class="ee-card-desc">' + eePromptLibrary_escapeHtml(item.desc) + "</p>"
        + '<div class="ee-card-details">'
        + '<div class="ee-subject-line">'
        + '<div class="ee-subject-main">'
        + '<span class="ee-subject-label">Subject:</span>'
        + '<button type="button" class="ee-subject-copy" data-copy-text="' + eePromptLibrary_escapeHtml(item.subject) + '">'
        + '<span class="ee-subject-text">' + eePromptLibrary_escapeHtml(item.subject) + "</span>"
        + '<span class="ee-copy-tip">Copy</span>'
        + "</button>"
        + "</div>"
        + (hasAlts
          ? '<button class="ee-subject-alt-toggle" type="button" aria-label="Show alternative subject lines" aria-expanded="false">'
            + '<svg class="ee-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>'
            + "</button>"
          : "")
        + "</div>"
        + eePromptLibrary_altSubjectsHtml(item)
        + '<div class="ee-prompt-text" data-prompt-text="' + eePromptLibrary_escapeHtml(copyText) + '">'
        + eePromptLibrary_escapeHtml(item.body)
        + "</div>"
        + "</div>"
        + "</div>"
        + '<div class="ee-card-actions">'
        + '<button class="ee-copy" type="button" aria-label="Copy email template">'
        + '<svg class="ee-icon ee-copy-symbol" viewBox="0 0 24 24" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>'
        + "<span>Copy</span>"
        + "</button>"
        + '<button class="ee-toggle" type="button" aria-label="Expand template">'
        + '<svg class="ee-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 15l-6-6-6 6"></path></svg>'
        + "</button>"
        + "</div>"
        + "</article>";
    }

    function eePromptLibrary_bindCopyTip(button) {
      var tip = button.querySelector(".ee-copy-tip");
      var copyValue = button.getAttribute("data-copy-text");

      button.onclick = function (event) {
        if (event) {
          event.stopPropagation();
        }
        eePromptLibrary_copyText(copyValue, function () {
          button.className = button.className.replace(/\s?is-copied/g, "") + " is-copied";
          if (tip) {
            tip.innerHTML = "Copied";
          }
          setTimeout(function () {
            button.className = button.className.replace(/\s?is-copied/g, "");
            if (tip) {
              tip.innerHTML = "Copy";
            }
          }, 2000);
        });
      };
    }

    function eePromptLibrary_showCopyFeedback(button) {
      var label = button.querySelector("span");
      var icon = button.querySelector(".ee-copy-symbol");

      if (icon) {
        icon.innerHTML = '<path d="M20 6L9 17l-5-5"></path>';
      }
      if (label) {
        label.innerHTML = "Copied!";
      }
      button.className = button.className.replace(/\s?is-copied/g, "") + " is-copied";
      setTimeout(function () {
        if (icon) {
          icon.innerHTML = '<rect width="14" height="14" x="8" y="8" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>';
        }
        if (label) {
          label.innerHTML = "Copy";
        }
        button.className = button.className.replace(/\s?is-copied/g, "");
      }, 1300);
    }

    function eePromptLibrary_bindCardActions() {
      var cards = list.querySelectorAll(".ee-prompt-card");
      var i;

      for (i = 0; i < cards.length; i += 1) {
        (function (card) {
          var toggle = card.querySelector(".ee-toggle");
          var copy = card.querySelector(".ee-copy");
          var promptBox = card.querySelector(".ee-prompt-text");
          var altToggle = card.querySelector(".ee-subject-alt-toggle");
          var altPanel = card.querySelector(".ee-alt-subjects");
          var altButtons = card.querySelectorAll(".ee-alt-subject");
          var subjectCopy = card.querySelector(".ee-subject-copy");

          if (toggle) {
            toggle.onclick = function () {
              if (card.className.indexOf("is-collapsed") === -1) {
                card.className += " is-collapsed";
                toggle.setAttribute("aria-label", "Expand template");
              } else {
                card.className = card.className.replace(/\s?is-collapsed/g, "");
                toggle.setAttribute("aria-label", "Collapse template");
              }
            };
          }

          if (altToggle && altPanel) {
            altToggle.onclick = function () {
              var isOpen = altPanel.className.indexOf("is-open") !== -1;
              if (isOpen) {
                altPanel.className = altPanel.className.replace(/\s?is-open/g, "");
                altPanel.setAttribute("hidden", "");
                altToggle.setAttribute("aria-expanded", "false");
                altToggle.setAttribute("aria-label", "Show alternative subject lines");
              } else {
                altPanel.className += " is-open";
                altPanel.removeAttribute("hidden");
                altToggle.setAttribute("aria-expanded", "true");
                altToggle.setAttribute("aria-label", "Hide alternative subject lines");
              }
            };
          }

          if (subjectCopy) {
            eePromptLibrary_bindCopyTip(subjectCopy);
          }

          if (copy && promptBox) {
            copy.onclick = function () {
              var promptValue = promptBox.getAttribute("data-prompt-text");
              eePromptLibrary_copyText(promptValue, function () {
                eePromptLibrary_showCopyFeedback(copy);
              });
            };
          }

          var j;
          for (j = 0; j < altButtons.length; j += 1) {
            eePromptLibrary_bindCopyTip(altButtons[j]);
          }
        })(cards[i]);
      }
    }

    function eePromptLibrary_updateCount(total) {
      if (!countLabel) {
        return;
      }
      var selected = categorySelect.value;
      var label = categoryLabels[selected] || "Templates";
      countLabel.innerHTML = total + " template" + (total === 1 ? "" : "s") + (selected === "any" ? "" : " in " + label);
    }

    function eePromptLibrary_render() {
      var visible = eePromptLibrary_filteredTemplates();
      var html = "";
      var hiddenCount = visible.length - 4;
      var i;

      expandedList = visible.length <= 4 ? true : expandedList;

      if (emptyState) {
        emptyState.style.display = visible.length ? "none" : "block";
      }

      for (i = 0; i < visible.length; i += 1) {
        html += eePromptLibrary_cardHtml(visible[i], i, eePromptLibrary_formatCopyText(visible[i]));
      }

      list.innerHTML = html;
      eePromptLibrary_updateCount(visible.length);

      if (showMore) {
        showMore.style.display = visible.length > 4 ? "inline-flex" : "none";
        if (showMore.querySelector("span")) {
          showMore.querySelector("span").innerHTML = expandedList
            ? "Show Fewer Templates"
            : "Show " + hiddenCount + " More Templates";
        }
      }

      eePromptLibrary_bindCardActions();
    }

    categorySelect.onchange = function () {
      expandedList = false;
      eePromptLibrary_render();
    };

    if (showMore) {
      showMore.onclick = function () {
        expandedList = !expandedList;
        eePromptLibrary_render();
      };
    }

    eePromptLibrary_render();
  };

  function eePromptLibrary_boot() {
    var attempts = 0;

    function tryStart() {
      if (document.getElementById("emailPromptLibrary")) {
        window.eePromptLibrary_start();
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

  eePromptLibrary_boot();
})();
