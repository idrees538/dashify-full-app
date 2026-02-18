import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
    IoGridOutline,
    IoCalendarOutline,
    IoBarChartOutline,
    IoCashOutline,
    IoCheckboxOutline,
    IoDownloadOutline,
    IoChevronDownOutline,
    IoChevronUpOutline,
    IoFolderOutline,
    IoSettingsOutline,
    IoHelpCircleOutline,
    IoChatbubbleOutline,
    IoSunnyOutline,
    IoMoonOutline,
    IoAddOutline,
    IoMenuOutline,
    IoCloseOutline,
    IoLogOutOutline,
} from 'react-icons/io5';
import webLogo from '../../assets/TriptychLogoPNG(White).png';
import lightWebLogo from '../../assets/TriptychLogoPNG(Black).png';
import dvAvatar from '../../assets/Dv.svg';
import './Sidebar.css';

const CAP_ITEMS = [
    { name: 'Dashboard', icon: IoGridOutline, path: '/dashboard' },
    { name: 'Calendar', icon: IoCalendarOutline, path: '/schedule' },
    { name: 'Analytics', icon: IoBarChartOutline, path: '/analytics' },
    { name: 'Credits', icon: IoCashOutline, path: '/credits' },
    // Show an alert dot on Review
    { name: 'Review', icon: IoCheckboxOutline, path: '/review', alert: true },
    { name: 'Deliverables', icon: IoDownloadOutline, path: '/deliverables' },
];

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [showCap, setShowCap] = useState(true);
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
    const hasProject = false; // TODO: replace with real project presence
    const projectName = 'Acme Studio';

    return (
        <>
            {/* Mobile Header / Hamburger */}
            <header className="mobile-header">
                <button className="mobile-toggle" onClick={() => setMobileOpen(true)}>
                    <IoMenuOutline />
                </button>
                {/* <div className="mobile-logo">
                    <img src={currentLogo} alt="Client Portal Logo" />
                    <span>Client Portal</span>
                </div> */}
            </header>

            {/* Mobile Overlay */}
            {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

            <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}>
                {/* Mobile Close Button */}
                <button className="sidebar__close-btn" onClick={() => setMobileOpen(false)}>
                    <IoCloseOutline />
                </button>

                {/* Top section: Logo + User (DashView) */}
                <div className="sidebar__section">
                    {/* Logo */}
                    <div className="flex items-center gap-4 w-full cursor-pointer">

                        {/* Logo Circle */}
                        <div className="sidebar__brand-icon">
                            <img
                                src={currentLogo}
                                alt="Client Portal Logo"
                                className="sidebar__brand-logo"
                            />
                        </div>

                        {/* Logo Text */}
                        <span className="sidebar__brand-text font-semibold text-[16px] text-[var(--text-primary)] whitespace-nowrap transition-opacity duration-200">
                            Client Portal
                        </span>

                    </div>


                </div>

                {/* General Section (placeholder for future items) */}
                {/* <div className="sidebar__section">
                    <span className="sidebar__label">General</span>
                    <nav className="sidebar__nav" />
                </div> */}

                {/* Projects Section */}
                <div className="sidebar__section">
                    <span className="sidebar__label">General</span>
                    <nav className="sidebar__nav">
                        {!hasProject ? (
                            <NavLink className="sidebar__start-project">
                                <span>Project</span>
                                <IoAddOutline />
                            </NavLink>
                        ) : (
                            <NavLink to="/project" className={`sidebar__nav-item ${location.pathname === '/project' ? 'sidebar__nav-item--active' : ''}`}>
                                <div className="sidebar__nav-link sidebar__nav-link--project">
                                    <span className="sidebar__nav-text">{projectName}</span>
                                    <span className="sidebar__nav-icon">
                                        <IoFolderOutline />
                                    </span>
                                </div>
                            </NavLink>
                        )}
                    </nav>
                </div>

                {/* Content Accelerator Program */}
                <div className="sidebar__section">
                    <span className="sidebar__label">Content Accelerator Program</span>
                    {showCap && (
                        <nav className="sidebar__nav">
                            {CAP_ITEMS.map((item) => {
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
                                        {item.alert && <span className="sidebar__alert-dot" />}
                                        <span className="sidebar__tooltip">{item.name}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>
                    )}
                </div>

                {/* Bottom: Collapse Toggle + Theme Toggle */}
                <div className="sidebar__bottom">
                    <button className="sidebar__pdf-btn" title="Download PDF Report (coming soon)">
                        <IoDownloadOutline />
                        <span>PDF Report</span>
                    </button>

                    {/* Collapse toggle moved to bottom */}
                    <button
                        className="sidebar__collapse-toggle"
                        onClick={() => setCollapsed(!collapsed)}
                        title={collapsed ? 'Expand menu' : 'Collapse menu'}
                    >
                        <IoLogOutOutline className={!collapsed ? 'sidebar__icon-flipped' : ''} />
                        <span className="sidebar__collapse-text">{collapsed ? 'Expand' : 'Collapse'} Menu</span>
                    </button>

                    <div className="sidebar__theme-row">
                        <div
                            onClick={toggleTheme}
                            role="button"
                            tabIndex={0}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            className={`
    relative flex items-center justify-center
    cursor-pointer
    transition-all duration-300

    ${collapsed
                                    ? "w-[34px] h-[34px] min-w-[34px] rounded-[10px] bg-transparent shadow-none hover:bg-[var(--bg-hover)]"
                                    : "min-w-[63px] h-[29px] px-[5px] rounded-[20px] bg-[var(--toggle-bg)] shadow-[0_0_40px_rgba(0,0,0,0.07)]"
                                }
  `}
                        >
                            {/* KNOB */}
                            {!collapsed && (
                                <span
                                    className={`
        absolute
        w-[25px] h-[25px]
        rounded-full
        bg-[var(--toggle-knob)]
        shadow-[0_0_40px_rgba(0,0,0,0.07)]
        top-1/2 -translate-y-1/2
        transition-all duration-300
        ${theme === "light"
                                            ? "left-[calc(100%-27px)]"
                                            : "left-[2px]"
                                        }
      `}
                                />
                            )}

                            {/* SUN */}
                            <span
                                className={`
      absolute top-1/2 -translate-y-1/2 left-[5px]
      w-[18px] h-[18px]
      flex items-center justify-center
      text-[16px] leading-none
      text-[var(--icon-color)]
      z-10

      ${collapsed
                                        ? theme === "dark"
                                            ? "w-[22px] h-[22px] text-[18px]"
                                            : "hidden"
                                        : ""
                                    }
    `}
                            >
                                <IoSunnyOutline />
                            </span>

                            {/* MOON */}
                            <span
                                className={`
      absolute top-1/2 -translate-y-1/2 right-[5px]
      w-[18px] h-[18px]
      flex items-center justify-center
      text-[16px] leading-none
      text-[var(--icon-color)]
      z-10

      ${collapsed
                                        ? theme === "light"
                                            ? "w-[22px] h-[22px] text-[18px]"
                                            : "hidden"
                                        : ""
                                    }
    `}
                            >
                                <IoMoonOutline />
                            </span>
                        </div>

                        <span className="sidebar__theme-label">
                            {theme === 'dark' ? 'Darkmode' : 'Lightmode'}
                        </span>
                    </div>

                    {/* Separator and attribution */}
                    <div className="sidebar__bottom-separator" />
                    <div className="sidebar__powered">Powered by Projex ©</div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
