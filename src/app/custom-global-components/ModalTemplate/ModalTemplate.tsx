import './ModalTemplate.css';

interface ModalTemplateProps {
    id: string,
    rounded?: boolean,
    modalParentStyle?: string,
    isModalCentered?: boolean,
    modalDialogStyle?: boolean,
    isModalScrollable?: boolean,
    headerClassName?: string,
    header?: React.ReactNode,
    body: React.ReactNode,
    bodyClassName?: string,
    footer: React.ReactNode,
    modalContentClassName?: string,
    footerClassName?: string,
    size: 'sm' | 'md' | 'lg' | 'xl'
}

export default function ModalTemplate({
    id,
    rounded = false,
    modalParentStyle,
    isModalCentered,
    modalDialogStyle,
    isModalScrollable = true,
    headerClassName,
    header,
    body,
    bodyClassName,
    footer,
    modalContentClassName,
    footerClassName,
    size
}: ModalTemplateProps) {
    return (
        <div className={`modal fade ${modalParentStyle}`} data-backdrop="static" data-keyboard="false" id={id}>
            <div className={`modal-dialog ${modalDialogStyle} modal-${size} ${isModalScrollable && 'modal-dialog-scrollable'} ${isModalCentered && 'modal-dialog-centered'}`}>
                <div className={`modal-content custom-bg ${!rounded && 'rounded-0'} text-dark ${modalContentClassName}`}>
                    {header && <div className={`modal-header custom-bottom-border-dark ${headerClassName}`}>{header}</div>}
                    <div className={`modal-body ${bodyClassName}`}>{body}</div>
                    {footer && <div className={`modal-footer custom-top-border-dark py-1 ${footerClassName}`}>{footer}</div>}
                </div>
            </div>
        </div>
    );
}