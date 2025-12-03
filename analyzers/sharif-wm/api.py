import uvicorn
from fastapi import FastAPI

from pydantic import BaseModel

import embed
import extract

app = FastAPI()

class EmbedArgs(BaseModel):
    base: str
    watermark: str

class ExtractArgs(BaseModel):
    image: str

@app.get("/strategy")
async def strategy_api():
    return {
            "embed": {
                "request": {
                    "base": "image;base64",
                    "watermark": "string;int64"
                },
                "response": {
                    "image": "image;base64"
                }
            },
            "extract": {
                "request": {
                    "image": "image;base64"
                },
                "response": {
                    "watermark": "image;base64"
                }
            }
        }

@app.post("/embed")
async def embed_api(args : EmbedArgs):
    return { "image": embed.embed(args.base, args.watermark) }

@app.post("/extract")
async def extract_api(args : ExtractArgs):
    return { "watermark": extract.extract(args.image) }

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=10002)
