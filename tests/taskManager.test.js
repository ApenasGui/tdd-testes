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
    countCompletedTasks,
    countPendingTasks,
    validatePriority,
    isDuplicate
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
        resetId();
    })

    it("Deve criar criar uma task com as propriedades corretas", () => {
        const task = createTask('Estudar TDD', 'medium');

        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('title', 'Estudar TDD');
        expect(task).toHaveProperty('completed', false);
        expect(task).toHaveProperty('priority');
    })

    it('Deve atribuir ID incrementais', () => {
        const task01 = createTask('Tarefa 01', 'low');
        const task02 = createTask('Tarefa 02', 'low');

        expect(task02.id).toBe(task01.id + 1);
    })

    it('Deve iniciar com completed false', () => {
        const task = createTask('Tarefa Teste', 'low');

        expect(task.completed).toBe(false);
    })

    it('deve fazer um trim no título', () => {
        const task = createTask('Titulo trim test  ', 'low');

        expect(task.title).toBe('Titulo trim test');
    })

});

describe('addTask', () => {
    beforeEach(() => {
        resetId();
    })

    it('deve adicionar uma tarefa a uma lista vazia', () => {
        const task = addTask([], 'Primeira tarefa', 'low');

        expect(task).toHaveLength(1);
        expect(task[0].title).toBe('Primeira tarefa');
    })

    it('deve adicionar uma tarefa a uma lista existente', () => {
        let tasks = addTask([], 'Tarefa 01', 'low');
        tasks = addTask(tasks, 'Tarefa 02', 'low');

        expect(tasks).toHaveLength(2);
        expect(tasks[1].title).toBe('Tarefa 02');
    })

    it('deve retornar um NOVO array (imutabilidade)', () => {
    const original = [];
    const updated = addTask(original, 'Nova tarefa', 'low');

    expect(updated).not.toBe(original);
    expect(original).toHaveLength(0);
    });

    it('deve lançar erro para título vazio', () => {
        expect(() => addTask([], '', '')).toThrow('Título inválido');
    });

    it('deve lançar erro para título null', () => {
        expect(() => addTask([], null, '')).toThrow('Título inválido');
    });

    it('deve lançar erro para título undefined', () => {
        expect(() => addTask([], undefined, '')).toThrow('Título inválido');
    });

    it('deve lançar erro para título com menos de 3 caracteres', () => {
        expect(() => addTask([], 'ab', '')).toThrow('Título inválido');
    });

    it('deve lançar erro para título numérico', () => {
        expect(() => addTask([], 42, '')).toThrow('Título inválido');
    });
})

describe('toggleTask', () => {
    beforeEach(() => {
        resetId();
    })

    it('deve alternar o status de completed de false para true', () => {
        const task = createTask('Tarefa teste', 'low');
        const toggled = toggleTask(task);

        expect(toggled.completed).toBe(true);
    })
    
    it('deve alternar o status de completed de true para false', () => {
        let task = createTask('Tarefa teste', 'low');
        task.completed = true;
        const toggled = toggleTask(task);

        expect(toggled.completed).toBe(false);
    })

    it('deve manter o id e o title inalterados', () => {
        const task = createTask('Tarefa teste', 'low');
        const toggled = toggleTask(task);

        expect(toggled.id).toBe(task.id);
        expect(toggled.title).toBe(task.title);
    })

    it('deve retornar um NOVO objeto (imutabilidade)', () => {
        const task = createTask('Tarefa teste', 'low');
        const toggled = toggleTask(task);

        expect(toggled).not.toBe(task);
    })
    
})

