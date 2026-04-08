import { describe, it, expect, beforeEach } from "vitest";
import {
    validateTitle, 
    createTask, 
    resetId, 
    addTask, 
    toggleTask, 
    removeTask,
    filterTasks,
    countTasks,
} from "../src/taskManager.js";

describe('validateTitle', () => {
    it("Deve retornar true para um título válido", () => {
        expect(validateTitle('Estudar vitest')).toBe(true);
    });

    it("Deve retornar true para título com exatamente 3 caracteres", () => {
        expect(validateTitle("abc")).toBe(true);
    });

    it("Deve retornar false caso receba uma string vazia", () => {
        expect(validateTitle('')).toBe(false);
    });

    it('deve retornar false para título com menos de 3 caracteres', () => {
        expect(validateTitle('ab')).toBe(false);
    });

    it('deve retornar false para null', () => {
        expect(validateTitle(null)).toBe(false);
    });

    it('deve retornar false para undefined', () => {
        expect(validateTitle(undefined)).toBe(false);
    });

    it('deve retornar false para número', () => {
        expect(validateTitle(123)).toBe(false);
    });

    it('deve retornar false para booleano', () => {
        expect(validateTitle(true)).toBe(false);
    });

    it('deve retornar false para array', () => {
        expect(validateTitle(['tarefa'])).toBe(false);
    });

    it('deve considerar o título após trim', () => {
        expect(validateTitle('  abc  ')).toBe(true);
    });
});

describe('createTask', () => {
    beforeEach(() => {
        resetId()
    })

    it("Deve criar criar uma task com as propriedades corretas", () => {
        const task = createTask('Estudar TDD');

        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('title', 'Estudar TDD');
        expect(task).toHaveProperty('completed', false);
    })

    it('Deve atribuir ID incrementais', () => {
        const task01 = createTask('Tarefa 01');
        const task02 = createTask('Tarefa 02');

        expect(task02.id).toBe(task01.id + 1);
    })

    it('Deve iniciar com completed false', () => {
        const task = createTask('Tarefa Teste');

        expect(task.completed).toBe(false);
    })

    it('deve fazer um trim no título', () => {
        const task = createTask('Titulo trim test  ');

        expect(task.title).toBe('Titulo trim test');
    })

});

describe('addTask', () => {
    beforeEach(() => {
        resetId();
    })

    it('deve adicionar uma tarefa a uma lista vazia', () => {
        const task = addTask([], 'Primeira tarefa');

        expect(task).toHaveLength(1);
        expect(task[0].title).toBe('Primeira tarefa');
    })

    it('deve adicionar uma tarefa a uma lista existente', () => {
        let tasks = addTask([], 'Tarefa 01');
        tasks = addTask(tasks, 'Tarefa 02');

        expect(tasks).toHaveLength(2);
        expect(tasks[1].title).toBe('Tarefa 02');
    })

    it('deve retornar um NOVO array (imutabilidade)', () => {
    const original = [];
    const updated = addTask(original, 'Nova tarefa');

    expect(updated).not.toBe(original);
    expect(original).toHaveLength(0);
    });

    it('deve lançar erro para título vazio', () => {
        expect(() => addTask([], '')).toThrow('Título inválido');
    });

    it('deve lançar erro para título null', () => {
        expect(() => addTask([], null)).toThrow('Título inválido');
    });

    it('deve lançar erro para título undefined', () => {
        expect(() => addTask([], undefined)).toThrow('Título inválido');
    });

    it('deve lançar erro para título com menos de 3 caracteres', () => {
        expect(() => addTask([], 'ab')).toThrow('Título inválido');
    });

    it('deve lançar erro para título numérico', () => {
        expect(() => addTask([], 42)).toThrow('Título inválido');
    });
})

describe('toggleTask', () => {
    beforeEach(() => {
        resetId();
    })

    it('deve alternar o status de completed de false para true', () => {
        const task = createTask('Tarefa teste');
        const toggled = toggleTask(task);

        expect(toggled.completed).toBe(true);
    })
    
    it('deve alternar o status de completed de true para false', () => {
        let task = createTask('Tarefa teste');
        task.completed = true;
        const toggled = toggleTask(task);

        expect(toggled.completed).toBe(false);
    })

    it('deve manter o id e o title inalterados', () => {
        const task = createTask('Tarefa teste');
        const toggled = toggleTask(task);

        expect(toggled.id).toBe(task.id);
        expect(toggled.title).toBe(task.title);
    })

    it('deve retornar um NOVO objeto (imutabilidade)', () => {
        const task = createTask('Tarefa teste');
        const toggled = toggleTask(task);

        expect(toggled).not.toBe(task);
    })
    
})

