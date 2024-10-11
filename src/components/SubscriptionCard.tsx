import React from "react";
import { useNavigate } from "react-router-dom";
import { ISubscriptionListQueryData } from "../types";

interface ISubscriptionCardProps {
  singleSubscription: ISubscriptionListQueryData;
}

const SubscriptionCard: React.FC<ISubscriptionCardProps> = ({
  singleSubscription,
}) => {
  //   console.log("singleSubscription *********", singleSubscription);

  const navigate = useNavigate();

  // ------ HANDLE CHANNEL NAVIGATION ------
  const handleChannelNavigate = () => {
    navigate(`/channel-profile?chId=${singleSubscription._id}`);
    window.location.reload();
  };

  return (
    <div
      onClick={handleChannelNavigate}
      className="flex items-center hover:bg-black/20 dark:hover:bg-zinc-600/40 gap-x-2 text-sm sm:text-base md:text-lg tracking-normal sm:tracking-normal rounded-md duration-200 capitalize py-2 cursor-pointer  "
    >
      <img
        src={singleSubscription.avatar}
        alt={singleSubscription.username}
        className="size-7 sm:size-10 rounded-full "
      />
      <p> {singleSubscription.username} </p>
    </div>
  );
};

export default SubscriptionCard;
