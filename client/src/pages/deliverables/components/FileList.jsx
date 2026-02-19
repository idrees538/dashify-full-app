import { IoArrowBackOutline, IoDocumentsOutline } from 'react-icons/io5';
import FileItem from './FileItem';

function FileList({ project, onBack }) {
    return (
        <div className="deliverables-filelist card">
            <div className="deliverables-filelist__header">
                <button className="deliverables-filelist__back" onClick={onBack}>
                    <IoArrowBackOutline />
                </button>
                <div className="deliverables-filelist__title-area">
                    <h3 className="deliverables-filelist__title">{project.name}</h3>
                    <span className="deliverables-filelist__count">
                        <IoDocumentsOutline /> {project.files.length} files
                    </span>
                </div>
            </div>
            <div className="deliverables-filelist__items">
                {project.files.map((file) => (
                    <FileItem key={file.id} file={file} />
                ))}
            </div>
        </div>
    );
}

export default FileList;
