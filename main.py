from typing import Optional
from enum import Enum #導入Enum並創建一個繼承自str和從繼承的子類Enum

# from fastapi import FastAPI
from pydantic import BaseModel #導入Pydantic的 BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import random as ran  #亂數
import time
app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

#region http://127.0.0.1:8100/api/post/warning/test

class Itempostwarning(BaseModel):
    LL: Optional[int] = None
    L: Optional[int] = None
    H : Optional[int] = None
    HH : Optional[int] = None
    
@app.post("/api/post/warning/test")
def post_warning(item: Itempostwarning , id : str):
    return {"status": True,"data": item}  

#endregion http://127.0.0.1:8100/api/post/warning/tests