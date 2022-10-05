import { Listbox } from '@headlessui/react';
import { DesktopComputerIcon, MoonIcon, SunIcon } from '@heroicons/react/outline';
import classNames from 'clsx';
import { useTheme } from 'next-themes';

// from https://egghead.io/blog/tailwindcss-dark-mode-nextjs-typography-prose

const THEMES = [
    { name: 'Light', value: 'light', icon: SunIcon },
    { name: 'Dark', value: 'dark', icon: MoonIcon },
    { name: 'System', value: 'system', icon: DesktopComputerIcon },
];

export function ThemeSelector(props: any) {
    const { theme, setTheme } = useTheme();
    let currentTheme = THEMES.find((item) => item.value === theme);
    if (!currentTheme) {
        currentTheme = { name: 'Light', value: 'light', icon: SunIcon };
    }

    function switchTheme(newTheme: any) {
        setTheme(newTheme?.value);
    }

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Listbox as="div" value={theme} onChange={switchTheme} {...props}>
            <Listbox.Label className="sr-only">Theme</Listbox.Label>
            <Listbox.Button className="flex h-8 w-8 items-center justify-center rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-gray-700 dark:ring-inset dark:ring-white/5">
                <span className="sr-only">{currentTheme.name}</span>
                <SunIcon
                    className={classNames(
                        'h-4 w-4 dark:fill-rose-600',
                        currentTheme.value === 'light' ? 'block' : 'hidden',
                    )}
                />
                <MoonIcon
                    className={classNames(
                        'h-4 w-4 dark:fill-rose-600',
                        currentTheme.value === 'dark' ? 'block' : 'hidden',
                    )}
                />
                <DesktopComputerIcon
                    className={classNames(
                        'h-4 w-4 dark:fill-rose-600',
                        currentTheme.value === 'system' ? 'block' : 'hidden',
                    )}
                />
            </Listbox.Button>
            <Listbox.Options className="absolute top-full mt-2 w-36 -translate-x-1/2 space-y-1 rounded-xl bg-white p-3 text-sm font-medium shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/5">
                {THEMES.map((themeItem) => (
                    <Listbox.Option
                        key={themeItem.value}
                        value={themeItem}
                        className={({ active, selected }) =>
                            classNames(
                                'flex cursor-pointer select-none items-center rounded-[0.625rem] p-1',
                                {
                                    'text-sky-500': selected,
                                    'text-slate-900 dark:text-white': active && !selected,
                                    'text-slate-700 dark:text-slate-400': !active && !selected,
                                    'bg-slate-100 dark:bg-slate-900/40': active,
                                },
                            )
                        }
                    >
                        {({ selected }) => (
                            <>
                                <div className="rounded-md bg-white p-1 shadow ring-1 ring-slate-900/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5">
                                    <themeItem.icon
                                        className={classNames('h-4 w-4', {
                                            'fill-sky-400 dark:fill-sky-400': selected,
                                            'fill-slate-400': !selected,
                                        })}
                                    />
                                </div>
                                <div className="ml-3">{themeItem.name}</div>
                            </>
                        )}
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </Listbox>
    );
}
