'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Ban,
  X,
  Command,
  IdCard,
} from 'lucide-react';
import { SlidingNumber } from '@workspace/ui/components/animate-ui/primitives/texts/sliding-number';
import { motion, type Variants, type Transition } from 'motion/react';

const TOTAL_PAGES = 10;

const BUTTON_MOTION_CONFIG = {
  initial: 'rest',
  whileHover: 'hover',
  whileTap: 'tap',
  variants: {
    rest: { maxWidth: '40px' },
    hover: {
      maxWidth: '140px',
      transition: { type: 'spring', stiffness: 200, damping: 35, delay: 0.15 },
    },
    tap: { scale: 0.95 },
  },
  transition: { type: 'spring', stiffness: 250, damping: 25 },
} as const;

const LABEL_VARIANTS: Variants = {
  rest: { opacity: 0, x: 4 },
  hover: { opacity: 1, x: 0, visibility: 'visible' },
  tap: { opacity: 1, x: 0, visibility: 'visible' },
};

const LABEL_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};

function ManagementBar() {
  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePrevPage = React.useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const handleNextPage = React.useCallback(() => {
    if (currentPage < TOTAL_PAGES) setCurrentPage(currentPage + 1);
  }, [currentPage]);

  return (
    <div className="@container/wrapper w-full flex justify-center">
      <div className="flex w-fit flex-col @xl/wrapper:flex-row items-center gap-y-2 rounded-lg border border-border bg-background p-2 shadow-lg">
        <div className="mx-auto flex flex-col @lg/wrapper:flex-row shrink-0 items-center">
          <div className="flex h-10">
            <button
              disabled={currentPage === 1}
              className="p-1 text-muted-foreground transition-colors hover:text-foreground disabled:text-muted-foreground/30 disabled:hover:text-muted-foreground/30"
              onClick={handlePrevPage}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="mx-2 flex items-center space-x-1 text-sm tabular-nums">
              <SlidingNumber
                className="text-foreground"
                padStart
                number={currentPage}
              />
              <span className="text-secondary-foreground">/ {TOTAL_PAGES}</span>
            </div>
            <button
              disabled={currentPage === TOTAL_PAGES}
              className="p-1 text-muted-foreground transition-colors hover:text-foreground disabled:text-muted-foreground/30 disabled:hover:text-muted-foreground/30"
              onClick={handleNextPage}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="mx-3 h-6 w-px bg-border rounded-full hidden @lg/wrapper:block" />

          <motion.div
            layout
            layoutRoot
            className="mx-auto flex flex-wrap space-x-2 sm:flex-nowrap"
          >
            <motion.button
              {...BUTTON_MOTION_CONFIG}
              className="flex h-10 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-full bg-secondary px-2.5 py-2 text-secondary-foreground"
              aria-label="Blacklist"
            >
              <Ban size={20} className="shrink-0" />
              <motion.span
                variants={LABEL_VARIANTS}
                transition={LABEL_TRANSITION}
                className="invisible text-sm"
              >
                Blacklist
              </motion.span>
            </motion.button>

            <motion.button
              {...BUTTON_MOTION_CONFIG}
              className="flex h-10 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-full bg-destructive/15 px-2.5 py-2 text-destructive"
              aria-label="Reject"
            >
              <X size={20} className="shrink-0" />
              <motion.span
                variants={LABEL_VARIANTS}
                transition={LABEL_TRANSITION}
                className="invisible text-sm"
              >
                Reject
              </motion.span>
            </motion.button>

            <motion.button
              {...BUTTON_MOTION_CONFIG}
              className="flex h-10 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-full bg-primary/10 px-2.5 py-2 text-primary"
              aria-label="Hire"
            >
              <IdCard size={20} className="shrink-0" />
              <motion.span
                variants={LABEL_VARIANTS}
                transition={LABEL_TRANSITION}
                className="invisible text-sm"
              >
                Hire
              </motion.span>
            </motion.button>
          </motion.div>
        </div>

        <div className="mx-3 hidden h-6 w-px bg-border @xl/wrapper:block rounded-full" />

        <motion.button
          whileTap={{ scale: 0.975 }}
          className="flex h-10 text-sm cursor-pointer items-center justify-center rounded-full bg-primary px-3 py-2 text-primary-foreground transition-colors duration-300 hover:bg-primary/90 w-full @xl/wrapper:w-auto"
        >
          <span className="mr-1 text-primary-foreground/70">Move to:</span>
          <span>Interview I</span>
          <div className="mx-3 h-5 w-px bg-primary-foreground/40 rounded-full" />
          <div className="flex items-center gap-1 rounded-md bg-primary-foreground/20 px-1.5 py-0.5 -mr-1">
            <Command size={14} />E
          </div>
        </motion.button>
      </div>
    </div>
  );
}

export { ManagementBar };
