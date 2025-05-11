export function dateStringToObj(dateString: any) {

    if (dateString != undefined && dateString != null && dateString != "") {
        const date:any = new Date(dateString)
        return date;
    }
    return null;
}

export function dateObjToString(dateString: any) {

    if (dateString != undefined && dateString != null && dateString != "") {
        const date = new Date(dateString)
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const object = new Date(date.getTime() - userTimezoneOffset);
        const newDateString = object.toISOString();
		return newDateString.split(".")[0];
    }
    return null;
}

export function newDateString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }