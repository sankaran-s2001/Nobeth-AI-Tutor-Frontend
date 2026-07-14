import React from 'react';

export const DiagramRenderer = ({ diagram, className = '' }) => {
  if (!diagram) return null;

  // Support both production Cloudinary/RAG diagram payloads and local database format
  const imageUrl = diagram.imageUrl || (diagram.type === 'image' || diagram.type === 'url' ? diagram.content : null);
  const isSvg = diagram.type === 'svg' || (!imageUrl && diagram.content && diagram.content.includes('<svg'));
  const svgContent = diagram.content;
  
  const heading = diagram.topic || diagram.title || 'Diagram';
  const captionText = diagram.caption;

  return (
    <div className={`bg-slate-50 border border-slate-100 rounded-2xl p-4 overflow-hidden flex flex-col gap-3 ${className}`}>
      {heading && (
        <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 select-none">
          {heading}
        </h5>
      )}

      <div className="w-full overflow-hidden flex flex-col items-center justify-center gap-2.5">
        {isSvg ? (
          <div
            className="w-full max-w-full overflow-hidden"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            ref={(el) => {
              if (el) {
                const svg = el.querySelector('svg');
                if (svg) {
                  svg.removeAttribute('width');
                  svg.removeAttribute('height');
                  svg.style.width = '100%';
                  svg.style.height = 'auto';
                  svg.style.maxWidth = '100%';
                  svg.style.display = 'block';
                  if (!svg.getAttribute('viewBox') && svg.getAttribute('width') && svg.getAttribute('height')) {
                    svg.setAttribute('viewBox', `0 0 ${svg.getAttribute('width')} ${svg.getAttribute('height')}`);
                  }
                }
              }
            }}
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={heading}
            className="block w-full max-w-full h-auto rounded-lg object-contain bg-white"
            style={{ maxHeight: '320px' }}
          />
        ) : (
          <p className="text-sm text-slate-400 italic">Unable to render diagram</p>
        )}
      </div>

      {captionText && (
        <p className="text-xs text-slate-500 italic text-center select-none px-2 mt-1">
          {captionText}
        </p>
      )}
    </div>
  );
};

export default DiagramRenderer;
