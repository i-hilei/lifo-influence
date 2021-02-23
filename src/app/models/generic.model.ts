export class GenericModel<I> {
    constructor() {}

    get build(): { [key: string]: any } {
        return {};
    }

    static hydrate(json, instance = new GenericModel()) {
        if (json === null) {
            return json;
        }
        if (typeof json === 'undefined') {
            return json;
        }
        Object.getOwnPropertyNames(instance).forEach((prop) => {
            if (typeof json[prop] !== 'undefined') {
                if (instance.build && typeof instance.build[prop] === 'function' && json[prop] !== null) {
                    instance[prop] = instance.build[prop](json[prop], 'hydrate');
                } else {
                    instance[prop] = json[prop];
                }
            }
        });
        return instance;
    }

    static dehydrate(instance = new GenericModel(), entity = new GenericModel()): object {
        const object = {};
        Object.keys(entity.build).forEach((key) => {
            object[key] = entity.build[key](instance[key]);
        });
        return object;
    }
}
