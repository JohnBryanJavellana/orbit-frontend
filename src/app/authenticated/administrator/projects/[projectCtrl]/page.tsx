'use client';

import CustomBreadcrumb from "@/app/custom-global-components/CustomBreadcrumb/CustomBreadcrumb";
import CustomTab from "@/app/custom-global-components/CustomTab/CustomTab";
import { useParams } from "next/navigation";
import { useState } from "react";
import ProjectsViewTab1 from "./tab1/ProjectsViewTab1";
import ProjectsViewTab2 from "./tab2/ProjectsViewTab2";
import ProjectsViewTab3 from "./tab3/ProjectsViewTab3";

export default function Projects() {
    const router = useParams();
    const projectCtrl = router.projectCtrl;
    const [tabId, setTabId] = useState<number>(0);

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
                    }
                ]}
            />

            <CustomTab
                tabId={tabId}
                tabs={[
                    {
                        icon: "info",
                        label: "Project Details",
                        index: 0
                    },
                    {
                        icon: "task",
                        label: "Tasks",
                        index: 1
                    },
                    {
                        icon: "group",
                        label: "Project Collaborators",
                        index: 2
                    }
                ]}
                callbackFunction={(e) => setTabId(e)}
            />

            <div className="card rounded-0 custom-bg custom-border-dark">
                <div className="card-body p-0">
                    <div role="tabpanel" hidden={tabId !== 0} id={`simple-tabpanel-0`} aria-labelledby={`simple-tab-0`}>
                        {(tabId === 0) && <ProjectsViewTab1 projectCtrl={projectCtrl} />}
                    </div>

                    <div role="tabpanel" hidden={tabId !== 1} id={`simple-tabpanel-1`} aria-labelledby={`simple-tab-1`}>
                        {(tabId === 1) && <ProjectsViewTab2 projectCtrl={projectCtrl} />}
                    </div>

                    <div role="tabpanel" hidden={tabId !== 2} id={`simple-tabpanel-2`} aria-labelledby={`simple-tab-2`}>
                        {(tabId === 2) && <ProjectsViewTab3 projectCtrl={projectCtrl} />}
                    </div>
                </div>
            </div>
        </>
    );
}