from dotenv import load_dotenv
import os
import json
import tkinter as tk
from tkinter import simpledialog, messagebox

load_dotenv()

DEFAULT_BACKEND_URL = "https://hudforge.onrender.com"


def _config_dir():
    base = os.getenv("APPDATA") or os.path.expanduser("~")
    path = os.path.join(base, "HUDForge")
    os.makedirs(path, exist_ok=True)
    return path


def _config_path():
    return os.path.join(_config_dir(), "config.json")


def _load_config():
    try:
        with open(_config_path(), "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def _save_config(config):
    with open(_config_path(), "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2)


def _ask_token():
    root = tk.Tk()
    root.withdraw()
    token = simpledialog.askstring("HUDForge", "Pega tu Agent Token:", parent=root)
    root.destroy()
    return token.strip() if token else None


def _run_setup():
    token = _ask_token()
    if not token:
        root = tk.Tk()
        root.withdraw()
        messagebox.showerror("HUDForge", "No se proporcionó un token. El agente se cerrará.")
        root.destroy()
        return None

    config = _load_config()
    config["agent_token"] = token
    _save_config(config)
    return config


def get_agent_token():
    config = _load_config()
    token = config.get("agent_token") or os.getenv("AGENT_TOKEN")
    if not token:
        config = _run_setup()
        token = config.get("agent_token") if config else None
    return token


def get_backend():
    return os.getenv("BACKEND_URL") or DEFAULT_BACKEND_URL


def get_log_path():
    return os.path.join(_config_dir(), "agent.log")
