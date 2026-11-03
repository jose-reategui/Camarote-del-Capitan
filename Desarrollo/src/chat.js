import { fetchChatResponse } from "./utils.js";
export function getChatView() {
    return `
        <section class="chat" aria-labelledby="chat-title">
        <header class="chat-header">
            <h1 id="chat-title">Capitán Jack Sparrow</h1>
            <p>Sube a bordo y comienza una conversación.</p>
        </header>

        <div
            id="messages"
            class="messages"
            role="log"
            aria-label="Mensajes de la conversación"
            aria-live="polite"
            >
            <article class="message message-character">
                <p class="message-author">Jack Sparrow</p>
                <p>¿Vienes por una aventura o necesitas un capitán?</p>
                </article>
        </div>

        <p id="chat-status" class="chat-status" role="status"></p>

        <form id="chat-form" class="chat-form">
            <label for="message-input">Tu mensaje</label>

        <div class="chat-controls">
            <input
                id="message-input"
                name="message"
                type="text"
                placeholder="Escribe al capitán..."
                maxlength="1000"
                required
            >
                <button type="submit">Enviar</button>
            </div>
            </form>
        </section>
    `;
}

const messages = [
    {
    role: "model",
    text: "¿Vienes por una aventura o necesitas un capitán?",
    },
];

let isLoading = false;
let errorMessage = "";
let draft = "";

function renderMessages(container) {
    container.replaceChildren();

    messages.forEach((message) => {
    const article = document.createElement("article");
    const author = document.createElement("p");
    const content = document.createElement("p");
    const isUser = message.role === "user";

    article.classList.add(
        "message",
        isUser ? "message-user" : "message-character"
    );

    author.className = "message-author";
    author.textContent = isUser ? "Tú" : "Jack Sparrow";
    content.textContent = message.text;

    article.append(author, content);
    container.append(article);
    });

    container.scrollTop = container.scrollHeight;
}

function updateChatUI() {
    const form = document.querySelector("#chat-form");

  // Podemos estar en Home o About mientras llega la respuesta.
    if (!form) {
    return;
    }

    const container = document.querySelector("#messages");
    const input = document.querySelector("#message-input");
    const button = form.querySelector("button");
    const status = document.querySelector("#chat-status");

    renderMessages(container);

    input.disabled = isLoading;
    button.disabled = isLoading;
    input.value = draft;
    button.textContent = isLoading ? "Esperando..." : "Enviar";

    status.textContent = isLoading
    ? "Jack está escribiendo..."
    : errorMessage;

    status.classList.toggle("is-error", Boolean(errorMessage));
    container.setAttribute("aria-busy", String(isLoading));
}

export function initChat() {
    const form = document.querySelector("#chat-form");
    const input = document.querySelector("#message-input");

    updateChatUI();

    input.addEventListener("input", () => {
    draft = input.value;
    });

    form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const text = input.value.trim();

    if (!text || isLoading) {
        return;
    }

    messages.push({
        role: "user",
        text,
    });

    draft = "";
    errorMessage = "";
    isLoading = true;
    updateChatUI();

    try {
        const reply = await fetchChatResponse(messages);

        messages.push({
        role: "model",
        text: reply,
        });
    } catch (error) {
      // Restauramos el mensaje para que pueda volver a enviarse.
        messages.pop();
        draft = text;

        errorMessage =
        error instanceof TypeError
            ? "No se pudo conectar. Revisa tu conexión e intenta nuevamente."
            : error.message || "Ocurrió un error al enviar el mensaje.";
    } finally {
        isLoading = false;
        updateChatUI();

        if (form.isConnected) {
        input.focus();
        }
    }
    });
}