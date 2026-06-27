/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/product/components/ColorSelector.jsx */
export function ColorSelector({ colors, selectedColor, onColorChange, colorName }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Color:</span>
        <span className="text-sm text-text-primary font-medium">{colorName}</span>
      </div>
      <div className="flex gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorChange(color.id)}
            className={`relative w-8 h-8 rounded-full transition-all ${
              selectedColor === color.id
                ? 'ring-2 ring-offset-2 ring-primary scale-110'
                : 'hover:scale-105'
            }`}
            style={{ backgroundColor: color.hex }}
            aria-label={`Select ${color.name}`}
          >
            {selectedColor === color.id && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white drop-shadow-md"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
