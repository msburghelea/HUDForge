from pydantic import BaseModel

class MetricCreate(BaseModel):
    cpu: float
    ram: float
    disk: dict[str,float]
    processes: list[str]