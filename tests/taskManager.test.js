import { describe, it, expect, beforeEach } from "vitest";
import {validateTitle, createTask, resetId} from "../src/taskManager.js";

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