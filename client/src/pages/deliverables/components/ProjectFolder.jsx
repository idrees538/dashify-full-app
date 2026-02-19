import { IoFolderOutline, IoDocumentsOutline } from 'react-icons/io5';

function ProjectFolder({ project, isActive, onClick }) {
    return (
        <button
            className={`deliverables-folder card ${isActive ? 'deliverables-folder--active' : ''}`}
            onClick={onClick}
        >
            <div className={`deliverables-folder__thumb deliverables-folder__thumb--${project.color}`}>
                <div className="deliverables-folder__icon">
                    <IoFolderOutline />
                </div>
                <span className="deliverables-folder__badge">
                    <IoDocumentsOutline /> {project.fileCount} files
                </span>
            </div>
            <div className="deliverables-folder__info">
                <h3 className="deliverables-folder__name">{project.name}</h3>
                <p className="deliverables-folder__meta">{project.client} · {project.date}</p>
            </div>
        </button>
    );
}

export default ProjectFolder;
