import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Heart, Trash2, FolderGit2, Sparkles } from "lucide-react";

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      // Filter only logged-in user's showcases
      const myPosts = res.data.filter(
        (post) => post.author?._id === (user?._id || user?.id)
      );
      setUserPosts(myPosts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserPosts();
  }, [user]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this showcase?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserPosts(userPosts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const totalLikes = userPosts.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
        <img
          src={user?.avatar}
          alt={user?.name}
          className="w-24 h-24 rounded-full border-4 border-indigo-50 shadow-md bg-slate-50"
        />

        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Creator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{user?.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{user?.email}</p>

          {/* Stats Bar */}
          <div className="flex items-center justify-center md:justify-start gap-8 mt-6 pt-6 border-t border-slate-100">
            <div>
              <span className="block text-xl font-bold text-slate-900">{userPosts.length}</span>
              <span className="text-xs font-medium text-slate-500">Showcases</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-200" />
            <div>
              <span className="block text-xl font-bold text-slate-900">{totalLikes}</span>
              <span className="text-xs font-medium text-slate-500">Total Likes</span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Created Works Grid */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">My Uploaded Works</h2>
        <span className="text-xs font-semibold text-slate-500">{userPosts.length} Items</span>
      </div>

      {loading ? (
        <p className="text-center text-slate-500 py-12">Loading your works...</p>
      ) : userPosts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600 font-semibold text-sm">You have not uploaded any works yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userPosts.map((post) => (
            <div
              key={post._id}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden aspect-[16/10] bg-slate-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 shadow-sm">
                    {post.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{post.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{post.description}</p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  {post.likes?.length || 0} Likes
                </span>

                <button
                  onClick={() => handleDelete(post._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}