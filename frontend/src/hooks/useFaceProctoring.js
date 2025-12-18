import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const DETECTION_INTERVAL_MS = 700;
const NO_FACE_GRACE_PERIOD_MS = 3000;
const MULTI_FACE_GRACE_PERIOD_MS = 2000;
const LOOKING_AWAY_GRACE_PERIOD_MS = 2000;
const TOAST_COOLDOWN_MS = 6000;

const LOOKING_AWAY_THRESHOLDS = {
  yawDegrees: 15,
  pitchDegrees: 15,
};

export default function useFaceProctoring({ enabled = false, rootRef = null }) {
  const landmarkerRef = useRef(null);
  const intervalRef = useRef(null);
  const lastToastTimeRef = useRef(0);
  const noFaceStartTimeRef = useRef(null);
  const multiFaceStartTimeRef = useRef(null);
  const lookingAwayStartTimeRef = useRef(null);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      cleanup();
      return;
    }

    let isCancelled = false;

    const initializeLandmarker = async () => {
      if (isInitializingRef.current) return;
      isInitializingRef.current = true;

      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (isCancelled) return;

        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 2,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: true,
        });

        if (isCancelled) {
          landmarker.close();
          return;
        }

        landmarkerRef.current = landmarker;
        startDetectionLoop();
      } catch (error) {
        console.error("[Face Proctoring] Initialization failed:", error);
        toast.error("Face detection unavailable. Please check camera permissions.");
      } finally {
        isInitializingRef.current = false;
      }
    };

    const startDetectionLoop = () => {
      intervalRef.current = setInterval(() => {
        performDetection();
      }, DETECTION_INTERVAL_MS);
    };

    const performDetection = () => {
      try {
        const landmarker = landmarkerRef.current;
        if (!landmarker) return;

        const videoElement = findLocalVideoElement(rootRef?.current);
        if (!videoElement) return;

        if (videoElement.readyState < 2 || videoElement.videoWidth === 0) {
          return;
        }

        const timestamp = performance.now();
        const result = landmarker.detectForVideo(videoElement, timestamp);

        processDetectionResult(result);
      } catch (error) {
        console.error("[Face Proctoring] Detection error:", error);
      }
    };

    const processDetectionResult = (result) => {
      const currentTime = Date.now();
      const faceCount = result?.faceLandmarks?.length || 0;

      if (faceCount === 0) {
        handleNoFace(currentTime);
        multiFaceStartTimeRef.current = null;
        lookingAwayStartTimeRef.current = null;
      } else if (faceCount >= 2) {
        handleMultipleFaces(currentTime);
        noFaceStartTimeRef.current = null;
        lookingAwayStartTimeRef.current = null;
      } else if (faceCount === 1) {
        noFaceStartTimeRef.current = null;
        multiFaceStartTimeRef.current = null;

        const isLookingAway = checkIfLookingAway(result);
        if (isLookingAway) {
          handleLookingAway(currentTime);
        } else {
          lookingAwayStartTimeRef.current = null;
        }
      }
    };

    const handleNoFace = (currentTime) => {
      if (noFaceStartTimeRef.current === null) {
        noFaceStartTimeRef.current = currentTime;
      } else {
        const duration = currentTime - noFaceStartTimeRef.current;
        if (duration >= NO_FACE_GRACE_PERIOD_MS) {
          showToastIfCooldownPassed(
            "⚠️ Face not detected! Please stay visible on camera.",
            "error",
            currentTime
          );
        }
      }
    };

    const handleMultipleFaces = (currentTime) => {
      if (multiFaceStartTimeRef.current === null) {
        multiFaceStartTimeRef.current = currentTime;
      } else {
        const duration = currentTime - multiFaceStartTimeRef.current;
        if (duration >= MULTI_FACE_GRACE_PERIOD_MS) {
          showToastIfCooldownPassed(
            "⚠️ Multiple faces detected! Only one person allowed.",
            "error",
            currentTime
          );
        }
      }
    };

    const handleLookingAway = (currentTime) => {
      if (lookingAwayStartTimeRef.current === null) {
        lookingAwayStartTimeRef.current = currentTime;
      } else {
        const duration = currentTime - lookingAwayStartTimeRef.current;
        if (duration >= LOOKING_AWAY_GRACE_PERIOD_MS) {
          showToastIfCooldownPassed(
            "⚠️ Looking away detected! Please focus on the screen.",
            "warning",
            currentTime
          );
        }
      }
    };

    const checkIfLookingAway = (result) => {
      try {
        if (!result?.facialTransformationMatrixes || result.facialTransformationMatrixes.length === 0) {
          return false;
        }

        const matrix = result.facialTransformationMatrixes[0];
        const rotationMatrix = [
          [matrix.data[0], matrix.data[1], matrix.data[2]],
          [matrix.data[4], matrix.data[5], matrix.data[6]],
          [matrix.data[8], matrix.data[9], matrix.data[10]],
        ];

        const yaw = Math.atan2(rotationMatrix[2][0], rotationMatrix[2][2]);
        const pitch = Math.asin(-rotationMatrix[2][1]);

        const yawDegrees = (yaw * 180) / Math.PI;
        const pitchDegrees = (pitch * 180) / Math.PI;

        const isYawExceeded = Math.abs(yawDegrees) > LOOKING_AWAY_THRESHOLDS.yawDegrees;
        const isPitchExceeded = Math.abs(pitchDegrees) > LOOKING_AWAY_THRESHOLDS.pitchDegrees;

        return isYawExceeded || isPitchExceeded;
      } catch (error) {
        console.error("[Face Proctoring] Head pose calculation error:", error);
        return false;
      }
    };

    const showToastIfCooldownPassed = (message, type, currentTime) => {
      const timeSinceLastToast = currentTime - lastToastTimeRef.current;
      if (timeSinceLastToast >= TOAST_COOLDOWN_MS) {
        if (type === "error") {
          toast.error(message, { duration: 4000 });
        } else if (type === "warning") {
          toast(message, { 
            duration: 4000,
            icon: "⚠️",
            style: {
              background: "#ff9800",
              color: "#fff",
            }
          });
        } else {
          toast(message, { duration: 4000 });
        }
        lastToastTimeRef.current = currentTime;
      }
    };

    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }

      noFaceStartTimeRef.current = null;
      multiFaceStartTimeRef.current = null;
      lookingAwayStartTimeRef.current = null;
      isInitializingRef.current = false;
    };

    initializeLandmarker();

    return () => {
      isCancelled = true;
      cleanup();
    };
  }, [enabled, rootRef]);
}

function findLocalVideoElement(rootElement) {
  const root = rootElement || document;
  const videos = Array.from(root.querySelectorAll("video"));

  const playingVideos = videos.filter(
    (v) => v.videoWidth > 0 && v.videoHeight > 0 && v.readyState >= 2
  );

  const mutedVideo = playingVideos.find((v) => v.muted);
  if (mutedVideo) return mutedVideo;

  return playingVideos[0] || videos[0] || null;
}
