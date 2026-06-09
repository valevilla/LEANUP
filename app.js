// Cargar la API Key guardada al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
        document.getElementById("user-api-key").value = savedKey;
    }
});

function saveApiKey() {
    const key = document.getElementById("user-api-key").value.trim();
    if (key) {
        localStorage.setItem("gemini_api_key", key);
        alert("API Key configurada de forma segura en este navegador local.");
    } else {
        localStorage.removeItem("gemini_api_key");
        alert("API Key eliminada.");
    }
}

function updateCompletionTracker() {
    const title = document.getElementById("proj-title")?.value || "";
    let percentage = 10;
    if (title.length > 10) percentage += 20;

    document.getElementById("completion-percentage").innerText = `${percentage}% Completado`;
    document.getElementById("completion-bar").style.width = `${percentage}%`;
}

function goToStep(step) {
    alert(`Cambiando dinámicamente a la Etapa ${step}`);
    // Aquí puedes alternar las clases 'hidden' de tus paneles correspondientes
}

// Llamada Directa y Segura a Gemini sin Backend intermedio
async function generateBrainstormIdeas() {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
        alert("Por favor, introduce y guarda una API Key de Gemini válida en la barra superior.");
        return;
    }

    const titleBox = document.getElementById("proj-title").value;
    const resultsBox = document.getElementById("brainstorm-results-box");
    
    resultsBox.classList.remove("hidden");
    resultsBox.innerText = "Pensando ideas de negocio disruptivas con IA...";

    try {
        // Endpoint oficial de la API de Google Gemini
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Actúa como un mentor de startups de incubadoras como MIT o Harvard. En base a este proyecto preliminar: "${titleBox}", lánzame 3 ideas de negocio Lean Startup viables estructuradas. Sé conciso.` }]
                }]
            })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            resultsBox.innerText = data.candidates[0].content.parts[0].text;
        } else {
            resultsBox.innerText = "Error en el formato de respuesta de la IA. Revisa tu API Key.";
        }
    } catch (error) {
        console.error(error);
        resultsBox.innerText = "Error crítico de conexión al llamar a la API externa.";
    }
}
