"use client";
import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

export function CanvasRevealEffectDemo({
  officeData,
  onClick,
}: {
  officeData: any;
  onClick: (workspace_id: string, workspace_name: string) => void;
}) {
  return (
    <>
      <div
        className="py-20 flex flex-col lg:flex-row   items-center justify-center w-full gap-4 mx-auto px-8"
        style={{ width: "93%" }}
      >
        {officeData.map(({ node }: any) => (
          <Card
            key={node.id}
            workspace_id={node.workspace_id}
            title={node.title}
            onClick={onClick}
            icon={<NineNineNineIcon />}
          >
            <CanvasRevealEffect
              animationSpeed={5.1}
              containerClassName={node.background}
              colors={node.colors}
              dotSize={2}
            />
          </Card>
        ))}
      </div>
    </>
  );
}

const Card = ({
  title,
  workspace_id,
  icon,
  children,
  onClick,
}: {
  title: string;
  workspace_id: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  onClick: (workspace_id: string, workspace_name: string) => void;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={() => onClick(workspace_id, title)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2]  max-w-sm w-full mx-auto p-4 relative h-[23rem] relative"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {!hovered && (
          <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full mt-10 mx-auto flex items-center justify-center">
            {icon}
          </div>
        )}
        <h2 className="dark:text-white mt-2 text-3xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200 text-center">
          {title}
        </h2>
      </div>
    </div>
  );
};

const NineNineNineIcon = () => {
  const size = 130;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 276 239"
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g stroke="gold" transform="translate(-1674 -702)">
          <g transform="translate(1585 365)">
            <g transform="translate(66 217)">
              <g>
                <g transform="translate(0 81.268)">
                  <g>
                    <path d="M159.947 230.514l-31.927-55.14-13.022 22.516 44.95 77.722v-45.098z"></path>
                    <path d="M127.14 173.892L95.968 119.67H69.826l44.35 76.76 12.965-22.538z"></path>
                    <path
                      d="M78.376 89.861L46.887 35.24 33.942 57.637l44.489 76.712-.055-44.488z"
                      transform="scale(1 -1) rotate(60 203.763 0)"
                    ></path>
                    <path d="M25.576 40.02L64.04 62.038h62.805l-12.504-22.032-88.766.016z"></path>
                    <path d="M116.071 40.002l12.861 21.892 63.255.174L205.2 39.996l-89.13.006z"></path>
                    <path
                      d="M264.059 50.383l-31.578-54.64-12.597 22.08 44.187 76.46-.012-43.9z"
                      transform="scale(1 -1) rotate(-60 163.23 0)"
                    ></path>
                    <path
                      d="M287.45 89.027l-31.396-54.27-13.23 22.893 44.582 77.023.044-45.646z"
                      transform="rotate(-120 265.098 85.145)"
                    ></path>
                    <path d="M193.925 173.436l13.296 22.983 44.409-76.772-26.629.03-31.076 53.76z"></path>
                    <path
                      d="M206.424 230.212l-31.634-55.337-13.3 23.146 44.934 77.791v-45.6z"
                      transform="matrix(-1 0 0 1 367.836 0)"
                    ></path>
                  </g>
                  <g transform="translate(64.797 63.006)">
                    <path d="M95.151 124.072l-19.397-33.58-11.593 20.192 30.99 53.666v-40.278z"></path>
                    <path d="M74.95 89.025L56.246 56.67H33.057l30.204 52.494 11.689-20.14z"></path>
                    <path d="M55.379 55.174l-19.094-33L1.478 2.216 32.196 55.39l23.183-.216z"></path>
                    <path d="M2.78.892L37 20.85l37.967-.002L63.212.662 2.779.892z"></path>
                    <path d="M76.785 20.826l38.062-.012L126.476.706H65.085l11.7 20.12z"></path>
                    <path d="M116.623 20.818l38.148-.038L189.344.755h-61.086l-11.635 20.063z"></path>
                    <path d="M155.47 22.11l-19.13 33.093 23.01-.054 30.632-52.72-34.512 19.68z"></path>
                    <path d="M116.817 89.025l11.448 19.913 30.22-52.273-22.99-.025-18.678 32.385z"></path>
                    <path
                      d="M127.5 123.999l-19.1-33.494-11.506 19.933 30.606 52.95v-39.39z"
                      transform="matrix(-1 0 0 1 224.317 0)"
                    ></path>
                  </g>
                  <g transform="translate(92.444 67.321)">
                    <path d="M67.443 77.286l-7.116-12.263-11.32 19.696 18.436 31.76V77.286z"></path>
                    <path
                      d="M29.891 52.957L41.363 72.8l12.807.005L65.6 53.028l-35.709-.071z"
                      transform="rotate(-120 47.744 62.88)"
                    ></path>
                    <path
                      d="M37.649 25.61l-6.9-11.913-11.397 19.72 18.24 31.614.057-39.422z"
                      transform="scale(1 -1) rotate(60 97.39 0)"
                    ></path>
                    <path
                      d="M47.267 8.479L40.48-3.265 29.166 16.358l18.158 31.418-.057-39.297z"
                      transform="rotate(120 38.208 22.69)"
                    ></path>
                    <path d="M49.837 18.039l11.368 19.58h13.62l11.416-19.58H49.837z"></path>
                    <path
                      d="M107.204 8.633L100.279-3.35 88.982 16.331l18.26 31.597-.038-39.295z"
                      transform="scale(1 -1) rotate(-60 58.719 0)"
                    ></path>
                    <path
                      d="M117.108 25.526l-6.864-11.796L98.84 33.462l18.238 31.588.03-39.524z"
                      transform="rotate(-120 107.935 39.823)"
                    ></path>
                    <path
                      d="M70.792 52.956l11.462 19.779 12.83.022 11.439-19.792-35.73-.01z"
                      transform="scale(1 -1) rotate(60 197.528 0)"
                    ></path>
                    <path
                      d="M87.372 77.24L80.46 65.016 69.198 84.738l18.174 31.596V77.24z"
                      transform="matrix(-1 0 0 1 156.494 0)"
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
