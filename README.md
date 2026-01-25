# Instagram Daily DM Automation Bot

Automatically send a specific message to a specific Instagram account every day at 9:00 AM (or any configured time).

## Features

- Sends automated daily DMs to a specified Instagram user
- Configurable message and schedule time
- Session persistence (stays logged in)
- Comprehensive logging
- Easy to set up and run

## Prerequisites

- Python 3.10 or higher
- An Instagram account
- The target user must be followable/messageable

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd abidalista-
```

### 2. Set up Python environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # On Linux/Mac
# or
venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure your settings

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your details
nano .env  # or use any text editor
```

Fill in your `.env` file:

```env
INSTAGRAM_USERNAME=your_instagram_username
INSTAGRAM_PASSWORD=your_instagram_password
TARGET_USERNAME=person_to_message
DM_MESSAGE=Good morning! Hope you have a great day!
SCHEDULE_TIME=09:00
```

### 4. Run the bot

**Option A: Run continuously (scheduler mode)**
```bash
python instagram_dm_bot.py
```
The bot will run continuously and send messages at the scheduled time every day.

**Option B: Send a message immediately (for testing)**
```bash
python instagram_dm_bot.py --now
```

## Usage

```
python instagram_dm_bot.py           # Run the scheduler
python instagram_dm_bot.py --now     # Send message immediately
python instagram_dm_bot.py --help    # Show help
```

## Running as a Background Service

### Using systemd (Linux)

1. Create a service file:

```bash
sudo nano /etc/systemd/system/instagram-dm-bot.service
```

2. Add the following content:

```ini
[Unit]
Description=Instagram DM Bot
After=network.target

[Service]
Type=simple
User=your_username
WorkingDirectory=/path/to/abidalista-
Environment=PATH=/path/to/abidalista-/venv/bin
ExecStart=/path/to/abidalista-/venv/bin/python instagram_dm_bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

3. Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable instagram-dm-bot
sudo systemctl start instagram-dm-bot
```

### Using cron (Alternative)

Add a cron job to run at 9 AM:

```bash
crontab -e
```

Add this line:
```
0 9 * * * cd /path/to/abidalista- && /path/to/venv/bin/python instagram_dm_bot.py --now
```

### Using screen/tmux

```bash
# Using screen
screen -S instagram-bot
python instagram_dm_bot.py
# Press Ctrl+A then D to detach

# Using tmux
tmux new -s instagram-bot
python instagram_dm_bot.py
# Press Ctrl+B then D to detach
```

## Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `INSTAGRAM_USERNAME` | Your Instagram username | Required |
| `INSTAGRAM_PASSWORD` | Your Instagram password | Required |
| `TARGET_USERNAME` | Username to send DM to | Required |
| `DM_MESSAGE` | Message to send | "Hello! This is an automated daily message." |
| `SCHEDULE_TIME` | Time to send (24h format) | "09:00" |

## Troubleshooting

### Two-Factor Authentication (2FA)

If you have 2FA enabled, you'll need to:
1. Generate an app-specific password in Instagram settings, OR
2. Temporarily disable 2FA for initial login, then re-enable

### Challenge Required

If Instagram requires a challenge/verification:
1. Log in to Instagram manually via browser or app
2. Complete any verification challenges
3. Try running the bot again

### Login Issues

- Make sure your credentials are correct
- Check if your account is locked or restricted
- Try logging in manually first to clear any security challenges

## Security Notes

- Never commit your `.env` file (it's in `.gitignore`)
- Keep your `session.json` file secure (contains auth tokens)
- Consider using a secondary Instagram account for automation
- Be aware of Instagram's terms of service regarding automation

## Logs

Logs are written to both console and `dm_bot.log` file. Check the log for:
- Successful message deliveries
- Login attempts
- Any errors or issues

## Disclaimer

This tool is for personal use only. Use responsibly and in accordance with Instagram's Terms of Service. Automated messaging may violate Instagram's policies and could result in account restrictions.

## License

MIT License - Use at your own risk.
