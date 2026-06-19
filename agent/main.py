from metrics import get_all_metrics
from sender import send_metrics
from auth import get_agent_token, get_backend, get_log_path
import logging
import time
import sys

logging.basicConfig(
    filename=get_log_path(),
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)

def main():
    if not get_agent_token():
        sys.exit(1)

    logging.info(f"Enviando metricas a {get_backend()} cada 5 segundos")
    while True:
        try:
            send_metrics(get_all_metrics())
        except Exception as e:
            logging.error(f"Error: {e}")
        time.sleep(5)

if __name__ == "__main__":
    main()