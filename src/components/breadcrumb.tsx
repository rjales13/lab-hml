import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { iBreadCrumbItems, iBreadCrumbProps } from '@/models/bread-crumb';
import { usePathname } from 'next/navigation';

export const BreadCrumb = ({ items }: iBreadCrumbProps) => {
  const pathname = usePathname();

  const basicItems: iBreadCrumbItems[] = [
    { name: 'Principal', isLink: true, link: '/' },
    { name: 'Listagem', isLink: true, link: `/${pathname.split('/')[1]}` },
    { name: 'Cadastro', isLink: false },
  ];

  const itemsToRender: iBreadCrumbItems[] = !items?.length ? basicItems : items;

  return (
    <Breadcrumb className="flex justify-end">
      <BreadcrumbList>
        {itemsToRender.map(({ isLink, name, link }) => (
          <React.Fragment key={name}>
            <BreadcrumbItem>
              {isLink ? (
                <BreadcrumbLink href={link}>{name}</BreadcrumbLink>
              ) : (
                <BreadcrumbLink>{name}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {isLink && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
