import useGetRankAttribute from "@/app/hooks/useGetRankAttribute";
import CustomAvatarWithOnlineBadge from "../CustomAvatarWithOnlineBadge/CustomAvatarWithOnlineBadge";
import useSystemURLCon from "@/app/hooks/useSystemURLCon";
import ModalViewUser from "./components/ModalViewUser";

export default function CustomUserPill({ user }: { user: any }) {
    const { urlWithoutApi } = useSystemURLCon();
    const { getRankAttribute } = useGetRankAttribute();

    return (
        <div>
            <div data-toggle="modal" data-target={`#view_user_details_${user?.id}`} className="custom-border-dark px-2 mt-1 py-0" style={{ borderRadius: '30px', cursor: 'pointer' }}>
                <div className="row">
                    <div className="col-2">
                        <CustomAvatarWithOnlineBadge data={user} height={48} width={48} src={`${urlWithoutApi}/user-images/${user.profile_picture}`} isOnline={user.is_online} isAdmin={user.role === "SUPERADMIN"} />
                    </div>
                    <div className="col-10 px-3 pl-4 pt-1">
                        {getRankAttribute(user.role === "ADMINISTRATOR" ? '∞' : user.role === "SUPERADMIN" ? 'Ω' : user.total_points || 0, true, false)}
                    </div>
                </div>
            </div>

            <ModalViewUser
                user={user}
            />
        </div>
    );
}