const modalComponents = import.meta.glob('/src/modals/**/*Modal.jsx', { eager: false });

export const getModalComponent = async (name) => {
    const splitName = name.split('.');
    let modalName = `${name.charAt(0).toUpperCase() + name.slice(1)}Modal`;
    if (splitName?.length > 0) {
        let name = splitName.pop();
        let path = splitName.join('/')
        modalName = `${path}/${name.charAt(0).toUpperCase() + name.slice(1)}Modal`;
    }

    const matchingPaths = Object.keys(modalComponents).filter(path =>
        path.endsWith(`/${modalName}.jsx`)
    );

    if (matchingPaths.length > 0) {
        try {
            const module = await modalComponents[matchingPaths[0]]();
            return module.default;
        } catch (error) {
            console.error(`Failed to load modal component: ${name}`, error);
            return null;
        }
    } else {
        console.warn(`Modal component file not found: ${modalName}`);
        return null;
    }
};

export const getAvailableModalNames = () => {
    return Object.keys(modalComponents).map(path => {
        const match = path.match(/\/(\w+)Modal\.jsx$/);
        return match ? match[1].toLowerCase() : null;
    }).filter(Boolean);
};