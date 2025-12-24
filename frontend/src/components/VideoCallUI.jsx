import {
  CallControls,
  CallingState,
  ParticipantView,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import useFaceProctoring from "../hooks/useFaceProctoring";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel, onLeave, session }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipants, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();
  const participantCount = useParticipantCount();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const videoContainerRef = useRef(null);

  useFaceProctoring({
    enabled: callingState === CallingState.JOINED,
    rootRef: videoContainerRef,
  });

  if (callingState === CallingState.JOINING || callingState === CallingState.RECONNECTING) {
    return (
      <div className="h-full flex items-center justify-center bg-base-300 rounded-lg">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">{callingState === CallingState.JOINING ? "Joining call..." : "Reconnecting..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={videoContainerRef} className="h-full flex gap-3 relative str-video">
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        <div className="flex items-center justify-between gap-2 bg-base-100 p-3 rounded-lg shadow-sm border border-base-300">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>
          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`btn btn-sm gap-2 h-9 min-h-0 ${isChatOpen ? "btn-primary" : "btn-ghost border-base-300"}`}
            >
              <MessageSquareIcon className="size-4" />
              <span className="text-xs uppercase font-bold">Chat</span>
            </button>
          )}
        </div>

        <div className="flex-1 bg-base-300 rounded-lg overflow-hidden relative min-h-0">
          <div className="flex flex-col gap-4 h-full p-4 overflow-y-auto custom-scrollbar">
            {participants.map((p) => (
              <div key={p.sessionId} className="relative rounded-2xl overflow-hidden bg-black border-2 border-base-100 shadow-xl aspect-video flex-1">
                <ParticipantView participant={p} />
              </div>
            ))}
            {participants.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <Loader2Icon className="w-10 h-10 animate-spin text-primary/20" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-base-100 p-3 rounded-lg shadow-sm border border-base-300 flex justify-center">
          <CallControls onLeave={onLeave ?? (() => navigate("/dashboard"))} />
        </div>
      </div>

      {/* CHAT SECTION */}
      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-lg shadow-lg overflow-hidden bg-[#272a30] transition-all duration-300 ease-in-out ${isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0 invisible"
            }`}
        >
          {isChatOpen && (
            <>
              <div className="bg-[#1c1e22] p-3 border-b border-[#3a3d44] flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm uppercase tracking-tight">Session Chat</h3>
                <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white">
                  <XIcon className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden stream-chat-dark">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;
