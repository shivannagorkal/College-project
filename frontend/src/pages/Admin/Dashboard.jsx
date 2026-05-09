import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

// ── Services ──────────────────────────────────────────────
import { eventService }          from '@/services/eventService';
import { galleryService }        from '@/services/galleryService';
import { announcementService }   from '@/services/announcementService';
import { facultyService }        from '@/services/facultyService';
import { topperService }         from '@/services/topperService';
import { carouselService }       from '@/services/carouselService';
import { StudentsResultService } from '@/services/StudentsResultService';

// ── Helpers ───────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins  > 0) return `${mins}m ago`;
  return 'just now';
}

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase();
}

const AVATAR_COLORS = [
  'bg-indigo-200','bg-pink-200','bg-green-200','bg-yellow-200',
  'bg-blue-200','bg-orange-200','bg-teal-200','bg-purple-200',
];

// ── Sub-components ────────────────────────────────────────
function Sparkline({ trend }) {
  return (
    <svg width="60" height="26" viewBox="0 0 60 26" fill="none" className="shrink-0">
      {trend === 'up' ? (
        <path d="M0 20 Q15 15 30 11 Q45 6 60 2"
          stroke="#6c2bd9" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M0 5 Q15 9 30 13 Q45 19 60 23"
          stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

function StatCard({ label, value, trend, emoji, bg, href, loading }) {
  return (
    <Link to={href} className="block h-full">
      <div className={`${bg} rounded-2xl p-4 h-full hover:shadow-md transition-all cursor-pointer`}>
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-7 w-10 bg-white/60 rounded" />
            <div className="h-3 w-24 bg-white/40 rounded" />
            <div className="h-3 w-16 bg-white/30 rounded" />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-extrabold text-gray-800 leading-tight">{value ?? '—'}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
              </div>
              <span className="text-2xl leading-none">{emoji}</span>
            </div>
            <div className={`flex items-center gap-1 mt-2 text-[11px] font-semibold
              ${trend === 'up' ? 'text-emerald-500' : 'text-red-400'}`}>
              {trend === 'up'
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />}
              {trend === 'up' ? '+increase this sem' : '−decrease this sem'}
            </div>
          </>
        )}
      </div>
    </Link>
  );
}

function PersonRow({ name, detail, imageUrl, initials, colorClass, light }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl px-3 py-2
      ${light ? 'bg-blue-50' : 'bg-gray-50'}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={name}
          className="w-9 h-9 rounded-full object-cover shrink-0 border border-white shadow-sm" />
      ) : (
        <div className={`w-9 h-9 rounded-full ${colorClass} flex items-center justify-center
          font-bold text-xs text-gray-700 shrink-0`}>
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-xs text-gray-800 truncate">{name}</p>
        <p className="text-[10px] text-gray-400 truncate">{detail}</p>
      </div>
    </div>
  );
}

function SkeletonRows({ n = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="animate-pulse flex gap-3 items-center bg-gray-50 rounded-xl px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Dashboard page content ────────────────────────────────
export function AdminDashboard() {
  const [counts,   setCounts]   = useState({});
  const [toppers,  setToppers]  = useState([]);
  const [faculty,  setFaculty]  = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const settled = await Promise.allSettled([
        eventService.getEvents(),
        galleryService.getImages(),
        announcementService.getAnnouncements(),
        facultyService.getFaculty(),
        topperService.getToppers(),
        carouselService.getCarouselImages(1),
        StudentsResultService.getStudentsResult(),
      ]);
      if (!alive) return;

      const ok = r => r.status === 'fulfilled' ? r.value : [];
      const [evs, gal, anns, fac, tops, car, res] = settled.map(ok);

      setCounts({
        events:        evs.length,
        gallery:       gal.length,
        announcements: anns.length,
        faculty:       fac.length,
        toppers:       tops.length,
        carousel:      car.length,
        results:       res.length,
      });

      setToppers(tops.slice(0, 4));
      setFaculty(fac.slice(0, 4));

      const feed = [
        ...evs.map(e  => ({ text: `Event: ${e.title  || e.name    || 'Untitled'}`, date: e.createdAt  || e.date || '' })),
        ...anns.map(a => ({ text: `Announcement: ${a.title || a.message || 'Untitled'}`, date: a.createdAt || a.date || '' })),
      ]
        .filter(f => f.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(f => ({ text: f.text, time: timeAgo(f.date) }));

      setActivity(feed.length ? feed : [{ text: 'No recent activity found', time: '' }]);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const statCards = [
    { label: 'Total Events',    value: counts.events,        trend: 'up',   emoji: '📅', bg: 'bg-blue-50',   href: '/admin/manage-events' },
    { label: 'Gallery Images',  value: counts.gallery,       trend: 'up',   emoji: '🖼️', bg: 'bg-yellow-50', href: '/admin/manage-gallery' },
    { label: 'Announcements',   value: counts.announcements, trend: 'down', emoji: '📢', bg: 'bg-green-50',  href: '/admin/manage-announcements' },
    { label: 'Student Results', value: counts.results,       trend: 'up',   emoji: '📋', bg: 'bg-purple-50', href: '/admin/manage-results' },
    { label: 'Faculty Members', value: counts.faculty,       trend: 'up',   emoji: '👨‍🏫', bg: 'bg-pink-50',   href: '/admin/manage-faculty' },
    { label: 'Carousel Slides', value: counts.carousel,      trend: 'down', emoji: '🎠', bg: 'bg-orange-50', href: '/admin/manage-carousel' },
  ];

  return (
    <div className="flex gap-4 px-4 sm:px-5 py-5 min-h-full"
      style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>

      {/* ── Center column ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <h2 className="text-base sm:text-lg font-extrabold text-gray-800">Knowledge base</h2>

        {/* Stats grid */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
          {statCards.map(card => (
            <StatCard key={card.href} {...card} loading={loading} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-gray-800 text-sm">Recent Activity</span>
            <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
              <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-gray-600" />
              <span className="hidden sm:inline">May 2026</span>
              <ChevronRight className="w-4 h-4 cursor-pointer hover:text-gray-600" />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <div className="h-3 bg-gray-100 rounded flex-1" />
                  <div className="h-3 bg-gray-100 rounded w-12 shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {activity.map((item, i) => (
                <div key={i}
                  className="flex items-start justify-between gap-3 py-3
                    border-b border-gray-50 last:border-0">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-[#6c2bd9] shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 leading-snug">{item.text}</span>
                  </div>
                  {item.time && (
                    <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {item.time}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Sparklines */}
          <div className="flex flex-wrap gap-5 mt-4 pt-3 border-t border-gray-50">
            {[
              { label: 'Events',        trend: 'up',   dot: 'bg-indigo-400' },
              { label: 'Announcements', trend: 'down', dot: 'bg-amber-400'  },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 text-xs text-gray-400">
                <span className={`w-2 h-2 rounded-full ${s.dot} inline-block`} />
                {s.label}
                <Sparkline trend={s.trend} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — md and above ── */}
      <div className="hidden md:flex w-52 xl:w-60 flex-col gap-4 shrink-0">

        {/* Top Toppers */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-center font-extrabold text-gray-800 text-sm mb-3">Top Toppers</h3>
          {loading ? <SkeletonRows n={3} /> : toppers.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-3">No toppers yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {toppers.map((t, i) => (
                <PersonRow key={t._id || i}
                  name={t.studentName || t.name || 'Unknown'}
                  detail={[t.year && `Year ${t.year}`, t.stream || t.topperType].filter(Boolean).join(' · ')}
                  imageUrl={t.studentImage || t.image || null}
                  initials={getInitials(t.studentName || t.name)}
                  colorClass={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                  light
                />
              ))}
            </div>
          )}
        </div>

        {/* Top Faculty */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-center font-extrabold text-gray-800 text-sm mb-3">Top Faculty</h3>
          {loading ? <SkeletonRows n={3} /> : faculty.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-3">No faculty yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {faculty.map((f, i) => (
                <PersonRow key={f._id || i}
                  name={f.name || f.facultyName || 'Unknown'}
                  detail={f.department || f.subject || ''}
                  imageUrl={f.image || f.photo || null}
                  initials={getInitials(f.name || f.facultyName)}
                  colorClass="bg-gray-200"
                  light={false}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}