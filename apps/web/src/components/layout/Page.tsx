import { type ReactNode } from "react";
import Header from "./Header";

interface PageProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

const Page = ({ title, subtitle, children, className = "" }: PageProps) => {
  return (
    <div className={`px-4 py-4 space-y-4 ${className}`}>
      {title && <Header title={title} subtitle={subtitle} />}
      {children}
    </div>
  );
};

export default Page;
