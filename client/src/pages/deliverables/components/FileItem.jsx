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
    const Icon = FILE_ICONS[file.type] || IoDocumentOutline;
    const colorClass = FILE_COLORS[file.type] || '--blue';

    return (
        <div className="deliverables-file">
            <div className={`deliverables-file__icon card__icon card__icon${colorClass}`}>
                <Icon />
            </div>
            <div className="deliverables-file__info">
                <span className="deliverables-file__name">{file.name}</span>
                <span className="deliverables-file__meta">{file.size} · {file.modified}</span>
            </div>
            <div className="deliverables-file__actions">
                <button className="deliverables-file__action" title="Preview">
                    <IoEyeOutline />
                </button>
                <button className="deliverables-file__action" title="Download">
                    <IoDownloadOutline />
                </button>
            </div>
        </div>
    );
}

export default FileItem;
