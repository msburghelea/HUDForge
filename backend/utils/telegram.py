import httpx

def send_telegram(token, chat_id, message):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    response = httpx.get(url, params={"chat_id": chat_id, "text": message})

    return response