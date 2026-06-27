import { CheckCircle2, MessageSquareText, Star } from 'lucide-react';

export function ReviewsSection({ averageRating = 0, totalReviews = 0 }) {
  const hasReviews = totalReviews > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-primary">
            Customer Reviews
          </h2>
          <p className="text-sm text-text-muted mt-2">
            Reviews are shown only after they are tied to a completed order.
          </p>
        </div>

        {hasReviews && (
          <div className="flex items-center gap-3">
            <div className="flex text-primary">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${index < Math.floor(averageRating) ? 'fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-text-primary">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-text-muted">({totalReviews} reviews)</span>
          </div>
        )}
      </div>

      {!hasReviews && (
        <div className="bg-surface border border-border rounded-2xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <MessageSquareText className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-serif font-bold text-text-primary">
                No verified reviews yet
              </h3>
              <p className="text-sm text-text-muted mt-2 leading-relaxed">
                Once customers buy and receive this item, their verified reviews can appear here. This keeps product feedback trustworthy.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 text-green-700 px-4 py-2 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Verified only
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
