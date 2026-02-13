import {
  CallControls,
  CallingState,
  ParticipantView,
  useCallStateHooks,
  ScreenShareButton,
  hasScreenShare,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon, MonitorIcon, LayoutGridIcon, GalleryHorizontalEndIcon, LayoutPanelLeftIcon } from "lucide-react";
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
  const [layout, setLayout] = useState('grid'); // 'grid', 'spotlight', 'sidebar'
  const videoContainerRef = useRef(null);

  useFaceProctoring({
    enabled: callingState === CallingState.JOINED,
    rootRef: videoContainerRef,
  });

  // Find participant who is screen sharing
  const screenSharingParticipant = useMemo(() => {
    if (!hasOngoingScreenShare) return null;

    // Find the participant who is sharing their screen
    return participants.find(p => {
      // Check various ways screen share can be indicated
      if (p.screenShareStream) return true;
      if (hasScreenShare(p)) return true;
      if (p.publishedTracks?.some(track =>
        track === 'screenShareTrack' ||
        track === 'SCREEN_SHARE' ||
        track === 'screen_share'
      )) return true;
      // Also check isScreenSharing property
      if (p.isScreenSharing) return true;
      return false;
    });
  }, [participants, hasOngoingScreenShare]);

  // Handle call end states - redirect to dashboard
  if (callingState === CallingState.LEFT || callingState === CallingState.IDLE) {
    // Force redirect when call ends
    window.location.href = "/dashboard";
    return (
      <div className="h-full flex items-center justify-center bg-base-300 rounded-lg">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

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
            {/* Layout toggle dropdown */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-sm btn-ghost border-base-300 h-9 min-h-0 gap-1">
                {layout === 'grid' && <LayoutGridIcon className="size-4" />}
                {layout === 'spotlight' && <GalleryHorizontalEndIcon className="size-4" />}
                {layout === 'sidebar' && <LayoutPanelLeftIcon className="size-4" />}
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-xl w-40 mt-2 border border-base-300 z-20">
                <li>
                  <button onClick={() => setLayout('grid')} className={layout === 'grid' ? 'active' : ''}>
                    <LayoutGridIcon className="size-4" /> Grid
                  </button>
                </li>
                <li>
                  <button onClick={() => setLayout('spotlight')} className={layout === 'spotlight' ? 'active' : ''}>
                    <GalleryHorizontalEndIcon className="size-4" /> Spotlight
                  </button>
                </li>
                <li>
                  <button onClick={() => setLayout('sidebar')} className={layout === 'sidebar' ? 'active' : ''}>
                    <LayoutPanelLeftIcon className="size-4" /> Sidebar
                  </button>
                </li>
              </ul>
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
        </div>

        {/* Video Grid */}
        <div className="flex-1 bg-base-300 rounded-lg overflow-hidden relative min-h-0">
          {/* Screen share layout - auto switches when someone shares */}
          {(hasOngoingScreenShare && screenSharingParticipant) ? (
            // Screen share mode - prominent screen share with participant thumbnails
            <div className="h-full p-3 flex flex-col gap-3">
              {/* Main screen share view - takes most space */}
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
                <div className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 z-10">
                  <MonitorIcon className="size-3" />
                  {screenSharingParticipant.name || 'Someone'}'s screen
                </div>
              </div>

              {/* Participant thumbnails at bottom */}
              <div className="flex gap-2 overflow-x-auto py-1 flex-shrink-0 justify-center">
                {participants.map((p) => (
                  <div
                    key={p.sessionId}
                    className={`relative rounded-lg overflow-hidden bg-black border-2 ${p.sessionId === screenSharingParticipant.sessionId ? 'border-primary' : 'border-base-100'
                      } shadow-lg flex-shrink-0 w-28 aspect-video`}
                  >
                    <ParticipantView participant={p} trackType="videoTrack" />
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-[10px] truncate max-w-[90%]">
                      {p.name || p.userId}
                    </div>
                    {p.sessionId === screenSharingParticipant.sessionId && (
                      <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                        <MonitorIcon className="size-2.5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : layout === 'grid' ? (
            // Grid layout - equal sized for all participants
            <div className="h-full p-3">
              <div className={`grid gap-3 h-full ${participants.length === 1 ? 'grid-cols-1' :
                participants.length === 2 ? 'grid-cols-2' :
                  participants.length <= 4 ? 'grid-cols-2' :
                    participants.length <= 6 ? 'grid-cols-3' :
                      'grid-cols-4'
                }`}>
                {participants.map((p) => (
                  <div
                    key={p.sessionId}
                    className="relative rounded-xl overflow-hidden bg-black border-2 border-base-100 shadow-xl flex items-center justify-center"
                  >
                    <ParticipantView participant={p} />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      {p.name || p.userId}
                    </div>
                  </div>
                ))}
              </div>
              {participants.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <Loader2Icon className="w-10 h-10 animate-spin text-primary/20" />
                </div>
              )}
            </div>
          ) : layout === 'spotlight' ? (
            // Spotlight layout - first participant large, rest small at bottom
            <div className="h-full p-3 flex flex-col gap-3">
              {/* Main spotlight view */}
              {participants.length > 0 && (
                <div className="flex-1 relative rounded-xl overflow-hidden bg-black border-2 border-base-100 shadow-2xl min-h-0">
                  <ParticipantView participant={participants[0]} />
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                    {participants[0].name || participants[0].userId}
                  </div>
                </div>
              )}
              {/* Other participants at bottom */}
              {participants.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-1 flex-shrink-0 justify-center">
                  {participants.slice(1).map((p) => (
                    <div
                      key={p.sessionId}
                      className="relative rounded-lg overflow-hidden bg-black border-2 border-base-100 shadow-lg flex-shrink-0 w-32 aspect-video"
                    >
                      <ParticipantView participant={p} />
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-[10px] truncate max-w-[90%]">
                        {p.name || p.userId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Sidebar layout - main view with sidebar
            <div className="h-full p-3 flex gap-3">
              {/* Main view */}
              {participants.length > 0 && (
                <div className="flex-1 relative rounded-xl overflow-hidden bg-black border-2 border-base-100 shadow-2xl">
                  <ParticipantView participant={participants[0]} />
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                    {participants[0].name || participants[0].userId}
                  </div>
                </div>
              )}
              {/* Sidebar with other participants */}
              {participants.length > 1 && (
                <div className="flex flex-col gap-2 overflow-y-auto w-32 flex-shrink-0">
                  {participants.slice(1).map((p) => (
                    <div
                      key={p.sessionId}
                      className="relative rounded-lg overflow-hidden bg-black border-2 border-base-100 shadow-lg aspect-video"
                    >
                      <ParticipantView participant={p} />
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-[10px] truncate max-w-[90%]">
                        {p.name || p.userId}
                      </div>
                    </div>
                  ))}
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
