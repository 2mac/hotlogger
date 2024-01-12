export function formDataToObject(form) {
    const obj = {
        custom: {}
    };

    form.forEach((v, k) => {
        if (k.startsWith('c:')) {
            obj.custom[k.slice(2)] = v;
        } else if (k.startsWith('addr:')) {
            const [_, addrKey, key] = k.split(':');
            if (!obj.custom[addrKey])
                obj.custom[addrKey] = {};
            
            obj.custom[addrKey][key] = v;
        } else {
            obj[k] = v;
        }
    });

    return obj;
}