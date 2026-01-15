import { BsArrowLeftRight, BsDownload, BsCheckCircle, BsExclamationCircle } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // New loading icon
import { LuInfo } from "react-icons/lu";
import { FaPaste } from "react-icons/fa";
import { CiLink } from "react-icons/ci";
import { useState } from "react";

export default function MainPage() {

    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('idle'); 

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
                body: JSON.stringify({ url: url }),
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    setStatus('idle');
                    setUrl(''); 
                }, 4000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 4000);
            }
        } catch (error) {
            console.error("Connection error:", error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 relative overflow-hidden">
            
            {/* --- NEW: FLOATING NOTIFICATION CARD --- */}
            {/* Conditional rendering: Only shows if status is NOT idle */}
            <div className={`fixed top-6 right-6 z-50 transition-all duration-500 transform ${status === 'idle' ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                <div className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-2xl border border-white/10 backdrop-blur-md ${
                    status === 'loading' ? 'bg-blue-900/90 text-white' :
                    status === 'success' ? 'bg-green-600/90 text-white' :
                    'bg-red-600/90 text-white'
                }`}>
                    {/* Icon Logic */}
                    <div className="text-2xl">
                        {status === 'loading' && <AiOutlineLoading3Quarters className="animate-spin" />}
                        {status === 'success' && <BsCheckCircle />}
                        {status === 'error'   && <BsExclamationCircle />}
                    </div>
                    
                    {/* Text Logic */}
                    <div>
                        <h4 className="font-bold text-sm">
                            {status === 'loading' ? 'Processing...' :
                             status === 'success' ? 'Download Complete!' :
                             'Download Failed'}
                        </h4>
                        <p className="text-xs opacity-80">
                            {status === 'loading' ? 'Converting video to MP3' :
                             status === 'success' ? 'Saved to your Music folder' :
                             'Please check the URL'}
                        </p>
                    </div>
                </div>
            </div>


            {/* --- SIDEBAR --- */}
            <aside className="flex flex-col shadow-xl text-white bg-zinc-900 w-25 border-s border-gray-800 z-10">
                <div className="flex flex-col justify-center items-center mt-6 mb-8 gap-4">
                    <div>
                        <a className="group flex flex-col items-center px-2 py-2 font-medium rounded-md hover:bg-white hover:text-gray-800 transition-colors" href="#">
                            <BsArrowLeftRight className="text-4xl text-gray-300 group-hover:text-gray-900 mx-auto mb-2 transition-colors" />
                        </a>
                    </div>
                    <img src="/sky.jpg" alt="Logo" className="w-20 h-20 rounded-full object-cover transition-transform duration-300 hover:scale-110 cursor-pointer" />
                </div>
                <nav className="flex flex-col justify-between flex-1 mb-4">
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="group flex flex-col items-center px-2 py-2 font-medium rounded-md hover:bg-white hover:text-gray-800 m-3 transition-colors">
                                <BsDownload className="text-3xl text-gray-300 group-hover:text-gray-900 mx-auto mb-2 transition-colors" />
                                <span className="text-sm">Downloads</span>
                            </a>     
                        </li>
                        <li>
                            <a href="#" className="group flex flex-col items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-white hover:text-gray-800 m-3 transition-colors">
                                <LuInfo className="text-3xl text-gray-300 group-hover:text-gray-900 mx-auto mb-2 transition-colors" />
                                <span className="text-sm">About</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 bg-black flex flex-col items-center justify-center p-4">
                <div className="pt-3 mb-6">
                    <img src="/pluto.png" alt="Pluto" className="w-40 drop-shadow-lg"/>
                </div>

                <div className="max-w-2xl w-full mx-auto bg-black rounded-2xl shadow-2xl border border-gray-800 p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Download MP3</h2>
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-400 mb-1">YouTube URL</label>
                            <CiLink className="absolute top-[38px] left-4 text-gray-400 text-xl pointer-events-none"/>
                            <input 
                                type="text" 
                                value={url}
                                placeholder="Paste link here..."
                                className="w-full bg-black text-white border border-gray-700 rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                            <button 
                                onClick={handleDownload}
                                disabled={status === 'loading'}
                                className={`w-full font-bold py-3 rounded-lg transition shadow-lg 
                                    ${status === 'loading' ? 'bg-gray-700 cursor-not-allowed text-gray-300' : 
                                      'bg-blue-900 hover:bg-blue-800 text-white shadow-blue-500/30'}`
                                }
                            >
                                {status === 'loading' ? 'Downloading...' : 'Start Download'}
                            </button>

                            <button onClick={handlePaste} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2 border border-gray-700">
                                <FaPaste className="text-lg" />
                                <span>Paste</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}