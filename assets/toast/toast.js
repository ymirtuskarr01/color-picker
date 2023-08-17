const init = () => {
    const node = document.createElement('section');
    node.classList.add('gui-toast-group');

    document.firstElementChild.insertBefore(node, document.body);
    return node;
}

const Toaster = init();

const createToast = text => {
    const node = document.createElement('output');

    node.innerText = text;
    node.classList.add('gui-toast');
    node.setAttribute('role', 'status');

    return node;
}

const addToast = toast => {
    const { matches:motionOK } = window.matchMedia(
        '(prefers-reduce-motion: no-preference)'
    )

    Toaster.children.length && motionOK
        ? flipToast(toast)
        : Toaster.appendChild(toast)
}

const flipToast = toast => {
    const first = Toaster.offsetHeight;
    Toaster.appendChild(toast);
    const last = Toaster.offsetHeight;
    const invert = last - first;

    const animation = Toaster.animate([
        { transform: `translateY(${invert}px)` },
        { transform: `translateY(0)` }
    ], {
        duration: 150,
        easing: 'ease-out'
    })
}

const Toast = text => {
    let toast = createToast(text)
    addToast(toast)

    return new Promise(async (resolve, reject) => {
        await Promise.allSettled(
            toast.getAnimations().map(animation =>
                animation.finished
            )
        )
        Toaster.removeChild(toast);
        resolve();
    })
}

export default Toast;