import React from "react";
// @ts-ignore
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
//@ts-expect-error
import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import { Task } from "@/types";

interface ColumnProps {
  id: string;
  title: string;
  cards: Task[];
  openModal: (cardId: string) => void;
}

const Column = ({ id, title, cards, openModal }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext
      id={id.toString()}
      items={cards ? cards.map((card) => ({ id: card.node.id })) : []}
      strategy={rectSortingStrategy}
    >
      <div
        ref={setNodeRef}
        style={{
          width: "280px",
          background: "transparent",
          marginRight: "10px",
          marginBottom: "80px",
        }}
      >
        <p
          style={{
            padding: "5px 40px",
            textAlign: "left",
            fontWeight: "500",
            color: "#575757",
            marginBottom: "20px",
            fontSize: "15px",
          }}
        >
          {title}
        </p>

        {cards?.map((card) => (
          <div key={card.node.id}>
            <Card
              node={{
                id: card.node.id,
                title: card.node.title,
                description: card.node.description,
              }}
              onClick={() => openModal(card.node.id)}
            />
          </div>
        ))}
      </div>
    </SortableContext>
  );
};

export default Column;
