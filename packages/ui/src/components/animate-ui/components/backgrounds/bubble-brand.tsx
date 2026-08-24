'use client';

import * as React from 'react';

import {
  BubbleBackground,
  type BubbleBackgroundProps,
} from '@workspace/ui/components/animate-ui/components/backgrounds/bubble';

const BRAND_BUBBLE_COLORS = {
  first: '207,190,173',
  second: '0,150,137',
  third: '16,78,100',
  fourth: '255,185,0',
  fifth: '254,154,0',
  sixth: '74,74,74',
};

function BubbleBackgroundBrand(
  props: Omit<BubbleBackgroundProps, 'colors'>,
) {
  return <BubbleBackground colors={BRAND_BUBBLE_COLORS} {...props} />;
}

export { BubbleBackgroundBrand, BRAND_BUBBLE_COLORS };
