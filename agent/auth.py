from dotenv import load_dotenv
import os
load_dotenv()

def get_agent_token():
    return os.getenv("AGENT_TOKEN")

def get_backend():
    return os.getenv("BACKEND_URL")
