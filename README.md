# Discord to Slack Message Importer  

This project provides scripts to import Discord messages into Slack and delete messages posted by the bot.  

## Prerequisites  

- Node.js installed on your system  
- A Slack bot with the necessary permissions  
- Your Discord chat exported as a JSON file  

## Setup  

1. Clone this repository.  
2. Obtain your Slack bot token (`SLACK_BOT_TOKEN`) and Slack channel ID (`SLACK_CHANNEL_ID`).  
3. Export your Discord chat as a JSON file and save it as `discord_chat.json`.  

## Importing Discord Messages to Slack  

1. Open `import_messages.js`.  
2. Set the values for `SLACK_BOT_TOKEN` and `SLACK_CHANNEL_ID`.  
3. Run the script:  

```sh
node import_messages.js
```
This will send the messages from discord_chat.json to the specified Slack channel.

## Deleting Messages from Slack

1.	Open delete_messages.js.
2.	Set the values for SLACK_BOT_TOKEN and SLACK_CHANNEL_ID.
3.	Run the script:

```sh
node delete_messages.js
```
This will delete messages posted by the bot in the specified Slack channel.

## Notes
	•	Ensure that your Slack bot has permission to post and delete messages in the channel.
	•	If you encounter any issues, check your bot’s permissions and the format of discord_chat.json.

## License

This project is open-source. Feel free to modify and use it as needed.
