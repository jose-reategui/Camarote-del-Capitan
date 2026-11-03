export function parseChatResponse(data) {
    if (typeof data?.text !== "string" || !data.text.trim()) {
    throw new Error("El servidor devolvió una respuesta vacía.");
    }

    return data.text.trim();
}

export async function fetchChatResponse(messages) {
    const response = await fetch("/api/functions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
    });

    const data = await response.json();

    if (!response.ok) {
    throw new Error(data.error || "No se pudo obtener una respuesta.");
    }

    return parseChatResponse(data);
}