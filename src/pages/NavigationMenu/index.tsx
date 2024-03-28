import React, { useState } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import { CaretDownIcon } from "@radix-ui/react-icons";

import Link from "next/link";

interface ListItemProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  [x: string]: any;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  function ListItem({ className, children, title, ...props }, forwardedRef) {
    return (
      <li>
        <NavigationMenu.Link asChild>
          <Link
            href={props.href}
            className={classNames("ListItemLink", className)}
            {...props}
            ref={forwardedRef}
          >
            <div className="ListItemHeading">{title}</div>
            <p className="ListItemText">{children}</p>
          </Link>
        </NavigationMenu.Link>
      </li>
    );
  }
);

const NavigationMenuDemo = () => {
  return (
    <NavigationMenu.Root className="NavigationMenuRoot">
      <NavigationMenu.List className="NavigationMenuList">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="NavigationMenuTrigger">
            Create meet
            <CaretDownIcon className="CaretDown" aria-hidden />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="NavigationMenuContent">
            <ul className="List two">
              <ListItem href="/create-meet/meets" title="Video meeting">
                Conduct virtual meetings with video. Ideal for workshops,
                training and webinars.
              </ListItem>
              <ListItem href="/create-meet/audio-spaces" title="Audio Spaces">
                Create an audio space for podcasts, discussions or music
                sessions. Communicate and share ideas through audio.
              </ListItem>
              <ListItem
                href="https://icons.radix-ui.com/"
                title="Token gated Room"
              >
                A closed room that can only be accessed with a token. Use for
                private events or exclusive content.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link className="NavigationMenuLink" href="/meets">
            Meets
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator className="NavigationMenuIndicator">
          <div className="Arrow" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className="ViewportPosition">
        <NavigationMenu.Viewport className="NavigationMenuViewport" />
      </div>
    </NavigationMenu.Root>
  );
};

export default NavigationMenuDemo;
