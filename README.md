# Slack HR Manager 🤬

A 100% rule-based Slack HR bot for Deluxe Media.

**NO AI. NO OpenAI. NO Claude. NO LLM. NO AI API.**

It reads messages using simple keyword rules and randomly selects a response from `index.js`.

## Files

```text
index.js
package.json
README.md
```

## 1. Create the Slack app

Create a Slack app for your workspace.

### Enable Socket Mode

Slack app → **Settings → Socket Mode → Enable Socket Mode**.

Create an App-Level Token with:

```text
connections:write
```

Copy the `xapp-...` token.

### Bot Token Scopes

Slack app → **OAuth & Permissions → Bot Token Scopes**:

```text
app_mentions:read
chat:write
im:history
im:read
im:write
```

Install/reinstall the app into the workspace and copy the `xoxb-...` Bot User OAuth Token.

### Event Subscriptions

Enable Events and subscribe to:

```text
app_mention
message.im
```

If Slack asks you to reinstall after changing permissions/events, reinstall it.

## 2. GitHub

Put these three files in the repository root:

```text
index.js
package.json
README.md
```

Do **not** put Slack tokens in GitHub.

## 3. Railway

Deploy the GitHub repository to Railway.

Railway should detect Node automatically.

Start command:

```bash
npm start
```

Add these Railway Variables:

```text
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...
```

That's it. There is no OpenAI key.

Railway supplies `PORT` automatically.

## 4. Test it

Invite the bot to a channel:

```text
/invite @HR Manager
```

Then mention it:

```text
@HR Manager I'm running late
```

It will randomly choose a response from the `late` category.

You can also DM the bot.

## 5. Adding responses

All responses are in `index.js` under:

```js
const responses = {
```

Each category is simply an array of strings. Add as many as you want.

Example:

```js
late: [
  "You're late. The clock did its job. You did not.",
  "Please stop treating start times as suggestions.",
  "Congratulations on arriving. Eventually."
]
```

The bot randomly selects one every time.

## Current categories

- Late / tardy
- PTO / vacation
- Sick / calling out
- Deadlines
- Meetings
- Payroll / money
- Complaints
- Excuses
- Greetings
- Thanks
- General HR
- Unknown / unclear messages

There are already 150+ responses included, and there is no practical limit to how many you add.

## How the bot works

```text
Slack
  ↓
Socket Mode
  ↓
Slack Bolt
  ↓
Keyword matcher
  ↓
Category
  ↓
Random response
  ↓
Slack
```

No AI is involved.

## Troubleshooting

### It doesn't respond to mentions

Check:

1. The bot is installed in the workspace.
2. The bot is invited to the channel.
3. `app_mention` is enabled.
4. `SLACK_BOT_TOKEN` is correct.
5. `SLACK_APP_TOKEN` is correct.
6. Socket Mode is enabled.
7. Railway is running.

### It doesn't respond to DMs

Check that `message.im` is enabled and the app has the IM scopes listed above. Reinstall the Slack app after changing permissions.

### Railway fails

The start command is:

```bash
npm start
```

which runs:

```bash
node index.js
```

### Security

Never commit Slack tokens or `.env` files containing secrets. If a token is exposed, revoke/rotate it in Slack immediately.
