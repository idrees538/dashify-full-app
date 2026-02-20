import { IoNotificationsOutline, IoSettingsOutline, IoMegaphoneOutline, IoMenuOutline } from 'react-icons/io5';
import dvAvatar from '../../assets/Dv.svg';

function Navbar() {
    return (
        <nav className="hidden md:flex items-center justify-between h-14 p-0 pr-2 bg-transparent border-none sm:mb-4">
            <div className="ml-auto inline-flex items-center gap-2">
                <div className="relative md:hidden">
                    <button className="w-[34px] h-[34px] inline-flex items-center justify-center text-text-secondary rounded-lg bg-bg-secondary border border-border-color hover:shadow-sm transition-shadow" title="Menu">
                        <IoMenuOutline />
                    </button>
                </div>
                <div className="relative">
                    <button className="w-[34px] h-[34px] inline-flex items-center justify-center text-text-secondary rounded-lg bg-bg-secondary border border-border-color hover:shadow-sm transition-shadow" title="Notifications">
                        <IoNotificationsOutline />
                    </button>
                    <span className="absolute w-2 h-2 bg-accent rounded-full top-1 right-1 border-2 border-bg-secondary" />
                </div>
                <div className="relative">
                    <button className="w-[34px] h-[34px] inline-flex items-center justify-center text-text-secondary rounded-lg bg-bg-secondary border border-border-color hover:shadow-sm transition-shadow" title="Settings">
                        <IoSettingsOutline />
                    </button>
                    <span className="absolute w-2 h-2 bg-accent rounded-full top-1 right-1 border-2 border-bg-secondary" />
                </div>
                <div className="relative">
                    <button className="w-[34px] h-[34px] inline-flex items-center justify-center text-text-secondary rounded-lg bg-bg-secondary border border-border-color hover:shadow-sm transition-shadow" title="Announcements">
                        <IoMegaphoneOutline />
                    </button>
                    <span className="absolute w-2 h-2 bg-accent rounded-full top-1 right-1 border-2 border-bg-secondary" />
                </div>

                <div className="w-[1px] h-[22px] bg-border-color mx-1.5 mr-0.5" />

                <div className="flex items-center">
                    <div className="w-[34px] h-[34px] inline-flex items-center justify-center text-text-secondary rounded-lg bg-bg-secondary border border-border-color hover:shadow-sm transition-shadow overflow-hidden" title="Profile">
                        <img
                            src={dvAvatar}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
