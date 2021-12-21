import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment, FunctionComponent, PropsWithChildren } from 'react';

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

// TODO: Add `title` and `buttons` props when they become needed
const Modal: FunctionComponent<PropsWithChildren<Props>> = ({
    id,
    isOpen,
    onClose,
    className,
    dialogClassName,
    wrapperClassName,
    backdropClassName,
    children,
}) => (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog
            as="div"
            id={id}
            className={classNames(styles.dialog, dialogClassName)}
            onClose={onClose}
        >
            <div className={classNames(styles.dialogWrapper, wrapperClassName)}>
                <Transition.Child
                    as={Fragment}
                    enter={styles.backdropTransition}
                    enterFrom={styles.backdropTransitionOpenStart}
                    enterTo={styles.backdropTransitionOpenFinish}
                    leave={styles.backdropTransition}
                    leaveFrom={styles.backdropTransitionOpenFinish}
                    leaveTo={styles.backdropTransitionOpenStart}
                >
                    <Dialog.Overlay className={classNames(styles.backdrop, backdropClassName)} />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter={styles.modalTransition}
                    enterFrom={styles.modalTransitionOpenStart}
                    enterTo={styles.modalTransitionOpenFinish}
                    leave={styles.modalTransition}
                    leaveFrom={styles.modalTransitionOpenFinish}
                    leaveTo={styles.modalTransitionOpenStart}
                >
                    <div className={classNames(styles.modal, className)}>{children}</div>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition>
);

export default Modal;
