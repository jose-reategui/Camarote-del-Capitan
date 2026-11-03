import { getChatView, initChat } from "./chat.js";

const app = document.querySelector("#app");

const routes = {
    "/home": {
    title: "Inicio",
    view: () => `
        <section class="chat">
            <div class="chat-header">
            <h1>El camarote del capitán</h1>

            <p>
                Conversa con Jack Sparrow, el ingenioso e impredecible
                capitán de Piratas del Caribe.
            </p>

            <p>
                Pregunta por sus aventuras, sus planes o los peligros
                que acechan en alta mar.
            </p>

            <a href="/chat" data-link>Comenzar a chatear</a>
        </div>
        </section>
    `,
    },

    "/chat": {
    title: "Chat",
    view: getChatView,
    },

    "/about": {
        title: "Acerca de",
        view: () => `
        <section class="chat">
            <div class="chat-header">
            <h1>Acerca del proyecto</h1>

            <p>
                Esta aplicación es un proyecto educativo desarrollado
                con HTML, CSS y JavaScript.
            </p>

            <p>
                El personaje elegido es Jack Sparrow, de la saga
                Piratas del Caribe. Su personalidad combina ingenio,
                humor y una peculiar forma de salir de los problemas.
            </p>

            <p>
                El objetivo es integrar Gemini mediante una función
                de servidor y mantener la API key fuera del frontend.
            </p>

            <p>
                Las respuestas serán generadas por inteligencia artificial
                y pueden contener errores. Este proyecto no es oficial.
            </p>
            </div>
        </section>
    `,
    },
};

function renderRoute() {
    const path = window.location.pathname;
    const route = routes[path];

    if (!route) {
    app.innerHTML = `
        <section class="chat">
        <div class="chat-header">
            <h1>Página no encontrada</h1>
            <a href="/home" data-link>Volver al inicio</a>
        </div>
        </section>
    `;

    document.title = "Página no encontrada";
    } else {
    app.innerHTML = route.view();
    document.title = `${route.title} | El camarote del capitán`;
    if (path === "/chat") {
    initChat();
    }
    }

    document.querySelectorAll("nav a[data-link]").forEach((link) => {
        if (link.getAttribute("href") === path) {
        link.setAttribute("aria-current", "page");
        } else {
        link.removeAttribute("aria-current");
    }
    });
}

document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-link]");

    if (
        !link ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
    ) {
        return;
    }

    const url = new URL(link.href);

    if (url.origin !== window.location.origin) {
        return;
    }

    event.preventDefault();

    if (url.href !== window.location.href) {
        window.history.pushState(null, "", url);
    }

    renderRoute();
});

window.addEventListener("popstate", renderRoute);

if (window.location.pathname === "/") {
    window.history.replaceState(null, "", "/home");
}

renderRoute();