import { IoNotificationsOutline, IoSettingsOutline, IoMegaphoneOutline, IoMenuOutline } from 'react-icons/io5';
import dvAvatar from '../../assets/Dv.svg';

function Navbar() {
    return (
        <nav className="hidden md:flex items-center justify-between h-12 p-0 pr-2 bg-transparent border-none sm:mb-2">
            <div className="ml-auto inline-flex items-center gap-2">
                <div className="relative md:hidden">
                    <button className="w-[30px] h-[30px] inline-flex items-center justify-center text-text-secondary rounded-md bg-bg-secondary border border-border-color hover:shadow-sm transition-shadow text-base" title="Menu">
                        <IoMenuOutline />
                    </button>
                </div>
                <div className="relative">
                    <button className="w-[30px] h-[30px] inline-flex items-center justify-center text-text-secondary rounded-md bg-bg-secondary border border-border-color hover:shadow-sm transition-shadow text-base" title="Notifications">
                        <IoNotificationsOutline />
                    </button>
                    <span className="absolute w-1.5 h-1.5 bg-accent rounded-full top-1 right-1 border border-bg-secondary" />
                </div>
                <div className="relative">
                    <button className="w-[30px] h-[30px] inline-flex items-center justify-center text-text-secondary rounded-md bg-bg-secondary border border-border-color hover:shadow-sm transition-shadow text-base" title="Settings">
                        <IoSettingsOutline />
                    </button>
                    <span className="absolute w-1.5 h-1.5 bg-accent rounded-full top-1 right-1 border border-bg-secondary" />
                </div>
                <div className="relative">
                    <button className="w-[30px] h-[30px] inline-flex items-center justify-center text-text-secondary rounded-md bg-bg-secondary border border-border-color hover:shadow-sm transition-shadow text-base" title="Announcements">
                        <IoMegaphoneOutline />
                    </button>
                    <span className="absolute w-1.5 h-1.5 bg-accent rounded-full top-1 right-1 border border-bg-secondary" />
                </div>

                <div className="w-[1px] h-[22px] bg-border-color mx-1.5 mr-0.5" />

                <div className="flex items-center">
                    <div className="w-[30px] h-[30px] inline-flex items-center justify-center text-text-secondary rounded-md bg-bg-secondary border border-border-color hover:shadow-sm transition-shadow overflow-hidden" title="Profile">
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
