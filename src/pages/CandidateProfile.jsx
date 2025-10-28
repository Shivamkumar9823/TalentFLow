// src/pages/CandidateProfile.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  Target,
  Clock,
  Loader2,
} from "lucide-react";

// Custom hook to fetch candidate data
const useCandidateProfile = (candidateId) => {
  const [profile, setProfile] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const profileResponse = await fetch(`/candidates/${candidateId}`);
      const profileData = profileResponse.ok ? await profileResponse.json() : null;

      const timelineResponse = await fetch(`/candidates/${candidateId}/timeline`);
      const timelineData = timelineResponse.ok ? await timelineResponse.json() : { timeline: [] };

      if (!profileData) throw new Error("Candidate not found.");

      setProfile(profileData);
      setTimeline(timelineData.timeline);
    } catch (err) {
      console.error("Error loading candidate profile:", err);
      setError(err.message || "Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { profile, timeline, loading, error };
};

// Stage color helper
const getStageColor = (stage) => {
  switch (stage) {
    case "hired":
      return "bg-green-500 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    case "applied":
      return "bg-blue-500 text-white";
    default:
      return "bg-purple-500 text-white";
  }
};

function CandidateProfile() {
  const { id: candidateId } = useParams();
  const navigate = useNavigate();
  const { profile, timeline, loading, error } = useCandidateProfile(candidateId);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-700">
        <Loader2 className="animate-spin text-indigo-500 mb-2" size={36} />
        <p>Loading Candidate Profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto mt-10 bg-red-100 text-red-700 p-4 rounded-lg shadow">
        Error: {error}
      </div>
    );

  if (!profile)
    return (
      <div className="text-center py-20 text-red-500">
        Candidate ID {candidateId} not found.
      </div>
    );

  return (
    <div className="mt-10 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 relative overflow-hidden">
        {/* Subtle background gradient accent */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-purple-500 to-blue-400 pointer-events-none"></div>

        <button
          onClick={() => navigate("/candidates")}
          className="flex items-center text-gray-500 hover:text-indigo-600 transition mb-6 relative z-10"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Candidates
        </button>

        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {profile.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
              <Briefcase size={16} />
              <span>
                Current Stage:{" "}
                <span
                  className={`ml-1 px-3 py-1 rounded-full text-xs font-bold ${getStageColor(
                    profile.stage
                  )}`}
                >
                  {profile.stage.toUpperCase()}
                </span>
              </span>
            </div>
          </div>

          {profile.jobTitle && (
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium shadow-sm mt-4 sm:mt-0">
              Applied for: {profile.jobTitle}
            </div>
          )}
        </header>

        {/* Contact Info */}
        <section className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-8 relative z-10">
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition">
            <Mail size={16} className="text-indigo-500" /> {profile.email}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition">
            <Phone size={16} className="text-indigo-500" /> {profile.phone || "N/A"}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition">
            <Calendar size={16} className="text-indigo-500" /> Applied on:{" "}
            {new Date(profile.appliedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition">
            <Target size={16} className="text-indigo-500" /> Job ID:{" "}
            {profile.jobId.substring(0, 8)}...
          </div>
        </section>

        {/* Timeline */}
        <section className="relative z-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            Status Timeline
          </h2>

          {timeline.length === 0 ? (
            <p className="text-gray-500 ml-4">No history recorded yet.</p>
          ) : (
            <ol className="relative border-l border-gray-300 ml-4">
              {timeline
                .slice()
                .reverse()
                .map((event) => (
                  <li key={event.id} className="mb-8 ml-6 group">
                    <span
                      className={`absolute flex items-center justify-center w-4 h-4 ${getStageColor(
                        event.new
                      )} rounded-full -left-2 ring-4 ring-white`}
                    ></span>

                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm group-hover:shadow-md transition">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {event.message}
                      </h3>
                      <time className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={12} />{" "}
                        {new Date(event.timestamp).toLocaleString()}
                      </time>
                    </div>
                  </li>
                ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

export default CandidateProfile;
