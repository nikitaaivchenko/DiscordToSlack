const fs = require("fs");
const axios = require("axios");

// Slack Bot Token & Channel ID (Replace these)
const SLACK_BOT_TOKEN = "SLACK_BOT_TOKEN"; // Replace with your bot token
const SLACK_CHANNEL_ID = "SLACK_CHANNEL_ID"; // Replace with your Slack channel ID

// Load Discord JSON
function loadDiscordChat(discordJsonPath) {
    return JSON.parse(fs.readFileSync(discordJsonPath, "utf-8")).messages;
}

// Convert Discord message format to Slack message format
function convertMessageText(text) {
    // Convert mentions: <@123456789> → <@U123456789>
    text = text.replace(/<@(\d+)>/g, "<@U$1>");

    // Convert Discord markdown to Slack markdown
    text = text.replace(/\*\*(.*?)\*\*/g, "*$1*"); // Bold
    text = text.replace(/\*(.*?)\*/g, "_$1_"); // Italic
    text = text.replace(/```(.*?)```/gs, "```$1```"); // Code block (same in Slack)

    return text;
}

// Send message to Slack
async function sendToSlack(text) {
    try {
        const response = await axios.post(
            "https://slack.com/api/chat.postMessage",
            {
                channel: SLACK_CHANNEL_ID,
                text: text
            },
            {
                headers: {
                    Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.data.ok) {
            console.log("Message sent:", text);
        } else {
            console.error("Error:", response.data);
        }
    } catch (error) {
        console.error("Request failed:", error);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Process & send messages
async function processDiscordChat(discordJsonPath) {
    const messages = loadDiscordChat(discordJsonPath);

    for (const msg of messages) {
        const formattedText = `${msg.author.name}: ${convertMessageText(msg.content)}`;
        await sendToSlack(formattedText);
        await delay(1000); // added delay to prevent DDOS of Slack postMessage API
    }

    console.log("✅ All messages sent to Slack!");
}

// Run conversion
processDiscordChat("discord_chat.json");
