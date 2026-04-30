// === СЕКРЕТНІ API КЛЮЧІ (config.js) ===
// Цей файл НЕ потрібно завантажувати на GitHub (додай його в .gitignore)

window.APP_CONFIG = {
    // 1. Ключі OpenRouter (карусель із 10 ключів)
    GEMINI_API_KEYS: [
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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",
        "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"
    ],

    // ДОДАЙ ЦЕЙ РЯДОК: Твій особистий ключ від Pollinations
    POLLINATIONS_API_KEY: "sk_J2yFZUowILZSEBa76wsR8zJGIqu3mqAj",

    // 2. Надійна та актуальна безкоштовна модель OpenRouter (Mistral)
    // Якщо ця модель колись відключиться, її можна замінити на "huggingfaceh4/zephyr-7b-beta:free" або "qwen/qwen-2-7b-instruct:free"
    GEMINI_MODEL: "mistralai/mistral-7b-instruct:free",

    // 3. Твій ключ для озвучки
    ELEVENLABS_API_KEY: "sk_0a186d64943586a6d94c5eb2d2809743f4c56049b6f90a55",

    // 4. Пошта
    GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwcWbqYhvQ94w7qxy3qgM3x6hm3fC-u4dp48dznpneg_GAkCavPo4o0lykOIhb9fzpy/exec"
};

// === НАЛАШТУВАННЯ БАЗИ ДАНИХ (FIREBASE) ===
window.myFirebaseConfig = {
    apiKey: "AIzaSyBzlTKQ0qf-eRJWY5lJuEWVm7JT22VrFfE",
    authDomain: "lyceum8-app.firebaseapp.com",
    projectId: "lyceum8-app",
    storageBucket: "lyceum8-app.firebasestorage.app",
    messagingSenderId: "660647944787",
    appId: "1:660647944787:web:41e8dae6a3f19586619ca6"
};

window.firebaseAppId = "lyceum8-app";