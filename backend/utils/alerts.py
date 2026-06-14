from models.settings import Setting
from models.alerts import Alert
from models.logs import log
from sqlalchemy.orm import Session
from utils.telegram import send_telegram

def check_alerts(user_id, metrics, metric_id, db: Session):
    config = db.query(Setting).filter(Setting.user_id == user_id).first()
    if not config:
        return
    if metrics.cpu < config.cpu_threshold_min or metrics.cpu > config.cpu_threshold_max:
        send_telegram(config.telegram_token_id, config.telegram_chat_id, f"CPU ALERT: {metrics.cpu}%")
        new_alert = Alert(user_id=user_id, metric_id=metric_id, type="CPU", message="CPU USAGE ALERT", sent=True)
        new_log = log(user_id=user_id, type="ALERT", message=f"CPU USAGE ALERT: {metrics.cpu}%")
        db.add(new_alert)
        db.add(new_log)
        db.commit()
    if metrics.ram < config.ram_threshold_min or metrics.ram > config.ram_threshold_max:
        send_telegram(config.telegram_token_id, config.telegram_chat_id, f"RAM ALERT: {metrics.ram}%")
        new_alert = Alert(user_id=user_id, metric_id=metric_id, type="RAM", message="RAM USAGE ALERT", sent=True)
        new_log = log(user_id=user_id, type="ALERT", message=f"RAM USAGE ALERT: {metrics.ram}%")
        db.add(new_alert)
        db.add(new_log)
        db.commit()
    for mountpoint, usage in metrics.disk.items():
        if usage < config.disk_threshold_min or usage > config.disk_threshold_max:
            send_telegram(config.telegram_token_id, config.telegram_chat_id, f"DISK ALERT {mountpoint}: {usage}%")
            new_alert = Alert(user_id=user_id, metric_id=metric_id, type="DISK", message=f"DISK USAGE ALERT {mountpoint}", sent=True)
            new_log = log(user_id=user_id, type="ALERT", message=f"DISK USAGE ALERT {mountpoint}: {usage}%")
            db.add(new_alert)
            db.add(new_log)
            db.commit()