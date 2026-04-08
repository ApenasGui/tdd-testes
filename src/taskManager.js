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

export function addTask(tasks, title){
    if(!validateTitle(title)){
        throw new Error("Título inválido")
    }

    const newTask = createTask(title);
    return[...tasks, newTask];
}

export function toggleTask(task){
    return {
        ...task,
        completed: !task.completed,
    }
}

export function removeTask(tasks, id){
    return tasks.filter(task => task.id !== id);
}

export function filterTasks(tasks, statusTask){
    if(statusTask === 'completed'){
        return tasks.filter(task => task.completed);
    }

    if(statusTask === 'pending'){
        return tasks.filter(task => !task.completed);
    }

    if(statusTask === 'default'){
        return tasks;
    }
}

export function countTasks(tasks = []){
    return tasks.length;
}

export function countCompletedTasks(tasks = []){
    return tasks.filter(task => task.completed === true).length;
}

export function countPendingTasks(tasks = []){
    return tasks.filter(task => task.completed === false).length;
}

