import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Heart, Trash2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("All");
  const { user, token } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    if (!token) return alert("Please log in to like posts!");
    try {
      await axios.patch(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts =
    filter === "All" ? posts : posts.filter((post) => post.category === filter);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex gap-2 pb-6 overflow-x-auto">
        {["All", "Photography", "UI/UX", "Web App", "3D Art"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === cat
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 border hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const isLiked = user && post.likes.includes(user._id || user.id);
          const isOwner = user && (user._id === post.author._id || user.id === post.author._id);

          return (
            <div key={post._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop";
                  }}
                />
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
                    <span>{post.category}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{post.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{post.description}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <img src={post.author.avatar} alt="author" className="w-6 h-6 rounded-full border" />
                  <span className="text-xs text-slate-600 font-medium">{post.author.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-500 transition"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    <span>{post.likes.length}</span>
                  </button>
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-slate-400 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          No projects found in this category. Click <strong>Upload Project</strong> to share the first one!
        </div>
      )}
    </div>
  );
}