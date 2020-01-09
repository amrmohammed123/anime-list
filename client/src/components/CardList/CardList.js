import React from "react";
import Card from "../../components/Card";
import styles from "./CardList.module.scss";

const CardList = ({
  className = "",
  cards = [],
  history = null,
  setMessage = null,
  itemType = "",
  ...props
}) => {
  let CardListClassNames = [styles.CardList, className].join(" ");
  return (
    <div className={CardListClassNames}>
      {cards.map((card, index) => (
        <Card
          className={styles.card}
          poster={card.poster}
          title={card.title}
          itemId={card.itemId || card.id}
          history={history}
          itemType={itemType}
          key={index}
          setMessage={setMessage}
        />
      ))}
    </div>
  );
};

export default CardList;
