from metrics import get_all_metrics
from sender import send_metrics
from auth import get_agent_token, get_backend
import time

def main():
    get_agent_token()
    print(f"Enviando metricas a {get_backend()} cada 5 segundos...")
    while True:
        try:
            send_metrics(get_all_metrics())
        except Exception as e:
            print(f"Error: {e}")
        time.sleep(5)

if __name__ == "__main__":
    main()