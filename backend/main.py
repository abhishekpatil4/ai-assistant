from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from firebase.init import auth
from composio_config import createNewEntity, isEntityConnected
import logging
from initialise_agent import initialise
from fastapi import UploadFile, File
import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from agent import perform_task
load_dotenv()
client = OpenAI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_token(auth_credentials: HTTPAuthorizationCredentials = Depends(
    HTTPBearer())):
    token = auth_credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Pydantic models
class UserData(BaseModel):
    username: str
    appType: str

class NewEntityData(BaseModel):
    username: str
    appType: str
    redirectUrl: str


class InitialiseAgentData(BaseModel):
    username: str

@app.post("/newentity")
async def handle_request(user_data: NewEntityData,
                         decoded_token: dict = Depends(verify_token)):
    user_id = decoded_token['uid']
    username = user_data.username
    appType = user_data.appType
    redirectUrl = user_data.redirectUrl
    res = createNewEntity(username, appType, redirectUrl)
    return res

@app.post("/checkconnection")
async def handle_request(user_data: UserData,
                         decoded_token: dict = Depends(verify_token)):
    user_id = decoded_token['uid']
    username = user_data.username
    appType = user_data.appType
    res = isEntityConnected(username, appType)
    return res

@app.post("/initialiseagent")
async def handle_request(user_data: InitialiseAgentData,
                         decoded_token: dict = Depends(verify_token)):
    username = user_data.username
    res = initialise(username)
    return res

def transcribe(path: str):
    with open(path, "rb") as audio:
        translation = client.audio.translations.create(
          model="whisper-1",
          file=audio,
        )
    return translation.text

@app.post('/sendaudio')
async def send_audio(audio: UploadFile = File(...)):
    if audio.filename == '':
        return {'error': 'No selected file'}, 400
    
    # Save the file to the desired location
    with open(os.path.join('audios', audio.filename), 'wb') as f:
        f.write(await audio.read())
    
    path = os.path.join('audios', audio.filename)
    res = transcribe(path)
    perform_task(res)
    print("\n\nTranscription: ", res)
    return res

@app.post("/assigntask")
async def assign_task(task_data: dict):
    task_description = task_data.get('task')
    
    if not task_description:
        return {'error': 'Task description is required'}, 400
    
    result = perform_task(task_description)
    return {'result': result}



@app.get("/")
async def handle_request():
    return "ok"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Start the server (if running locally)
# Run the following command in your terminal: uvicorn main:app --reload
