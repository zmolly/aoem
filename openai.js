import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

export default async function sendToOpenAI(systemPrompt, userContent) {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent }
  ];
  const { data } = await openai.createChatCompletion({
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    messages
  });
  return data.choices[0].message.content.trim();
}
