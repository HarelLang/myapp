from openai import OpenAI
from messages import ChatRequest
from personalities import PERSONALITIES
from fastapi import FastAPI
from typing import Any
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
API_KEY = os.environ.get("OPENAI_API_KEY")

app = FastAPI()


@app.get("/api/personalities")
def api_personalities():
    return [{"id": k, **v} for k, v in PERSONALITIES.items()]


def get_chat_history(request: ChatRequest) -> list[dict[str, Any]]:
    messages = [{"role": "system", "content": PERSONALITIES[request.personality_id]["system_prompt"]}]
    messages += [{"role": message.role, "content": message.content} for message in request.messages]
    return messages


def communicate_with_open_ai(api_key: str, messages: list[dict[str, Any]]) -> dict[str, Any]:
    client = OpenAI(api_key=api_key)
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )
    return {"reply": response.choices[0].message.content}


@app.post("/api/chat")
def chat(request: ChatRequest):
    return communicate_with_open_ai(API_KEY, get_chat_history(request))


frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")