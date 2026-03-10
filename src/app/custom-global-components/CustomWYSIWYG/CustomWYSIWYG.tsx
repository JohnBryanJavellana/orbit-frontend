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
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
            },
            '& .p-editor-toolbar': {
                border: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'grey.50'
            },
            '& .p-editor-content': {
                border: 'none',
                '& .ql-editor': {
                    minHeight: `${minHeight}px`,
                    fontSize: '0.95rem'
                }
            }
        }}>
            <Editor
                value={value}
                onTextChange={(e: any) => onTextChange(e.htmlValue)}
                style={{ minHeight: `${minHeight}px` }}
                headerTemplate={header}
                placeholder={placeholder}
                maxLength={maxLength}
            />
        </Box>
    )
}