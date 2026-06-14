from metrics import get_all_metrics
from sender import send_metrics
import time

def main():
    while True:
        send_metrics(get_all_metrics())
        time.sleep(5)

if __name__ == "__main__":
    main()