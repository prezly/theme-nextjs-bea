import { Listbox } from '@headlessui/react'
import classNames from "classnames";
import { themes } from "@/components/ThemeSelector/constants";
import {MoonIcon, SunIcon} from "@heroicons/react/outline";
import {useTheme} from "next-themes";

// from https://egghead.io/blog/tailwindcss-dark-mode-nextjs-typography-prose

export function ThemeSelector(props: any) {
    const {theme, setTheme} = useTheme();
    const currentTheme = themes.find((item) => item.value === theme)

    const switchTheme = (theme: any) => {
        setTheme(theme?.value);
    }

    return (
        <Listbox
            as="div"
            value={theme}
            onChange={switchTheme}
            {...props}
        >
            <Listbox.Label className="sr-only">Theme</Listbox.Label>
            <Listbox.Button className="flex h-6 w-6 items-center justify-center rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5">
                <span className="sr-only">{currentTheme ? currentTheme.name : 'Default'}</span>
                <SunIcon className="hidden h-4 w-4 fill-sky-400 [[data-theme=light]_&]:block" />
                <MoonIcon className="hidden h-4 w-4 fill-sky-400 [[data-theme=dark]_&]:block" />
                <SunIcon className="hidden h-4 w-4 fill-slate-400 [:not(.dark)[data-theme=system]_&]:block" />
                <MoonIcon className="hidden h-4 w-4 fill-slate-400 [.dark[data-theme=system]_&]:block" />
            </Listbox.Button>
            <Listbox.Options className="absolute top-full left-1/2 mt-3 w-36 -translate-x-1/2 space-y-1 rounded-xl bg-white p-3 text-sm font-medium shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/5">
                {themes.map((theme) => (
                    <Listbox.Option
                        key={theme.value}
                        value={theme}
                        className={({ active, selected }) =>
                            classNames(
                                'flex cursor-pointer select-none items-center rounded-[0.625rem] p-1',
                                {
                                    'text-sky-500': selected,
                                    'text-slate-900 dark:text-white': active && !selected,
                                    'text-slate-700 dark:text-slate-400': !active && !selected,
                                    'bg-slate-100 dark:bg-slate-900/40': active,
                                }
                            )
                        }
                    >
                        {({ selected }) => (
                            <>
                                <div className="rounded-md bg-white p-1 shadow ring-1 ring-slate-900/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5">
                                    <theme.icon
                                        className={classNames('h-4 w-4', {
                                            'fill-sky-400 dark:fill-sky-400': selected,
                                            'fill-slate-400': !selected,
                                        })}
                                    />
                                </div>
                                <div className="ml-3">{theme.name}</div>
                            </>
                        )}
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </Listbox>
    )
}
