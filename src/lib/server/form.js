export function formDataToObject(form) {
    const obj = {
        custom: {}
    };

    form.forEach((v, k) => {
        if (k.startsWith('c:')) {
            obj.custom[k.slice(2)] = v;
        } else {
            obj[k] = v;
        }
    });

    return obj;
}