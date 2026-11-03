import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    fetchChatResponse,
    parseChatResponse,
} from "../src/utils.js";

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("parseChatResponse", () => {
    it("extrae el texto y elimina espacios de los extremos", () => {
    const result = parseChatResponse({
        text: "  Bienvenido a bordo.  ",
    });

    expect(result).toBe("Bienvenido a bordo.");
    });

    it("rechaza una respuesta sin el campo text", () => {
    expect(() => parseChatResponse({})).toThrow(
        "El servidor devolvió una respuesta vacía."
    );
    });

    it("rechaza una respuesta que solo contiene espacios", () => {
    expect(() => parseChatResponse({ text: "   " })).toThrow(
        "El servidor devolvió una respuesta vacía."
    );
    });
});

describe("fetchChatResponse", () => {
    it("envía todo el historial por POST y devuelve la respuesta", async () => {
    const messages = [
        { role: "user", text: "Me llamo José." },
        { role: "model", text: "Bienvenido, José." },
        { role: "user", text: "¿Cómo me llamo?" },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ text: "Te llamas José." }),
    });

    vi.stubGlobal("fetch", mockFetch);

    const result = await fetchChatResponse(messages);

    expect(result).toBe("Te llamas José.");
    expect(mockFetch).toHaveBeenCalledTimes(1);

    expect(mockFetch).toHaveBeenCalledWith("/api/functions", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
    });
    });

    it("propaga el error informado por el servidor", async () => {
    vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
            error: "Se alcanzó el límite de solicitudes.",
        }),
        })
    );

    await expect(
        fetchChatResponse([{ role: "user", text: "Hola" }])
    ).rejects.toThrow("Se alcanzó el límite de solicitudes.");
    });

    it("propaga un fallo de conexión", async () => {
    vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new TypeError("Failed to fetch"))
    );

    await expect(
        fetchChatResponse([{ role: "user", text: "Hola" }])
    ).rejects.toThrow("Failed to fetch");
    });
});