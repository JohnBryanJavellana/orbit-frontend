'use client';

import CustomBreadcrumb from "@/app/custom-global-components/CustomBreadcrumb/CustomBreadcrumb";
import CustomTab from "@/app/custom-global-components/CustomTab/CustomTab";
import { useParams } from "next/navigation";
import { useState } from "react";
import ViewTaskTab1 from "./tab1/ViewTaskTab1";
import ViewTaskTab2 from "./tab2/ViewTaskTab2";
import ViewTaskTab3 from "./tab3/ViewTaskTab3";
import ViewTaskTab4 from "./tab4/ViewTaskTab4";

export default function ViewTask() {
    const router = useParams();
    const projectCtrl = router.projectCtrl;
    const taskCtrl = router.taskCtrl;
    const [tabId, setTabId] = useState(0);

    return (
        <>
            <CustomBreadcrumb
                pageName={[
                    {
                        'name': 'Projects',
                        'ilast': true,
                        'address': '/authenticated/administrator/projects/'
                    },
                    {
                        'name': 'View Project',
                        'last': false
                    },
                    {
                        'name': projectCtrl,
                        'last': true,
                        'address': `/authenticated/administrator/projects/${projectCtrl}`
                    },
                    {
                        'name': 'View Task',
                        'last': false
                    },
                    {
                        'name': taskCtrl,
                        'last': true,
                        'address': `/authenticated/administrator/projects/${projectCtrl}/view-task/${taskCtrl}`
                    },
                ]}
            />

            <CustomTab
                tabId={tabId}
                tabs={[
                    {
                        icon: "info",
                        label: "Overview",
                        index: 0
                    },
                    {
                        icon: "groups",
                        label: "Task Collaborators",
                        index: 1
                    },
                    {
                        icon: "task",
                        label: "Progress",
                        index: 2
                    },
                    {
                        icon: "photo",
                        label: "Photo Documentations",
                        index: 3
                    }
                ]}
                callbackFunction={(e) => setTabId(e)}
            />

            <div className="card rounded-0 custom-bg custom-border-dark">
                <div className="card-body p-0">
                    <div role="tabpanel" hidden={tabId !== 0} id={`simple-tabpanel-0`} aria-labelledby={`simple-tab-0`}>
                        {(tabId === 0) && <ViewTaskTab1 projectCtrl={projectCtrl} taskCtrl={taskCtrl} />}
                    </div>

                    <div role="tabpanel" hidden={tabId !== 1} id={`simple-tabpanel-1`} aria-labelledby={`simple-tab-1`}>
                        {(tabId === 1) && <ViewTaskTab2 projectCtrl={projectCtrl} taskCtrl={taskCtrl} />}
                    </div>

                    <div role="tabpanel" hidden={tabId !== 2} id={`simple-tabpanel-2`} aria-labelledby={`simple-tab-2`}>
                        {(tabId === 2) && <ViewTaskTab3 projectCtrl={projectCtrl} taskCtrl={taskCtrl} />}
                    </div>

                    <div role="tabpanel" hidden={tabId !== 3} id={`simple-tabpanel-3`} aria-labelledby={`simple-tab-3`}>
                        {(tabId === 3) && <ViewTaskTab4 projectCtrl={projectCtrl} taskCtrl={taskCtrl} />}
                    </div>
                </div>
            </div>
        </>
    );
}