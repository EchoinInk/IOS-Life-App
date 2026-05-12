import { type ReactNode } from "react";

interface PageBodyProps {
  children: ReactNode;
  className?: string;
}

const PageBody = ({ children, className = "" }: PageBodyProps) => (
  <div className={`flex-1 overflow-y-auto ${className}`}>
    {children}
  </div>
);

export default PageBody;
