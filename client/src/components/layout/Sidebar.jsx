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
// Sidebar.css removed as part of Tailwind migration

const CAP_ITEMS = [
    { name: 'Dashboard', icon: IoGridOutline, path: '/dashboard' },
    { name: 'Calendar', icon: IoCalendarOutline, path: '/calendar' },
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
            <header className="md:hidden flex items-center justify-between p-4 bg-bg-sidebar border-b border-border-color sticky top-0 left-0 w-full z-[110]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center overflow-hidden">
                        <img src={currentLogo} alt="Logo" className="w-[44px] h-[44px] object-contain" />
                    </div>
                    <span className="font-semibold text-sm text-text-primary">Client Portal</span>
                </div>
                <button className="text-[24px] text-text-secondary flex items-center justify-center" onClick={() => setMobileOpen(true)}>
                    <IoMenuOutline />
                </button>
            </header>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[115] md:hidden animate-fade-in transition-opacity duration-300"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside className={`
                flex flex-col items-start py-4 h-full bg-bg-sidebar border-r border-border-color transition-all duration-300 z-[120] overflow-y-auto overflow-x-hidden
                ${collapsed ? 'w-[74px] min-w-[74px] items-center' : 'w-60 min-w-60'}
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                fixed md:relative top-0 left-0 bottom-0
            `}>
                {/* Sidebar Header: Logo + Brand (Hidden on Mobile as it has its own header) */}
                <div className={`hidden md:flex flex-col items-center px-4 pb-4 gap-4 w-full border-b border-border-color ${collapsed ? 'px-5 py-3' : ''}`}>
                    <div className="flex items-center gap-4 w-full cursor-pointer">
                        <div className="w-10 h-10 min-w-10 rounded-full bg-accent-light flex items-center justify-center overflow-hidden">
                            <img
                                src={currentLogo}
                                alt="Client Portal Logo"
                                className="w-[54px] h-[54px] object-contain block"
                            />
                        </div>
                        <span className={`font-semibold text-base text-text-primary whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                            Client Portal
                        </span>
                    </div>
                </div>

                {/* Mobile Sidebar Brand (Visible only when mobile sidebar is open) */}
                <div className="md:hidden flex items-center justify-between px-6 pb-6 w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center overflow-hidden">
                            <img src={currentLogo} alt="Logo" className="w-[44px] h-[44px] object-contain" />
                        </div>
                        <span className="font-semibold text-base text-text-primary">Client Portal</span>
                    </div>
                    <button className="text-2xl text-text-secondary" onClick={() => setMobileOpen(false)}>
                        <IoCloseOutline />
                    </button>
                </div>

                {/* General Section */}
                <div className={`flex flex-col items-center px-4 md:px-4 pb-4 gap-4 w-full border-b border-border-color ${collapsed ? 'px-5 py-3' : ''}`}>
                    <span className={`font-medium text-[10px] text-text-secondary/60 w-full text-left uppercase tracking-wider ${collapsed ? 'md:hidden' : ''}`}>General</span>
                    <nav className="flex flex-col items-start p-0 gap-0 w-full">
                        {!hasProject ? (
                            <NavLink className="flex items-center gap-2 w-full p-2 text-text-secondary hover:bg-bg-hover rounded transition-colors duration-200">
                                <span className={collapsed ? 'md:hidden' : ''}>Project</span>
                                <IoAddOutline className="text-xl" />
                            </NavLink>
                        ) : (
                            <NavLink to="/project" className={({ isActive }) => `flex flex-row justify-between items-center p-1.5 px-2 gap-2.5 w-full rounded transition-colors duration-200 cursor-pointer relative ${isActive ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-bg-hover'}`}>
                                <div className="flex items-center gap-[11px] flex-1 justify-between">
                                    <span className={`font-normal text-[13px] leading-4 text-text-secondary whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'md:opacity-0 md:w-0 overflow-hidden' : 'opacity-100'}`}>{projectName}</span>
                                    <span className="w-5.5 h-5.5 min-w-[22px] flex items-center justify-center text-text-secondary text-base transition-colors duration-200">
                                        <IoFolderOutline />
                                    </span>
                                </div>
                            </NavLink>
                        )}
                    </nav>
                </div>

                {/* Content Accelerator Program */}
                <div className={`flex flex-col items-center px-4 pb-4 gap-4 w-full border-b border-border-color ${collapsed ? 'px-5 py-3' : ''}`}>
                    <span className={`font-medium text-[10px] text-text-secondary/60 w-full text-left uppercase tracking-wider ${collapsed ? 'md:hidden' : ''}`}>Content Accelerator Program</span>
                    {showCap && (
                        <nav className="flex flex-col items-start p-0 gap-0 w-full">
                            {CAP_ITEMS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        to={item.path}
                                        key={item.name + item.path}
                                        className={({ isActive }) => `flex flex-row justify-between items-center p-1.5 px-2 gap-2.5 w-full  rounded transition-colors duration-200 cursor-pointer relative group ${collapsed ? ' md:w-8.5 md:h-8.5 mx-auto' : ''} ${isActive ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-bg-hover'}`}
                                    >
                                        <div className={`flex items-center gap-[11px] flex-1 ${collapsed ? 'md:justify-center md:gap-0' : ''}`}>
                                            <span className={`w-5.5 h-5.5 min-w-[22px] flex items-center justify-center text-text-secondary text-base transition-colors duration-200 group-[.active]:text-accent`}>
                                                <Icon />
                                            </span>
                                            <span className={`font-normal text-[13px] leading-4 text-text-secondary whitespace-nowrap transition-opacity duration-200 group-[.active]:text-text-primary group-[.active]:font-medium ${collapsed ? 'md:opacity-0 md:w-0 overflow-hidden' : 'opacity-100'}`}>{item.name}</span>
                                        </div>
                                        {item.alert && <span className="absolute w-1.5 h-1.5 right-2.5 top-1/2 -translate-y-1/2 bg-accent rounded-full pointer-events-none" />}
                                        {collapsed && <span className="hidden group-hover:md:block absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-bg-card text-text-primary px-3 py-1.5 rounded-md text-[13px] font-medium whitespace-nowrap shadow-lg border border-border-color z-[200] pointer-events-none">{item.name}</span>}
                                    </NavLink>
                                );
                            })}
                        </nav>
                    )}
                </div>

                {/* Bottom: Collapse Toggle + Theme Toggle */}
                <div className="flex flex-col items-start px-5 gap-2 w-full mt-auto pt-2">
                    <button className={`inline-flex items-center gap-2 w-full p-2 px-2.5 rounded hover:bg-bg-hover transition-colors ${collapsed ? 'md:justify-center md:w-8.5 md:h-8.5 rounded-lg' : ''}`} title="Download PDF Report (coming soon)">
                        <IoDownloadOutline className="text-text-secondary" />
                        <span className={`text-xs ${collapsed ? 'md:hidden' : ''}`}>PDF Report</span>
                    </button>

                    {/* Collapse toggle (Desktop only) */}
                    <button
                        className={`hidden md:inline-flex items-center gap-2 w-full p-2 px-2.5 rounded hover:bg-bg-hover transition-colors ${collapsed ? 'justify-center w-8.5 h-8.5 rounded-lg' : ''}`}
                        onClick={() => setCollapsed(!collapsed)}
                        title={collapsed ? 'Expand menu' : 'Collapse menu'}
                    >
                        <IoLogOutOutline className={`text-text-secondary ${!collapsed ? 'scale-x-[-1]' : ''}`} />
                        <span className={`text-xs ${collapsed ? 'hidden' : ''}`}>{collapsed ? 'Expand' : 'Collapse'} Menu</span>
                    </button>

                    <div className={`flex items-center gap-4 w-full p-2 px-2.5 rounded-lg ${collapsed ? 'md:gap-0 md:p-2 md:justify-center' : ''}`}>
                        <div
                            onClick={toggleTheme}
                            role="button"
                            tabIndex={0}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            className={`
                                relative flex items-center justify-center cursor-pointer transition-all duration-300
                                ${collapsed
                                    ? "md:w-[34px] md:h-[34px] md:min-w-[34px] md:rounded-[10px] md:bg-transparent md:shadow-none md:hover:bg-bg-hover"
                                    : "min-w-[63px] h-[29px] px-[5px] rounded-[20px] bg-black/5 dark:bg-white/10 shadow-sm"
                                }
                            `}
                        >
                            {/* KNOB */}
                            {(!collapsed || mobileOpen) && (
                                <span
                                    className={`
                                        absolute w-[25px] h-[25px] rounded-full bg-white dark:bg-white/20 shadow-sm top-1/2 -translate-y-1/2 transition-all duration-300
                                        ${theme === "light" ? "left-[calc(100%-27px)]" : "left-[2px]"}
                                    `}
                                />
                            )}

                            {/* SUN */}
                            <span className={`absolute top-1/2 -translate-y-1/2 left-[5px] w-[18px] h-[18px] flex items-center justify-center text-base text-text-secondary z-10 ${collapsed && !mobileOpen ? (theme === "dark" ? "w-[22px] h-[22px] text-[18px]" : "hidden") : ""}`}>
                                <IoSunnyOutline />
                            </span>

                            {/* MOON */}
                            <span className={`absolute top-1/2 -translate-y-1/2 right-[5px] w-[18px] h-[18px] flex items-center justify-center text-base text-text-secondary z-10 ${collapsed && !mobileOpen ? (theme === "light" ? "w-[22px] h-[22px] text-[18px]" : "hidden") : ""}`}>
                                <IoMoonOutline />
                            </span>
                        </div>

                        <span className={`font-normal text-sm text-text-secondary whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'md:hidden' : 'opacity-100'}`}>
                            {theme === 'dark' ? 'Darkmode' : 'Lightmode'}
                        </span>
                    </div>

                    {/* Separator and attribution */}
                    <div className="w-full h-[1px] bg-border-color my-1" />
                    <div className={`text-[10px] text-text-secondary/60 w-full text-center ${collapsed ? 'md:hidden' : ''}`}>Powered by Projex ©</div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
