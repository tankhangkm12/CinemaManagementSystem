from fastapi import FastAPI
from dotenv import load_dotenv
import uvicorn
import os

load_dotenv()
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
