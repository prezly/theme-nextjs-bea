'use client';

import { Dialog, DialogBackdrop, Transition, TransitionChild } from '@headlessui/react';
import classNames from 'classnames';
import type { PropsWithChildren } from 'react';
import { Fragment } from 'react';

import styles from './Modal.module.scss';

interface Props {
    id?: string;
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    dialogClassName?: string;
    wrapperClassName?: string;
    backdropClassName?: string;
}

export function Modal({
    id,
    isOpen,
    onClose,
    className,
    dialogClassName,
    wrapperClassName,
    backdropClassName,
    children,
}: PropsWithChildren<Props>) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                id={id}
                className={classNames(styles.dialog, dialogClassName)}
                onClose={onClose}
            >
                <div className={classNames(styles.dialogWrapper, wrapperClassName)}>
                    <TransitionChild
                        as={Fragment}
                        enter={styles.backdropTransition}
                        enterFrom={styles.backdropTransitionOpenStart}
                        enterTo={styles.backdropTransitionOpenFinish}
                        leave={styles.backdropTransition}
                        leaveFrom={styles.backdropTransitionOpenFinish}
                        leaveTo={styles.backdropTransitionOpenStart}
                    >
                        <DialogBackdrop
                            className={classNames(styles.backdrop, backdropClassName)}
                            onClick={onClose}
                        />
                    </TransitionChild>

                    <TransitionChild
                        as={Fragment}
                        enter={styles.modalTransition}
                        enterFrom={styles.modalTransitionOpenStart}
                        enterTo={styles.modalTransitionOpenFinish}
                        leave={styles.modalTransition}
                        leaveFrom={styles.modalTransitionOpenFinish}
                        leaveTo={styles.modalTransitionOpenStart}
                    >
                        <div className={classNames(styles.modal, className)}>{children}</div>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
