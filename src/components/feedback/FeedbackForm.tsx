import { useState } from 'preact/hooks';

interface Props {
  ticketId: string;
  serviceName: string;
  branchName: string;
  staffName: string;
}

const QUICK_TAGS = [
  'Fast Service',
  'Friendly Staff',
  'Professional',
  'Clean Facility',
  'Good Communication',
  'Needs Improvement',
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      class={`w-10 h-10 sm:w-12 sm:h-12 transition-colors ${filled ? 'text-amber-400' : 'text-slate-200'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function FeedbackForm({ ticketId, serviceName, branchName, staffName }: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSubmit() {
    if (rating === 0) return;
    // In a real app, this would call an API
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div class="text-center py-10">
        {/* Animated checkmark */}
        <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 animate-bounce">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-slate-800 mb-2">Thank you for your feedback!</h2>
        <p class="text-slate-500 mb-8">
          Your feedback helps us improve our services. We appreciate you taking the time.
        </p>
        <a
          href="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </a>
      </div>
    );
  }

  const displayRating = hoverRating || rating;

  return (
    <div>
      {/* Service info header */}
      <div class="text-center mb-8">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
          How was your experience?
        </h2>
        <p class="text-slate-500">
          <span class="font-medium text-slate-700">{serviceName}</span> at{' '}
          <span class="font-medium text-slate-700">{branchName}</span>
        </p>
        {staffName && (
          <p class="text-sm text-slate-400 mt-1">
            Served by <span class="font-medium text-slate-500">{staffName}</span>
          </p>
        )}
      </div>

      {/* Star rating */}
      <div class="flex items-center justify-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            class="p-1 transition-transform hover:scale-110 focus:outline-none"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <StarIcon filled={star <= displayRating} />
          </button>
        ))}
      </div>
      <p class="text-center text-sm text-slate-500 mb-8">
        {displayRating === 0 && 'Tap a star to rate'}
        {displayRating === 1 && 'Poor'}
        {displayRating === 2 && 'Fair'}
        {displayRating === 3 && 'Good'}
        {displayRating === 4 && 'Very Good'}
        {displayRating === 5 && 'Excellent'}
      </p>

      {/* Quick tags */}
      <div class="mb-6">
        <label class="block text-sm font-medium text-slate-700 mb-3">
          What stood out? <span class="font-normal text-slate-400">(optional)</span>
        </label>
        <div class="flex flex-wrap gap-2">
          {QUICK_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                class={[
                  'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all',
                  isSelected
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-slate-50',
                ].join(' ')}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comment */}
      <div class="mb-8">
        <label class="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="comment">
          Additional comments <span class="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onInput={(e) => setComment((e.target as HTMLTextAreaElement).value)}
          placeholder="Tell us more about your experience..."
          class="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder-slate-400 resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={rating === 0}
        class="w-full py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Feedback
      </button>
    </div>
  );
}
