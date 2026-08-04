// Central Tailwind config for the CompareHub template
// Included by HTML pages before loading the Tailwind CDN script

tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        work:  ['"Work Sans"', 'sans-serif'],
        inter: ['Inter',       'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#155dfc',
          hover:   '#1447e6',
          dark:    '#181d25',
          body:    '#364153',
          subtle:  '#5a6372',
          muted:   '#808793',
          border:  '#e5e7eb',
          surface: '#f9fafb',
          light:   '#e5edff',
          success: '#05df72',
          danger:  '#ef4444',
          vendor:  '#0f42b3',
        },
      },
      borderRadius: {
        btn:    '14px',
        card:   '10px',
        panel:  '16px',
        drawer: '20px',
        pill:   '30px',
      },
      fontSize: {
        'label':      ['11px', { lineHeight: '1.5' }],
        'caption':    ['12px', { lineHeight: '1.5' }],
        'body-sm':    ['13px', { lineHeight: '1.5' }],
        'body':       ['14px', { lineHeight: '1.5' }],
        'body-md':    ['15px', { lineHeight: '1.5' }],
        'heading-sm': ['18px', { lineHeight: '1.5' }],
        'heading':    ['20px', { lineHeight: '1.5' }],
        'heading-lg': ['30px', { lineHeight: '1.2' }],
        'hero':       ['45px', { lineHeight: '1.1' }],
      },
      boxShadow: {
        card:         '0 2px 4px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 28px rgba(0,0,0,0.1)',
        header:       '0 1px 12px rgba(0,0,0,0.08)',
        drawer:       '0 -8px 32px rgba(0,0,0,0.12)',
        dropdown:     '0 12px 32px rgba(0,0,0,0.12)',
      },
      spacing: {
        'section':    '111px',
      },
    },
  },
};
