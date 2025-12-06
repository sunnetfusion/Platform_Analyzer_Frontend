import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, AlertTriangle, MessageSquare, Send } from 'lucide-react';

interface Comment {
  id: number;
  user_name: string;
  rating: number;
  experience: string;
  comment: string;
  was_scammed: boolean;
  timestamp: string;
  helpful_count: number;
}

interface CommentsSectionProps {
  url: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ url }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState({
    total_comments: 0,
    average_rating: 0,
    scam_reports: 0,
    experience_breakdown: { positive: 0, neutral: 0, negative: 0 }
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    rating: 5,
    experience: 'positive',
    comment: '',
    was_scammed: false
  });
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = 'https://platform-analyzer-backend.onrender.com';

  useEffect(() => {
    loadComments();
  }, [url]);

  const loadComments = async () => {
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
      const response = await fetch(`${API_BASE_URL}/api/comments/${domain}`);
      const data = await response.json();
      setComments(data.comments || []);
      setStats({
        total_comments: data.total_comments,
        average_rating: data.average_rating,
        scam_reports: data.scam_reports,
        experience_breakdown: data.experience_breakdown
      });
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.user_name || !formData.comment) return;
    
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, url })
      });

      if (response.ok) {
        setFormData({
          user_name: '',
          rating: 5,
          experience: 'positive',
          comment: '',
          was_scammed: false
        });
        setShowForm(false);
        loadComments();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const markHelpful = async (commentId: number) => {
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
      await fetch(`${API_BASE_URL}/api/comments/${commentId}/helpful?domain=${domain}`, {
        method: 'POST'
      });
      loadComments();
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const getExperienceColor = (exp: string) => {
    if (exp === 'positive') return 'text-green-600 bg-green-50';
    if (exp === 'negative') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
            <MessageSquare className="w-7 h-7" />
            User Reviews & Experiences
          </h3>
          <p className="text-gray-600 mt-1">Share your experience to help others</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Share Experience
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="text-3xl font-bold text-blue-600">{stats.total_comments}</div>
          <div className="text-sm text-blue-700">Total Reviews</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
          <div className="text-3xl font-bold text-yellow-600 flex items-center gap-1">
            {stats.average_rating.toFixed(1)} <Star className="w-5 h-5 fill-yellow-500" />
          </div>
          <div className="text-sm text-yellow-700">Average Rating</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
          <div className="text-3xl font-bold text-red-600">{stats.scam_reports}</div>
          <div className="text-sm text-red-700">Scam Reports</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="text-3xl font-bold text-green-600">{stats.experience_breakdown.positive}</div>
          <div className="text-sm text-green-700">Positive Reviews</div>
        </div>
      </div>

      {/* Add Comment Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFormData({ ...formData, rating: star })}
                  >
                    <Star
                      className={`w-8 h-8 ${star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
            <div className="flex gap-3">
              {['positive', 'neutral', 'negative'].map((exp) => (
                <button
                  key={exp}
                  onClick={() => setFormData({ ...formData, experience: exp })}
                  className={`px-4 py-2 rounded-lg font-semibold capitalize ${
                    formData.experience === exp
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Experience</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
              rows={4}
              placeholder="Share details about your experience with this website..."
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.was_scammed}
                onChange={(e) => setFormData({ ...formData, was_scammed: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-sm font-semibold text-gray-700">I was scammed by this website</span>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !formData.user_name || !formData.comment}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 transition-all shadow-lg"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-semibold">No reviews yet</p>
            <p className="text-sm">Be the first to share your experience!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-lg text-gray-800">{comment.user_name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < comment.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getExperienceColor(comment.experience)}`}>
                      {comment.experience}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(comment.timestamp).toLocaleDateString()}
                </span>
              </div>

              {comment.was_scammed && (
                <div className="mb-3 flex items-center gap-2 text-red-600 font-semibold bg-red-50 px-3 py-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                  User reported being scammed
                </div>
              )}

              <p className="text-gray-700 mb-4">{comment.comment}</p>

              <button
                onClick={() => markHelpful(comment.id)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                Helpful ({comment.helpful_count})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;