import React from "react";
import ProfileCard from "../../components/ProfileCard";

const ProfileCardList = ({
  className = "",
  cards = [],
  history = null,
  setMessage = null,
  itemType = "",
  ...props
}) => {
  return (
    <div className={className}>
      {cards.map((card, index) => (
        <ProfileCard
          poster={card.poster}
          title={card.title}
          itemId={card.itemId || card.id}
          history={history}
          itemType={itemType}
          status={card.status}
          key={index}
          setMessage={setMessage}
        />
      ))}
    </div>
  );
};

export default ProfileCardList;
