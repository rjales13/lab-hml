export interface iBreadCrumbItems {
  name: string;
  isLink: boolean;
  link?: string;
}

export interface iBreadCrumbProps {
  items?: iBreadCrumbItems[];
}