describe('removeTask', () => {
    beforeEach(() => {
        resetId();
    })

    it('deve remover a tarefa pelo id', () => {
        let tasks = addTask([], "Tarefa 01")
        tasks = addTask(tasks, "Tarefa 02")
        const taskToRemove = tasks[0];

        const updatedTasks = removeTask(tasks, taskToRemove.id);

        expect(updatedTasks).toHaveLength(1);
        expect(updatedTasks[0].id).toBe(2);
    })

    it('deve manter as outras tarefas inalteradas', () => {
        let tasks = addTask([], "Tarefa 01")
        tasks = addTask(tasks, "Tarefa 02")
        const taskToRemove = tasks[0];

        const updatedTasks = removeTask(tasks, taskToRemove.id);

        expect(updatedTasks[0].title).toBe("Tarefa 02");
    })

    it('deve retornar um NOVO array (imutabilidade)', () => {
        let tasks = addTask([], "Tarefa 01")
        const taskToRemove = tasks[0];

        const updatedTasks = removeTask(tasks, taskToRemove.id);

        expect(updatedTasks).not.toBe(tasks);
    })

    it('id inexistente deve retornar o array original sem alterações', () => {
        let tasks = addTask([], "Tarefa 01")
        tasks = addTask(tasks, "Tarefa 02")

        const updatedTasks = removeTask(tasks, 67);

        expect(updatedTasks).toEqual(tasks);
    })

    it('lista vazia retorna array vazio', () => {
        const updatedTasks = removeTask([], 1);

        expect(updatedTasks).toEqual([]);
    })

})

describe('filterTasks', () => {
    beforeEach(() => {
        resetId();
    })

    it('deve retornar só as tarefas completadas', () => {

        let task1 = createTask('Tarefa 01');
        let task2 = createTask('Tarefa 02');
        let task3 = createTask('Tarefa 03');
        let task4 = createTask('Tarefa 04');

        task2.completed = toggleTask(task2).completed;
        task4.completed = toggleTask(task4).completed;

        let listaTask = [task1, task2, task3, task4];
        let listaCompletas = [];

        for(let i = 0; i < listaTask.length; i++){
            let taskAtual = listaTask[i];

            if(taskAtual.completed == true){
                listaCompletas.push(taskAtual)
            }
        };

        expect(listaCompletas.length).toBe(2);
    });

    it('deve retornar todas as tarefas', () => {
        let task1 = createTask('Tarefa 01');
        let task2 = createTask('Tarefa 02');
        let task3 = createTask('Tarefa 03');
        let task4 = createTask('Tarefa 04');

        task3.completed = toggleTask(task3).completed;

        let listaTasks = [task1, task2, task3, task4];
        let listaTodas = [];

        for(let i = 0; i < listaTasks.length; i++){
            let taskAtual = listaTasks[i];
            listaTodas.push(taskAtual)
        };

        expect(listaTodas.length).toBe(4);
    })

    it('deve retornar todas as tarefas pendendtes', () => {
        let task1 = createTask('Tarefa 01');
        let task2 = createTask('Tarefa 02');
        let task3 = createTask('Tarefa 03');
        let task4 = createTask('Tarefa 04');

        task2.completed = toggleTask(task2).completed;

        let listaTasks = [task1, task2, task3, task4];
        let listaTarefasPendentes = [];

        for(let i = 0; i < listaTasks.length; i++){
            let taskAtual = listaTasks[i];

            if(taskAtual.completed == false){
                listaTarefasPendentes.push(taskAtual)
            }
        };

        expect(listaTarefasPendentes.length).toBe(3);
    })

    it('deve retornar vazio se lista estiver vazia', () => {
        let listaTasks = [];

        expect(listaTasks).toHaveLength([]);
    });

    it('deve retornar um novo array (imutabilidade)', () => {
        let listaTaskOriginal = [createTask('Tarefa 01'), createTask('Tarefa 02')];
        listaTaskOriginal[0].completed = true;
        listaTaskOriginal[1].completed = false;

        let listaNova = listaTaskOriginal;

        expect(listaNova).toBe(listaTaskOriginal);
    })

    describe('countTasks', () => {
        beforeEach(() => {
            resetId();
        })

        it('deve retornar 0 para lista vazia', () => {
            let listaTasks = [];
            expect(listaTasks.length).toBe(0);
        });

        it('deve contar o número de tarefas completadas', () => {
            let tasks = addTask([], 'Tarefa 01');
            tasks = addTask(tasks, 'Tarefa 02');
            tasks = addTask(tasks, 'Tarefa 03');

            expect(countTasks(tasks)).toBe(3);
        });
    });

    
});