// ─────────────────────────────────────────────────────────
// adminUI.jsx  –  shared primitives used across all admin pages
// Import from '@/components/admin/adminUI'
// ─────────────────────────────────────────────────────────

// Page wrapper: consistent padding + background
export function PageShell({ children }) {
  return (
    <div className="min-h-full bg-secondary p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">{children}</div>
    </div>
  );
}

// Top bar: title on left, action button on right
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// White card surface
export function Surface({ children, className = '' }) {
  return (
    <div className={`bg-background rounded-2xl border border-border shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// Form field wrapper with label + optional error
export function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-foreground">{label}</label>
      )}
      {children}
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}

// Styled native select (matches Input look)
export function NativeSelect({ children, className = '', ...props }) {
  return (
    <select
      className={`w-full h-10 rounded-lg border border-input bg-background px-3 text-sm
        text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30
        focus:border-primary transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

// Empty state for tables / grids
export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-7 h-7 text-primary" />
        </div>
      )}
      <p className="font-semibold text-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground max-w-xs">{description}</p>}
    </div>
  );
}

// Loading skeleton row
export function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-muted rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// Consistent action buttons
export function ActionButtons({ onEdit, onDelete, onView }) {
  return (
    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
      {onView && (
        <button
          onClick={onView}
          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
          title="View"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
}