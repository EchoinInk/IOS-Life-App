import Header from "@/components/layout/Header";

export interface HomeHeaderProps {
  greeting: string;
}

/**
 * Home Header Component
 * 
 * Thin wrapper around the layout Header component
 * specific to the home screen context.
 */
export const HomeHeader = ({ greeting }: HomeHeaderProps) => {
  return (
    <Header 
      showTopBar 
      greeting={greeting} 
      topBarSubtitle="Let's make today amazing" 
      hasNotifications={false} 
    />
  );
};
