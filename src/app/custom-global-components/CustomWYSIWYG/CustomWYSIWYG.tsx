import { Box } from "@mui/material";
import { Editor } from 'primereact/editor';

interface CustomWYSIWYGProps {
    value?: string | undefined,
    onTextChange: (e: any) => void,
    minHeight?: number,
    maxLength?: number,
    placeholder: string
}

export default function CustomWYSIWYG({ value, onTextChange, minHeight = 320, maxLength, placeholder }: CustomWYSIWYGProps) {
    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <select className="ql-header" defaultValue="0">
                    <option value="1">Heading</option>
                    <option value="2">Subheading</option>
                    <option value="0">Normal</option>
                </select>
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-strike" aria-label="Strike"></button>
                <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
                <button className="ql-list" value="bullet" aria-label="Unordered List"></button>
                <button className="ql-clean" aria-label="Clear Formatting"></button>
            </span>
        );
    };

    const header = renderHeader();

    return (
        <Box sx={{
            '& .p-editor-container': {
                borderRadius: '8px',
                border: '1px solid gray',
                borderColor: 'divider',
                overflow: 'hidden'
            },
            '& .p-editor-toolbar': {
                border: 'none',
                borderBottom: '1px solid gray',
                borderColor: 'divider',
                bgcolor: '#333',
                display: 'flex',
                alignItems: 'center',
            },
            '& .ql-stroke': {
                stroke: '#fff !important',
            },
            '& .ql-fill': {
                fill: '#fff !important',
            },
            '& .ql-picker': {
                color: '#fff !important',
            },
            '& .ql-picker-label': {
                color: '#fff !important',
            },
            '& .ql-picker-options': {
                bgcolor: '#fff !important',
                color: '#333333 !important',
                padding: '8px !important',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            },
            '& .ql-picker-item': {
                color: '#333 !important',
            },
            '& .ql-picker-item:hover': {
                color: '#007ad9 !important',
            },
            '& .p-editor-content': {
                border: 'none',
                '& .ql-editor': {
                    minHeight: `${minHeight}px`,
                    fontSize: '0.95rem',
                    bgcolor: 'background.paper',
                    '&.ql-blank::before': {
                        color: 'text.secondary',
                        fontStyle: 'normal',
                        opacity: 1,
                    }
                }
            }
        }}>
            <Editor
                value={value}
                onTextChange={(e: any) => onTextChange(e.htmlValue)}
                headerTemplate={header}
                placeholder={placeholder}
                maxLength={maxLength}
            />
        </Box>
    )
}