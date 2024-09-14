import * as React from 'react';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import FolderIcon from '@mui/icons-material/Folder';

interface BreadcrumbsNavProps {
    currentPath: string[];
    onBreadcrumbClick: (index: number) => void;
}

export default function BreadcrumbsNav({ currentPath, onBreadcrumbClick }: BreadcrumbsNavProps) {
    return (
        <Breadcrumbs separator="›" aria-label="breadcrumbs" sx={{ mb: 2 }}>
            {currentPath.map((item, index) => (
                <Link
                    key={item + index}
                    color="primary"
                    onClick={() => onBreadcrumbClick(index)}
                    sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <FolderIcon sx={{ mr: 0.5 }} color="inherit" />
                    {item}
                </Link>
            ))}
        </Breadcrumbs>
    );
}
