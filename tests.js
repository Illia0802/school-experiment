(function() {
    window.currentTestData = null;

    window.generateAITest = async function() {
        const topicInput = document.getElementById('ai-test-topic');
        const loader = document.getElementById('ai-test-loader');
        const container = document.getElementById('test-render-container');
        const btn = document.getElementById('btn-gen-test');
        
        const topic = topicInput.value.trim();
        if (!topic) return alert('Будь ласка, введіть тему тесту!');

        loader.style.display = 'block';
        container.innerHTML = '';
        btn.disabled = true;

        // Змушуємо ШІ повернути чіткий JSON
        const prompt = `Ти професійний вчитель. Створи цікавий тест (5 питань) на тему: "${topic}". 
Поверни результат ВИКЛЮЧНО у форматі JSON. Без маркдауну, без тегів \`\`\`json.
Структура JSON має бути точно такою:
{
  "title": "Назва тесту",
  "questions": [
    {
      "q": "Текст питання",
      "options": ["Варіант 1", "Варіант 2", "Варіант 3", "Варіант 4"],
      "correctIndex": 0
    }
  ]
}
Заборони собі писати будь-що інше окрім цього JSON.`;

        try {
            let jsonResponse = null;
            
            // Використовуємо ключі Gemini з config.js (найкраще для JSON)
            const apiKeys = window.APP_CONFIG?.GEMINI_API_KEYS || [];
            
            if (apiKeys.length > 0) {
                let key = apiKeys[Math.floor(Math.random() * apiKeys.length)];
                let geminiModel = "gemini-1.5-flash"; 
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${key.trim()}`;
                
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: prompt }] }],
                        generationConfig: { 
                            temperature: 0.7, 
                            responseMimeType: "application/json" 
                        }
                    })
                });

                if (res.ok) {
                    const result = await res.json();
                    const txt = result.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (txt) jsonResponse = JSON.parse(txt);
                }
            }
            
            // Якщо Gemini не спрацював, резервний запит через Airforce
            if (!jsonResponse) {
                const res = await fetch('https://api.airforce/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [{ role: 'user', content: prompt }],
                        model: 'gpt-4o-mini',
                        temperature: 0.7
                    })
                });
                const result = await res.json();
                let txt = result.choices?.[0]?.message?.content || "";
                txt = txt.replace(/```json/g, '').replace(/```/g, '').trim();
                jsonResponse = JSON.parse(txt);
            }

            // Якщо отримали правильну структуру - рендеримо
            if (jsonResponse && jsonResponse.questions) {
                window.currentTestData = jsonResponse;
                window.renderActiveTest(jsonResponse);
            } else {
                throw new Error("Невірний формат даних від ШІ");
            }
        } catch (e) {
            console.error("Помилка генерації тесту:", e);
            container.innerHTML = '<div class="sch-empty" style="color:var(--danger); border-color:var(--danger);">Помилка генерації. Сервери ШІ перевантажені або тема занадто складна. Спробуйте ще раз!</div>';
        } finally {
            loader.style.display = 'none';
            btn.disabled = false;
        }
    };

    // Рендер тесту на екран
    window.renderActiveTest = function(data) {
        const container = document.getElementById('test-render-container');
        let html = `<div class="card"><h2 style="color:var(--primary); margin-bottom: 20px; font-size: 18px;">${data.title}</h2>`;
        
        data.questions.forEach((q, qIndex) => {
            html += `<div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border);">
                        <h4 style="margin-bottom: 12px; color: var(--text-main); font-size: 15px; line-height: 1.4;">${qIndex + 1}. ${q.q}</h4>
                        <div style="display: flex; flex-direction: column; gap: 8px;">`;
            
            q.options.forEach((opt, optIndex) => {
                html += `<label style="display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 12px; background: var(--bg-main); border-radius: 12px; border: 1px solid var(--border); transition: 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">
                            <input type="radio" name="q_${qIndex}" value="${optIndex}" style="accent-color: var(--primary); transform: scale(1.2);">
                            <span style="font-size: 14px; color: var(--text-main); font-weight: 500;">${opt}</span>
                         </label>`;
            });
            html += `</div></div>`;
        });

        html += `<button onclick="window.checkTestResults()" style="width: 100%; padding: 14px; background: var(--primary); color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; transition: 0.2s; box-shadow: var(--shadow-sm);">Завершити тест та перевірити</button>`;
        html += `</div>`;
        
        container.innerHTML = html;
    };

    // Перевірка результатів
    window.checkTestResults = function() {
        if (!window.currentTestData) return;
        
        let score = 0;
        const total = window.currentTestData.questions.length;
        const container = document.getElementById('test-render-container');

        // Перевіряємо кожне питання
        window.currentTestData.questions.forEach((q, qIndex) => {
            const selected = document.querySelector(`input[name="q_${qIndex}"]:checked`);
            
            // Знаходимо блок конкретного питання, щоб розфарбувати варіанти
            const firstRadio = document.querySelector(`input[name="q_${qIndex}"]`);
            if (!firstRadio) return;
            const qDiv = firstRadio.closest('div').parentElement; 
            const allLabels = qDiv.querySelectorAll('label');
            
            // 1. Обов'язково підсвічуємо правильну відповідь зеленим
            if (allLabels[q.correctIndex]) {
                allLabels[q.correctIndex].style.background = 'rgba(16, 185, 129, 0.1)';
                allLabels[q.correctIndex].style.borderColor = 'var(--success)';
            }
            
            // 2. Аналізуємо вибір користувача
            if (selected) {
                const val = parseInt(selected.value);
                if (val === q.correctIndex) {
                    score++; // Вгадав
                } else {
                    // Не вгадав - підсвічуємо червоним
                    selected.closest('label').style.background = 'rgba(239, 68, 68, 0.1)';
                    selected.closest('label').style.borderColor = 'var(--danger)';
                }
            }
        });

        // Блокуємо всі радіокнопки після перевірки
        container.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true);
        
        // Виводимо фінальний результат
        const btn = container.querySelector('button');
        let message = 'Треба ще потренуватися! 💪';
        if (score === total) message = 'Ідеально! 🎉';
        else if (score >= total / 2) message = 'Гарний результат! 👍';

        btn.outerHTML = `<div style="text-align: center; padding: 20px; background: var(--bg-main); border-radius: 12px; border: 2px dashed var(--primary); margin-top: 15px; animation: fadeIn 0.5s ease;">
                            <h2 style="color: var(--text-main); margin-bottom: 5px;">Ваш результат: <span style="color: var(--primary);">${score} / ${total}</span></h2>
                            <p style="color: var(--text-muted); font-size: 14px; font-weight: 600;">${message}</p>
                            <button onclick="window.currentTestData = null; document.getElementById('test-render-container').innerHTML = '<div class=\\'sch-empty\\'>Тут з\\'явиться ваш тест 👆</div>'; document.getElementById('ai-test-topic').value = '';" style="margin-top: 15px; padding: 10px 20px; background: var(--bg-tab); border: 1px solid var(--border); color: var(--text-main); border-radius: 10px; cursor: pointer; font-weight: 600;">Створити новий тест</button>
                         </div>`;
                         
        // Запускаємо салют якщо всі відповіді правильні
        if (score === total && typeof window.triggerConfetti === 'function') {
            window.triggerConfetti();
        }
    };

    console.log("📝 Модуль інтерактивних тестів завантажено!");
})();