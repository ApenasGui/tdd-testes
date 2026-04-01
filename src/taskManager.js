let _nextId = 1;

export function resetId(){
    _nextId = 1;
}

export function validateTitle(title){
    if(typeof title != 'string'){
        return false;
    }

    const titleTrimmed = title.trim();
    return titleTrimmed.length >= 3;
}

export function createTask(title){
    return {
        id: _nextId++,
        title: title.trim(),
        completed: false,
    };
}