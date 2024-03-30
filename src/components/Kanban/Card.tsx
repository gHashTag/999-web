import { forwardRef } from "react";
// @ts-ignore
import { CSS } from "@dnd-kit/utilities";
// @ts-ignore
import { useSortable } from "@dnd-kit/sortable";
import { Task } from "@/types";
import { BackgroundGradient } from "../ui/background-gradient";
// @ts-ignore
import { Spacer } from "@nextui-org/react";

interface CardProps {
  node: {
    id: string;
    title: string;
    description: string;
  };
  onClick?: () => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ node, onClick }, ref) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: node.id,
  });

  const style = {
    opacity: 1,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div ref={ref} onClick={onClick}>
      <BackgroundGradient className="rounded-[22px] sm:p-1">
        <div className="bg-stone-950 rounded-[17px]">
          <div
            className="text-2xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-semibold"
            style={{ paddingTop: 10, paddingLeft: 10 }}
          >
            {node?.title}
          </div>
          <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
            <div
              className="text-1xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl"
              style={{
                padding: 10,
                paddingBottom: 10,
                color: "rgb(87 83 78)",
              }}
            >
              {node?.description}
            </div>
          </div>
        </div>
      </BackgroundGradient>
      <Spacer x={40} />
      <div id={node?.id.toString()} />
    </div>
  );
});

Card.displayName = "Card";

export default Card;
