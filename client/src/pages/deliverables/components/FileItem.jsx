import {
    IoDocumentOutline,
    IoImageOutline,
    IoVideocamOutline,
    IoMusicalNoteOutline,
    IoCodeSlashOutline,
    IoDownloadOutline,
    IoEyeOutline,
} from 'react-icons/io5';

const FILE_ICONS = {
    video: IoVideocamOutline,
    image: IoImageOutline,
    document: IoDocumentOutline,
    audio: IoMusicalNoteOutline,
    code: IoCodeSlashOutline,
};

const FILE_COLORS = {
    video: '--purple',
    image: '--green',
    document: '--blue',
    audio: '--orange',
    code: '--cyan',
};

function FileItem({ file }) {
    const iconColorClass = file.type === 'video' ? 'bg-[#FF6037]/10 text-accent' :
        file.type === 'image' ? 'bg-[#10B981]/10 text-[#10B981]' :
            file.type === 'document' ? 'bg-blue-500/10 text-blue-500' :
                file.type === 'audio' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                    'bg-[#06B6D4]/10 text-[#06B6D4]';

    return (
        <div className="flex items-center gap-3.5 p-3.5 px-4 border-b border-border-color last:border-b-0 transition-colors hover:bg-bg-hover hover:rounded-xl mx-0">
            <div className={`w-[42px] h-[42px] rounded-xl text-xl flex-shrink-0 flex items-center justify-center ${iconColorClass}`}>
                {/* <Icon /> */}
            </div>
            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-semibold text-text-primary truncate">{file.name}</span>
                <span className="text-[12px] text-text-secondary">{file.size} · {file.modified}</span>
            </div>
            <div className="flex gap-1 flex-shrink-0">
                <button className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-lg text-text-secondary bg-transparent transition-all hover:text-accent hover:bg-accent-light" title="Preview">
                    <IoEyeOutline />
                </button>
                <button className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-lg text-text-secondary bg-transparent transition-all hover:text-accent hover:bg-accent-light" title="Download">
                    <IoDownloadOutline />
                </button>
            </div>
        </div>
    );
}

export default FileItem;
