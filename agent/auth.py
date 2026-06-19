from dotenv import load_dotenv
import os
import json

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


def _run_setup():
    print("=== Configuracion inicial de HUDForge ===")
    token = ""
    while not token:
        token = input("Pega tu Agent Token y pulsa Enter: ").strip()

    config = _load_config()
    config["agent_token"] = token
    config.setdefault("backend_url", os.getenv("BACKEND_URL", DEFAULT_BACKEND_URL))
    _save_config(config)

    print(f"Configuracion guardada en: {_config_path()}")
    print("El agente empezara a enviar metricas.\n")
    return config


def get_agent_token():
    config = _load_config()
    token = config.get("agent_token") or os.getenv("AGENT_TOKEN")
    if not token:
        config = _run_setup()
        token = config.get("agent_token")
    return token


def get_backend():
    config = _load_config()
    return config.get("backend_url") or os.getenv("BACKEND_URL") or DEFAULT_BACKEND_URL
