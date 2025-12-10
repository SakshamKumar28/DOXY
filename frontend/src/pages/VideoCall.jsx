import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import SimplePeer from 'simple-peer';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import toast from 'react-hot-toast';

const VideoCall = () => {
    const { roomId } = useParams();
    const { socket } = useSocket();
    const navigate = useNavigate();
    
    // State
    const [stream, setStream] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [isMyAudioMuted, setIsMyAudioMuted] = useState(false);
    const [isMyVideoOff, setIsMyVideoOff] = useState(false);
    const [remoteStream, setRemoteStream] = useState(null);

    // Refs
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const socketRef = useRef();

    useEffect(() => {
        if (!socket) return;
        socketRef.current = socket;

        // 1. Get User Media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                
                // 2. Join Room (CRITICAL DO NOT REMOVE)
                socket.emit('join-room', roomId);

                // 3. Setup Listeners
                socket.on('user-joined', (userId) => {
                    console.log('User joined:', userId);
                    callUser(userId, currentStream);
                });

                socket.on('signal', ({ signalData, sender }) => {
                    console.log('Received signal from:', sender);
                    answerCall(signalData, sender, currentStream);
                });
            })
            .catch(err => {
                console.error("Failed to get media:", err);
                toast.error("Could not access camera/microphone");
            });

        return () => {
            if (connectionRef.current) {
                connectionRef.current.destroy();
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            socket.off('user-joined');
            socket.off('signal');
        };
    }, [socket, roomId]);

    // Separate effect to assign stream to video element when it becomes available
    useEffect(() => {
        if (myVideo.current && stream) {
            myVideo.current.srcObject = stream;
        }
    }, [stream]);

    // Separate effect for remote stream
    useEffect(() => {
        if (userVideo.current && remoteStream) {
            userVideo.current.srcObject = remoteStream;
        }
    }, [remoteStream]);


    const callUser = (userId, currentStream) => {
        const peer = new SimplePeer({
            initiator: true,
            trickle: true,
            stream: currentStream,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:global.stun.twilio.com:3478' },
                    { urls: 'stun:stun.services.mozilla.com' },
                    { urls: 'stun:stun.nextcloud.com:443' }
                ]
            }
        });
        // ... (rest of listeners same as before) ...
        peer.on('signal', (data) => {
            socket.emit('signal', {
                roomId,
                signalData: data,
                target: userId
            });
        });

        peer.on('stream', (userStream) => {
            setRemoteStream(userStream);
            if (userVideo.current) {
                userVideo.current.srcObject = userStream;
            }
        });

        peer.on('error', (err) => {
            console.error('Peer error:', err);
            // toast.error("Connection unstable. Retrying..."); 
        });

        connectionRef.current = peer;
    };

    const answerCall = (signalData, senderId, currentStream) => {
        if (connectionRef.current) {
            connectionRef.current.signal(signalData);
            if (!callAccepted) setCallAccepted(true);
        } else {
            const peer = new SimplePeer({
                initiator: false,
                trickle: true,
                stream: currentStream,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:global.stun.twilio.com:3478' },
                        { urls: 'stun:stun.services.mozilla.com' },
                        { urls: 'stun:stun.nextcloud.com:443' }
                    ]
                }
            });
            // ... (rest of listeners same as before) ...
            peer.on('signal', (data) => {
                socket.emit('signal', {
                    roomId,
                    signalData: data,
                    target: senderId
                });
            });

            peer.on('stream', (userStream) => {
                setRemoteStream(userStream);
                if (userVideo.current) {
                    userVideo.current.srcObject = userStream;
                }
            });
            
            peer.on('error', (err) => {
                 console.error('Peer error:', err);
            });

            peer.signal(signalData);
            connectionRef.current = peer;
            setCallAccepted(true);
        }
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
            setIsMyAudioMuted(!isMyAudioMuted);
        }
    };

    const toggleVideo = () => {
         if (stream) {
            stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
            setIsMyVideoOff(!isMyVideoOff);
        }
    };

    const leaveCall = () => {
        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
        navigate(-1);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-slate-900 md:p-4 p-0">
            
            <div className="relative w-full h-screen md:h-auto md:max-w-6xl md:aspect-video bg-black md:rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                {/* Remote Video (Main) */}
                {callAccepted && remoteStream ? (
                     <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                ) : (
                    <div className="text-white text-center p-4">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-lg font-medium animate-pulse">Waiting for other to join...</p>
                        <p className="text-sm text-gray-400 mt-2">Room: {roomId}</p>
                        <p className="text-xs text-gray-500 mt-4 max-w-xs mx-auto">
                            If connection takes long, try refreshing both devices.
                        </p>
                    </div>
                )}

                {/* Local Video (Floating) */}
                {stream && (
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 w-24 md:w-56 aspect-[9/16] md:aspect-video bg-gray-800 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl transition-all hover:scale-105 z-10">
                        <video playsInline ref={myVideo} autoPlay muted className={`w-full h-full object-cover ${isMyVideoOff ? 'hidden' : ''}`} />
                         {isMyVideoOff && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400 text-xs">
                                <VideoOff size={16} />
                            </div>
                        )}
                    </div>
                )}
                
                {/* Controls Overlay (Mobile-Friendly) */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 md:gap-8 z-20 px-6 py-4 bg-gray-900/80 backdrop-blur-md rounded-full border border-white/10 shadow-xl">
                    <button
                        onClick={toggleMute}
                        className={`p-4 rounded-full transition-all ${isMyAudioMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700/50 hover:bg-gray-600/50 text-white'}`}
                    >
                        {isMyAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    
                    <button
                        onClick={leaveCall}
                        className="p-5 rounded-full bg-red-600/90 hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/50 scale-110"
                    >
                        <PhoneOff size={28} className="text-white" />
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`p-4 rounded-full transition-all ${isMyVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700/50 hover:bg-gray-600/50 text-white'}`}
                    >
                        {isMyVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
