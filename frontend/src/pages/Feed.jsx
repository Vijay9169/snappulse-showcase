import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Heart, Trash2, Search, Sparkles, SlidersHorizontal } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import ProjectModal from "../components/ProjectModal";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
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
    if (!token) return alert("Please log in to like showcases!");
    try {
      await axios.patch(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
      // Agar modal khula ho to uska data bhi live update ho jaye
      if (selectedProject && selectedProject._id === postId) {
        const isCurrentlyLiked = selectedProject.likes?.includes(user._id || user.id);
        const updatedLikes = isCurrentlyLiked
          ? selectedProject.likes.filter((id) => id !== (user._id || user.id))
          : [...(selectedProject.likes || []), user._id || user.id];
        setSelectedProject({ ...selectedProject, likes: updatedLikes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this showcase?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter((p) => p._id !== postId));
      if (selectedProject?._id === postId) setSelectedProject(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Live Category + Live Text Search
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = filter === "All" || post.category === filter;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Hero Header + Search Bar */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Creator Portfolios</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore and Share Creative Works
        </h1>
        <p className="mt-3 text-slate-600 text-base">
          A high-performance showcase platform built for designers, developers, and visual artists.
        </p>

        {/* Live Search Input */}
        <div className="mt-6 relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search projects by title, description or author..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-slate-200 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {["All", "Photography", "UI/UX", "Web App", "3D Art"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition duration-200 ${
                filter === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Showing {filteredPosts.length} projects</span>
        </div>
      </div>

      {/* Showcase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => {
          const isLiked = user && post.likes?.includes(user._id || user.id);
          const isOwner = user && (user._id === post.author?._id || user.id === post.author?._id);

          return (
            <div
              key={post._id}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
            >
              {/* YAHAN LAGA HAI ONCLICK: Image aur text par click karne se modal open hoga */}
              <div 
                className="cursor-pointer"
                onClick={() => setSelectedProject(post)}
              >
                <div className="relative overflow-hidden aspect-[16/10] bg-slate-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 shadow-sm">
                    {post.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition duration-200 line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                </div>
              </div>

              {/* Card Footer (Like & Delete Controls) */}
              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.author?.avatar}
                    alt={post.author?.name}
                    className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200"
                  />
                  <span className="text-xs font-semibold text-slate-700">{post.author?.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition ${
                      isLiked
                        ? "bg-rose-50 border-rose-200 text-rose-600"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                    <span>{post.likes?.length || 0}</span>
                  </button>

                  {isOwner && (
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete showcase"
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

      {/* No Results Fallback */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No showcases found</h3>
          <p className="text-sm text-slate-500 mt-1">
            Search query ya filter adjust karke dobara dekhein.
          </p>
        </div>
      )}

      {/* LIGHTBOX / PROJECT DETAILS POPUP MODAL */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onLike={handleLike}
          isLiked={user && selectedProject.likes?.includes(user._id || user.id)}
        />
      )}
    </div>
  );
}