import type { ReactNode } from 'react';

export function Icon({ name, size = 19 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const paths: Record<string, ReactNode> = {
    grid: (
      <>
        <rect x='3' y='3' width='7' height='7' rx='1.5' />
        <rect x='14' y='3' width='7' height='7' rx='1.5' />
        <rect x='3' y='14' width='7' height='7' rx='1.5' />
        <rect x='14' y='14' width='7' height='7' rx='1.5' />
      </>
    ),
    file: (
      <>
        <path d='M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z' />
        <path d='M13 3v7h7M8 14h8M8 17h6' />
      </>
    ),
    people: (
      <>
        <path d='M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
        <circle cx='10' cy='7' r='4' />
        <path d='M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
      </>
    ),
    plus: (
      <>
        <path d='M12 5v14M5 12h14' />
      </>
    ),
    arrow: (
      <>
        <path d='M7 17 17 7M7 7h10v10' />
      </>
    ),
    dots: (
      <>
        <circle cx='5' cy='12' r='1' />
        <circle cx='12' cy='12' r='1' />
        <circle cx='19' cy='12' r='1' />
      </>
    ),
    copy: (
      <>
        <rect x='8' y='8' width='13' height='13' rx='2' />
        <path d='M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3' />
      </>
    ),
    check: <path d='m5 12 4 4L19 6' />,
    back: (
      <>
        <path d='m15 18-6-6 6-6' />
        <path d='M9 12h12' />
      </>
    ),
    trash: (
      <>
        <path d='M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v7m6-7v7' />
      </>
    ),
    sparkle: (
      <>
        <path d='m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z' />
        <path d='m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z' />
      </>
    ),
  };
  return (
    <svg {...common} aria-hidden='true'>
      {paths[name] ?? paths.file}
    </svg>
  );
}

