const SYSTEM_PROMPT = `
Interpreta a una versión ficticia del capitán Jack Sparrow,
de la saga Piratas del Caribe.

Personalidad:
- Eres ingenioso, teatral, impredecible y algo presumido.
- Hablas como un capitán pirata, sin dificultar la comprensión.
- Usas humor y referencias ocasionales a barcos, tesoros y aventuras.
- No repitas las mismas frases en cada respuesta.

Conversación:
- Responde en español, salvo que el usuario solicite otro idioma.
- Usa respuestas breves: normalmente entre una y tres frases.
- Ten en cuenta lo que el usuario ya dijo.
- No inventes mensajes ni decisiones del usuario.
- Conoces tu mundo ficticio; ante temas modernos, reconoce
tu desconocimiento o usa una comparación pirata.
- Si te preguntan, reconoce que eres una simulación mediante IA.
- Ante temas delicados, prioriza una respuesta responsable.
`;

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");

    if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
        error: "Método no permitido.",
    });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL;

    if (!apiKey || !model) {
    return res.status(500).json({
        error: "Falta configurar Gemini en el servidor.",
    });
    }

    const messages = req.body?.messages;

    const validMessages =
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.every(
        (message) =>
        message &&
        ["user", "model"].includes(message.role) &&
        typeof message.text === "string" &&
        message.text.trim().length > 0 &&
        message.text.length <= 10000
    );

    if (
    !validMessages ||
    messages[messages.length - 1].role !== "user"
    ) {
    return res.status(400).json({
        error: "El historial de mensajes no es válido.",
        });
    }

  // El saludo inicial es visual: la conversación enviada
  // a Gemini comienza con el primer mensaje del usuario.
    const firstUserIndex = messages.findIndex(
        (message) => message.role === "user"
    );

    const contents = messages.slice(firstUserIndex).map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
    }));

    try {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
            systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
            },
            contents,
            generationConfig: {
            temperature: 1,
            },
            }),
            signal: AbortSignal.timeout(25000),
        }
    );

    if (!response.ok) {
        const status = response.status === 429 ? 429 : 502;

        return res.status(status).json({
            error:
                status === 429
                    ? "Se alcanzó el límite de solicitudes. Intenta más tarde."
                    : "Gemini no pudo responder. Intenta nuevamente.",
        });
    }

    const data = await response.json();

    const text = (data.candidates?.[0]?.content?.parts ?? [])
        .filter((part) => !part.thought && typeof part.text === "string")
        .map((part) => part.text)
        .join("")
        .trim();

    if (!text) {
        return res.status(502).json({
            error: "Gemini no devolvió una respuesta de texto.",
        });
    }

    return res.status(200).json({ text });
    } catch {
    return res.status(502).json({
        error: "No se pudo conectar con Gemini. Intenta nuevamente.",
        });
    }
}