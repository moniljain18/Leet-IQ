import {
  CallControls,
  CallingState,
  ParticipantView,
  SpeakerLayout,
  useCallStateHooks,
  ScreenShareButton,
  hasScreenShare,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon, MonitorIcon, LayoutGridIcon, LayoutPanelLeftIcon } from "lucide-react";
import { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import useFaceProctoring from "../hooks/useFaceProctoring";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel, onLeave, session }) {
  const navigate = useNavigate();
  const {
    useCallCallingState,
    useParticipants,
    useParticipantCount,
    useScreenShareState,
    useHasOngoingScreenShare,
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const participants = useParticipants();
  const participantCount = useParticipantCount();
  const { isSharingScreen } = useScreenShareState();
  const hasOngoingScreenShare = useHasOngoingScreenShare();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [useAutoLayout, setUseAutoLayout] = useState(true);
  const videoContainerRef = useRef(null);

  useFaceProctoring({
    enabled: callingState === CallingState.JOINED,
    rootRef: videoContainerRef,
  });

  // Find participant who is screen sharing by checking screenShareStream
  const screenSharingParticipant = useMemo(() => {
    return participants.find(p =>
      p.screenShareStream ||
      p.publishedTracks?.includes('screenShareTrack') ||
      hasScreenShare(p)
    );
  }, [participants]);

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
        {/* Header with participant count and controls */}
        <div className="flex items-center justify-between gap-2 bg-base-100 p-3 rounded-lg shadow-sm border border-base-300">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">
                {participantCount} {participantCount === 1 ? "participant" : "participants"}
              </span>
            </div>
            {(hasOngoingScreenShare || screenSharingParticipant) && (
              <div className="flex items-center gap-1.5 text-amber-500">
                <MonitorIcon className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {screenSharingParticipant?.name || 'Someone'} is sharing screen
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Layout toggle */}
            <button
              onClick={() => setUseAutoLayout(!useAutoLayout)}
              className="btn btn-sm btn-ghost border-base-300 h-9 min-h-0"
              title={useAutoLayout ? "Switch to Grid Layout" : "Switch to Auto Layout"}
            >
              {useAutoLayout ? <LayoutGridIcon className="size-4" /> : <LayoutPanelLeftIcon className="size-4" />}
            </button>
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
        </div>

        {/* Video Grid */}
        <div className="flex-1 bg-base-300 rounded-lg overflow-hidden relative min-h-0">
          {useAutoLayout ? (
            // Use Stream's SpeakerLayout which handles screen sharing automatically
            <SpeakerLayout participantsBarPosition="bottom" />
          ) : (
            // Custom grid layout
            <div className="h-full p-3">
              {(hasOngoingScreenShare || screenSharingParticipant) ? (
                // Screen share layout
                <div className="h-full flex flex-col gap-3">
                  {/* Main screen share view */}
                  {screenSharingParticipant && (
                    <div className="flex-1 relative rounded-xl overflow-hidden bg-black border-2 border-primary/50 shadow-2xl min-h-0">
                      <ParticipantView
                        participant={screenSharingParticipant}
                        trackType="screenShareTrack"
                        VideoPlaceholder={() => (
                          <div className="w-full h-full flex items-center justify-center bg-base-200">
                            <div className="text-center">
                              <MonitorIcon className="w-16 h-16 mx-auto text-primary/30 mb-2" />
                              <p className="text-base-content/50">Loading screen share...</p>
                            </div>
                          </div>
                        )}
                      />
                      <div className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                        <MonitorIcon className="size-3" />
                        {screenSharingParticipant.name || 'Unknown'}'s screen
                      </div>
                    </div>
                  )}

                  {/* Participant thumbnails */}
                  <div className="flex gap-2 overflow-x-auto py-2 flex-shrink-0">
                    {participants.map((p) => (
                      <div
                        key={p.sessionId}
                        className={`relative rounded-lg overflow-hidden bg-black border-2 ${p.sessionId === screenSharingParticipant?.sessionId ? 'border-primary' : 'border-base-100'
                          } shadow-lg flex-shrink-0 w-32 aspect-video`}
                      >
                        <ParticipantView participant={p} trackType="videoTrack" />
                        <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-[10px] truncate max-w-[90%]">
                          {p.name || p.userId}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Normal grid layout
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-y-auto">
                  {participants.map((p) => (
                    <div key={p.sessionId} className="relative rounded-2xl overflow-hidden bg-black border-2 border-base-100 shadow-xl aspect-video">
                      <ParticipantView participant={p} />
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                        {p.name || p.userId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {participants.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <Loader2Icon className="w-10 h-10 animate-spin text-primary/20" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Call controls */}
        <div className="bg-base-100 p-3 rounded-lg shadow-sm border border-base-300 flex justify-center items-center gap-4">
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
