import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'Roast My Landing Page',
  },
})

export async function roastWebsite(screenshotBase64: string): Promise<{
  roastPoints: string[]
  fixSuggestions: string[]
  overallScore: number
  verdict: string
}> {
  const response = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a funny but helpful website critic. Your job is to point out design problems in a way that makes people laugh AND learn.

IMPORTANT RULES:
1. Use SIMPLE English - like you're talking to a friend
2. NO fancy words or design jargon
3. Keep sentences short and punchy
4. Be funny but not mean - we want them to laugh, not cry
5. Every roast should help them understand what's wrong
6. Use everyday comparisons (like "messy room", "hard to read menu", etc.)

Things you look for:
- Can people tell what the site is about in 3 seconds?
- Is the main button easy to find?
- Are the colors easy on the eyes?
- Is the text easy to read?
- Does it look trustworthy?
- Is there too much going on?
- Does it look modern or outdated?

Your roast style:
- Short and snappy (max 15 words per roast)
- Use emojis occasionally for fun
- Make real-world comparisons people understand
- Point to specific things you see
- Be the funny friend who tells the truth`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Look at this landing page and roast it! But keep it simple and fun.

Give me:

1. **7-10 roast points** - Short, funny observations about what's wrong
   Examples of GOOD simple roasts:
   - "Your button is so small, I need a magnifying glass to find it 🔍"
   - "This looks like a website from 2005. Did a time machine bring it here?"
   - "There's so much text, I got tired just looking at it"
   - "The colors are fighting each other. Nobody's winning."
   - "I have no idea what you're selling. And I looked for 10 seconds."
   
   BAD roasts (too complex, avoid these):
   - "The visual hierarchy is compromised" (too technical)
   - "Your typography lacks consistency" (jargon)
   - "The UX paradigm is flawed" (nobody talks like this)

2. **5-7 fix suggestions** - Simple advice anyone can understand
   Examples of GOOD fixes:
   - "Make your main button bigger and brighter - people should see it instantly"
   - "Add some space between sections - everything is too cramped"
   - "Use fewer colors - pick 2-3 and stick with them"
   - "Put your main message at the top in big text"
   
3. **Overall score** - Rate 1-10 (be honest but fair)

4. **Verdict** - One funny sentence that sums it all up (max 15 words)
   Examples:
   - "This page is working hard, but in all the wrong directions."
   - "It's like a garage sale - lots of stuff, no organization."
   - "Your page needs a spa day and a fresh start."

Format as JSON:
{
  "roastPoints": ["roast 1", "roast 2", ...],
  "fixSuggestions": ["fix 1", "fix 2", ...],
  "overallScore": 5,
  "verdict": "Short funny summary here"
}`,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${screenshotBase64}`,
            },
          },
        ],
      },
    ],
    max_tokens: 2000,
    temperature: 0.85,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from AI')
  }

  const parsed = JSON.parse(content)
  return {
    roastPoints: parsed.roastPoints || [],
    fixSuggestions: parsed.fixSuggestions || [],
    overallScore: parsed.overallScore || 5,
    verdict: parsed.verdict || 'This page needs some love.',
  }
}
