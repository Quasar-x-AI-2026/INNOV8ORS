from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils import analyze_market_data

app = FastAPI()

COMMODITY_MAP = {"Milk": 0, "Onion": 1, "Potato": 2, "Sugar": 3, "Tomato": 4}
MARKET_MAP = {"Azadpur": 0, "Daryaganj": 1, "Ghazipur": 2, "INA Market": 3, "Keshopur": 4, "Okhla": 5, "Rohini": 6}

class PriceRequest(BaseModel):
    month: int
    commodity_name: str
    market_name: str
    actual_price: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/v1/check-price")
async def check_price(data: PriceRequest):
    if data.commodity_name not in COMMODITY_MAP or data.market_name not in MARKET_MAP:
        raise HTTPException(status_code=400, detail="Invalid Commodity or Market Name")
    
    result = analyze_market_data(
        data.month,
        COMMODITY_MAP[data.commodity_name],
        MARKET_MAP[data.market_name],
        data.actual_price
    )
    return {**result, "input": data.dict()}
