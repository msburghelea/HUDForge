import psutil
import httpx

def get_cpu():
    return psutil.cpu_percent(interval=1)

def get_ram():
    return psutil.virtual_memory().percent

def get_disk():
    partitions={}
    for i in psutil.disk_partitions():
        partitions[i.mountpoint]=psutil.disk_usage(i.mountpoint).percent
    return partitions

def get_processes():
    process_list=[]
    for i in psutil.process_iter():
        process_list.append(i.name())

    return process_list

def get_all_metrics():
    final_list={}
    final_list["cpu"]=get_cpu()
    final_list["ram"]=get_ram()
    final_list["disk"]=get_disk()
    final_list["processes"]=get_processes()
    return final_list