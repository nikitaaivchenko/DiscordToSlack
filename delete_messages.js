const axios = require("axios");

// 🔑 Specify your bot token and channel ID
const SLACK_BOT_TOKEN = "SLACK_BOT_TOKEN"; // Your bot token
const SLACK_CHANNEL_ID = "SLACK_CHANNEL_ID"; // Slack channel ID

// Delay function to avoid spamming the API
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch messages from the Slack channel
async function getMessages() {
    try {
        const response = await axios.get("https://slack.com/api/conversations.history", {
            headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` },
            params: { channel: SLACK_CHANNEL_ID, limit: 1000 }
        });

        if (response.data.ok) {
            return response.data.messages;
        } else {
            console.error("❌ Error fetching messages:", response.data.error);
            return [];
        }
    } catch (error) {
        console.error("❌ Request error:", error);
        return [];
    }
}

// Delete messages sent by the bot
async function deleteBotMessages() {
    const messages = await getMessages();

    for (const msg of messages) {
        if (msg.bot_id) { // Check if the message was sent by a bot
            try {
                const deleteResponse = await axios.post(
                    "https://slack.com/api/chat.delete",
                    {
                        channel: SLACK_CHANNEL_ID,
                        ts: msg.ts
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (deleteResponse.data.ok) {
                    console.log(`✅ Deleted message with TS: ${msg.ts}`);
                } else {
                    console.error(`❌ Deletion error: ${deleteResponse.data.error}`);
                }
            } catch (error) {
                console.error("❌ Error deleting message:", error);
            }

            await delay(1000); // added delay to prevent DDOS of Slack postMessage API
        }
    }

    console.log("🎉 All bot messages have been deleted!");
}

// 🚀 Run the script
deleteBotMessages();
