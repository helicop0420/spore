import { HTMLAttributeAnchorTarget } from "react";

type NavItem = {
  name: string;
  href: string;
  target?: HTMLAttributeAnchorTarget;
  needConnect?: boolean;
};

export const NAVS: NavItem[] = [
  {
    name: 'Explore',
    href: '/',
  },
  {
    name: 'What is Spore?',
    href: 'https://spore.pro',
    target: '_blank',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/sporeprotocol/spore-demo',
    target: '_blank',
  },
];

export const MOBILE_NAVS: NavItem[] = [
  {
    name: 'Explore',
    href: '/',
  },
  {
    name: 'My Space',
    href: '/my',
    needConnect: true,
  },
  {
    name: 'What is Spore?',
    href: 'https://spore.pro',
    target: '_blank',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/sporeprotocol/spore-demo',
    target: '_blank',
  },
];
