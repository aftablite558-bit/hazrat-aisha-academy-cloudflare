sed -i "s/initial={{ x: '-100%' }}/initial={{ x: '100%' }}/g" src/components/layout/Sidebar.tsx
sed -i "s/exit={{ x: '-100%' }}/exit={{ x: '100%' }}/g" src/components/layout/Sidebar.tsx
sed -i "s/fixed left-0 top-0 bottom-0 z-50 lg:hidden w-\[280px\] max-w-\[80vw\]/fixed right-0 top-0 bottom-0 z-50 lg:hidden w-[280px] max-w-[80vw]/g" src/components/layout/Sidebar.tsx
sed -i "s/border-l-0 rounded-none rounded-r-\[32px\]/border-r-0 rounded-none rounded-l-[32px]/g" src/components/layout/Sidebar.tsx
