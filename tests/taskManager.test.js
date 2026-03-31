import { describe, it, expect } from "vitest";
import {validateTitle} from "../src/taskManager.js";

describe('validateTitle', () => {
    it("Deve retornar true para um título válido", () => {
        expect(validateTitle('Estudar vitest')).toBe(true);
    })

    it("Deve retornar true para título com exatamente 3 caracteres", () => {
        expect(validateTitle("abc")).toBe(true);
    })

    it("Deve retornar false caso receba uma string vazia", () => {
        expect(validateTitle('')).toBe(false);
    })
});

