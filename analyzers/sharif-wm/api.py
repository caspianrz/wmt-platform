import uvicorn
from fastapi import FastAPI

from pydantic import BaseModel

import embed
import extract

app = FastAPI()

class EmbedArgs(BaseModel):
    inp: str
    outp: str
    uid: str

class ExtractArgs(BaseModel):
    inp: str

@app.post("/embed")
async def embed_api(args : EmbedArgs):
    return { "id": embed.embed(args.inp, args.outp, args.uid) }

@app.post("/extract")
async def extract_api(args : ExtractArgs):
    return { "id": extract.extract(args.inp) }

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=9000)
