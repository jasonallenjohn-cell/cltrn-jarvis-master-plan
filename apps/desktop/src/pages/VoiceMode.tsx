
import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Pause, Square, Wand2, Check, AlertCircle } from 'lucide-react';
import { useMemories } from '../hooks/useMemories';

type VoiceModeType = 'meeting' | 'dictation';

// Polyfill for getUserMedia in insecure contexts (Tauri dev mode)
function getMediaStream(): Promise<MediaStream> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia({ audio: true });
    }

    // Fallback for older browsers / insecure contexts
    const getUserMedia =
        (navigator as any).getUserMedia ||
        (navigator as any).webkitGetUserMedia ||
        (navigator as any).mozGetUserMedia;

    if (getUserMedia) {
        return new Promise((resolve, reject) => {
            getUserMedia.call(navigator, { audio: true }, resolve, reject);
        });
    }

    return Promise.reject(new Error('getUserMedia is not supported in this browser'));
}

export default function VoiceMode() {
    const [mode, setMode] = useState<VoiceModeType>('dictation');
    const [isRecording, setIsRecording] = useState(false);
    const [bars, setBars] = useState<number[]>(Array(40).fill(20));
    const [transcript, setTranscript] = useState('');
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [duration, setDuration] = useState(0);
    const [micAvailable, setMicAvailable] = useState<boolean | null>(null);
    const { addMemory } = useMemories();

    // Refs for audio
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const recognitionRef = useRef<any>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Check if mic API is available on mount
    useEffect(() => {
        const hasMic = !!(
            (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
            (navigator as any).getUserMedia ||
            (navigator as any).webkitGetUserMedia ||
            (navigator as any).mozGetUserMedia
        );
        setMicAvailable(hasMic);
    }, []);

    // Format duration as mm:ss
    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Simulated recording (fallback when mic API unavailable)
    const startSimulatedRecording = useCallback(() => {
        setIsRecording(true);
        setError(null);
        setDuration(0);

        // Simulated waveform
        const interval = setInterval(() => {
            setBars(prev => prev.map(() => 10 + Math.random() * 80));
        }, 100);
        animFrameRef.current = interval as any;

        // Simulated transcript after 3s
        const timeout = setTimeout(() => {
            setTranscript('This is a simulated transcript. Microphone access is not available in this environment. To enable real recording, build and run the app in production mode.');
        }, 3000);
        recognitionRef.current = timeout;

        // Timer
        timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
    }, []);

    // Start real microphone recording
    const startRealRecording = useCallback(async () => {
        setError(null);
        setDuration(0);

        try {
            const stream = await getMediaStream();
            mediaStreamRef.current = stream;

            // Set up Web Audio API for waveform visualization
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 128;
            source.connect(analyser);
            analyserRef.current = analyser;

            // Real waveform animation from audio data
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateBars = () => {
                analyser.getByteFrequencyData(dataArray);
                const newBars = Array.from({ length: 40 }, (_, i) => {
                    const index = Math.floor((i / 40) * dataArray.length);
                    return Math.max(10, (dataArray[index] / 255) * 100);
                });
                setBars(newBars);
                animFrameRef.current = requestAnimationFrame(updateBars) as any;
            };
            updateBars();

            // Start Speech Recognition
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    let fullTranscript = '';
                    for (let i = 0; i < event.results.length; i++) {
                        fullTranscript += event.results[i][0].transcript;
                    }
                    setTranscript(fullTranscript);
                };

                recognition.onerror = (event: any) => {
                    if (event.error !== 'no-speech') {
                        console.error('Speech recognition error:', event.error);
                    }
                };

                recognition.onend = () => {
                    if (mediaStreamRef.current) {
                        try { recognition.start(); } catch (e) { /* ignore */ }
                    }
                };

                recognition.start();
                recognitionRef.current = recognition;
            }

            // Timer
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

            setIsRecording(true);
        } catch (err: any) {
            console.error('Failed to start recording:', err);
            if (err.name === 'NotAllowedError') {
                setError('Microphone access denied. Please allow microphone access in your system settings.');
            } else if (err.name === 'NotFoundError') {
                setError('No microphone found. Please connect a microphone.');
            } else {
                setError(err.message || 'Failed to start recording');
            }
        }
    }, []);

    // Start recording (auto-selects real or simulated)
    const startRecording = useCallback(() => {
        if (micAvailable) {
            startRealRecording();
        } else {
            startSimulatedRecording();
        }
    }, [micAvailable, startRealRecording, startSimulatedRecording]);

    // Stop recording and clean up
    const stopRecording = useCallback(() => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current as number);
            clearInterval(animFrameRef.current as any);
            animFrameRef.current = null;
        }

        if (recognitionRef.current) {
            if (typeof recognitionRef.current === 'object' && recognitionRef.current.stop) {
                recognitionRef.current.stop();
            } else {
                clearTimeout(recognitionRef.current);
            }
            recognitionRef.current = null;
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setBars(Array(40).fill(20));
        setIsRecording(false);
    }, []);

    // Save transcript as memory
    const handleStop = async () => {
        stopRecording();
        setError(null);

        if (!transcript.trim()) return;

        try {
            await addMemory(transcript, 'observed');
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                setTranscript('');
                setDuration(0);
            }, 2000);
        } catch (err: any) {
            console.error('Failed to save memory:', err);
            setError(err.message || 'Failed to save memory');
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => { stopRecording(); };
    }, [stopRecording]);

    return (
        <div className="h-full flex flex-col animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-medium text-white">Voice & Meetings</h1>
                    <p className="text-xs text-silver mt-1">Real-time transcription and coaching</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode('meeting')}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${mode === 'meeting'
                                ? 'bg-gold-dim border border-gold/30 text-gold'
                                : 'bg-card border border-white/10 text-silver hover:text-white'
                            }`}
                    >
                        Meeting Mode
                    </button>
                    <button
                        onClick={() => setMode('dictation')}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${mode === 'dictation'
                                ? 'bg-gold-dim border border-gold/30 text-gold'
                                : 'bg-card border border-white/10 text-silver hover:text-white'
                            }`}
                    >
                        Dictation
                    </button>
                </div>
            </div>

            {/* Mic unavailable warning */}
            {micAvailable === false && !isRecording && (
                <div className="mb-4 bg-gold/10 border border-gold/20 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-gold shrink-0" />
                    <p className="text-xs text-gold">Microphone API unavailable in dev mode. Using simulated recording. Build the app for real mic access.</p>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                    <p className="text-xs text-red-500">{error}</p>
                </div>
            )}

            {/* Main Visualizer Area */}
            <div className="flex-1 bg-card rounded-2xl border border-white/[0.08] p-8 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

                {/* Waveform */}
                <div className="flex items-center gap-1 h-32 mb-8">
                    {bars.map((height, i) => (
                        <div
                            key={i}
                            className="w-1.5 bg-gradient-to-t from-gold/20 via-gold to-gold/20 rounded-full transition-all duration-100"
                            style={{ height: `${height}%` }}
                        />
                    ))}
                </div>

                {/* Status Text */}
                <div className="text-center z-10">
                    <p className="text-2xl font-medium text-white mb-2">
                        {saved ? "Memory Saved!" : isRecording ? "Listening..." : "Ready to record"}
                    </p>
                    <p className="text-sm text-silver">
                        {saved
                            ? "Transcript saved to your memory bank"
                            : isRecording
                                ? `${formatDuration(duration)} • ${mode === 'meeting' ? 'Meeting Mode' : 'Dictation Mode'}`
                                : "Press the microphone to start"}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center mb-8">
                <div className="bg-card border border-white/[0.08] rounded-full p-2 flex items-center gap-4 shadow-2xl">
                    {!isRecording ? (
                        <button
                            onClick={startRecording}
                            className="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center hover:bg-[#b8860b] transition-colors"
                        >
                            <Mic fill="currentColor" />
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={stopRecording}
                                className="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center hover:bg-[#b8860b] transition-colors"
                            >
                                <Pause fill="currentColor" />
                            </button>
                            <button
                                onClick={handleStop}
                                className="w-12 h-12 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors"
                            >
                                <Square size={18} fill="currentColor" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Transcript / Action Items */}
            <div className="grid grid-cols-3 gap-6 h-64">
                <div className="col-span-2 bg-card border border-white/[0.08] rounded-xl p-4 overflow-y-auto custom-scrollbar">
                    <h3 className="text-xs font-semibold text-silver uppercase tracking-wider mb-4 sticky top-0 bg-card py-2">Live Transcript</h3>
                    <div className="space-y-4 text-sm">
                        {transcript && (
                            <p className="text-white"><span className="text-gold font-medium">You:</span> {transcript}</p>
                        )}
                        {isRecording && !transcript && (
                            <p className="text-white/50 animate-pulse">Listening for speech...</p>
                        )}
                        {!transcript && !isRecording && (
                            <p className="text-silver/50 text-xs">Start recording to see your transcript here</p>
                        )}
                    </div>
                </div>

                <div className="bg-card border border-white/[0.08] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold text-silver uppercase tracking-wider">AI Insights</h3>
                        <Wand2 size={14} className="text-gold" />
                    </div>

                    <div className="space-y-3">
                        {transcript && transcript.length > 20 && (
                            <>
                                <div className="bg-gold-dim border border-gold/20 rounded-lg p-3">
                                    <div className="text-[10px] text-gold uppercase font-bold mb-1">Words Captured</div>
                                    <p className="text-xs text-white">{transcript.split(' ').length} words</p>
                                </div>
                                <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-3">
                                    <div className="text-[10px] text-silver uppercase font-bold mb-1">Duration</div>
                                    <p className="text-xs text-silver">{formatDuration(duration)} recorded</p>
                                </div>
                            </>
                        )}
                        {saved && (
                            <div className="bg-green/10 border border-green/20 rounded-lg p-3 flex items-center gap-2">
                                <Check size={14} className="text-green" />
                                <p className="text-xs text-green">Memory saved successfully</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
