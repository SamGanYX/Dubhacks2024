const OpenAI = require('openai'); // Assuming you have the openai package installed

const YOUR_API_KEY = "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";

const openai = new OpenAI({
    apiKey: YOUR_API_KEY,
    baseUrl: "https://api.perplexity.ai"
});

const messages = [
    {
        role: "system",
        content: "You are an artificial intelligence assistant and you need to engage in a helpful, detailed, polite conversation with a user."
    },
    {
        role: "user",
        content: "How many stars are in the universe?"
    }
];

// Chat completion without streaming
async function getChatCompletion() {
    const response = await openai.chat.completions.create({
        model: "llama-3-sonar-large-32k-online",
        messages: messages
    });
    console.log(response);
}

// Chat completion with streaming
async function getChatCompletionStream() {
    const responseStream = openai.chat.completions.create({
        model: "llama-3-sonar-large-32k-online",
        messages: messages,
        stream: true
    });

    for await (const response of responseStream) {
        console.log(response);
    }
}

// Call the functions
getChatCompletion();
getChatCompletionStream();
