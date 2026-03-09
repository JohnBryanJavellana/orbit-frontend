import { IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function usePasswordEndadornment() {
    const [visible, setVisible] = useState<Boolean>(false);
    const toggle = () => setVisible((prev) => !prev);
    const inputType = visible ? "text" : "password";

    const EndAdornment = () => {
        return (
            <>
                <InputAdornment position="end">
                    <IconButton aria-label={visible ? 'hide the password' : 'display the password'} onClick={toggle} edge="end">
                        {visible ? <VisibilityOff className="text-white" /> : <Visibility className="text-white" />}
                    </IconButton>
                </InputAdornment>
            </>
        );
    }

    return { EndAdornment, visible, inputType };
}