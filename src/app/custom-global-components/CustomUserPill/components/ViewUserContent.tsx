import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography } from "@mui/material";
import CustomAvatarWithOnlineBadge from "../../CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";
import useGetRankAttribute2 from "@/app/hooks/useGetRankAttribute2";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import NoviceRankWithBanner from "../../CustomRanksWithBanner/Novice/NoviceRankWithBanner";
import SuperiorRankWithBanner from "../../CustomRanksWithBanner/Superior/SuperiorRankWithBanner";
import SupremeRankWithBanner from "../../CustomRanksWithBanner/Supreme/SupremeRankWithBanner";
import ContributorRankWithBanner from "../../CustomRanksWithBanner/Contributor/ContributorRankWithBanner";
import SpecialistRankWithBanner from "../../CustomRanksWithBanner/Specialist/SpecialistRankWithBanner";
import LeadRankWithBanner from "../../CustomRanksWithBanner/Lead/LeadRankWithBanner";
import ArchitectRankWithBanner from "../../CustomRanksWithBanner/Architect/ArchitectRankWithBanner";
import './ViewUserContent.css';

export default function ViewUserContent({ user }: { user: any }) {
    const { getRankAttribute } = useGetRankAttribute2();
    const { urlWithoutApi } = useSystemURLCon();

    return (
        <>
            <div className="row custom-top-border-dark">
                <div className="col-xl-8">
                    <Box sx={{
                        height: '120px',
                        background: `linear-gradient(180deg, rgba(220, 53, 69, 0.2) 0%, transparent 100%)`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end'
                    }}>
                        <div style={{ transform: 'translateY(40px)' }}>
                            <CustomAvatarWithOnlineBadge height={120} width={120} data={user} src={`${urlWithoutApi}/user-images/${user.profile_picture}`} isOnline={user.is_online} isAdmin={user.role === "SUPERADMIN"} />
                        </div>
                    </Box>

                    <Box sx={{ p: 4, pt: '12%', textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                            {user.first_name} {user.middle_name} {user.last_name} {user.suffix ?? ''}
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#adb5bd', mb: 2 }}>
                            {user.email}
                        </Typography>

                        <div dangerouslySetInnerHTML={{ __html: user.bio }} />

                        {!["ADMINISTRATOR", "SUPERADMIN"].includes(user.role) && (
                            getRankAttribute(user.total_points)
                        )}

                        <div className="mt-5">
                            {
                                ["ADMINISTRATOR", "SUPERADMIN"].includes(user.role)
                                    ? <>
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <div className="row elevation-1 rounded-sm custom-border-dark">
                                                    <div className="col-6 p-4 text-center">
                                                        <div className="h4 text-bold">Task Deployed</div>
                                                        <div className="h3">{user.user_profile_view.stats?.deployed_tasks}</div>
                                                    </div>
                                                    <div className="col-6 p-4 custom-left-border-dark text-center">
                                                        <div className="h4 text-bold">Task Accomplished</div>
                                                        <div className="h3">{user.user_profile_view.stats?.accomplished_tasks}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-xl-12 p-0">
                                                <Accordion disableGutters expanded={true} className="bg-dark rounded-sm elevation-1 custom-border-dark mt-2">
                                                    <AccordionSummary
                                                        aria-controls="panel1-content"
                                                        id="panel1-header"
                                                    >
                                                        <Typography component="span">Created Projects</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails className="text-left">
                                                        {
                                                            user.user_profile_view.stats?.created_projects.length > 0
                                                                ? user.user_profile_view.stats?.created_projects.map((project: any, index: number) => {
                                                                    return <div key={index}>
                                                                        <div className="p-2 text-white">
                                                                            {project?.name}
                                                                        </div>

                                                                        {index < user.user_profile_view.stats.created_projects.length - 1 && <Divider sx={{ opacity: '0.3' }} />}
                                                                    </div>
                                                                }) : <i className="text-muted">No projects yet.</i>
                                                        }
                                                    </AccordionDetails>
                                                </Accordion>
                                            </div>
                                        </div>
                                    </> : <>
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <div className="row elevation-1 rounded-sm custom-border-dark">
                                                    <div className="col-6 p-4 text-center">
                                                        <div className="h4 text-bold">Task Applied</div>
                                                        <div className="h3">{user.user_profile_view.stats?.assigned_tasks}</div>
                                                    </div>
                                                    <div className="col-6 p-4 custom-left-border-dark text-center">
                                                        <div className="h4 text-bold">Task Accomplished</div>
                                                        <div className="h3">{user.user_profile_view.stats?.finished_tasks}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                            }
                        </div>
                    </Box>
                </div>

                <div className={`col-xl-4 text-center ${["ADMINISTRATOR", "SUPERADMIN"].includes(user.role) ? 'with-shooting-star' : ''}`} style={{ userSelect: 'none' }}>
                    {user.role === "SUPERADMIN" && <SupremeRankWithBanner />}
                    {user.role === "ADMINISTRATOR" && <SuperiorRankWithBanner />}
                    {(!["ADMINISTRATOR", "SUPERADMIN"].includes(user.role) && user.total_points < 500) && <NoviceRankWithBanner />}
                    {(!["ADMINISTRATOR", "SUPERADMIN"].includes(user.role) && user.total_points < 1500 && user.total_points >= 500) && <ContributorRankWithBanner />}
                    {(!["ADMINISTRATOR", "SUPERADMIN"].includes(user.role) && user.total_points < 3000 && user.total_points >= 1500) && <SpecialistRankWithBanner />}
                    {(!["ADMINISTRATOR", "SUPERADMIN"].includes(user.role) && user.total_points < 5000 && user.total_points >= 3000) && <LeadRankWithBanner />}
                    {(!["ADMINISTRATOR", "SUPERADMIN"].includes(user.role) && user.total_points >= 5000) && <ArchitectRankWithBanner />}
                </div>
            </div>
        </>
    );
}