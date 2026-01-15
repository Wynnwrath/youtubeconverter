from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
import os
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str

def delete_file(path: str):
    if os.path.exists(path):
        os.remove(path)
        print(f"🗑️ Deleted temp file: {path}")

@app.post("/download")
def download_video(request: VideoRequest, background_tasks: BackgroundTasks):
    try:
        file_id = str(uuid.uuid4())
        filename = f"{file_id}.mp3"
        
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': file_id, 
            'noplaylist': True,
            'quiet': True,
            'cookiefile': 'cookies.txt',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([request.url])

        final_path = f"{file_id}.mp3"
        if not os.path.exists(final_path):
             for file in os.listdir('.'):
                 if file.startswith(file_id):
                     final_path = file
                     break
        
        if not os.path.exists(final_path):
            raise Exception("File not found after download")

        background_tasks.add_task(delete_file, final_path)

        return FileResponse(
            path=final_path, 
            filename="downloaded_song.mp3",
            media_type='audio/mpeg'
        )

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))