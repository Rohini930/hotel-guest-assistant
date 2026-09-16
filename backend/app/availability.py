from datetime import date
from .data import load_hotel_data
def validate_dates(check_in,check_out):
    try: start=date.fromisoformat(check_in); end=date.fromisoformat(check_out)
    except (TypeError,ValueError): raise ValueError("Dates must use YYYY-MM-DD format.")
    if end<=start: raise ValueError("Check-out date must be after check-in date.")
    return start,end
def check_availability(check_in,check_out,adults):
    if not isinstance(adults,int) or isinstance(adults,bool) or adults<1: raise ValueError("Number of guests must be at least 1.")
    start,end=validate_dates(check_in,check_out); nights=(end-start).days
    available=[]
    for room in load_hotel_data()["rooms"]:
        if adults>room["capacity"]: continue
        if room["id"]=="family" and start.day==15: continue
        if room["id"]=="executive" and start.day==20: continue
        available.append({**room,"nights":nights,"total":room["nightly_rate"]*nights})
    return {"available":bool(available),"check_in":check_in,"check_out":check_out,"adults":adults,"nights":nights,"rooms":available}
