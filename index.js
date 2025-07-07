import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import sendToOpenAI from './openai.js';

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const systemPrompt = process.env.SYSTEM_PROMPT || "You are a helpful assistant. Only answer with facts.";
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  try {
    const reply = await sendToOpenAI(systemPrompt, message.content);
    await message.reply(reply);
  } catch (err) {
    console.error('Error handling message:', err);
  }
});

client.login(token);

export default client;
