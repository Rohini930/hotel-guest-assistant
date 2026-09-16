import json
from pathlib import Path
DATA_PATH=Path(__file__).with_name("hotel_data.json")
def load_hotel_data():
    with DATA_PATH.open(encoding="utf-8") as f: return json.load(f)
