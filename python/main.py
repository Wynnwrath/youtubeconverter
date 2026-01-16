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
    format_type: str = "mp3" 
    quality: str = "best" #'high', 'medium', 'low'

def run_download(link: str, format_type: str, quality: str):
    try:
        # Settigns for yt-dlp
        ydl_opts = {
            'outtmpl': 'F:/Codes/Usb/%(title)s.%(ext)s', 
            'playlist_items': '1-5', 
            'ffmpeg_location': 'F:/Codes/youtubeconverter/python/', 
            'quiet': True,
            'noplaylist': True,
        }

        # --- AUDIO MODE ---
        if format_type == "mp3":
            print(f"🎵 Mode: MP3")
            ydl_opts.update({
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
            })
            
        # --- VIDEO MODE ---
        elif format_type == "mp4":
            print(f"🎬 Mode: MP4 | Quality: {quality}")
            
            ydl_opts.update({'merge_output_format': 'mp4'})

            if quality == "high":
                fmt = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
            elif quality == "medium":
                fmt = 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]'
            elif quality == "low":
                fmt = 'bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]'
            else:
                fmt = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'

            ydl_opts.update({'format': fmt})

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([link])
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

@app.post("/download")
def download_video(request: VideoRequest):
    print(f"📥 URL: {request.url} | {request.format_type} | {request.quality}")
    
    success = run_download(request.url, request.format_type, request.quality)
    
    if success:
        return {"status": "success", "message": "Saved successfully"}
    else:
        raise HTTPException(status_code=500, detail="Download failed")