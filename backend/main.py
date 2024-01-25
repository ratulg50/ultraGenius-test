from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict
from lorem_text import lorem

app = FastAPI()

users_db = {
    "user1": {"username": "user1", "password": "password1"},
    "user2": {"username": "user2", "password": "password2"},
}
session_tokens = set()

SECRET_KEY = "dummy_secret_key"
ALGORITHM = "HS256"

def create_dummy_token(data: dict):
    return data["username"] + "_dummy_token"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    if token not in session_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints
@app.post("/login")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    username = form_data.username
    password = form_data.password
    if username in users_db and users_db[username]["password"] == password:
        token = create_dummy_token({"username": username})
        session_tokens.add(token)
        return {"access_token": token, "token_type": "bearer"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/discussion-summary")
async def get_discussion_summary(current_user: str = Depends(get_current_user)):
    random_text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ..."
    metadata = {"likes": 0, "dislikes": 0}  # Example metadata
    return {"discussion_summary": random_text, "metadata": metadata}

@app.post("/save-discussion-summary")
async def save_discussion_summary(
    summary_data: Dict[str, str], current_user: str = Depends(get_current_user)
):
    summary_text = summary_data.get("summary_text", "")
    return {"message": "Discussion Summary saved successfully"}

@app.post("/logout")
async def logout(current_user: str = Depends(get_current_user)):
    session_tokens.remove(current_user)
    return {"message": "Logout successful"}

@app.get("/random-text")
async def get_random_text():
    random_text = lorem.words(50)
    return {"random_text": random_text}