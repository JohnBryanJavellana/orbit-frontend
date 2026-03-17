import CustomUserPill from "@/app/custom-global-components/CustomUserPill/CustomUserPill";
import useDateFormat from "@/app/hooks/useDateFormat";
import { Box } from "@mui/material";

export default function ProjectContent({ projectDetails, projectCtrl }: { projectDetails: any, projectCtrl: any }) {
    const { FormatDatetimeToHumanReadable } = useDateFormat();

    return (
        <div>
            <div className="card-body">
                <div className="p-1 text-white">
                    <div className="mb-2">
                        <div className="row">
                            <div className="col-xl-9 mb-2">
                                <h1 className="text-white font-bold text-break text-3xl mb-1">
                                    {projectDetails.name}
                                </h1>
                                <div className="text-sm text-muted opacity-60">
                                    Project Ref: <span className="text-red-500 font-mono">{projectCtrl}</span>
                                </div>
                            </div>

                            <div className="col-xl-3 mb-2">
                                <Box component="section" className="text-center" sx={{ p: 2, border: '1px dashed grey', background: ['IN PROGRESS', 'OPEN', 'COMPLETED'].includes(projectDetails.status) ? 'rgba(0, 250, 0, 0.08)' : 'rgba(250, 0, 0, 0.08)' }}>
                                    {projectDetails.status}
                                </Box>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-dark custom-border-dark px-6 quill-content px-4 pt-3 my-3"
                        dangerouslySetInnerHTML={{ __html: projectDetails.description }}
                    />

                    <div className="bg-dark custom-border-dark mb-3">
                        <div className="row">
                            <div className="col-12 p-4 text-center">
                                <h5 className="text-bold text-muted">Completion Points</h5>
                                <div className="h3">+{projectDetails.completion_points}</div>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-muted">
                        <div className="col-xl-3 pr-5">
                            <div className="pr-5">
                                <div className="mb-3">Creator</div>
                                <CustomUserPill user={projectDetails.creator} />
                            </div>
                        </div>

                        <div className="mt-3">
                            Created at {FormatDatetimeToHumanReadable(projectDetails.created_at, true)}
                        </div>
                        <div>
                            Updated at {FormatDatetimeToHumanReadable(projectDetails.updated_at, true)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}