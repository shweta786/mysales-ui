export class CommonUtil {
    static areSameObjects = (obj1, obj2, propsToSkip?: string[]) => {
        if (typeof (obj1) !== typeof (obj2)) {
            return false;
        }

        // Loop through properties in object 1
        for (const p in obj1) {
            if (propsToSkip && propsToSkip.length > 0 && propsToSkip.indexOf(p) !== -1) {
                continue;
            }
            if (p == 'logicNumber') {
                if (obj1[p] && obj2[p] && obj1[p].length == obj2[p].length) {
                    for (let i = 0; i < obj1[p].length; i++) {
                        let logicNum1 = (typeof (obj1[p][i]) == 'string' ? obj1[p][i]
                            :
                            (obj1[p][i].id ? obj1[p][i].id : ''));
                        let logicNum2 = (typeof (obj2[p][i]) == 'string' ? obj2[p][i]
                            :
                            (obj2[p][i].id ? obj2[p][i].id : ''));
                        if (logicNum1 !== logicNum2) {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
                continue;
            }

            // Check property exists on both objects
            if (obj1.hasOwnProperty(p) === obj2.hasOwnProperty(p)) {
                switch (typeof (obj1[p])) {
                    // Deep compare objects
                    case 'object':
                        if (!CommonUtil.areSameObjects(obj1[p], obj2[p], propsToSkip)) {
                            return false;
                        }
                        break;
                    // Compare function code
                    case 'function':
                        // if (typeof (obj2[p]) === undefined
                        //     || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) { return false; }
                        break;
                    // Compare values
                    default:
                        if (obj1[p] !== obj2[p]) {
                            return false;
                        }
                }
            } else {
                return false;
            }
        }

        // Check object 2 for any extra properties
        for (const p in obj2) {
            if (typeof (obj1[p]) === undefined) {
                return false;
            }
        }
        return true;
    };
    public static getUpdatedDate(
        year: number,
        month: number,
        day: number,
        hours?: number,
        minutes?: number,
        seconds?: number): Date {
        // const date = CommonUtil.getDate();
        // if (year !== undefined) { date.setFullYear(year); }
        // if (month !== undefined) { date.setMonth(month - 1); }
        // if (day !== undefined) { date.setDate(day); }
        const date = new Date(year, month - 1, day);
        if (hours !== undefined) { date.setHours(hours); }
        if (minutes !== undefined) { date.setMinutes(minutes); }
        if (seconds !== undefined) { date.setSeconds(seconds); }
        return date;
    }

    public static sortFilteredRowsByField(...fields: string[]) {
        return function (A, B) {
            var a, b, field, result;
            for (var i = 0; i < fields.length; i++) {
                result = 0;
                field = fields[i];
                a = A[field];
                b = B[field];
                if (typeof a === 'string' && a && b) {
                    a = a.toUpperCase();
                    b = b.toUpperCase();
                }
                if (a < b) result = -1;
                if (a > b) result = 1;
                if (result !== 0) break;
            }
            return result;
        }
    }
}
