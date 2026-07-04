const fs = require("fs");
const path = require("path");

const altMap = {
  "Promotion Discussion Request": [
    "Can we discuss my next step on the team?",
    "Ready to talk growth — {{your name}}",
    "Interest in advancing to {{target role}}"
  ],
  "Salary Review Request": [
    "Compensation check-in for {{review period}}",
    "Can we align on my salary?",
    "Discussion about my current compensation"
  ],
  "Request for Stretch Assignment": [
    "Ready to take on more on {{project or initiative}}",
    "Volunteering for expanded scope",
    "Growth opportunity — {{your name}}"
  ],
  "Internal Role Application Follow-Up": [
    "Still very interested in {{internal role title}}",
    "{{internal role title}} application — {{your name}}",
    "Following up on my internal application"
  ],
  "Thank You for Career Advice": [
    "Grateful for your guidance on {{topic discussed}}",
    "Applying your advice — quick thank you",
    "Your insight made a difference"
  ],
  "Introduction to Industry Leader": [
    "Fan of your work on {{topic or publication}}",
    "Quick introduction — {{your name}}",
    "Inspired by your perspective on {{related topic}}"
  ],
  "Informational Interview Request": [
    "15 minutes to learn from your career path?",
    "Would love your perspective on {{target field or role}}",
    "Quick career conversation request"
  ],
  "Reconnect with Former Colleague": [
    "Long time no speak — {{your name}}",
    "Catching up after {{former company or team}}",
    "Hope you are well — wanted to reconnect"
  ],
  "Expertise Share / Article Introduction": [
    "Resource for you on {{article or topic title}}",
    "Sharing something relevant to your work",
    "Quick share — {{article or topic title}}"
  ],
  "LinkedIn Connection Follow-Up": [
    "Enjoyed connecting — next step?",
    "Following up from LinkedIn",
    "Would love to continue our conversation"
  ],
  "Conference or Event Follow-Up": [
    "Continued our {{event name}} conversation",
    "{{event name}} — great to meet you",
    "Following up from {{event date}}"
  ],
  "Warm Introduction Request": [
    "Would you intro me to {{target contact name}}?",
    "Introduction ask — {{target contact name}}",
    "Quick favor — warm intro request"
  ],
  "Double Opt-In Introduction": [
    "You two should meet — intro inside",
    "Connecting {{person A name}} ↔ {{person B name}}",
    "Mutual intro — hope this helps"
  ],
  "Coffee Chat Request": [
    "20 minutes to swap notes on {{specific topic}}?",
    "Coffee chat — {{your name}}",
    "Open to a quick virtual coffee?"
  ],
  "Thank You After Networking Meeting": [
    "Appreciated our chat today",
    "Great conversation — thank you",
    "Following through on what we discussed"
  ],
  "Clear Task Delegation": [
    "New assignment: {{task name}}",
    "Ownership of {{task name}} — details inside",
    "Action needed by {{due date}}"
  ],
  "Team Member Recognition": [
    "Outstanding work on {{project name}}",
    "You made a real difference this week",
    "Kudos for {{specific action}}"
  ],
  "Welcome New Team Member": [
    "So glad you are here, {{new hire name}}",
    "Your first week at {{team name}} — start here",
    "Welcome aboard — a few helpful notes"
  ],
  "Constructive Feedback": [
    "Quick feedback on {{situation or deliverable}}",
    "Thoughts to help you grow on {{project or task name}}",
    "Feedback + support for next steps"
  ],
  "Team Milestone Celebration": [
    "We hit {{milestone achieved}} — thank you",
    "Big win on {{project name}}",
    "Celebrating the team this week"
  ],
  "Podcast Guest Pitch": [
    "Episode idea for {{podcast name}} listeners",
    "Guest pitch: {{episode topic}}",
    "Story your audience might love"
  ],
  "Conference Speaking Proposal": [
    "Talk idea for {{event name}}",
    "Speaker submission — {{session title}}",
    "Session proposal for {{event date}}"
  ],
  "Collaboration Proposal": [
    "Idea we could build together",
    "Partnership thought for {{project or campaign name}}",
    "Collaboration on {{collaboration idea}}"
  ],
  "Testimonial or Recommendation Request": [
    "Quick favor — a few sentences?",
    "Would you share a short testimonial?",
    "Testimonial request for {{project name}}"
  ],
  "Guest Article Pitch": [
    "Story idea for {{publication name}}",
    "Article pitch — {{proposed article title}}",
    "Would this fit your editorial calendar?"
  ],
  "Public Thank-You Note": [
    "Deeply grateful for {{specific contribution}}",
    "Thank you — meant a lot",
    "Wanted you to know the impact you had"
  ],
  "Professional Apology": [
    "I want to make this right",
    "Taking ownership on {{issue or deliverable}}",
    "My apology and plan to fix this"
  ],
  "Clarification After Misunderstanding": [
    "Want to make sure we are aligned",
    "Clearing up my last note on {{topic}}",
    "Quick clarification — {{topic or previous message}}"
  ],
  "Response to Positive Feedback": [
    "Thank you — glad it landed well",
    "Appreciate the kind words",
    "Grateful for your feedback on {{project or interaction}}"
  ],
  "Reference or Bio Update Request": [
    "Quick ask about my bio/reference",
    "Could we refresh my reference?",
    "Bio update request — {{context}}"
  ],
  "Value-First Cold Outreach": [
    "Idea for {{company name}} on {{relevant pain point}}",
    "Not a pitch — just something useful",
    "Thought about {{company name}} and {{specific insight}}"
  ],
  "Follow-Up After No Response": [
    "Circling back — still useful?",
    "One more thought on {{original topic}}",
    "Closing the loop unless timing changed"
  ],
  "Meeting Request After Research": [
    "Impressed by {{company name}}'s {{specific initiative}}",
    "Worth a 20-minute conversation?",
    "Question about {{prospect priority}}"
  ],
  "Referral Partner Outreach": [
    "Referral partnership idea",
    "We could help each other's clients",
    "Partnership thought — {{your company}}"
  ],
  "Re-Engage Dormant Lead": [
    "Still on your radar — {{previous topic}}?",
    "Checking back in, {{prospect name}}",
    "Any update on {{original goal}}?"
  ],
  "Project Kickoff Confirmation": [
    "We are underway — {{project name}} details",
    "Kickoff confirmed for {{project name}}",
    "Next steps for {{project name}}"
  ],
  "Weekly Project Status Update": [
    "{{project name}} progress — week of {{date}}",
    "Your Friday update from our team",
    "Status snapshot: {{project name}}"
  ],
  "Scope Change Notification": [
    "Change request summary — {{project name}}",
    "Updated scope for {{project name}}",
    "Approval needed: scope adjustment"
  ],
  "Project Delay Apology": [
    "Revised delivery date for {{project name}}",
    "Timeline update — my apology included",
    "New ETA for {{project name}}"
  ],
  "Project Completion Handoff": [
    "We are wrapped — {{project name}} handoff",
    "Final deliverables for {{project name}}",
    "Project closed — everything you need"
  ],
  "Invoice Submission": [
    "Your invoice from {{your company}} — {{invoice number}}",
    "Payment due {{due date}} — Invoice {{invoice number}}",
    "Billing for {{project or service name}}"
  ],
  "Friendly Payment Reminder": [
    "Quick reminder — Invoice {{invoice number}}",
    "Payment due soon for {{project or service name}}",
    "Just a nudge on {{invoice number}}"
  ],
  "Overdue Payment Follow-Up": [
    "Invoice {{invoice number}} — past due",
    "Can we resolve payment for {{amount}}?",
    "Outstanding balance on Invoice {{invoice number}}"
  ],
  "Quote or Proposal Submission": [
    "Your custom proposal for {{project name}}",
    "Pricing and scope inside — {{project name}}",
    "Next steps for {{project name}}"
  ],
  "Contract Renewal Notice": [
    "Time to renew {{service name}}",
    "Your agreement expires {{expiration date}}",
    "Renewal options for {{service name}}"
  ],
  "Holiday or Seasonal Check-In": [
    "Warm wishes for {{season or holiday}}",
    "Thinking of you this {{season or holiday}}",
    "Hope you are enjoying {{season or holiday}}"
  ],
  "Congratulations on Promotion": [
    "So well deserved, {{recipient name}}",
    "Cheering you on in {{new role title}}",
    "Big congrats on the promotion"
  ],
  "Share a Useful Resource": [
    "This made me think of you",
    "Resource for {{recipient focus area}}",
    "Passing along something useful"
  ],
  "Long-Term Nurture Check-In": [
    "Just saying hello, {{recipient name}}",
    "Hope {{company name}} is treating you well",
    "Keeping in touch — no agenda"
  ],
  "Birthday or Work Anniversary Note": [
    "Celebrating you today, {{recipient name}}",
    "Wishing you a fantastic {{birthday/work anniversary}}",
    "Cheers to you on your special day"
  ],
  "Missed Deadline Accountability": [
    "I missed our deadline — here is the fix",
    "Revised plan for {{deliverable name}}",
    "Owning the delay on {{deliverable name}}"
  ],
  "Professional Boundary Setting": [
    "Clarifying how I can best support this",
    "A quick note on expectations",
    "Making our collaboration smoother"
  ],
  "De-Escalation After Disagreement": [
    "Can we reset on {{project or issue}}?",
    "Finding common ground on {{disagreement topic}}",
    "Moving forward together"
  ],
  "Clarify Expectations After Confusion": [
    "Let's get on the same page",
    "Confirming roles on {{project or task}}",
    "Quick alignment check"
  ],
  "Follow-Up After Difficult Conversation": [
    "Appreciate today's honesty",
    "Next steps from our conversation",
    "Thank you for working through this with me"
  ],
  "I Admire Your Work": [
    "Your {{specific project or content}} stuck with me",
    "Just wanted to say thank you",
    "You influenced how I think about {{related topic}}"
  ],
  "Offer Value Before the Ask": [
    "No ask — just sharing this with you",
    "Thought this could help with {{recipient priority}}",
    "Passing along something valuable"
  ],
  "Book or Resource Recommendation Request": [
    "What should I read next on {{topic}}?",
    "Your take on {{topic}} reading?",
    "One book recommendation?"
  ],
  "Request to Join a Community or Group": [
    "Would love to contribute to {{community or group name}}",
    "Membership request — {{your name}}",
    "Interested in joining {{community or group name}}"
  ],
  "Non-Pushy Follow-Up With New Value": [
    "One more thing on {{topic}}",
    "New angle on {{previous topic}}",
    "Adding value, not pressure"
  ]
};

const dataPath = path.join(__dirname, "..", "email-templates-data.js");
const src = fs.readFileSync(dataPath, "utf8");
const templates = eval(src.replace("window.eeEmailTemplates =", ""));

const updated = templates.map(function (item) {
  return Object.assign({}, item, {
    altSubjects: altMap[item.title] || []
  });
});

const out =
  "window.eeEmailTemplates = " +
  JSON.stringify(updated, null, 2)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/\\n/g, "\\n") +
  ";\n";

fs.writeFileSync(dataPath, out.replace(/"body": "([^"]*)"/g, function (_, body) {
  return '"body": "' + body.replace(/\n/g, "\\n") + '"';
}), "utf8");

console.log("Updated", updated.length, "templates with altSubjects");
