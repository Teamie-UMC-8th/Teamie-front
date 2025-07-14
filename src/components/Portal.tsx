'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  as?: 'div' | 'aside';
  containerId?: string;
}

export default function Portal({ children, as = 'div', containerId = 'portal-root' }: PortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(containerId);

    if (!element) {
      element = document.createElement(as);
      element.id = containerId;
      document.body.appendChild(element);
    }

    setContainer(element);

    return () => {
      if (element && element.parentNode && element.childNodes.length === 0) {
        element.parentNode.removeChild(element);
      }
    };
  }, [containerId, as]);

  return container ? createPortal(children, container) : null;
}
