/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/features/product/components/SizeGuide.jsx */
export function SizeGuide({ dimensions }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
      <h4 className="text-sm font-bold uppercase tracking-wider text-text-primary">
        Size Guide
      </h4>
      <div className="space-y-3">
        {dimensions.map((dim, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-text-muted capitalize">{dim.label}</span>
            <span className="text-sm font-medium text-text-primary">{dim.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
