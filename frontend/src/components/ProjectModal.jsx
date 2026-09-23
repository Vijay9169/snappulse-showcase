import { X, Heart, Calendar, User, Tag } from "lucide-react";

export default function ProjectModal({ project, onClose, onLike, isLiked }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {project.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto">
          <div className="w-full bg-slate-900 max-h-[460px] flex items-center justify-center overflow-hidden">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-contain max-h-[460px]"
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{project.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {project.author?.name || "Creator"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onLike(project._id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                  isLiked
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{project.likes?.length || 0} Likes</span>
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                About this project
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}