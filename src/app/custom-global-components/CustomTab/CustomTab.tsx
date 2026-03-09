import { Tab, Tabs } from "@mui/material";

interface CustomTabProps {
    tabs: any[],
    tabId: number,
    callbackFunction?: (e: any) => void,
    centered?: boolean,
    variant?: 'standard' | 'scrollable' | 'fullWidth',
    disabled?: boolean
}

export default function CustomTab({ tabs, tabId, callbackFunction, centered = false, variant = "scrollable", disabled = false }: CustomTabProps) {
    const handleChange = (_: React.SyntheticEvent, newValue: any) => {
        if (!disabled) callbackFunction?.(newValue);
    }

    const tabLabel = (icon: string, label: string, index: number) => {
        return (
            <div className={`d-flex align-items-center ${tabId === index && 'text-bold'}`}>
                <span className='material-icons-outlined mr-2' style={{ fontSize: "18px" }}>{icon}</span>
                {label}
            </div>
        );
    }

    const tabProps = (index: number) => {
        return {
            'id': `simple-tab-${index}`,
            'style': {
                backgroundColor: tabId === index ? '#880808' : 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                borderBottom: 'none',
                color: 'white'
            },
            'className': `rounded-top`,
            'aria-controls': `simple-tabpanel-${index}`
        };
    }

    return (
        <Tabs
            selectionFollowsFocus
            className=''
            centered={centered}
            value={tabId}
            onChange={handleChange}
            aria-label="ROOM VIEW TABS"
            variant={variant}
            scrollButtons="auto"
            sx={{
                '& .MuiTabs-flexContainer': {
                    gap: theme => theme.spacing(0.7)
                },
            }}
        >
            {
                tabs.map((tab, index) => (
                    <Tab key={index} label={tabLabel(tab.icon, tab.label, tab.index)} {...tabProps(tab.index)} value={tab.index} />
                ))
            }
        </Tabs>
    );
}