type StringParamObject = {
    [key: string]: string;
};

function escapedQuotedString({ ...stringObj }: StringParamObject) {
    let strObj = {};

    Object.entries(stringObj).forEach(([key, value]) => {
        strObj = Object.assign(strObj, { [key]: value.replace(/"/g, '\\"') });
    });

    return strObj;
}

export default escapedQuotedString;
