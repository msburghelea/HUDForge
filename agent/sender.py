from auth import get_agent_token, get_backend
import httpx

def send_metrics(metrics):
    backend= get_backend()
    token=get_agent_token()
    headers={"X-Agent-Token":token}
    response = httpx.post(
        f"{backend}/metrics/send",
        json=metrics,
        headers=headers
    )
    return response

