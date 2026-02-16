import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
    IoHomeOutline,
    IoMailOutline,
    IoCalendarOutline,
    IoNewspaperOutline,
    IoBriefcaseOutline,
    IoFolderOutline,
    IoFlagOutline,
    IoPeopleOutline,
    IoShieldCheckmarkOutline,
    IoSettingsOutline,
    IoHelpCircleOutline,
    IoChatbubbleOutline,
    IoNotificationsOutline,
    IoLogOutOutline,
    IoSunnyOutline,
    IoMoonOutline,
    IoAddOutline,
    IoMenuOutline,
    IoCloseOutline,
} from 'react-icons/io5';
import webLogo from '../../assets/web_logo.svg';
import lightWebLogo from '../../assets/light_web_logo.svg';
import dvAvatar from '../../assets/Dv.svg';
import './Sidebar.css';

const NAV_SECTIONS = [
    {
        label: 'General',
        items: [
            { name: 'Dashboard', icon: IoHomeOutline, path: '/dashboard' },
            { name: 'Analytics', icon: IoMailOutline, path: '/analytics', badge: 2, hasAdd: true },
            { name: 'Schedule', icon: IoCalendarOutline, path: '/schedule', badge: 3, hasAdd: true },
            { name: 'News', icon: IoNewspaperOutline, path: '/news' },
            { name: 'Recruitment', icon: IoBriefcaseOutline, path: '/recruitment' },
            { name: 'Project', icon: IoFolderOutline, path: '/project', hasAdd: true },
        ],
    },
    {
        label: 'Myspace',
        items: [
            { name: 'Activity', icon: IoFlagOutline, path: '/activity' },
            { name: 'Shared', icon: IoPeopleOutline, path: '/shared' },
            { name: 'Privacy', icon: IoShieldCheckmarkOutline, path: '/privacy' },
        ],
    },
    {
        label: 'Support',
        items: [
            { name: 'Setting', icon: IoSettingsOutline, path: '/settings' },
            { name: 'Help!', icon: IoHelpCircleOutline, path: '/help' },
            { name: 'Chat', icon: IoChatbubbleOutline, path: '/chat', badge: 5, hasAdd: true },
        ],
    },
];

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    // Auto-collapse on tablet and hide on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCollapsed(false);
                setMobileOpen(false);
            } else if (window.innerWidth <= 1024) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const currentLogo = theme === 'light' ? lightWebLogo : webLogo;

    return (
        <>
            {/* Mobile Header / Hamburger */}
            <header className="mobile-header">
                <button className="mobile-toggle" onClick={() => setMobileOpen(true)}>
                    <IoMenuOutline />
                </button>
                <div className="mobile-logo">
                    <img src={currentLogo} alt="Dashify Logo" />
                    <span>Dashify</span>
                </div>
            </header>

            {/* Mobile Overlay */}
            {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

            <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}>
                {/* Mobile Close Button */}
                <button className="sidebar__close-btn" onClick={() => setMobileOpen(false)}>
                    <IoCloseOutline />
                </button>

                {/* Top section: Logo + User */}
                <div className="sidebar__section">
                    {/* Logo */}
                    <div className="sidebar__logo">
                        <div className="sidebar__logo-icon">
                            <img src={currentLogo} alt="Dashify Logo" className="sidebar__logo-img" />
                        </div>
                        <span className="sidebar__logo-text">Dashify</span>
                    </div>

                    {/* User Profile */}
                    <div className="sidebar__user">
                        <div className="sidebar__user-info">
                            <img src={dvAvatar} alt="DashView" className="sidebar__user-avatar-img" />
                            <span className="sidebar__user-name">DashView</span>
                        </div>
                        <div className="sidebar__user-actions">
                            <button className="sidebar__action-btn" title="Notifications">
                                <IoNotificationsOutline />
                                <span className="sidebar__notification-dot" />
                            </button>
                            <button
                                className="sidebar__action-btn"
                                title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                                onClick={() => setCollapsed(!collapsed)}
                            >
                                <IoLogOutOutline />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Sections */}
                {NAV_SECTIONS.map((section) => (
                    <div className="sidebar__section" key={section.label}>
                        <span className="sidebar__label">{section.label}</span>
                        <nav className="sidebar__nav">
                            {section.items.map((item) => {
                                const isActive = location.pathname === item.path;
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        to={item.path}
                                        key={item.name + item.path}
                                        className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
                                    >
                                        <div className="sidebar__nav-link">
                                            <span className="sidebar__nav-icon">
                                                <Icon />
                                            </span>
                                            <span className="sidebar__nav-text">{item.name}</span>
                                        </div>
                                        {(item.badge || item.hasAdd) && (
                                            <div className="sidebar__nav-actions">
                                                {item.badge && (
                                                    <span className="sidebar__badge">{item.badge}</span>
                                                )}
                                                {item.hasAdd && (
                                                    <button className="sidebar__add-btn" title={`Add ${item.name}`}>
                                                        <IoAddOutline />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <span className="sidebar__tooltip">{item.name}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>
                ))}

                {/* Bottom: Theme Toggle */}
                <div className="sidebar__bottom">
                    <div className="sidebar__theme-row">
                        <div
                            className={`sidebar__theme-toggle ${theme === 'light' ? 'sidebar__theme-toggle--light' : ''
                                }`}
                            onClick={toggleTheme}
                            role="button"
                            tabIndex={0}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            <span className="sidebar__theme-knob" />
                            <span className="sidebar__theme-icon">
                                <IoSunnyOutline />
                            </span>
                            <span className="sidebar__theme-icon">
                                <IoMoonOutline />
                            </span>
                        </div>
                        <span className="sidebar__theme-label">
                            {theme === 'dark' ? 'Darkmode' : 'Lightmode'}
                        </span>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
