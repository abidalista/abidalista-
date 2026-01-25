#!/usr/bin/env python3
"""
Instagram Daily DM Automation Bot

This script automatically sends a specific message to a specific Instagram account
every day at a scheduled time (default: 9:00 AM).
"""

import os
import sys
import time
import logging
from datetime import datetime
from pathlib import Path

import schedule
from dotenv import load_dotenv
from instagrapi import Client
from instagrapi.exceptions import (
    LoginRequired,
    ChallengeRequired,
    TwoFactorRequired,
    BadPassword,
    UserNotFound,
)

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('dm_bot.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Configuration from environment variables
INSTAGRAM_USERNAME = os.getenv('INSTAGRAM_USERNAME')
INSTAGRAM_PASSWORD = os.getenv('INSTAGRAM_PASSWORD')
TARGET_USERNAME = os.getenv('TARGET_USERNAME')
MESSAGE = os.getenv('DM_MESSAGE', 'Hello! This is an automated daily message.')
SCHEDULE_TIME = os.getenv('SCHEDULE_TIME', '09:00')

# Session file path for persistent login
SESSION_FILE = Path('session.json')


class InstagramDMBot:
    """Instagram DM Bot that sends daily messages to a specific user."""

    def __init__(self):
        self.client = Client()
        self.client.delay_range = [1, 3]  # Add delay between requests

    def login(self) -> bool:
        """
        Login to Instagram account.
        Attempts to reuse session if available.

        Returns:
            bool: True if login successful, False otherwise
        """
        if not INSTAGRAM_USERNAME or not INSTAGRAM_PASSWORD:
            logger.error("Instagram credentials not set in environment variables!")
            return False

        try:
            # Try to load existing session
            if SESSION_FILE.exists():
                logger.info("Loading existing session...")
                self.client.load_settings(SESSION_FILE)
                self.client.login(INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD)

                # Verify session is still valid
                try:
                    self.client.get_timeline_feed()
                    logger.info("Session restored successfully!")
                    return True
                except LoginRequired:
                    logger.info("Session expired, performing fresh login...")
                    SESSION_FILE.unlink(missing_ok=True)

            # Fresh login
            logger.info(f"Logging in as {INSTAGRAM_USERNAME}...")
            self.client.login(INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD)

            # Save session for future use
            self.client.dump_settings(SESSION_FILE)
            logger.info("Login successful! Session saved.")
            return True

        except BadPassword:
            logger.error("Invalid password! Please check your credentials.")
            return False
        except TwoFactorRequired:
            logger.error("Two-factor authentication required! Please see README for setup instructions.")
            return False
        except ChallengeRequired:
            logger.error("Instagram challenge required! Please login manually first to verify your account.")
            return False
        except Exception as e:
            logger.error(f"Login failed: {e}")
            return False

    def get_user_id(self, username: str) -> int | None:
        """
        Get user ID from username.

        Args:
            username: Instagram username

        Returns:
            int: User ID if found, None otherwise
        """
        try:
            user_info = self.client.user_info_by_username(username)
            return user_info.pk
        except UserNotFound:
            logger.error(f"User '{username}' not found!")
            return None
        except Exception as e:
            logger.error(f"Error getting user ID: {e}")
            return None

    def send_dm(self, user_id: int, message: str) -> bool:
        """
        Send a direct message to a user.

        Args:
            user_id: Target user's ID
            message: Message to send

        Returns:
            bool: True if message sent successfully
        """
        try:
            self.client.direct_send(message, [user_id])
            logger.info(f"Message sent successfully to user ID: {user_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to send message: {e}")
            return False

    def send_daily_message(self) -> bool:
        """
        Main function to send the daily DM.

        Returns:
            bool: True if message sent successfully
        """
        if not TARGET_USERNAME:
            logger.error("TARGET_USERNAME not set in environment variables!")
            return False

        logger.info(f"Starting daily message send to @{TARGET_USERNAME}")

        # Login if needed
        if not self.login():
            return False

        # Get target user ID
        user_id = self.get_user_id(TARGET_USERNAME)
        if not user_id:
            return False

        # Send the message
        success = self.send_dm(user_id, MESSAGE)

        if success:
            logger.info(f"Daily message sent at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        return success


def job():
    """Scheduled job to send daily DM."""
    logger.info("=" * 50)
    logger.info("Running scheduled DM job...")
    bot = InstagramDMBot()
    bot.send_daily_message()
    logger.info("=" * 50)


def run_scheduler():
    """Run the scheduler to send DMs at the specified time."""
    logger.info(f"Instagram DM Bot started!")
    logger.info(f"Scheduled to send message at {SCHEDULE_TIME} every day")
    logger.info(f"Target user: @{TARGET_USERNAME}")
    logger.info(f"Message: {MESSAGE[:50]}..." if len(MESSAGE) > 50 else f"Message: {MESSAGE}")
    logger.info("-" * 50)

    # Schedule the job
    schedule.every().day.at(SCHEDULE_TIME).do(job)

    # Keep the script running
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute


def send_now():
    """Send a message immediately (for testing)."""
    logger.info("Sending message immediately...")
    bot = InstagramDMBot()
    return bot.send_daily_message()


def main():
    """Main entry point."""
    # Validate configuration
    missing_vars = []
    if not INSTAGRAM_USERNAME:
        missing_vars.append('INSTAGRAM_USERNAME')
    if not INSTAGRAM_PASSWORD:
        missing_vars.append('INSTAGRAM_PASSWORD')
    if not TARGET_USERNAME:
        missing_vars.append('TARGET_USERNAME')

    if missing_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        logger.error("Please create a .env file with the required variables. See .env.example")
        sys.exit(1)

    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == '--now' or sys.argv[1] == '-n':
            # Send message immediately
            success = send_now()
            sys.exit(0 if success else 1)
        elif sys.argv[1] == '--help' or sys.argv[1] == '-h':
            print("""
Instagram Daily DM Bot

Usage:
    python instagram_dm_bot.py           Run the scheduler (sends at configured time)
    python instagram_dm_bot.py --now     Send a message immediately
    python instagram_dm_bot.py --help    Show this help message

Environment Variables (set in .env file):
    INSTAGRAM_USERNAME    Your Instagram username
    INSTAGRAM_PASSWORD    Your Instagram password
    TARGET_USERNAME       Username to send DM to (without @)
    DM_MESSAGE           The message to send (optional)
    SCHEDULE_TIME        Time to send message in HH:MM format (default: 09:00)
            """)
            sys.exit(0)

    # Run the scheduler
    run_scheduler()


if __name__ == '__main__':
    main()