describe('removeTask', () => {
    beforeEach(() => {
        resetId();
    })

    it('deve remover a tarefa pelo id', () => {
        let tasks = addTask([], "Tarefa 01", 'low')
        tasks = addTask(tasks, "Tarefa 02", 'low')
        const taskToRemove = tasks[0];

        const updatedTasks = removeTask(tasks, taskToRemove.id);

        expect(updatedTasks).toHaveLength(1);
        expect(updatedTasks[0].id).toBe(2);
    })

    it('deve manter as outras tarefas inalteradas', () => {
        let tasks = addTask([], "Tarefa 01", 'low')
        tasks = addTask(tasks, "Tarefa 02", 'low')
        const taskToRemove = tasks[0];

        const updatedTasks = removeTask(tasks, taskToRemove.id);

        expect(updatedTasks[0].title).toBe("Tarefa 02");
    })

    it('deve retornar um NOVO array (imutabilidade)', () => {
        let tasks = addTask([], "Tarefa 01", '')
        const taskToRemove = tasks[0];

        const updatedTasks = removeTask(tasks, taskToRemove.id);

        expect(updatedTasks).not.toBe(tasks);
    })

    it('id inexistente deve retornar o array original sem alterações', () => {
        let tasks = addTask([], "Tarefa 01", '')
        tasks = addTask(tasks, "Tarefa 02", '')

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

        let task1 = createTask('Tarefa 01', '');
        let task2 = createTask('Tarefa 02', '');
        let task3 = createTask('Tarefa 03', '');
        let task4 = createTask('Tarefa 04', '');

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
        let task1 = createTask('Tarefa 01', '');
        let task2 = createTask('Tarefa 02', '');
        let task3 = createTask('Tarefa 03', '');
        let task4 = createTask('Tarefa 04', '');

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
        let task1 = createTask('Tarefa 01', '');
        let task2 = createTask('Tarefa 02', '');
        let task3 = createTask('Tarefa 03', '');
        let task4 = createTask('Tarefa 04', '');

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
        let listaTaskOriginal = [createTask('Tarefa 01', ''), createTask('Tarefa 02', '')];
        listaTaskOriginal[0].completed = true;
        listaTaskOriginal[1].completed = false;

        let listaNova = listaTaskOriginal;

        expect(listaNova).toBe(listaTaskOriginal);
    })
});

    describe('countTasks', () => {
        beforeEach(() => {
            resetId();
        })

        it('deve retornar 0 para lista vazia', () => {
            let listaTasks = [];
            expect(listaTasks.length).toBe(0);
        });

        it('deve contar o número de tarefas completadas', () => {
            let tasks = addTask([], 'Tarefa 01', '');
            tasks = addTask(tasks, 'Tarefa 02', '');
            tasks = addTask(tasks, 'Tarefa 03', '');

            expect(countTasks(tasks)).toBe(3);
        });
    });

    describe('countCompletedTasks', () => {
        let tasks = [];
        beforeEach(() => {
            resetId();
                tasks = addTask([], 'Tarefa 01', '');
                tasks = addTask(tasks, 'Tarefa 02', '');
                tasks = addTask(tasks, 'Tarefa 03', '');
        })

        it('deve retornar 0 se não houver tarefas completadas', () => {
            expect(countCompletedTasks(tasks)).toBe(0);
        });

        it('deve retornar o número de tarefas completadas', () => {

            tasks[0].completed = toggleTask(tasks[0]).completed;
            tasks[2].completed = toggleTask(tasks[2]).completed;

            expect(countCompletedTasks(tasks)).toBe(2);
    });


    describe('countPendingTasks', () => {
        let tasks = [];
        beforeEach(() => {
            resetId();
            tasks = addTask([], 'Tarefa 01', '');
            tasks = addTask(tasks, 'Tarefa 02', '');
            tasks = addTask(tasks, 'Tarefa 03', '');

            tasks = tasks.map(task => (task.id === 1 ? toggleTask(task) : task));
        })

        it('deve retornar 0 se não houver tarefas pendentes', () => {
            const allCompletedTasks = tasks.map((task) => ({ ...task, completed: true }));

            expect(countPendingTasks(allCompletedTasks)).toBe(0);
        });

        it('deve retornar o número de tarefas pendentes', () => {
            expect(countPendingTasks(tasks)).toBe(2);
        });

        it('deve retornar 0 se a lista estiver vazia', () => {
            expect(countPendingTasks([])).toBe(0);
        });
    });

    describe('validatePriority', () => {
        let validPriorities = [];
        let task;
        beforeEach(() => {
            resetId();
            validPriorities = ['low', 'medium', 'high'];
            task = (createTask('Tarefa 1', 'medium'));
        })

        it('deve retornar true para prioridade válida', () => {
            let prioritiesTests = ['low', 'low', 'high', 'medium', 'low', 'medium']

            for(let i = 0; i < prioritiesTests.length; i++){
                expect(validatePriority(prioritiesTests[i])).toBe(true);
            }
        });

        it('deve retornar false se não for nenhuma das opções válidas', () => {
            const invalidValues = ['urgent', 'critical', undefined, 123, true, [], {}];

            invalidValues.forEach(value => {
                if(invalidValues != validPriorities){
                    expect(validatePriority(value)).toBe(false);
                }
            });
        });
    });

    describe('isDuplicate', () => {
        let tasks = [];
        beforeEach(() => {
            resetId();
            tasks = addTask([], 'Tarefa 01', '');
            tasks = addTask(tasks, 'Tarefa 02', '');
            tasks = addTask(tasks, 'tarefa 01', '');
        })

        it('deve retornar true para título duplicado', () => {
            const titles = tasks.map(task => task.title);
            for(let i = 0; i < titles.length; i++){
                for(let j = i + 1; j < titles.length; j++){
                    if(isDuplicate(titles[i], titles[j])){
                        expect(true).toBe(true);
                    }
                }
            }
        });

        it('deve retornar false para títulos únicos', () => {
            const titles = tasks.map(task => task.title);
            for(let i = 0; i < titles.length; i++){
                for(let j = i + 1; j < titles.length; j++){
                    if(!isDuplicate(titles[i], titles[j])){
                        expect(false).toBe(false);
                    }
                }
            }
        });

        it('deve true para títulos para titulos com case sensitive', () => {
            const title1 = tasks[0].title; // "Tarefa 01 em lower case"
            const title2 = tasks[2].title; // "tarefa 01 em lower case"
            expect(isDuplicate(title1, title2)).toBe(true);
        });

        it('deve retornar erro caso a mesma tarefa adicionada tenha o mesmo nome de uma tarefa existente', () => {
            const newTaskTitle = 'Tarefa 01';
            const existingTaskTitle = tasks[0].title;
            if(isDuplicate(newTaskTitle, existingTaskTitle)){
                expect(() => addTask(newTaskTitle, newTaskTitle, '')).toThrow('Título duplicado');
            }
        })
    });

    describe('sortTasks', () => {
        let tasks = [];
        beforeEach(() => {
            resetId();
            tasks = addTask([], 'Tarefa 01', 'default');
            tasks = addTask(tasks, 'Tarefa 02', 'pending');
            tasks = addTask(tasks, 'Tarefa 03', 'completed');
        })

        it('deve ordenar tarefas por pendente, completada e default', () => {
            const sortedTasks = sortTasks(tasks);
            expect(sortedTasks[0].priority).toBe('pending');
            expect(sortedTasks[1].priority).toBe('completed');
            expect(sortedTasks[2].priority).toBe('default');
        });

        it('deve retornar um novo array (imutabilidade)', () => {
            const sortedTasks = sortTasks(tasks);
            expect(sortedTasks).not.toBe(tasks);
        });

        it('lista vazia deve retornar um array vazio', () => {
            const sortedTasks = sortTasks([]);
            expect(sortedTasks).toEqual([]);
        });

        it('lista só com pendentes deve manter a ordem', () => {
            const pendingTasks = tasks.filter(task => task.priority === 'pending');
            const sortedTasks = sortTasks(pendingTasks);
            expect(sortedTasks).toEqual(pendingTasks);
        });

        it('lista só com conpletadas deve manter a ordem', () => {
            const completedTasks = tasks.filter(task => task.priority === 'completed');
            const sortedTasks = sortTasks(completedTasks);
            expect(sortedTasks).toEqual(completedTasks);
        });
    })
})