import "dotenv/config";
import { App } from "@slack/bolt";
import http from "http";

for (const key of ["SLACK_BOT_TOKEN", "SLACK_APP_TOKEN"]) {
  if (!process.env[key]) throw new Error(`Missing ${key}`);
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

// ============================================================
// DELUXE MEDIA HR MANAGER
// 100% RULE-BASED. NO AI. NO AI API.
// Add/edit response strings here whenever you want.
// ============================================================
const responses = {
  late: [
    "Noted. The concept of time remains undefeated.",
    "Thank you for informing HR after the time you were supposed to arrive.",
    "Understood. Please try arriving at the scheduled time next time. Revolutionary concept.",
    "HR has logged your groundbreaking discovery that traffic exists.",
    "You're late. The clock did its job. You did not.",
    "Amazing. Somehow the meeting started without waiting for your grand entrance.",
    "Thanks for the update. Please let your calendar know that it has been betrayed.",
    "We appreciate your commitment to making every arrival a surprise.",
    "Your attendance has entered the 'creative interpretation' category.",
    "Please stop treating start times as suggestions.",
    "I see we're once again negotiating with the concept of punctuality.",
    "HR would like to remind you that 'almost on time' is not a time zone.",
    "Congratulations on arriving. Eventually.",
    "I'll notify the Department of People Who Arrive When They Feel Like It.",
    "The good news: you made it. The bad news: the meeting already happened.",
    "Noted. Please consult a clock before your next scheduled commitment.",
    "Your ETA appears to stand for Eventually, Technically, Arriving.",
    "A fascinating strategy: arrive after the work has already started.",
    "Thank you for the update. Please save the sequel for tomorrow.",
    "Punctuality called. You missed it.",
    "The schedule was not merely a suggestion, despite your interpretation.",
    "Excellent. Another episode of 'Will They Show Up?'.",
    "Please remember that being on time is generally easier than explaining why you weren't.",
    "The meeting had a start time. You had a different vision. HR is taking notes.",
    "Your arrival has been accepted, albeit several minutes after its usefulness peaked."
  ],
  pto: [
    "You can ask. Whether the answer is yes is a completely different department.",
    "Submit the request properly. Slack is many things; it is not a PTO approval form.",
    "Fine. Put the request in the actual system before HR has to hunt you down.",
    "PTO requests work better when submitted before the vacation starts. Wild concept, I know.",
    "Approved in spirit. Now do the paperwork like an adult.",
    "HR has no objection to vacation. HR does object to surprise vacation.",
    "Please submit the request through the proper channel. I refuse to approve vacation via interpretive Slack message.",
    "Take the day if it's approved. Don't simply announce your disappearance like a magician.",
    "Vacation is great. Documentation is also great. Please provide both.",
    "You may request PTO. HR cannot read minds, calendars, or vibes.",
    "Put it through the system and we'll deal with it like civilized professionals.",
    "I support your desire to escape the workplace. Please follow the process first.",
    "No, 'I mentioned it in Slack once' is not a robust PTO workflow.",
    "Submit the request. Then I can pretend this was easy.",
    "Your vacation deserves planning. So does everyone else's workload.",
    "Please use the actual PTO process. HR is begging you to make this boring."
  ],
  sick: [
    "If you're sick, stay home. We do not need a heroic performance from you today.",
    "Take care of yourself and follow the normal call-out process. Revolutionary, I know.",
    "Being sick is acceptable. Vanishing without telling anyone is not.",
    "Rest. Hydrate. Notify the appropriate person. HR has spoken.",
    "Please use the actual sick-day process instead of making this a Slack mystery.",
    "Get better. The work will survive without you for a minute.",
    "If you're genuinely sick, stay home. If you're mysteriously sick every Monday, that's a separate conversation.",
    "Your immune system has filed a complaint. Please listen to it.",
    "Take the day if you need it. Just communicate like a functioning employee.",
    "HR officially authorizes you to stop pretending you're productive while feeling terrible.",
    "Go rest. Nobody wins a prize for working while half-dead.",
    "Sick means sick. Follow the process and don't make HR reconstruct the timeline."
  ],
  deadline: [
    "A deadline is not a decorative suggestion.",
    "The deadline remains the deadline, despite your apparent negotiations with reality.",
    "Please stop discovering the deadline on the day the deadline happens.",
    "If you knew you couldn't make it, communication should have occurred approximately before now.",
    "Deadlines work best when respected. I know. Shocking.",
    "You cannot simply move a deadline because you became emotionally uncomfortable with it.",
    "Please provide a realistic update instead of optimism disguised as a schedule.",
    "The project does not care that you 'thought you had more time.'",
    "If the deadline is at risk, say so early. HR shouldn't have to perform archaeology.",
    "Congratulations, you've reached the part of the project where planning matters.",
    "Please stop using 'almost done' as a unit of measurement.",
    "A deadline approaching is not a surprise event. It was on the calendar.",
    "If you need more time, ask for it. Don't wait until the deadline has already filed a missing-person report.",
    "The calendar remains available for consultation.",
    "Your future self would like you to stop creating problems for them."
  ],
  meeting: [
    "Another meeting? Excellent. Exactly what productivity needed.",
    "If this could have been an email, I am personally disappointed in everyone involved.",
    "Please attend the meeting you were invited to. Apparently we're doing attendance now.",
    "Bring an agenda. Otherwise this is just a group hallucination.",
    "If you don't need to be there, don't be there. Your calendar has suffered enough.",
    "Please arrive prepared. 'I didn't know what this was about' is not preparation.",
    "Meetings are not a substitute for decisions.",
    "Keep it short. Nobody needs a 47-minute preamble to a two-minute question.",
    "If someone says 'quick meeting,' HR will be monitoring the situation closely.",
    "Please respect everyone's time. Time is expensive and apparently we enjoy wasting it.",
    "If the meeting has no purpose, cancel it. HR will personally send flowers.",
    "Yes, you should probably read the agenda before asking what the meeting is about."
  ],
  payroll: [
    "Money questions get HR's attention very quickly. Funny how that works.",
    "Please provide the relevant details instead of making HR play financial detective.",
    "Payroll is not powered by vibes. Give us the information we need.",
    "If something looks wrong with your pay, report the actual discrepancy so it can be checked.",
    "Yes, you should care about your paycheck. No, yelling at Slack will not make payroll faster.",
    "Please don't send sensitive banking information into a Slack channel.",
    "Money matters deserve accurate information, not a dramatic paragraph.",
    "If you believe you're missing money, give HR the dates and details. We'll investigate the boring way.",
    "Payroll is a process, not a magic trick. Please allow the process to happen.",
    "Your paycheck deserves a better investigation than 'where's my money???'."
  ],
  complaint: [
    "Noted. Now tell me the actual problem instead of submitting a one-line emotional press release.",
    "Complaining is permitted. Being vague is not helpful.",
    "Okay. What's the specific issue, and what outcome do you want?",
    "HR has received your complaint. Please provide facts before we begin the courtroom drama.",
    "If you want this fixed, give me something actionable.",
    "I can work with a complaint. I cannot work with pure vibes.",
    "Let's separate the problem from the dramatic narration of the problem.",
    "Fine. Let's deal with it. What happened, specifically?",
    "Please provide names, dates, and facts where appropriate. Save the screenplay for Netflix.",
    "I hear you. Now let's figure out whether this is actually an HR issue."
  ],
  excuse: [
    "That's certainly an explanation. Whether it's a good one remains under review.",
    "I have heard stronger excuses from people trying to get out of jury duty.",
    "Interesting. HR will file that under 'creative reasoning.'",
    "Thank you for your submission to the Annual Excuse Olympics.",
    "I'm sure that sounded more convincing in your head.",
    "Let's try again, but this time with the part where you take responsibility.",
    "The explanation has been received. The accountability portion is still missing.",
    "Beautiful story. Unfortunately, the calendar has evidence.",
    "I appreciate the creativity. I do not appreciate the outcome.",
    "That excuse has been forwarded to the Department of Things We Both Know Aren't True.",
    "Please provide fewer excuses and more solutions.",
    "I don't need a novel. I need the actual situation and what you're doing about it."
  ],
  greeting: [
    "Hello. HR is unfortunately open.",
    "Hi. What did you break?",
    "Hey. Please tell me this isn't about a policy violation.",
    "Hello. State your business before I develop concerns.",
    "Hi. HR here. Try to keep the chaos organized.",
    "Greetings. I assume something happened.",
    "Hey. What administrative disaster are we handling today?",
    "Hello. Please approach HR with facts and reasonable expectations.",
    "Hi. I am available, against my better judgment.",
    "Hey. What kind of problem have you brought me?"
  ],
  thanks: [
    "You're welcome. Please don't make me regret helping.",
    "Anytime. Unfortunately.",
    "You're welcome. That's what HR gets paid for.",
    "No problem. I expect this to be the end of the matter.",
    "Glad to help. Now go do the thing.",
    "You're welcome. Please use this knowledge responsibly.",
    "Of course. One successful interaction. We did it.",
    "Happy to help. Miracles happen.",
    "You're welcome. Please don't immediately create another HR issue."
  ],
  general: [
    "That is technically a question. It is not, however, a good one.",
    "HR has entered the chat. Unfortunately for everyone.",
    "Please use your critical thinking skills before escalating this to HR.",
    "I am HR, not your personal life coach.",
    "Interesting choice. Let's discuss why you thought that was a good idea.",
    "No. Next question.",
    "Maybe. Give me actual context.",
    "That's above my pay grade, but somehow still in my inbox.",
    "HR would like everyone to make fewer problems for HR.",
    "I have reviewed your message and would like 30 seconds of my life back.",
    "Please explain what you actually need instead of making HR decode this.",
    "This feels like a problem that could have been prevented with approximately eight seconds of thought.",
    "I support workplace communication. I do not support whatever this is.",
    "Thank you for bringing this to HR. I regret being available.",
    "Let's resolve this before it becomes a meeting.",
    "Your message has been received, judged, and reluctantly processed.",
    "I understand the question. I question the decision to ask it this way.",
    "Please proceed with the sensible option. You know which one.",
    "HR's official position is: use common sense first.",
    "I am going to answer this once, because apparently we have to.",
    "This is why HR has job security.",
    "Congratulations. You've created paperwork without creating anything useful.",
    "I would love to say this is surprising.",
    "Please don't make me write a policy about this.",
    "We could solve this in two minutes if everyone simply behaved normally.",
    "Noted. Deeply, reluctantly, noted.",
    "That sounds like a you problem wearing a company shirt.",
    "Let's not turn a minor inconvenience into an organizational event.",
    "I have questions. Mostly about your decision-making process.",
    "Please make the next decision slightly less exciting for HR.",
    "Before escalating this, please attempt the revolutionary strategy of reading the instructions.",
    "This has the unmistakable smell of a problem created by poor planning.",
    "HR recommends fewer surprises and more communication.",
    "I am adding this to the invisible folder labeled 'things I should not have to explain.'",
    "Let's use our adult words and solve this before someone creates a spreadsheet about it.",
    "You have my attention. Please use it wisely.",
    "I don't love this for you, or for me, or frankly for the company.",
    "Please don't turn a five-minute issue into a three-day saga.",
    "The answer is probably simpler than the story you're telling me.",
    "This could have been handled normally. Yet here we are."
  ],
  fallback: [
    "I have absolutely no idea what you're asking. Try using actual words.",
    "Please rephrase that before HR calls IT.",
    "That message has been rejected for lack of useful information.",
    "I need context. I am a bot, not a mind reader.",
    "Try again. Preferably with a subject, verb, and actual point.",
    "I understood the words individually. Together, they were a disaster.",
    "Please provide enough context for someone other than you to understand this.",
    "No idea. Ask the question again like you want an answer.",
    "That was impressively unhelpful. Try again.",
    "HR requires a minimum level of information to operate. You have not met it.",
    "Please clarify before I make something up and accidentally create a policy.",
    "I need more than that. Give me the situation, not the trailer.",
    "Please add context. Even a little. HR is begging.",
    "That sentence has arrived without enough luggage to be useful.",
    "Try again, but this time tell me what you actually want."
  ]
};

function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
function cleanText(text = "") {
  return text.replace(/<@[A-Z0-9]+>/gi, "").replace(/<#[A-Z0-9]+\|[^>]+>/gi, "").replace(/\s+/g, " ").trim();
}
function includesAny(text, words) { return words.some(w => text.includes(w)); }
function classify(text) {
  const t = text.toLowerCase();
  if (includesAny(t, ["hello", "hi ", "hey", "yo ", "good morning", "good afternoon", "good evening"])) return "greeting";
  if (includesAny(t, ["thank you", "thanks", "thx", "appreciate it"])) return "thanks";
  if (includesAny(t, ["pto", "vacation", "day off", "time off", "leave", "out friday", "out monday"])) return "pto";
  if (includesAny(t, ["sick", "not feeling well", "call out", "calling out", "ill", "doctor"])) return "sick";
  if (includesAny(t, ["running late", "late", "traffic", "tardy", "overslept"])) return "late";
  if (includesAny(t, ["deadline", "due date", "due tomorrow", "overdue", "behind", "extension", "more time"])) return "deadline";
  if (includesAny(t, ["meeting", "zoom", "google meet", "calendar invite", "calendar"])) return "meeting";
  if (includesAny(t, ["paycheck", "payday", "payroll", "salary", "payment", "paid", "missing money", "money"])) return "payroll";
  if (includesAny(t, ["complaint", "complain", "unfair", "upset", "angry", "problem with", "issue with"])) return "complaint";
  if (includesAny(t, ["because", "couldn't", "could not", "forgot", "forgotten", "my bad", "wasn't my fault", "not my fault", "excuse"])) return "excuse";
  return "general";
}
function getResponse(text) { return pick(responses[classify(text)] || responses.fallback); }

const seenEvents = new Set();
function alreadySeen(id) {
  if (!id) return false;
  if (seenEvents.has(id)) return true;
  seenEvents.add(id);
  setTimeout(() => seenEvents.delete(id), 300000);
  return false;
}

app.event("app_mention", async ({ event, say, logger }) => {
  try {
    if (alreadySeen(event.event_id)) return;
    await say({ text: getResponse(cleanText(event.text)), thread_ts: event.thread_ts || event.ts });
  } catch (err) { logger.error(err); }
});

app.event("message", async ({ event, say, logger }) => {
  try {
    if (alreadySeen(event.event_id) || event.bot_id || event.subtype || event.channel_type !== "im") return;
    const text = cleanText(event.text);
    if (text) await say(getResponse(text));
  } catch (err) { logger.error(err); }
});

const port = Number(process.env.PORT || 3000);
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, service: "Deluxe Media HR Manager" }));
}).listen(port);

await app.start();
console.log("⚡ Deluxe Media HR Manager is running.");
console.log("🤬 Rule-based mode: NO AI.");
