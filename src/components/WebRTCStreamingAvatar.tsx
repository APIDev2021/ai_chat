import { useState, useRef, useEffect } from "react";
import {
  Loader2,
  Play,
  Square,
  Send,
  ChevronDown,
  ChevronUp,
  Video,
  Mic,
  MicOff,
  Clock,
} from "lucide-react";
import { api } from "../services/api";

const SESSION_DURATION = 180; // 3 minutes in seconds

const WebRTCStreamingAvatar = ({ debug = false }) => {
  const API_KEY = import.meta.env.VITE_HEYGEN_API_KEY;

  if (!API_KEY) {
    throw new Error("VITE_HEYGEN_API_KEY environment variable is not set");
  }

  const videoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const sessionInfoRef = useRef(null);
  const speakQueueRef = useRef([]);
  const isSpeakingRef = useRef(false);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const [chatMode, setChatMode] = useState("text");
  const [isProcessing, setIsProcessing] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(SESSION_DURATION);
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startSessionTimer = () => {
    setTimeRemaining(SESSION_DURATION);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - clear interval and close session
          clearInterval(timerRef.current);
          closeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearSessionTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const updateStatus = (message) => {
    if (debug) {
      const timestamp = new Date().toLocaleTimeString();
      setStatus((prev) => `${prev}\n[${timestamp}] ${message}`);
      console.log(`[${timestamp}] ${message}`);
    }
  };

  const processSpeakQueue = async () => {
    if (isSpeakingRef.current || !speakQueueRef.current.length) return;

    isSpeakingRef.current = true;
    try {
      const nextSpeak = speakQueueRef.current.shift();
      if (nextSpeak) {
        await nextSpeak();
      }
    } catch (error) {
      console.error("Error in speak queue:", error);
      updateStatus(`Speak queue error: ${error.message}`);
    } finally {
      isSpeakingRef.current = false;
      if (speakQueueRef.current.length > 0) {
        processSpeakQueue();
      }
    }
  };

  const queueSpeak = (text) => {
    return new Promise((resolve, reject) => {
      const speakTask = async () => {
        try {
          await sendText(text);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      speakQueueRef.current.push(speakTask);
      processSpeakQueue();
    });
  };

  const createNewSession = async () => {
    try {
      updateStatus("Creating new session...");

      const response = await fetch("https://api.heygen.com/v1/streaming.new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": API_KEY,
        },
        body: JSON.stringify({
          video_encoding: "H264",
          quality: "low",
          avatar_name: "8f0ece2d4b44403e89f63f9b2fb68782",
          voice: {
            emotion: "Friendly",
            rate: 1.0,
          },
          disable_idle_timeout: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to create session: ${response.status} ${JSON.stringify(errorData)}`,
        );
      }

      const data = await response.json();
      updateStatus("Session data received");
      console.log("Session data:", data);

      sessionInfoRef.current = data.data;

      const { sdp: serverSdp, ice_servers2: iceServers } =
        sessionInfoRef.current;

      updateStatus("Creating peer connection...");
      peerConnectionRef.current = new RTCPeerConnection({ iceServers });

      peerConnectionRef.current.ontrack = (event) => {
        if (event.track.kind === "audio" || event.track.kind === "video") {
          videoRef.current.srcObject = event.streams[0];
          updateStatus(`Received ${event.track.kind} track`);
        }
      };

      updateStatus("Setting remote description...");
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(serverSdp),
      );

      updateStatus("Session created successfully");
    } catch (error) {
      console.error("Session creation error:", error);
      updateStatus(`Session creation failed: ${error.message}`);
      setError(`Failed to create streaming session: ${error.message}`);
      throw error;
    }
  };

  const startStreamingSession = async () => {
    try {
      updateStatus("Creating answer...");
      const localDescription = await peerConnectionRef.current.createAnswer();

      updateStatus("Setting local description...");
      await peerConnectionRef.current.setLocalDescription(localDescription);

      peerConnectionRef.current.onicecandidate = ({ candidate }) => {
        if (candidate) {
          handleICE(sessionInfoRef.current.session_id, candidate.toJSON());
        }
      };

      peerConnectionRef.current.oniceconnectionstatechange = () => {
        const state = peerConnectionRef.current.iceConnectionState;
        updateStatus(`ICE Connection State: ${state}`);

        if (
          state === "disconnected" ||
          state === "failed" ||
          state === "closed"
        ) {
          setIsStreaming(false);
          setError("Connection lost. Please try reconnecting.");
        }
      };

      updateStatus("Starting stream...");
      const startResponse = await fetch(
        "https://api.heygen.com/v1/streaming.start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": API_KEY,
          },
          body: JSON.stringify({
            session_id: sessionInfoRef.current.session_id,
            sdp: localDescription,
          }),
        },
      );

      if (!startResponse.ok) {
        const errorData = await startResponse.json().catch(() => ({}));
        throw new Error(
          `Failed to start stream: ${startResponse.status} ${JSON.stringify(errorData)}`,
        );
      }

      updateStatus("Streaming started successfully");
      setIsStreaming(true);
      startSessionTimer(); // Start the timer when streaming begins
    } catch (error) {
      console.error("Streaming start error:", error);
      updateStatus(`Streaming start failed: ${error.message}`);
      setError(`Failed to start streaming: ${error.message}`);
      throw error;
    }
  };

  const handleICE = async (sessionId, candidate) => {
    try {
      const response = await fetch("https://api.heygen.com/v1/streaming.ice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": API_KEY,
        },
        body: JSON.stringify({
          session_id: sessionId,
          candidate,
        }),
      });

      if (!response.ok) {
        throw new Error(`ICE candidate error: ${response.status}`);
      }
    } catch (error) {
      console.error("ICE handling error:", error);
      updateStatus(`ICE error: ${error.message}`);
    }
  };

  const sendText = async (text) => {
    if (!sessionInfoRef.current) {
      setError("No active session");
      return;
    }

    try {
      updateStatus(`Sending text to avatar: ${text}`);
      const response = await fetch("https://api.heygen.com/v1/streaming.task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": API_KEY,
        },
        body: JSON.stringify({
          session_id: sessionInfoRef.current.session_id,
          text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to send text: ${response.status} ${JSON.stringify(errorData)}`,
        );
      }

      updateStatus(`Text sent successfully`);
    } catch (error) {
      console.error("Text sending error:", error);
      updateStatus(`Failed to send text: ${error.message}`);
      setError(`Failed to send text: ${error.message}`);
      throw error;
    }
  };

  const handleChatMessage = async (userMessage) => {
    if (!sessionInfoRef.current) {
      setError("No active session");
      return;
    }

    try {
      setIsLoading(true);
      updateStatus(`Processing chat message: ${userMessage}`);

      const response = await api.sendChatMessage(
        [{ role: "user", content: userMessage }],
        "video", // Always use video prompt for avatar
      );

      updateStatus("Received chat response, queueing speech...");
      await queueSpeak(response);

      updateStatus("Chat response processed successfully");
    } catch (error) {
      console.error("Chat processing error:", error);
      updateStatus(`Chat processing failed: ${error.message}`);
      setError("Failed to process chat message");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestAudioPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setHasAudioPermission(true);
      audioStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error("Error getting audio permission:", error);
      setHasAudioPermission(false);
      setError(
        "Microphone access denied. Please enable microphone access to use voice chat.",
      );
      return null;
    }
  };

  const startRecording = async () => {
    try {
      const audioStream =
        audioStreamRef.current || (await requestAudioPermission());
      if (!audioStream) return;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      const mediaRecorder = new MediaRecorder(audioStream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        try {
          const audioBlob = new Blob(chunks, { type: mimeType });
          await processRecording(audioBlob);
        } catch (error) {
          console.error("Error processing recording:", error);
          setError("Failed to process recording. Please try again.");
        } finally {
          setIsProcessing(false);
        }
      };

      await new Promise((resolve) => setTimeout(resolve, 300));

      mediaRecorder.start(100);
      setIsRecording(true);
      setError(null);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError(
        "Failed to start recording. Please check your microphone access.",
      );
    }
  };

  const stopRecording = async () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state === "inactive"
    )
      return;

    try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } catch (error) {
      console.error("Error stopping recording:", error);
      setError("Failed to stop recording. Please try again.");
      setIsRecording(false);
    }
  };

  const processRecording = async (audioBlob) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("model", "whisper-1");
      formData.append("language", "en");

      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Transcription failed: ${response.status} ${response.statusText}${
            errorData.error?.message ? ` - ${errorData.error.message}` : ""
          }`,
        );
      }

      const data = await response.json();
      const transcription = data.text?.trim();

      if (transcription) {
        setMessage(transcription);
        await handleChatMessage(transcription);
      } else {
        setError(
          "No transcription received. Please try speaking more clearly.",
        );
      }
    } catch (error) {
      console.error("Error processing voice:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to process voice input. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const closeSession = async () => {
    if (!sessionInfoRef.current) return;

    try {
      clearSessionTimer(); // Clear the timer when closing session
      updateStatus("Closing session...");
      const response = await fetch("https://api.heygen.com/v1/streaming.stop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": API_KEY,
        },
        body: JSON.stringify({
          session_id: sessionInfoRef.current.session_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to close session: ${response.status} ${JSON.stringify(errorData)}`,
        );
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      sessionInfoRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setIsStreaming(false);
      updateStatus("Session closed successfully");
    } catch (error) {
      console.error("Session close error:", error);
      updateStatus(`Failed to close session: ${error.message}`);
      setError(`Failed to close session: ${error.message}`);
    }
  };

  const handleStart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await createNewSession();
      await startStreamingSession();
    } catch (error) {
      console.error("Start session error:", error);
      setError("Failed to start session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage(""); // Clear input immediately for better UX

    try {
      await handleChatMessage(userMessage);
    } catch (error) {
      setError("Failed to process message");
      console.error("Speak error:", error);
    }
  };

  const handleCleanup = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    setIsRecording(false);
    setChatMode("text");
  };

  // Add this timer classes constant
  const timerClasses = `flex items-center gap-2 ${
    timeRemaining <= 30 ? "text-red-400" : "text-green-400"
  }`;

  useEffect(() => {
    return () => {
      clearSessionTimer();
      if (isStreaming) {
        closeSession();
      }
      handleCleanup();
    };
  }, []);

  if (!API_KEY) {
    return (
      <div className="p-4 text-red-400 bg-red-500/10 rounded">
        Error: VITE_HEYGEN_API_KEY environment variable is not set. Please set
        it in your .env file.
      </div>
    );
  }

  return (
    <div className="border border-green-500/30 rounded-lg bg-black/50 backdrop-blur">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full border-b border-green-500/30 p-4 flex items-center justify-between hover:bg-green-500/5 transition-colors"
      >
        <div className="flex items-center gap-2 text-xl font-mono">
          <Video className="w-5 h-5 text-green-400" />
          <h2 className="flex items-center gap-2">
            <span className="text-green-400">&gt;</span> AVATAR.STREAM
          </h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-green-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-green-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Add timer display below the header */}
          {isStreaming && (
            <div className={timerClasses}>
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
          )}
          <div className="relative w-full pt-[56.25%]">
            <div className="absolute inset-0 bg-black/50 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                autoPlay
                playsInline
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded">
              {error}
            </div>
          )}

          {debug && status && (
            <div className="p-4 font-mono text-xs text-green-400 bg-black/30 whitespace-pre-wrap">
              {status}
            </div>
          )}

          <div className="flex gap-2">
            {!isStreaming ? (
              <button
                onClick={handleStart}
                disabled={isLoading}
                className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 transition-colors rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Start Stream
              </button>
            ) : (
              <button
                onClick={closeSession}
                disabled={isLoading}
                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 transition-colors rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                End Stream
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {chatMode === "text" ? (
              <>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type something to talk to avatar..."
                  className="flex-1 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 text-green-300 placeholder-green-700 focus:outline-none focus:border-green-500"
                  disabled={!isStreaming || isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSpeak();
                    }
                  }}
                />
                <button
                  onClick={() => setChatMode("voice")}
                  disabled={!isStreaming || isLoading}
                  className="bg-green-500/20 hover:bg-green-500/30 transition-colors rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSpeak}
                  disabled={!isStreaming || !message.trim() || isLoading}
                  className="bg-green-500/20 hover:bg-green-500/30 transition-colors rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!isStreaming || isProcessing}
                  className={`flex-1 flex items-center justify-center gap-2 ${
                    isRecording
                      ? "bg-red-500/20 hover:bg-red-500/30"
                      : "bg-green-500/20 hover:bg-green-500/30"
                  } transition-colors rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isRecording ? (
                    <>
                      <Square className="w-4 h-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Start Recording
                    </>
                  )}
                </button>
                <button
                  onClick={() => setChatMode("text")}
                  className="bg-green-500/20 hover:bg-green-500/30 transition-colors rounded-lg px-4 py-2"
                  disabled={isLoading || isRecording}
                >
                  <Send className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebRTCStreamingAvatar;
