import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2 } from 'lucide-react';

export function AlbanianAgent({ serverUrl, config = {} }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState(null);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [conversationMode, setConversationMode] = useState(false); // Phone call mode

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioWorkletRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const nextStartTimeRef = useRef(0);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(serverUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to server');
      setIsConnected(true);
      setError(null);

      // Start session
      ws.send(JSON.stringify({
        type: 'start',
        config: config
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'ready':
          console.log('Session ready');
          break;

        case 'response':
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.data.content,
            timestamp: data.data.timestamp
          }]);
          break;

        case 'audio':
          // Handle audio response - play PCM audio from Gemini
          if (data.data.data) {
            playAudioResponse(data.data.data, data.data.mimeType);
          }
          // Fallback to TTS if text is provided
          else if (data.data.text) {
            speakText(data.data.text, data.data.language || 'sq');
          }
          break;

        case 'turnComplete':
          // Turn is complete, ready for next input
          console.log('Turn complete');
          break;

        case 'userSpeaking':
          // VAD detected user speaking
          setUserSpeaking(data.speaking);
          console.log(data.speaking ? 'User started speaking' : 'User stopped speaking');
          break;

        case 'aiSpeaking':
          // AI is speaking
          setAiSpeaking(data.speaking);
          console.log(data.speaking ? 'AI started speaking' : 'AI stopped speaking');
          break;

        case 'aiInterrupted':
          // User interrupted the AI
          console.log('AI was interrupted');
          setAiSpeaking(false);
          break;

        case 'error':
          setError(data.message);
          console.error('Server error:', data.message);
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error. Please check if the server is running.');
    };

    ws.onclose = () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    };

        return () => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'stop' }));
            ws.close();
          }
        };
      } catch (error) {
        console.error('Connection error:', error);
        setError('Failed to connect to server');
      }
    };

    connectToServer();
  }, [serverUrl, config]);

  // Text-to-Speech using Web Speech API (fallback)
  const speakText = (text, language) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'sq' ? 'sq-AL' : language;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play audio response from Gemini (PCM audio) with proper queuing
  const playAudioResponse = async (base64Data, mimeType) => {
    try {
      // Decode base64 to ArrayBuffer
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create audio context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      // PCM is 16-bit, 24kHz, mono from Gemini
      const sampleRate = 24000;
      const numChannels = 1;
      const numSamples = bytes.length / 2; // 16-bit = 2 bytes per sample

      // Create AudioBuffer
      const audioBuffer = audioContext.createBuffer(numChannels, numSamples, sampleRate);
      const channelData = audioBuffer.getChannelData(0);

      // Convert 16-bit PCM to Float32Array
      const dataView = new DataView(bytes.buffer);
      for (let i = 0; i < numSamples; i++) {
        const int16 = dataView.getInt16(i * 2, true); // true = little-endian
        channelData[i] = int16 / 32768.0; // Normalize to -1.0 to 1.0
      }

      // Queue the audio chunk
      playAudioChunk(audioContext, audioBuffer);

    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // Play audio chunks sequentially (not simultaneously)
  const playAudioChunk = (audioContext, audioBuffer) => {
    // Calculate when this chunk should start
    const currentTime = audioContext.currentTime;

    // If nothing is playing, start immediately
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }

    // Create and schedule the audio source
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    // Start at the calculated time (queued)
    source.start(nextStartTimeRef.current);

    // Update next start time to be after this chunk finishes
    nextStartTimeRef.current += audioBuffer.duration;

    // Reset timer when audio finishes to prevent drift
    source.onended = () => {
      const now = audioContext.currentTime;
      if (nextStartTimeRef.current < now) {
        nextStartTimeRef.current = now;
      }
    };
  };

  // Voice recording with real-time streaming
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000 // Request 16kHz (Gemini's preferred rate)
        }
      });

      audioStreamRef.current = stream;

      // Create audio context for processing
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 16000
        });
      }

      const audioContext = audioContextRef.current;
      const source = audioContext.createMediaStreamSource(stream);

      // Create script processor for real-time audio chunks
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        if (!isRecording) return;

        const inputData = e.inputBuffer.getChannelData(0);

        // Convert Float32Array to 16-bit PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Convert to base64 and send
        const base64 = arrayBufferToBase64(pcmData.buffer);

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'audio',
            audio: base64
          }));
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      audioWorkletRef.current = { source, processor };

      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Could not access microphone. Please grant permission.');
    }
  };

  // Helper function to convert ArrayBuffer to base64
  const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const stopRecording = () => {
    setIsRecording(false);

    // Stop audio worklet
    if (audioWorkletRef.current) {
      const { source, processor } = audioWorkletRef.current;
      source.disconnect();
      processor.disconnect();
      audioWorkletRef.current = null;
    }

    // Stop media stream
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
  };

  // Send text message
  const sendMessage = () => {
    if (!inputText.trim() || !wsRef.current) return;

    const message = {
      role: 'user',
      content: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, message]);

    wsRef.current.send(JSON.stringify({
      type: 'text',
      text: inputText
    }));

    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="albanian-agent-widget">
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="status-bar">
        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '● Connected' : '○ Disconnected'}
        </span>

        {conversationMode && isConnected && (
          <div className="conversation-status">
            {userSpeaking && <span className="speaking-indicator user">🎤 You're speaking...</span>}
            {aiSpeaking && <span className="speaking-indicator ai">🔊 AI is speaking...</span>}
            {!userSpeaking && !aiSpeaking && <span className="speaking-indicator listening">👂 Listening...</span>}
          </div>
        )}

        {isConnected && (
          <button
            className={`conversation-toggle ${conversationMode ? 'active' : ''}`}
            onClick={() => {
              if (!conversationMode) {
                setConversationMode(true);
                startRecording();
              } else {
                setConversationMode(false);
                stopRecording();
              }
            }}
            title={conversationMode ? 'End phone call mode' : 'Start phone call mode'}
          >
            {conversationMode ? '📞 End Call' : '📞 Start Call'}
          </button>
        )}
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Përshëndetje! Si mund t'ju ndihmoj sot?</p>
            <p style={{ fontSize: '0.9em', color: '#666' }}>Hello! How can I help you today?</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content}
            </div>
            <div className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="input-container">
        <button
          className={`voice-button ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isConnected}
          title={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <input
          type="text"
          className="text-input"
          placeholder="Shkruani mesazhin tuaj këtu..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
        />

        <button
          className="send-button"
          onClick={sendMessage}
          disabled={!isConnected || !inputText.trim()}
          title="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
