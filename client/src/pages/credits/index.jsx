import {
    IoCashOutline,
    IoCalendarOutline,
    IoCheckmarkCircleOutline,
    IoTimeOutline,
    IoDocumentTextOutline,
    IoCameraOutline,
    IoBarChartOutline,
    IoPlayCircleOutline,
    IoEllipsisHorizontal,
    IoOpenOutline,
} from 'react-icons/io5';
import './Credits.css';

const CREDIT_STATS = {
    owned: 7,
    remaining: 3,
    rollover: 0,
    expiration: 'Sept. 26th 2025'
};

const REQUESTS = [
    { status: 'Request submitted', date: 'Jan 30, 2025', description: 'Order received on Jan 30, 2025', completed: true },
    { status: 'Review and Scope Check', date: 'Jan 31, 2025', description: 'Order Reviewed on Jan 31, 2025', completed: true, current: true },
    { status: 'Credit Assignment', description: 'The credits have been successfully deducted', completed: true },
    { status: 'Confirmed', description: 'Shoot dates and times confirmed', completed: true },
];

const CATEGORY_DATA = [
    { label: 'Performance Videos', value: 14 },
    { label: 'Day in the Life', value: 7 },
    { label: 'Visualizer', value: 10 },
    { label: 'Reports', value: 4 },
    { label: 'Photography', value: 7 },
];

const STATISTICS = [
    { label: 'Total Credits Assigned', value: '214' },
    { label: 'Most Frequent Request Type', value: 'Performance Video' },
    { label: '% of Months with 100% Usage', value: '3 of 12 months' },
    { label: 'Credits Expired', value: '12' },
    { label: 'Least Frequent Request Type', value: 'Reports' },
    { label: '% of Total Credits on Performance Vids', value: '73%' },
    { label: 'Average Credits Per Deliverable', value: '4' },
    { label: 'Lowest Usage Month', value: 'February' },
    { label: 'Total Utilization', value: '98%' },
];

const TRANSACTIONS = [
    { date: '08/01/25', content: 'Performance Video', cost: 5 },
    { date: '08/01/25', content: 'Performance Video', cost: 5 },
    { date: '08/01/25', content: 'Performance Video', cost: 5 },
    { date: '08/01/25', content: 'Performance Video', cost: 5 },
    { date: '08/01/25', content: 'Performance Video', cost: 5 },
    { date: '08/01/25', content: 'Performance Video', cost: 5 },
    { date: '08/01/25', content: 'Performance Video', cost: 5 },
    { date: '08/01/25', content: 'Performance Video', cost: 5 },
    { date: '08/01/25', content: 'Performance Video', cost: 5 },
];

function Credits() {
    const maxVal = Math.max(...CATEGORY_DATA.map(d => d.value));

    return (
        <div className="credits-page page">
            <div className="page__header flex justify-between items-center mb-8">
                <div>
                    <h1 className="page__title">Credits</h1>
                    <p className="page__subtitle">Manage your credits and view transaction history.</p>
                </div>
            </div>

            <div className="credits-grid">
                {/* Credit Summary */}
                <div className="credits-card col-span-12">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="section-title">Credit Summary</h3>
                    </div>
                    <div className="credits-bank mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium opacity-60">Credit Bank</span>
                            <div className="flex gap-3">
                                <button className="btn btn-secondary text-sm px-6 py-2 rounded-lg bg-[var(--bg-active)] font-semibold">Redeem</button>
                                <button className="btn btn-primary text-sm px-6 py-2 rounded-lg bg-[var(--accent)] text-white font-semibold">Get Credits</button>
                            </div>
                        </div>
                        <div className="progress-bar-container h-8 bg-[var(--bg-active)] rounded-md overflow-hidden relative">
                            <div className="progress-bar-fill h-full bg-[#333] w-[70%]" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold opacity-40">7 of 10 Credits Redeemable</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="stat-item">
                            <span className="stat-label">Credits Owned</span>
                            <div className="stat-circle mx-auto">{CREDIT_STATS.owned}</div>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Credits Remaining</span>
                            <div className="stat-circle mx-auto">{CREDIT_STATS.remaining}</div>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Rollover Credits</span>
                            <div className="stat-circle mx-auto">{CREDIT_STATS.rollover}</div>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Rollover Expiration</span>
                            <div className="text-lg font-bold mt-4">{CREDIT_STATS.expiration}</div>
                        </div>
                    </div>
                </div>

                {/* Left Column: Requests */}
                <div className="credits-card col-span-4 self-start">
                    <h3 className="section-title mb-6">Requests</h3>
                    <div className="timeline">
                        {REQUESTS.map((req, i) => (
                            <div key={i} className={`timeline-item ${i === REQUESTS.length - 1 ? 'last' : ''}`}>
                                <div className="timeline-icon">
                                    {i === 0 && <IoDocumentTextOutline />}
                                    {i === 1 && <IoCameraOutline />}
                                    {i === 2 && <IoCashOutline />}
                                    {i === 3 && <IoCheckmarkCircleOutline />}
                                </div>
                                <div className="timeline-content">
                                    <div className="flex justify-between">
                                        <h4 className="font-bold text-sm">{req.status}</h4>
                                        <div className={`timeline-dot-path ${req.completed ? 'completed' : ''}`}>
                                            <div className="dot" />
                                        </div>
                                    </div>
                                    <p className="text-xs opacity-60 mt-1">{req.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Credits by Category Chart */}
                <div className="credits-card col-span-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="section-title">Credits by Category</h3>
                        <div className="flex items-center gap-2 opacity-60 text-xs">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Accounts</span>
                            <IoEllipsisHorizontal className="cursor-pointer" />
                        </div>
                    </div>
                    <div className="category-chart h-[300px] flex items-end justify-between px-4 pb-8 border-b border-[var(--border-color)]">
                        {CATEGORY_DATA.map((d, i) => (
                            <div key={i} className="chart-bar-container flex flex-col items-center flex-1">
                                <div
                                    className="chart-bar w-12 bg-red-600 rounded-sm hover:bg-red-500 transition-all cursor-pointer relative group"
                                    style={{ height: `${(d.value / maxVal) * 90}%` }}
                                >
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100">{d.value}</span>
                                </div>
                                <span className="text-[10px] mt-2 text-center font-medium opacity-60">{d.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="credits-card col-span-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="section-title">Credit Statistics</h3>
                        <IoEllipsisHorizontal className="cursor-pointer opacity-60" />
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        {STATISTICS.map((s, i) => (
                            <div key={i} className={`stat-box p-4 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-color)]`}>
                                <p className="text-[10px] uppercase tracking-wider opacity-60 mb-2 font-semibold">{s.label}</p>
                                <p className="text-lg font-bold truncate">{s.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="credits-card col-span-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="section-title">Recent Transactions</h3>
                        <IoOpenOutline className="cursor-pointer opacity-60" />
                    </div>
                    <div className="transactions-table">
                        <div className="table-header grid grid-cols-3 text-[10px] uppercase tracking-widest opacity-40 font-bold mb-4">
                            <span>Date</span>
                            <span>Content</span>
                            <span className="text-right">Cost</span>
                        </div>
                        <div className="table-body flex flex-col gap-3">
                            {TRANSACTIONS.map((t, i) => (
                                <div key={i} className="table-row grid grid-cols-3 items-center text-xs font-semibold">
                                    <span className="opacity-60">{t.date}</span>
                                    <span className="truncate">{t.content}</span>
                                    <div className="flex justify-end">
                                        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">{t.cost}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Credits;

