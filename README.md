# Discord OpenAI Bot

This is a simple Discord bot that forwards messages to the OpenAI Chat API and replies with the response.

## Setup

1. Copy `.env.example` to `.env` and fill in your keys.

```
cp .env.example .env
```

2. Install dependencies (requires Node.js 18+).

```
npm install
```

3. Start the bot.

```
npm start
```

## Configuration

Environment variables:

- `OPENAI_API_KEY` – your OpenAI API key.
- `DISCORD_TOKEN` – Discord bot token.
- `SYSTEM_PROMPT` – system prompt sent with every request.
- `OPENAI_MODEL` – OpenAI model (default `gpt-3.5-turbo`).

## Testing

Run the Jest test suite:

```
npm test
```
