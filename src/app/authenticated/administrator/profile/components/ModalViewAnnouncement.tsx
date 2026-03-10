'use client';
/* global $ */

import ModalTemplate from "@/app/custom-global-components/ModalTemplate/ModalTemplate";
import './ModalViewAnnouncement.css';

interface ModalViewAnnouncementProps {
    data: any | null,
    id: number | null
}

export default function ModalViewAnnouncement({ data, id }: ModalViewAnnouncementProps) {
    return (
        <>
            <ModalTemplate
                id={`view_announcement_popup_${id}`}
                size={"lg"}
                modalDialogStyle="parchment bg-transparent"
                isModalScrollable={false}
                bodyClassName="mx-5"
                modalContentClassName="bg-transparent border-0 elevation-0 shadow-0"
                body={
                    <>
                        <div className="parchment-content">
                            <h2 className="text-dark text-bold">Announcement</h2>
                            <p className="text-dark">{data?.message || "No content available"} Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora consequatur illo quos dolorum. Beatae obcaecati, necessitatibus laudantium, odit inventore voluptates non numquam, quia et quo soluta accusantium maiores esse! Nam! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit sapiente distinctio perspiciatis accusamus, voluptas odio dolorem ad amet repellat necessitatibus nisi consequatur qui labore doloribus nesciunt iste dignissimos voluptatem magni? Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, reiciendis modi totam debitis excepturi dolores voluptatum aut reprehenderit cum ad error, vitae itaque soluta nesciunt suscipit? Molestiae nulla deserunt in? Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima doloremque, quidem placeat rem quam vero laudantium in ea numquam veritatis fugit. Nisi eum quae sunt quod ea rerum nulla fuga. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad, ducimus alias architecto iusto sequi ab veritatis maxime hic vitae doloremque repellendus exercitationem placeat molestias sit ut repudiandae delectus maiores itaque! Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus adipisci quae quod ea esse dolorem qui quas accusantium itaque, vitae dolorum enim ullam eaque perspiciatis provident veniam sed minus assumenda. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur inventore, eaque ducimus, nam sapiente accusantium non, nesciunt animi voluptates expedita mollitia? Vel ducimus ratione, illum dolores delectus fuga repellat nihil? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita officia sint aperiam nostrum temporibus non? Fugiat, harum eligendi quisquam quidem voluptatum expedita nemo eaque hic reprehenderit aliquid amet quaerat ratione. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequuntur quod, eveniet tempore voluptates natus velit enim eius magni temporibus eos. Amet labore id illum molestiae accusamus officia! Odio, eius sit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti eum optio facere eius, fuga molestiae, et maiores expedita placeat aut exercitationem possimus? Cupiditate magnam ullam dolorem praesentium consequatur totam architecto? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam similique voluptatibus deserunt qui eveniet consectetur? Minima deserunt rerum officia placeat, tempore alias! Ex nobis quos repudiandae beatae quam at molestias. Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro architecto quas earum. Facere officia dignissimos molestiae adipisci rem cum animi unde nihil, ipsum ea nam, ratione maiores officiis nesciunt eveniet! ;Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus laudantium deleniti, esse modi illum doloribus aperiam veniam voluptas nihil atque optio eligendi in ratione debitis nesciunt consequuntur dolorem aut placeat?</p>

                            <div className="d-flex align-items-center justify-content-center">
                                <button type="button" data-dismiss="modal" className="rpg-button px-4 shadow">
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}