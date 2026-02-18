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
        <div className="page">
            {/* Welcome banner removed as requested */}

            {/* Section 2: Token Summary */}
            <div className="dash-tokens card">
                <div className="dash-tokens__header">
                    <div className="dash-tokens__icon">
                        <IoFlashOutline />
                    </div>
                    <div>
                        <h3 className="dash-tokens__title">Token Usage</h3>
                        <p className="dash-tokens__sub">Track your token consumption</p>
                    </div>
                </div>
                <div className="dash-tokens__stats">
                    <div className="dash-tokens__stat">
                        <span className="dash-tokens__stat-label">Total Available</span>
                        <span className="dash-tokens__stat-value">{tokensTotal.toLocaleString()}</span>
                    </div>
                    <div className="dash-tokens__stat">
                        <span className="dash-tokens__stat-label">Used</span>
                        <span className="dash-tokens__stat-value dash-tokens__stat-value--used">{tokensUsed.toLocaleString()}</span>
                    </div>
                    <div className="dash-tokens__stat">
                        <span className="dash-tokens__stat-label">Remaining</span>
                        <span className="dash-tokens__stat-value dash-tokens__stat-value--remaining">{(tokensTotal - tokensUsed).toLocaleString()}</span>
                    </div>
                </div>
                <div className="dash-tokens__bar-wrap">
                    <div className="dash-tokens__bar">
                        <div
                            className="dash-tokens__bar-fill"
                            style={{ width: `${tokensPercent}%` }}
                        />
                    </div>
                    <span className="dash-tokens__bar-label">
                        {tokensUsed.toLocaleString()} / {tokensTotal.toLocaleString()} used
                    </span>
                </div>
            </div>

            {/* Section 3: Active Plans */}
            <div className="dash-section">
                <h2 className="dash-section__title">Active Plans</h2>
                <div className="dash-plans">
                    {PLANS.map((plan, i) => (
                        <div className="card dash-plan" key={i}>
                            <div className="dash-plan__top">
                                <h3 className="dash-plan__name">{plan.name}</h3>
                                <span className={`dash-plan__status dash-plan__status--${plan.status.toLowerCase()}`}>
                                    {plan.status}
                                </span>
                            </div>
                            <div className="dash-plan__details">
                                <div className="dash-plan__detail">
                                    <IoTimeOutline />
                                    <span>Expires: {plan.expiry}</span>
                                </div>
                                <div className="dash-plan__detail">
                                    <IoFlashOutline />
                                    <span>{plan.tokens} tokens allocated</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 4: Quick Access Widgets */}
            <div className="dash-section">
                <h2 className="dash-section__title">Quick Access</h2>
                <div className="dash-widgets">
                    {QUICK_WIDGETS.map((w, i) => {
                        const Icon = w.icon;
                        return (
                            <NavLink to={w.path} className="card dash-widget" key={i}>
                                <div className={`card__icon card__icon${w.color}`}>
                                    <Icon />
                                </div>
                                <p className="dash-widget__label">{w.label}</p>
                                <p className="dash-widget__value">{w.value}</p>
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
