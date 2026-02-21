import { NavLink } from 'react-router-dom';
import {
    IoCheckmarkCircleOutline,
    IoFlashOutline,
    IoVideocamOutline,
    IoBarChartOutline,
    IoShareSocialOutline,
    IoRocketOutline,
    IoTimeOutline,
} from 'react-icons/io5';

const PLANS = [
    {
        name: 'Pro Creator Plan',
        expiry: 'Mar 15, 2026',
        tokens: 1500,
        status: 'Active',
    },
    {
        name: 'Starter Plan',
        expiry: 'Feb 28, 2026',
        tokens: 500,
        status: 'Active',
    },
    {
        name: 'Enterprise Trial',
        expiry: 'Jan 10, 2026',
        tokens: 200,
        status: 'Expired',
    },
];

const QUICK_WIDGETS = [
    {
        icon: IoVideocamOutline,
        label: 'Video Usage',
        value: '12 videos',
        color: '--purple',
        path: '/video',
    },
    {
        icon: IoBarChartOutline,
        label: 'Analytics',
        value: '3.2K views',
        color: '--blue',
        path: '/analytics',
    },
    {
        icon: IoShareSocialOutline,
        label: 'Social Activity',
        value: '28 posts',
        color: '--green',
        path: '/social',
    },
];

function Dashboard() {
    const tokensUsed = 1200;
    const tokensTotal = 2000;
    const tokensPercent = (tokensUsed / tokensTotal) * 100;

    return (
        <div className="w-full max-w-[1200px] mx-auto animate-fade-in px-2 sm:px-4 md:px-0">
            {/* Welcome banner removed as requested */}

            {/* Section 2: Token Summary */}
            <div className="mb-6 bg-bg-secondary rounded-lg p-4 shadow-sm border border-border-color hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center text-[20px]">
                        <IoFlashOutline />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-text-primary">Token Usage</h3>
                        <p className="text-[12px] text-text-secondary">Track your consumption</p>
                    </div>
                </div>
                <div className="flex gap-6 mb-4 flex-wrap">
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] text-text-secondary uppercase tracking-wider font-medium">Total Available</span>
                        <span className="text-xl font-bold text-text-primary">{tokensTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] text-text-secondary uppercase tracking-wider font-medium">Used</span>
                        <span className="text-xl font-bold text-[#F59E0B]">{tokensUsed.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] text-text-secondary uppercase tracking-wider font-medium">Remaining</span>
                        <span className="text-xl font-bold text-[#10B981]">{(tokensTotal - tokensUsed).toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <div className="w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent rounded-full transition-all duration-1000"
                            style={{ width: `${tokensPercent}%` }}
                        />
                    </div>
                    <span className="text-[11px] text-text-secondary font-medium">
                        {tokensUsed.toLocaleString()} / {tokensTotal.toLocaleString()} used
                    </span>
                </div>
            </div>

            {/* Section 3: Active Plans */}
            <div className="mb-6">
                <h2 className="text-base font-semibold text-text-primary mb-3">Active Plans</h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                    {PLANS.map((plan, i) => (
                        <div className="bg-bg-secondary rounded-lg p-4 shadow-sm border border-border-color hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200" key={i}>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-semibold text-text-primary">{plan.name}</h3>
                                <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${plan.status.toLowerCase() === 'active' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                                    {plan.status}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2.5">
                                <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                                    <IoTimeOutline className="text-sm text-text-secondary/60" />
                                    <span>Expires: {plan.expiry}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                                    <IoFlashOutline className="text-sm text-text-secondary/60" />
                                    <span>{plan.tokens} tokens allocated</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 4: Quick Access Widgets */}
            <div className="mb-6">
                <h2 className="text-base font-semibold text-text-primary mb-3">Quick Access</h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                    {QUICK_WIDGETS.map((w, i) => {
                        const Icon = w.icon;
                        const iconColorClass = w.color === '--purple' ? 'bg-accent-light text-accent' :
                            w.color === '--blue' ? 'bg-blue-500/10 text-blue-500' :
                                w.color === '--green' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-gray-500/10 text-gray-500';
                        return (
                            <NavLink to={w.path} className="bg-bg-secondary rounded-lg p-4 shadow-sm border border-border-color hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex flex-col items-start" key={i}>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-[20px] ${iconColorClass}`}>
                                    <Icon />
                                </div>
                                <p className="text-[12px] font-medium text-text-secondary mb-0.5">{w.label}</p>
                                <p className="text-lg font-bold text-text-primary">{w.value}</p>
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
