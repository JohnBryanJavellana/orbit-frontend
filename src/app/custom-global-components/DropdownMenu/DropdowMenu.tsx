import { Menu, MenuItem, Tooltip } from "@mui/material";
import { useState } from "react";

interface DropdownMenuProps {
    id: number,
    menuItems: any[] | null,
    noMarginRight?: boolean
}

export default function DropdownMenu({ id, menuItems, noMarginRight = false }: DropdownMenuProps) {
    const [anchorEl, setAnchorEl] = useState<any | null>(null);
    const [openDrawerId, setOpenDrawerId] = useState<string>('');

    const handleClick = (event: any, drawerId: string) => {
        setOpenDrawerId(drawerId);
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setOpenDrawerId('');
        setAnchorEl(null);
    }

    return (
        <div>
            <Tooltip title="View Actions">
                <button
                    onClick={(e) => handleClick(e, String(id))}
                    className={`p-0 text-center border rounded-circle text-bold ${!noMarginRight && 'mx-3'} elevation-1 data-table-ellipsis-button`}
                    type="button"
                    aria-controls={openDrawerId === String(id) ? `grouped_menu_${id}` : undefined}
                    aria-haspopup="true"
                    aria-expanded={openDrawerId === String(id) ? 'true' : undefined}
                >
                    <i className="fas fa-ellipsis-v"></i>
                </button>
            </Tooltip>

            <Menu
                id={`grouped_menu_${id}`}
                anchorEl={anchorEl}
                open={openDrawerId === String(id)}
                onClose={() => handleClose()}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        border: '1.5px solid #525252 !important',
                        background: '#3B3B3B !important',
                        borderRadius: '0px',
                        marginTop: '-30px',
                        boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                    },
                }}
            >
                {
                    menuItems?.map((item, index) => (
                        <MenuItem
                            key={index}
                            dense
                            tabIndex={index}
                            className={`text-${item['textColor']}`}
                            onClick={item['onClick']}
                            onClickCapture={() => handleClose()}
                            data-widget={item['data-widget']}
                            data-toggle={item['data-toggle']}
                            data-target={item['data-target']}
                        >
                            <span className='material-icons-outlined mr-2 text-muted' style={{ fontSize: '18px' }}>{item['icon']}</span> {item['label']}
                        </MenuItem>
                    ))
                }
            </Menu>
        </div>
    );
}