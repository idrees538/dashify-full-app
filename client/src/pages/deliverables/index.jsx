import { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import ProjectFolder from './components/ProjectFolder';
import FileList from './components/FileList';

const PROJECTS = [
    {
        id: 1,
        name: 'Brand Campaign 2026',
        client: 'Acme Corp',
        date: 'Feb 18, 2026',
        color: 'purple',
        fileCount: 6,
        files: [
            { id: 11, name: 'Final_Edit_v3.mp4', type: 'video', size: '248 MB', modified: 'Feb 18' },
            { id: 12, name: 'Campaign_Brief.pdf', type: 'document', size: '1.2 MB', modified: 'Feb 16' },
            { id: 13, name: 'Hero_Banner.png', type: 'image', size: '4.8 MB', modified: 'Feb 17' },
            { id: 14, name: 'BTS_Reel.mp4', type: 'video', size: '180 MB', modified: 'Feb 17' },
            { id: 15, name: 'Voiceover_Final.wav', type: 'audio', size: '32 MB', modified: 'Feb 15' },
            { id: 16, name: 'Social_Assets.zip', type: 'document', size: '56 MB', modified: 'Feb 18' },
        ],
    },
    {
        id: 2,
        name: 'Product Launch Video',
        client: 'TechStart Inc',
        date: 'Feb 15, 2026',
        color: 'blue',
        fileCount: 4,
        files: [
            { id: 21, name: 'Launch_Teaser_v2.mp4', type: 'video', size: '312 MB', modified: 'Feb 15' },
            { id: 22, name: 'Storyboard.pdf', type: 'document', size: '8.4 MB', modified: 'Feb 10' },
            { id: 23, name: 'Product_Shots.zip', type: 'image', size: '124 MB', modified: 'Feb 14' },
            { id: 24, name: 'Soundtrack.mp3', type: 'audio', size: '6.2 MB', modified: 'Feb 13' },
        ],
    },
    {
        id: 3,
        name: 'Client Testimonials',
        client: 'GreenLeaf Co',
        date: 'Feb 12, 2026',
        color: 'green',
        fileCount: 5,
        files: [
            { id: 31, name: 'Testimonial_Reel.mp4', type: 'video', size: '420 MB', modified: 'Feb 12' },
            { id: 32, name: 'Interview_Sarah.mp4', type: 'video', size: '180 MB', modified: 'Feb 11' },
            { id: 33, name: 'Interview_Mark.mp4', type: 'video', size: '195 MB', modified: 'Feb 11' },
            { id: 34, name: 'Subtitles.srt', type: 'code', size: '24 KB', modified: 'Feb 12' },
            { id: 35, name: 'Thumbnail.jpg', type: 'image', size: '2.1 MB', modified: 'Feb 12' },
        ],
    },
    {
        id: 4,
        name: 'Social Media Q1',
        client: 'BrightWave',
        date: 'Feb 8, 2026',
        color: 'orange',
        fileCount: 7,
        files: [
            { id: 41, name: 'IG_Story_Pack.zip', type: 'image', size: '45 MB', modified: 'Feb 8' },
            { id: 42, name: 'TikTok_Batch_01.mp4', type: 'video', size: '520 MB', modified: 'Feb 7' },
            { id: 43, name: 'TikTok_Batch_02.mp4', type: 'video', size: '480 MB', modified: 'Feb 7' },
            { id: 44, name: 'Content_Calendar.xlsx', type: 'document', size: '340 KB', modified: 'Feb 5' },
            { id: 45, name: 'Captions.docx', type: 'document', size: '128 KB', modified: 'Feb 6' },
            { id: 46, name: 'Brand_Guidelines.pdf', type: 'document', size: '3.6 MB', modified: 'Feb 3' },
            { id: 47, name: 'Audio_Logo.wav', type: 'audio', size: '1.4 MB', modified: 'Feb 4' },
        ],
    },
    {
        id: 5,
        name: 'Corporate Overview',
        client: 'Nexus Global',
        date: 'Jan 28, 2026',
        color: 'cyan',
        fileCount: 3,
        files: [
            { id: 51, name: 'Overview_Final.mp4', type: 'video', size: '680 MB', modified: 'Jan 28' },
            { id: 52, name: 'Script.pdf', type: 'document', size: '450 KB', modified: 'Jan 25' },
            { id: 53, name: 'Logo_Animation.mov', type: 'video', size: '28 MB', modified: 'Jan 27' },
        ],
    },
];

function Deliverables() {
    const [openProjectId, setOpenProjectId] = useState(null);
    const [search, setSearch] = useState('');

    const openProject = PROJECTS.find((p) => p.id === openProjectId);

    const filteredProjects = PROJECTS.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.client.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page">
            <div className="page__header">
                <h1 className="page__title">Deliverables</h1>
                <p className="page__subtitle">
                    Browse project folders and access all your delivered files.
                </p>
            </div>

            {/* Search bar */}
            {!openProject && (
                <div className="deliverables-search">
                    <IoSearchOutline className="deliverables-search__icon" />
                    <input
                        type="text"
                        className="deliverables-search__input"
                        placeholder="Search projects…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            )}

            {/* File list view or folder grid */}
            {openProject ? (
                <FileList
                    project={openProject}
                    onBack={() => setOpenProjectId(null)}
                />
            ) : (
                <div className="deliverables-grid">
                    {filteredProjects.map((project) => (
                        <ProjectFolder
                            key={project.id}
                            project={project}
                            isActive={false}
                            onClick={() => setOpenProjectId(project.id)}
                        />
                    ))}
                    {filteredProjects.length === 0 && (
                        <div className="deliverables-empty card">
                            <p>No projects match your search.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Deliverables;
