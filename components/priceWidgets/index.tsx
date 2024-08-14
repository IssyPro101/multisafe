import React from 'react';
import styled from 'styled-components';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import {ArrowUp} from "@/components/icons/arrow-up";
import { formatNumber } from '@/app/utils/formatNumber';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Price = {
  name: number;
  value: number;
};

type LivePriceFeedProps = {
  id: string;
  name: string;
  symbol: string;
  icon: React.ReactElement;
  balance: number;
  price: number;
  change: string;
  isChangePositive: boolean;
  isBorder?: boolean;
  prices: Price[];
};

export function LivePricingFeed({
  id,
  name,
  symbol,
  icon,
  balance,
  price,
  change,
  isChangePositive,
  prices,
  isBorder,
}: LivePriceFeedProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg p-5 shadow-[0_8px_16px_rgba(17,24,39,0.05)] bg-gray-900 lg:flex-row w-full',
      )}
    >
      <div className="w-full flex-col">
        <div className="mb-3 flex items-center">
          {icon}
          <h4 className="text-sm font-medium text-gray-900 ml-3 dark:text-white">
            {name}
          </h4>
        </div>

        <div className="flex mb-2 text-sm font-medium tracking-tighter text-gray-900 dark:text-white lg:text-lg 2xl:text-xl 3xl:text-2xl">
          {formatNumber(balance)}
          <span className="ml-3">{symbol}</span>
        </div>

        <div className="flex items-center text-xs font-medium 2xl:text-sm">
          <span
            className="truncate tracking-tighter text-gray-600 mr-5 dark:text-gray-400 2xl:w-24 3xl:w-auto"
            title={`${price * balance} USD`}
          >
            ${formatNumber(price * balance)} USD
          </span>

          <span
            className={`flex items-center  ${
              isChangePositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            <span
              className={`mr-2 ${
                !isChangePositive ? 'rotate-180' : ''
              }`}
            >
              <ArrowUp />
            </span>
            {change}
          </span>
        </div>
      </div>

      <div
        className="h-20 w-full overflow-hidden"
        data-hello={isChangePositive ? '#22c55e' : '#D6455D'}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={prices}>
            <defs>
              <linearGradient id={`${name}-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isChangePositive ? '#22c55e' : '#D6455D'}
                  stopOpacity={0.5}
                />
                <stop
                  offset="100%"
                  stopColor={isChangePositive ? '#22c55e' : '#D6455D'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="linear"
              dataKey="value"
              stroke={isChangePositive ? '#22c55e' : '#D6455D'}
              strokeWidth={2.5}
              fill={`url(#${`${name}-${id}`})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
