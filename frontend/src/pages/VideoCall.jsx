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
            trickle: true, // Enable trickle for better connectivity
            stream: currentStream,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:global.stun.twilio.com:3478' }
                ]
            }
        });

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
            toast.error("Call connection failed. Retrying...");
        });

        connectionRef.current = peer;
    };

    const answerCall = (signalData, senderId, currentStream) => {
        if (connectionRef.current) {
            // Already connected or negotiating, just pass the signal
            connectionRef.current.signal(signalData);
            if (!callAccepted) setCallAccepted(true); // Ensure accepted state
        } else {
            // New Incoming Call
            const peer = new SimplePeer({
                initiator: false,
                trickle: true,
                stream: currentStream,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:global.stun.twilio.com:3478' }
                    ]
                }
            });

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
        navigate(-1); // Go back
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-slate-900 p-4">
            
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl flex items-center justify-center">
                {/* Remote Video (Main) */}
                {callAccepted && remoteStream ? (
                     <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                ) : (
                    <div className="text-white text-center">
                        <p className="text-lg animate-pulse">Waiting for other to join...</p>
                        <p className="text-sm text-gray-400 mt-2">Room ID: {roomId}</p>
                    </div>
                )}

                {/* Local Video (Floating) */}
                {stream && (
                    <div className="absolute top-4 right-4 w-48 aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-slate-700 shadow-lg">
                        <video playsInline ref={myVideo} autoPlay muted className={`w-full h-full object-cover ${isMyVideoOff ? 'hidden' : ''}`} />
                         {isMyVideoOff && (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                Camera Off
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-8 flex gap-6">
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full transition-all ${isMyAudioMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    {isMyAudioMuted ? <MicOff className="text-white" /> : <Mic className="text-white" />}
                </button>
                
                <button
                    onClick={leaveCall}
                    className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/50"
                >
                    <PhoneOff className="text-white" />
                </button>

                <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full transition-all ${isMyVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    {isMyVideoOff ? <VideoOff className="text-white" /> : <Video className="text-white" />}
                </button>
            </div>
        </div>
    );
};

export default VideoCall;
