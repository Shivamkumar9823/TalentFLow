import React, { useState } from 'react';
import { GripVertical, Edit2, Archive, ArchiveRestore, Tag, Link2, Sparkles } from 'lucide-react';





const JobItem = ({ job, onEdit, onArchive, provided, snapshot }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleArchiveClick = () => {
    const newStatus = job.status === 'active' ? 'archived' : 'active';
    onArchive(job.id, newStatus);
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group bg-white rounded-xl p-5 shadow-sm border transition-all duration-300
        ${snapshot.isDragging 
          ? 'shadow-2xl scale-105 rotate-1 border-amber-400 bg-gradient-to-br from-white to-amber-50' 
          : 'border-gray-200 hover:shadow-lg hover:border-amber-300'
        }
        ${isHovered && !snapshot.isDragging ? 'bg-gradient-to-r from-white via-amber-50/30 to-white' : ''}
      `}
      style={{
        ...provided.draggableProps.style,
        cursor: snapshot.isDragging ? 'grabbing' : 'grab',
      }}
    >
      {/* Animated Corner Accent */}
      <div className={`
        absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 
        transition-all duration-500 rounded-bl-full
        ${isHovered ? 'opacity-10 scale-150' : 'opacity-0 scale-100'}
      `}></div>

      {/* Drag Indicator Line */}
      {snapshot.isDragging && (
        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-amber-500 rounded-l-xl animate-pulse"></div>
      )}

      <div className="flex items-start gap-4 relative">
        
        {/* Drag Handle */}
        <div 
          {...provided.dragHandleProps}
          className="flex-shrink-0 touch-none group/handle"
        >
          <div className={`
            p-2.5 rounded-xl transition-all duration-300 cursor-grab active:cursor-grabbing
            ${snapshot.isDragging 
              ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg scale-110' 
              : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-amber-100 group-hover:to-orange-100'
            }
          `}>
            <GripVertical className={`
              w-5 h-5 transition-all duration-300
              ${snapshot.isDragging 
                ? 'text-white' 
                : 'text-gray-400 group-hover/handle:text-amber-600 group-hover/handle:scale-110'
              }
            `} />
          </div>
        </div>

        {/* Job Content */}
        <div className="flex-1 min-w-0">
          
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              {/* Job Title */}
              <a 
                  href={`/jobs/${job.id}`} // <--- DYNAMIC ROUTE LINK
                  className={`
                  text-xl font-bold mb-2 transition-all duration-300 no-underline block
                  ${snapshot.isDragging 
                    ? 'text-amber-700' 
                    : 'text-gray-900 group-hover:text-amber-600'
                  }
              `}
              >
                {job.title}
                {snapshot.isDragging && (
                  <Sparkles className="inline-block w-5 h-5 ml-2 text-amber-500 animate-spin" />
                )}
              </a>
              
              {/* Slug */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Link2 className="w-4 h-4 text-gray-400" />
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                  {job.slug}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0">
              <span className={`
                relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide
                transition-all duration-300 border-2
                ${job.status === 'active'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600 shadow-md'
                  : 'bg-gray-100 text-gray-600 border-gray-300'
                }
              `}>
                {job.status === 'active' && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                )}
                {job.status}
              </span>
            </div>
          </div>

          {/* Tags Section */}
          {job.tags && job.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                      transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5
                      ${index % 3 === 0 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200' 
                        : index % 3 === 1
                        ? 'bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200'
                      }
                    `}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(job)}
              className={`
                group/btn flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm
                transition-all duration-300 transform hover:scale-105
                ${snapshot.isDragging
                  ? 'bg-amber-500 text-white border-2 border-amber-600'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-amber-500 hover:text-amber-600 hover:shadow-md'
                }
              `}
            >
              <Edit2 className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
              Edit
            </button>

            <button
              onClick={handleArchiveClick}
              className={`
                group/btn flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm
                transition-all duration-300 transform hover:scale-105
                ${job.status === 'active'
                  ? snapshot.isDragging
                    ? 'bg-gray-500 text-white border-2 border-gray-600'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-400 hover:text-red-600 hover:shadow-md'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-2 border-green-600 hover:from-green-600 hover:to-emerald-600 shadow-md'
                }
              `}
            >
              {job.status === 'active' ? (
                <>
                  <Archive className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
                  Archive
                </>
              ) : (
                <>
                  <ArchiveRestore className="w-4 h-4 transition-transform group-hover/btn:-rotate-12" />
                  Unarchive
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Hover Accent Bar */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500
        transition-all duration-500 rounded-b-xl
        ${isHovered && !snapshot.isDragging ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}
      `}></div>

      {/* Dragging Badge */}
      {snapshot.isDragging && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Moving
          </div>
        </div>
      )}
    </div>
  );
};

export default JobItem;