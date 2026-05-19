import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Share2, Download, ArrowRight, CheckCircle2 } from "lucide-react";

interface Submission {
  simulationTitle: string;
  companyName: string;
  score: number;
  submittedAt: any;
}

export default function SimulationComplete() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (submissionId && profile) loadSubmission();
  }, [submissionId, profile]);

  async function loadSubmission() {
    if (!submissionId || !profile) return;
    try {
      const snap = await getDoc(doc(db, "submissions", submissionId));
      if (!snap.exists()) {
        navigate("/dashboard");
        return;
      }
      const data = snap.data() as Submission;
      
      // Verify this submission belongs to the user
      if (snap.data().userId !== profile.uid) {
        navigate("/dashboard");
        return;
      }
      
      setSubmission(data);
    } catch (error) {
      console.error("Failed to load submission:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  function shareOnLinkedIn() {
    const text = `I just completed "${submission?.simulationTitle}" simulation by ${submission?.companyName} and scored ${submission?.score}%! 🎉`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`;
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, '_blank');
  }

  function shareOnTwitter() {
    const text = `I just completed "${submission?.simulationTitle}" simulation by ${submission?.companyName} and scored ${submission?.score}%! 🎉 #CareerDevelopment`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`, '_blank');
  }

  function shareOnFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank');
  }

  function downloadCertificate() {
    // Placeholder for certificate download
    alert("Certificate download coming soon!");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!submission) {
    return null;
  }

  const isPassed = submission.score >= 70;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Confetti effect */}
        <div className="text-center mb-8 animate-bounce">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {isPassed ? "🎉 Congratulations!" : "✅ Completed!"}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            You've successfully completed
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {submission.simulationTitle}
            </h2>
            <p className="text-gray-600 mb-4">by {submission.companyName}</p>
            
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
              <span className="text-sm font-medium text-gray-600">Your Score:</span>
              <span className={`text-3xl font-bold ${
                submission.score >= 90 ? "text-green-600" :
                submission.score >= 70 ? "text-blue-600" :
                submission.score >= 50 ? "text-yellow-600" :
                "text-gray-600"
              }`}>
                {submission.score}%
              </span>
            </div>
          </div>

          {/* Performance message */}
          <div className="mb-8">
            {submission.score >= 90 && (
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <p className="font-semibold">Outstanding Performance!</p>
              </div>
            )}
            {submission.score >= 70 && submission.score < 90 && (
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <p className="font-semibold">Great Job!</p>
              </div>
            )}
            {submission.score >= 50 && submission.score < 70 && (
              <div className="flex items-center justify-center gap-2 text-yellow-600 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <p className="font-semibold">Good Effort!</p>
              </div>
            )}
            <p className="text-sm text-gray-500">
              {isPassed 
                ? "You've demonstrated excellent skills and understanding."
                : "Keep practicing to improve your score!"}
            </p>
          </div>

          {/* Share section */}
          <div className="border-t border-gray-100 pt-8 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Share2 className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Share Your Achievement</h3>
            </div>
            
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={shareOnLinkedIn}
                className="flex items-center gap-2 bg-[#0077B5] text-white px-6 py-3 rounded-xl hover:bg-[#006399] transition font-medium"
              >
                <Share2 className="w-5 h-5" />
                LinkedIn
              </button>
              <button
                onClick={shareOnTwitter}
                className="flex items-center gap-2 bg-[#1DA1F2] text-white px-6 py-3 rounded-xl hover:bg-[#1a8cd8] transition font-medium"
              >
                <Share2 className="w-5 h-5" />
                Twitter
              </button>
              <button
                onClick={shareOnFacebook}
                className="flex items-center gap-2 bg-[#1877F2] text-white px-6 py-3 rounded-xl hover:bg-[#166fe5] transition font-medium"
              >
                <Share2 className="w-5 h-5" />
                Facebook
              </button>
            </div>
          </div>

          {/* Certificate download */}
          {isPassed && (
            <button
              onClick={downloadCertificate}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition font-medium mx-auto mb-6"
            >
              <Download className="w-5 h-5" />
              Download Certificate
            </button>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition font-medium no-underline"
            >
              View Dashboard
            </Link>
            <Link
              to="/explore"
              className="flex items-center justify-center gap-2 bg-gradient-to-b from-gray-700 to-gray-900 text-white px-6 py-3 rounded-xl hover:brightness-110 transition font-medium no-underline"
            >
              Explore More
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Footer message */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your results have been saved to your dashboard
        </p>
      </div>
    </div>
  );
}
