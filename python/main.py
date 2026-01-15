from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str

def run_download(link: str):
    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': 'F:/Codes/Music/%(title)s.%(ext)s', 
            'playlist_items': '1-5', 
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'ffmpeg_location': 'F:/Codes/youtubeconverter/python/', 
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([link])
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

@app.post("/download")
def download_video(request: VideoRequest):
    print(f"📥 Received URL: {request.url}")
    
    success = run_download(request.url)
    
    if success:
        return {"status": "success", "message": "Download complete!"}
    else:
        raise HTTPException(status_code=500, detail="Download failed. Check server logs.")
