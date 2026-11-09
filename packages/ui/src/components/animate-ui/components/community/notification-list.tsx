'use client';

import { RotateCcw, ArrowUpRight } from 'lucide-react';
import { useFastTransition } from '@workspace/ui/hooks/use-fast-transition';
import { motion } from 'motion/react';
import { glass } from '@workspace/ui/lib/glass';

export type NotificationItem = {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  count?: number;
};

export const notifications: NotificationItem[] = [
  {
    id: 1,
    title: 'NPM Install Complete',
    subtitle: '1,227 packages added!',
    time: 'just now',
    count: 2,
  },
  {
    id: 2,
    title: 'Build Succeeded',
    subtitle: 'Build finished in 12.34s',
    time: '1m 11s',
  },
  {
    id: 3,
    title: 'Lint Passed',
    subtitle: 'No problems found',
    time: '5m',
  },
];

const getCardVariants = (i: number) => ({
  collapsed: {
    marginTop: i === 0 ? 0 : -44,
    scaleX: 1 - i * 0.05,
  },
  expanded: {
    marginTop: i === 0 ? 0 : 4,
    scaleX: 1,
  },
});

const notificationTextVariants = {
  collapsed: { opacity: 1, y: 0, pointerEvents: 'auto' },
  expanded: { opacity: 0, y: -16, pointerEvents: 'none' },
};

const viewAllTextVariants = {
  collapsed: { opacity: 0, y: 16, pointerEvents: 'none' },
  expanded: { opacity: 1, y: 0, pointerEvents: 'auto' },
};

function NotificationList({
  items = notifications,
  label = 'Notifications',
  viewAllLabel = 'View all',
}: {
  items?: NotificationItem[];
  label?: string;
  viewAllLabel?: string;
}) {
  const fast = useFastTransition();
  return (
    <motion.div
      className="p-3 w-xs space-y-3"
      initial="collapsed"
      whileHover="expanded"
    >
      <div>
        {items.map((notification, i) => (
          <motion.div
            key={notification.id}
            className={`${glass("card")} rounded-lg px-4 py-2 shadow-sm hover:shadow-lg transition-shadow duration-(--motion-fast) relative`}
            variants={getCardVariants(i)}
            style={{
              zIndex: items.length - i,
            }}
          >
            <div className="flex justify-between items-center">
              <h1 className="text-sm font-[weight:var(--font-body-weight-action)]">{notification.title}</h1>
              {notification.count && (
                <div className="flex items-center text-xs gap-0.5 font-[weight:var(--font-body-weight-action)] text-foreground/75">
                  <RotateCcw className="size-3" />
                  <span>{notification.count}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-foreground/75 font-[weight:var(--font-body-weight-action)]">
              <span>{notification.time}</span>
              &nbsp;•&nbsp;
              <span>{notification.subtitle}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="size-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-[weight:var(--font-body-weight-action)]">
          {items.length}
        </div>
        <span className="grid">
          <motion.span
            className="text-sm font-[weight:var(--font-body-weight-action)] text-foreground row-start-1 col-start-1"
            variants={notificationTextVariants}
            transition={fast}
          >
            {label}
          </motion.span>
          <motion.span
            className="text-sm font-[weight:var(--font-body-weight-action)] text-foreground flex items-center gap-1 cursor-pointer select-none row-start-1 col-start-1"
            variants={viewAllTextVariants}
            transition={fast}
          >
            {viewAllLabel} <ArrowUpRight className="size-4" />
          </motion.span>
        </span>
      </div>
    </motion.div>
  );
}

export { NotificationList };
