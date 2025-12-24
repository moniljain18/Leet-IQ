import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import User from "../models/User.js";

function generateInviteCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${part1}-${part2}-${part3}`;
}

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    if (!streamClient || !chatClient) {
      return res
        .status(503)
        .json({ message: "Stream credentials are missing. Please configure STREAM_API_KEY and STREAM_SECRET_KEY." });
    }

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Generate unique invite code
    let inviteCode;
    let isUnique = false;
    while (!isUnique) {
      inviteCode = generateInviteCode();
      const existing = await Session.findOne({ inviteCode });
      if (!existing) isUnique = true;
    }

    // create session in db
    const session = await Session.create({ problem, difficulty, host: userId, callId, inviteCode });
    console.log("Session created in DB:", session._id, "Invite Code:", inviteCode);

    // create stream video call
    try {
      await streamClient.video.call("default", callId).getOrCreate({
        data: {
          created_by_id: clerkId,
          custom: { problem, difficulty, sessionId: session._id.toString() },
        },
      });
    } catch (streamErr) {
      console.error("Error creating Stream video call:", streamErr);
      // Continue even if stream fails, to debug
    }

    // chat messaging
    try {
      const channel = chatClient.channel("messaging", callId, {
        name: `${problem} Session`,
        created_by_id: clerkId,
        members: [clerkId],
      });

      await channel.create();
    } catch (chatErr) {
      console.error("Error creating Stream chat:", chatErr);
    }

    console.log("Session creation successful, returning response.");
    res.status(201).json({ session });
  } catch (error) {
    console.error("Error in createSession controller:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, days = 30, search = "" } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - parseInt(days));

    const query = {
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
      createdAt: { $gte: dateLimit },
    };

    if (search) {
      query.problem = { $regex: search, $options: "i" };
    }

    const totalCount = await Session.countDocuments(query);
    const sessions = await Session.find(query)
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      sessions,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    // Check if user is the host
    if (session.host.toString() === userId.toString()) {
      // Host is already in the session, just return populated session
      const populatedSession = await Session.findById(id)
        .populate("host", "name email profileImage clerkId")
        .populate("participant", "name email profileImage clerkId");
      return res.status(200).json({ session: populatedSession });
    }

    // Check if user is already the participant
    if (session.participant && session.participant.toString() === userId.toString()) {
      // User is already participant, just return populated session
      const populatedSession = await Session.findById(id)
        .populate("host", "name email profileImage clerkId")
        .populate("participant", "name email profileImage clerkId");
      return res.status(200).json({ session: populatedSession });
    }

    // check if session is already full - has a different participant
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    // Add user as participant
    session.participant = userId;
    await session.save();

    // Add user to Stream chat channel and video call members
    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.addMembers([clerkId]);

      const call = streamClient.video.call("default", session.callId);
      await call.update({
        members: {
          [clerkId]: { role: "user" }
        }
      });
    } catch (streamError) {
      console.error("Stream error (non-critical):", streamError.message);
      // Continue even if Stream fails - session is already saved
    }

    // Return populated session
    const populatedSession = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    res.status(200).json({ session: populatedSession });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", details: error.message });
  }
}

export async function leaveSession(req, res) {
  try {
    console.log("leaveSession called", { params: req.params, user: req.user });
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot leave a completed session" });
    }

    // Only participant can "leave" (host should not clear host)
    const isParticipant = session.participant && session.participant.toString() === userId.toString();
    console.log("leaveSession check", { sessionParticipant: session.participant, userId, isParticipant });

    if (!isParticipant) {
      console.log("User is not participant, returning session as-is");
      const populatedSession = await Session.findById(id)
        .populate("host", "name email profileImage clerkId")
        .populate("participant", "name email profileImage clerkId");
      return res.status(200).json({ session: populatedSession });
    }

    // Clear participant slot -> makes room 1/2 again
    console.log("Clearing participant slot");
    session.participant = null;
    await session.save();

    // Optional: remove from Stream chat members and call members (non-critical)
    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.removeMembers([clerkId]);

      const call = streamClient.video.call("default", session.callId);
      await call.update({
        members: {
          [clerkId]: null
        }
      });
    } catch (e) {
      console.error("Stream remove member error (non-critical):", e.message);
    }

    const populatedSession = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    return res.status(200).json({ session: populatedSession });
  } catch (error) {
    console.log("Error in leaveSession controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error", details: error.message });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinByCode(req, res) {
  try {
    const { inviteCode } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!inviteCode) {
      return res.status(400).json({ message: "Invite code is required" });
    }

    const session = await Session.findOne({ inviteCode, status: "active" });

    if (!session) {
      return res.status(404).json({ message: "Invalid or inactive invite code" });
    }

    // Reuse joining logic
    if (session.host.toString() === userId.toString()) {
      const populatedSession = await Session.findById(session._id)
        .populate("host", "name email profileImage clerkId")
        .populate("participant", "name email profileImage clerkId");
      return res.status(200).json({ session: populatedSession });
    }

    if (session.participant && session.participant.toString() === userId.toString()) {
      const populatedSession = await Session.findById(session._id)
        .populate("host", "name email profileImage clerkId")
        .populate("participant", "name email profileImage clerkId");
      return res.status(200).json({ session: populatedSession });
    }

    if (session.participant) {
      return res.status(409).json({ message: "Session is full" });
    }

    // Add user as participant
    session.participant = userId;
    await session.save();

    // Add user to Stream chat channel and video call members
    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.addMembers([clerkId]);

      const call = streamClient.video.call("default", session.callId);
      await call.update({
        members: {
          [clerkId]: { role: "user" }
        }
      });
    } catch (streamError) {
      console.error("Stream error (non-critical):", streamError.message);
    }

    const populatedSession = await Session.findById(session._id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    res.status(200).json({ session: populatedSession });
  } catch (error) {
    console.error("Error in joinByCode controller:", error);
    res.status(500).json({ message: "Internal Server Error", details: error.message });
  }
}
