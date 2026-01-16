import { BsArrowLeftRight, BsDownload, BsCheckCircle, BsExclamationCircle } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; 
import { LuInfo } from "react-icons/lu";
import { FaPaste, FaVideo, FaMusic } from "react-icons/fa"; 
import { CiLink } from "react-icons/ci";
import { useState } from "react";

export default function MainPage() {

    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('idle');  // 'idle', 'loading', 'success', 'error'
    const [format, setFormat] = useState('mp3'); // 'mp3' or 'mp4'
    const [quality, setQuality] = useState('high'); // 'high', 'medium', 'low'

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setUrl(text);
        } catch (err) {
            console.error('Failed to read clipboard', err);
        }
    };

    const handleDownload = async () => {
        if (!url) return;
        setStatus('loading');

        try {
            const response = await fetch('http://127.0.0.1:8000/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                
                body: JSON.stringify({ url: url, format_type: format, quality: quality }),
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => { setStatus('idle'); setUrl(''); }, 4000); 
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 4000);
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 relative overflow-hidden">
            <div className={`fixed top-6 right-6 z-50 transition-all duration-500 transform ${status === 'idle' ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                <div className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-2xl border border-white/10 backdrop-blur-md ${
                    status === 'loading' ? 'bg-blue-900/95 text-white' :
                    status === 'success' ? 'bg-green-600/95 text-white' :
                    'bg-red-600/95 text-white'
                }`}>
                    <div className="text-2xl">
                        {status === 'loading' && <AiOutlineLoading3Quarters className="animate-spin" />}
                        {status === 'success' && <BsCheckCircle />}
                        {status === 'error'   && <BsExclamationCircle />}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">
                            {status === 'loading' ? 'Processing...' : status === 'success' ? 'Download Complete!' : 'Failed'}
                        </h4>
                        <p className="text-xs opacity-90">
                            {status === 'loading' ? `Downloading ${format.toUpperCase()} (${quality})...` : 
                             status === 'success' ? 'Saved to USB Folder' : 'Check console'}
                        </p>
                    </div>
                </div>
            </div>

            <aside className="flex flex-col shadow-xl text-white bg-zinc-900 w-25 border-s border-gray-800 z-10">
                <div className="flex flex-col justify-center items-center mt-6 mb-8 gap-4">
                    <a className="group flex flex-col items-center px-2 py-2 font-medium rounded-md hover:bg-white hover:text-gray-800 transition-colors" href="#">
                        <BsArrowLeftRight className="text-4xl text-gray-300 group-hover:text-gray-900 mx-auto mb-2 transition-colors" />
                    </a>
                    <img src="/sky.jpg" alt="Logo" className="w-20 h-20 rounded-full object-cover transition-transform duration-300 hover:scale-110 cursor-pointer" />
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 bg-black flex flex-col items-center justify-center p-4">
                <div className="pt-3 mb-6">
                    <img src="/pluto.png" alt="Pluto" className="w-40 drop-shadow-lg"/>
                </div>

                <div className="max-w-2xl w-full mx-auto bg-black rounded-2xl shadow-2xl border border-gray-800 p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Download Media</h2>
                    
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="bfk text-sm font-medium text-gray-400 mb-1">YouTube URL</label>
                            <CiLink className="absolute top-[38px] left-4 text-gray-400 text-xl pointer-events-none"/>
                            <input 
                                type="text" value={url} placeholder="Paste link here..."
                                className="w-full bg-black text-white border border-gray-700 rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none transition"
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 bg-gray-900 p-1 rounded-lg">
                            <button onClick={() => setFormat('mp3')} className={`py-2 rounded-md text-sm font-medium transition ${format === 'mp3' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                                <FaMusic className="inline mr-2"/> Audio (MP3)
                            </button>
                            <button onClick={() => setFormat('mp4')} className={`py-2 rounded-md text-sm font-medium transition ${format === 'mp4' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                                <FaVideo className="inline mr-2"/> Video (MP4)
                            </button>
                        </div>

                        <div className={`overflow-hidden transition-all duration-300 ${format === 'mp4' ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="flex gap-2">
                                {['high', 'medium', 'low'].map((q) => (
                                    <button 
                                        key={q}
                                        onClick={() => setQuality(q)}
                                        className={`flex-1 py-2 text-xs font-bold uppercase rounded border transition ${
                                            quality === q 
                                            ? 'bg-blue-600 border-blue-500 text-white' 
                                            : 'bg-black border-gray-800 text-gray-500 hover:border-gray-600'
                                        }`}
                                    >
                                        {q === 'high' ? 'High (HD)' : q === 'medium' ? 'Medium (720p)' : 'Low (360p)'}
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-gray-500 text-[10px] mt-1">
                                *Select "Low" for Messenger/Email sharing
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                            <button onClick={handleDownload} disabled={status === 'loading'} className={`w-full font-bold py-3 rounded-lg transition shadow-lg ${status === 'loading' ? 'bg-gray-700 cursor-not-allowed text-gray-300' : status === 'success' ? 'bg-green-600 text-white' : status === 'error' ? 'bg-red-600 text-white' : 'bg-blue-900 hover:bg-blue-800 text-white shadow-blue-500/30'}`}>
                                {status === 'loading' ? 'Downloading...' : status === 'success' ? 'Saved!' : status === 'error' ? 'Error' : 'Start Download'}
                            </button>
                            <button onClick={handlePaste} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2 border border-gray-700">
                                <FaPaste className="text-lg" /> <span>Paste</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}