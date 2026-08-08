type Listener = (isRefreshing: boolean) => void;

let current = false;
const listeners = new Set<Listener>();

export const setRefreshing = (v: boolean) => {
    current = v;
    for (const l of listeners) l(current);
};

export const subscribe = (l: Listener) => {
    listeners.add(l);
    return () => listeners.delete(l);
};

export const getRefreshing = () => current;
