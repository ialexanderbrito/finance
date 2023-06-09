import { Switch } from '@headlessui/react';
import { CaretRight } from '@phosphor-icons/react';

import { useTheme } from 'contexts/Theme';

interface SubmenuProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  arrow?: boolean;
  divider?: boolean;
  switchTheme?: boolean;
}

export function Submenu({
  icon,
  title,
  onClick,
  arrow,
  divider,
  switchTheme,
}: SubmenuProps) {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <div
        className="flex w-full cursor-pointer flex-row items-center justify-center gap-2"
        onClick={onClick}
      >
        <div className="text-md flex w-full flex-row items-center justify-start gap-2">
          {icon}
          {title}
        </div>
        <div>
          {arrow && (
            <CaretRight
              size={20}
              weight="light"
              className="text-secondary dark:text-secondaryDark"
            />
          )}
        </div>
        <div>
          {switchTheme && (
            <Switch
              checked={theme === 'dark'}
              onChange={() => toggleTheme()}
              className={`${
                theme === 'dark' ? 'bg-primary' : 'bg-secondary'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white`}
              />
            </Switch>
          )}
        </div>
      </div>
      {divider && (
        <div className="h-[0.5px] w-full bg-text/30 dark:bg-textDark/30" />
      )}
    </>
  );
}
