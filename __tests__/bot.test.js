import { jest } from '@jest/globals';

// Mock discord.js
jest.unstable_mockModule('discord.js', () => {
  return {
    Client: class {
      listeners = {};
      user = { tag: 'bot#1234' };
      on(event, fn) { this.listeners[event] = fn; }
      once(event, fn) { this.listeners[event] = fn; }
      emit(event, ...args) { if (this.listeners[event]) this.listeners[event](...args); }
      login() { return Promise.resolve(); }
    },
    GatewayIntentBits: { Guilds: 1, GuildMessages: 2, MessageContent: 4 }
  };
});

// Mock openai helper
const sendToOpenAI = jest.fn();
jest.unstable_mockModule('../openai.js', () => ({ default: sendToOpenAI }));

const { default: client } = await import('../index.js');

describe('Discord OpenAI Bot', () => {
  beforeEach(() => {
    sendToOpenAI.mockReset();
  });

  test('sends user message to OpenAI and replies', async () => {
    sendToOpenAI.mockResolvedValue('response from openai');
    const message = { author: { bot: false }, content: 'hello', reply: jest.fn() };
    await client.listeners['messageCreate'](message);
    expect(sendToOpenAI).toHaveBeenCalledWith(process.env.SYSTEM_PROMPT, 'hello');
    expect(message.reply).toHaveBeenCalledWith('response from openai');
  });

  test('ignores bot messages', async () => {
    const message = { author: { bot: true }, content: 'ignore', reply: jest.fn() };
    await client.listeners['messageCreate'](message);
    expect(sendToOpenAI).not.toHaveBeenCalled();
  });

  test('logs OpenAI errors', async () => {
    const error = new Error('fail');
    sendToOpenAI.mockRejectedValue(error);
    console.error = jest.fn();
    const message = { author: { bot: false }, content: 'hello', reply: jest.fn() };
    await client.listeners['messageCreate'](message);
    expect(console.error).toHaveBeenCalled();
  });

  test('logs Discord reply errors', async () => {
    sendToOpenAI.mockResolvedValue('ok');
    console.error = jest.fn();
    const message = { author: { bot: false }, content: 'hi', reply: jest.fn().mockRejectedValue(new Error('discord fail')) };
    await client.listeners['messageCreate'](message);
    expect(console.error).toHaveBeenCalled();
  });
});
