(function() {
    // === ГЛОБАЛЬНІ ЗМІННІ ТЕСТІВ ===
    window.activeTest = null;
    window.activeTestId = null;
    window.currentQIndex = 0;
    window.testScore = 0;
    window.testCheatCount = 0;
    window.testAnswers = [];
    window.manualQuestionCount = 0;

    // Перемикання вкладок всередині "Тестів"
    window.switchTestMode = function(mode) {
        ['ai', 'manual', 'my'].forEach(m => {
            document.getElementById(`btn-test-${m}`).classList.toggle('active', mode === m);
            document.getElementById(`test-mode-${m}`).style.display = mode === m ? 'block' : 'none';
        });
        if (mode === 'my' && window.loadMyTests) window.loadMyTests();
    };

    // === РУЧНИЙ КОНСТРУКТОР ТЕСТІВ ===
    window.addManualQuestion = function() {
        window.manualQuestionCount++;
        const qId = window.manualQuestionCount;
        const html = `
            <div class="manual-q-block" data-qid="${qId}" style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--border); position:relative;">
                <button onclick="this.parentElement.remove()" style="position:absolute; top:10px; right:10px; background:var(--danger); color:white; border:none; border-radius:50%; width:24px; height:24px; cursor:pointer; font-weight:bold;">✕</button>
                
                <select class="setting-control q-type" style="margin-bottom:10px; font-weight:bold; color:var(--primary);" onchange="window.updateQuestionTypeUI(this, ${qId})">
                    <option value="single">🔘 Одна правильна відповідь</option>
                    <option value="multi">☑️ Кілька правильних відповідей</option>
                    <option value="open">✍️ Відкрита відповідь (текст)</option>
                </select>

                <input type="text" class="setting-control q-text" placeholder="Запитання ${qId}" style="margin-bottom:10px; border-color:var(--primary);">
                
                <div class="q-options-area" id="opts_area_${qId}" style="display:flex; flex-direction:column; gap:8px;">
                    <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);"><input type="radio" name="correct_${qId}" value="0" checked style="accent-color:var(--success); transform:scale(1.2);"> <input type="text" class="setting-control opt-text" placeholder="Варіант А" style="padding:8px; border:none; box-shadow:none;"></label>
                    <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);"><input type="radio" name="correct_${qId}" value="1" style="accent-color:var(--success); transform:scale(1.2);"> <input type="text" class="setting-control opt-text" placeholder="Варіант Б" style="padding:8px; border:none; box-shadow:none;"></label>
                    <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);"><input type="radio" name="correct_${qId}" value="2" style="accent-color:var(--success); transform:scale(1.2);"> <input type="text" class="setting-control opt-text" placeholder="Варіант В" style="padding:8px; border:none; box-shadow:none;"></label>
                    <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);"><input type="radio" name="correct_${qId}" value="3" style="accent-color:var(--success); transform:scale(1.2);"> <input type="text" class="setting-control opt-text" placeholder="Варіант Г" style="padding:8px; border:none; box-shadow:none;"></label>
                </div>
            </div>
        `;
        document.getElementById('manual-questions-container').insertAdjacentHTML('beforeend', html);
    };

    window.updateQuestionTypeUI = function(selectEl, qId) {
        const area = document.getElementById(`opts_area_${qId}`);
        const type = selectEl.value;
        if (type === 'open') {
            area.innerHTML = `<div style="font-size:12px; color:var(--text-muted); font-style:italic;">Учень вводитиме текст самостійно. Цю відповідь вам треба буде перевірити вручну.</div>`;
        } else if (type === 'multi') {
            area.innerHTML = `
                <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);"><input type="checkbox" name="correct_${qId}" value="0" style="accent-color:var(--success); transform:scale(1.2);"> <input type="text" class="setting-control opt-text" placeholder="Варіант А" style="padding:8px; border:none; box-shadow:none;"></label>
                <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);"><input type="checkbox" name="correct_${qId}" value="1" style="accent-color:var(--success); transform:scale(1.2);"> <input type="text" class="setting-control opt-text" placeholder="Варіант Б" style="padding:8px; border:none; box-shadow:none;"></label>
                <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);"><input type="checkbox" name="correct_${qId}" value="2" style="accent-color:var(--success); transform:scale(1.2);"> <input type="text" class="setting-control opt-text" placeholder="Варіант В" style="padding:8px; border:none; box-shadow:none;"></label>
                <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);"><input type="checkbox" name="correct_${qId}" value="3" style="accent-color:var(--success); transform:scale(1.2);"> <input type="text" class="setting-control opt-text" placeholder="Варіант Г" style="padding:8px; border:none; box-shadow:none;"></label>
            `;
        } else {
            area.innerHTML = `
                <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);"><input type="radio" name="correct_${qId}" value="0" checked style="accent-color:var(--success); transform:scale(1.2);"> <input type="text" class="setting-control opt-text" placeholder="Варіант А" style="padding:8px; border:none; box-shadow:none;"></label>
                <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);"><input type="radio" name="correct_${qId}" value="1" style="accent-color:var(--success); transform:scale(1.2);"> <input type="text" class="setting-control opt-text" placeholder="Варіант Б" style="padding:8px; border:none; box-shadow:none;"></label>
                <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);"><input type="radio" name="correct_${qId}" value="2" style="accent-color:var(--success); transform:scale(1.2);"> <input type="text" class="setting-control opt-text" placeholder="Варіант В" style="padding:8px; border:none; box-shadow:none;"></label>
                <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);"><input type="radio" name="correct_${qId}" value="3" style="accent-color:var(--success); transform:scale(1.2);"> <input type="text" class="setting-control opt-text" placeholder="Варіант Г" style="padding:8px; border:none; box-shadow:none;"></label>
            `;
        }
    };

    window.publishManualTest = async function() {
        const title = document.getElementById('manual-test-title').value.trim();
        const isPublic = document.getElementById('manual-test-public').checked;
        if(!title) return alert('Введіть назву тесту!');
        
        const blocks = document.querySelectorAll('.manual-q-block');
        if(blocks.length === 0) return alert('Додайте питання!');
        
        const testData = { 
            title: title, 
            isPublic: isPublic,
            creatorEmail: window.currentUser ? window.currentUser.email : 'guest',
            questions: [] 
        };
        
        for(let block of blocks) {
            const type = block.querySelector('.q-type').value;
            const qText = block.querySelector('.q-text').value.trim();
            if(!qText) return alert('Заповніть текст усіх питань!');

            let qObj = { type: type, q: qText };

            if (type !== 'open') {
                const opts = Array.from(block.querySelectorAll('.opt-text')).map(input => input.value.trim());
                if(opts.some(o => !o)) return alert('Заповніть усі варіанти відповідей!');
                qObj.options = opts;
                
                if (type === 'single') {
                    const checked = block.querySelector('input[type="radio"]:checked');
                    qObj.correct = [parseInt(checked.value)];
                } else if (type === 'multi') {
                    const checked = Array.from(block.querySelectorAll('input[type="checkbox"]:checked'));
                    if(checked.length === 0) return alert('Оберіть хоча б одну правильну відповідь для чекбоксів!');
                    qObj.correct = checked.map(c => parseInt(c.value));
                }
            }
            testData.questions.push(qObj);
        }

        if(!window.fbSaveTest) return alert('Зачекайте, БД ще вантажиться...');
        try {
            const testId = 't_' + Date.now().toString(36);
            await window.fbSaveTest(testId, testData);
            
            // КРАСИВЕ ПОСИЛАННЯ
            const link = window.location.origin + window.location.pathname + '?t=' + testId;
            
            document.getElementById('test-render-container').innerHTML = `
                <div style="text-align: center; padding: 25px; background: var(--glass); border-radius: 16px; border: 2px solid var(--success); box-shadow: var(--shadow-md); animation: fadeIn 0.4s ease;">
                    <h2 style="color: var(--success); margin-bottom: 10px;">✅ Тест опубліковано!</h2>
                    <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 15px;">Надішліть це посилання учням:</p>
                    <input type="text" value="${link}" readonly style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-tab); color: var(--primary); font-weight: 600; text-align: center; cursor: pointer;" onclick="this.select(); document.execCommand('copy'); alert('Скопійовано!');">
                </div>
            `;
        } catch(e) { alert('Помилка: ' + e.message); }
    };

    // === ШІ ГЕНЕРАТОР ТЕСТІВ ===
    window.generateAITest = async function() {
        const topicInput = document.getElementById('ai-test-topic');
        const loader = document.getElementById('ai-test-loader');
        const container = document.getElementById('test-render-container');
        const btn = document.getElementById('btn-gen-test');
        
        const topic = topicInput.value.trim();
        if (!topic) return alert('Будь ласка, введіть тему!');

        loader.style.display = 'block'; container.innerHTML = ''; btn.disabled = true;

        const prompt = `Створи цікавий тест (5 питань) на тему: "${topic}". 
Поверни результат ВИКЛЮЧНО у форматі JSON. Без маркдауну, без пояснень, без тегів \`\`\`json.
Структура JSON має бути точно такою:
{
  "title": "Назва тесту",
  "questions": [
    {
      "type": "single",
      "q": "Питання",
      "options": ["А", "Б", "В", "Г"],
      "correct": [0]
    }
  ]
}`;

        const parseAIJson = (txt) => {
            try { return JSON.parse(txt); } catch(e) {}
            try { 
                const f = txt.indexOf('{'); 
                const l = txt.lastIndexOf('}'); 
                if(f !== -1 && l !== -1) return JSON.parse(txt.substring(f, l+1)); 
            } catch(e){}
            return null;
        };

        try {
            let jsonResponse = null;
            const apiKeys = window.APP_CONFIG?.GEMINI_API_KEYS || [];
            
            for (let i = 0; i < apiKeys.length; i++) {
                if (jsonResponse) break;
                let key = apiKeys[i];
                if (!key || key.trim() === "") continue;

                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key.trim()}`;
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ role: 'user', parts: [{ text: prompt }] }],
                            generationConfig: { temperature: 0.7, responseMimeType: "application/json" }
                        })
                    });

                    if (res.ok) {
                        const result = await res.json();
                        const txt = result.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (txt) jsonResponse = parseAIJson(txt);
                    }
                } catch(e) {}
            }
            
            if (!jsonResponse) {
                try {
                    const res = await fetch('https://api.airforce/v1/chat/completions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], model: 'gpt-4o-mini', temperature: 0.7 })
                    });
                    if (res.ok) {
                        const result = await res.json();
                        const txt = result.choices?.[0]?.message?.content || "";
                        jsonResponse = parseAIJson(txt);
                    }
                } catch(e) {}
            }

            if (jsonResponse && jsonResponse.questions) {
                jsonResponse.isPublic = false;
                jsonResponse.creatorEmail = window.currentUser ? window.currentUser.email : 'guest';
                
                if(!window.fbSaveTest) return alert('База даних завантажується...');
                const testId = 't_' + Date.now().toString(36);
                await window.fbSaveTest(testId, jsonResponse);
                const link = window.location.origin + window.location.pathname + '?t=' + testId;
                
                container.innerHTML = `
                    <div style="text-align: center; padding: 25px; background: var(--glass); border-radius: 16px; border: 2px solid var(--success); box-shadow: var(--shadow-md);">
                        <h2 style="color: var(--success); margin-bottom: 10px;">✅ ШІ склав тест!</h2>
                        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 15px;">Надішліть це посилання учням:</p>
                        <input type="text" value="${link}" readonly style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-tab); color: var(--primary); font-weight: 600; text-align: center; cursor: pointer;" onclick="this.select(); document.execCommand('copy'); alert('Скопійовано!');">
                    </div>
                `;

            } else {
                throw new Error("Невірний формат");
            }
        } catch (e) {
            container.innerHTML = '<div class="sch-empty" style="color:var(--danger); border-color:var(--danger);">Помилка генерації. Спробуйте ще раз!</div>';
        } finally {
            loader.style.display = 'none';
            btn.disabled = false;
        }
    };

    // === РАННЕР ТЕСТУ (ПРОХОДЖЕННЯ) ===
    window.openTestRunner = function(testId, testData) {
        window.activeTestId = testId;
        window.activeTest = testData;
        window.currentQIndex = 0;
        window.testScore = 0;
        window.testCheatCount = 0;
        window.testAnswers = [];
        
        document.getElementById('test-runner-overlay').style.display = 'flex';
        document.getElementById('tr-intro-title').innerText = testData.title;
        
        if (!window.currentUser) {
            document.getElementById('tr-guest-fields').style.display = 'block';
            document.getElementById('tr-guest-name').value = '';
        } else {
            document.getElementById('tr-guest-fields').style.display = 'none';
        }
        
        document.getElementById('tr-intro-screen').style.display = 'block';
        document.getElementById('tr-active-screen').style.display = 'none';
        document.getElementById('tr-outro-screen').style.display = 'none';
    };

    window.startFullscreenTest = function() {
        let userName = "Учень";
        if (!window.currentUser) {
            userName = document.getElementById('tr-guest-name').value.trim();
            if (!userName) return alert('Будь ласка, введіть Прізвище та Ім\'я!');
            window.testTakerName = userName;
        } else {
            window.testTakerName = `${window.currentUser.firstName} ${window.currentUser.lastName}`;
        }

        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(e=>{});
        
        document.addEventListener('fullscreenchange', window.fullscreenCheatCheck);

        document.getElementById('tr-intro-screen').style.display = 'none';
        document.getElementById('tr-active-screen').style.display = 'block';
        window.renderCurrentQuestion();
    };

    window.fullscreenCheatCheck = function() {
        if (!document.fullscreenElement && document.getElementById('tr-active-screen').style.display === 'block') {
            window.testCheatCount++;
            alert('⚠️ Порушення! Ви вийшли з повного екрану. Це зафіксовано системою.');
        }
    };

    window.renderCurrentQuestion = function() {
        const q = window.activeTest.questions[window.currentQIndex];
        document.getElementById('tr-current-info').innerText = `Питання ${window.currentQIndex + 1} / ${window.activeTest.questions.length}`;
        
        const progress = ((window.currentQIndex) / window.activeTest.questions.length) * 100;
        document.getElementById('tr-progress').style.width = progress + '%';

        let html = `<div class="tr-q-box active"><div class="tr-q-text">${q.q}</div>`;
        
        if (q.type === 'open') {
            html += `<textarea class="tr-textarea" id="tr-open-ans" placeholder="Напишіть вашу розгорнуту відповідь тут..."></textarea>`;
        } else {
            const inputType = q.type === 'multi' ? 'checkbox' : 'radio';
            q.options.forEach((opt, idx) => {
                html += `
                    <label class="tr-opt-label">
                        <input type="${inputType}" name="tr-opt" value="${idx}">
                        <span>${opt}</span>
                    </label>
                `;
            });
        }
        html += `</div>`;
        
        document.getElementById('tr-questions-area').innerHTML = html;
    };

    window.submitCurrentAnswer = function() {
        const q = window.activeTest.questions[window.currentQIndex];
        let answerData = null;
        let isCorrect = false;

        if (q.type === 'open') {
            const text = document.getElementById('tr-open-ans').value.trim();
            if (!text) return alert('Напишіть відповідь!');
            answerData = text;
            isCorrect = null; 
        } else {
            const checked = Array.from(document.querySelectorAll('input[name="tr-opt"]:checked'));
            if (checked.length === 0) return alert('Оберіть варіант!');
            
            answerData = checked.map(el => parseInt(el.value));
            
            if (q.type === 'single') {
                isCorrect = answerData[0] === q.correct[0];
            } else if (q.type === 'multi') {
                isCorrect = answerData.length === q.correct.length && answerData.every(val => q.correct.includes(val));
            }
            
            if (isCorrect) window.testScore++;
        }

        window.testAnswers.push({ qIndex: window.currentQIndex, answer: answerData, isCorrect: isCorrect });

        const toast = document.getElementById('toast-success');
        toast.style.display = 'flex';
        setTimeout(() => { toast.style.display = 'none'; }, 1000);

        window.currentQIndex++;
        
        if (window.currentQIndex >= window.activeTest.questions.length) {
            setTimeout(window.finishTest, 500); 
        } else {
            setTimeout(window.renderCurrentQuestion, 500); 
        }
    };

    window.finishTest = async function() {
        document.removeEventListener('fullscreenchange', window.fullscreenCheatCheck);
        if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen().catch(e=>{});

        document.getElementById('tr-progress').style.width = '100%';
        document.getElementById('tr-active-screen').style.display = 'none';
        
        if (window.fbSaveTestResult) {
            await window.fbSaveTestResult(window.activeTestId, {
                studentName: window.testTakerName,
                score: window.testScore,
                maxScore: window.activeTest.questions.length,
                cheatCount: window.testCheatCount,
                answers: window.testAnswers,
                time: Date.now()
            });
        }

        document.getElementById('tr-final-score').innerText = `${window.testScore} / ${window.activeTest.questions.length}`;
        document.getElementById('tr-outro-screen').style.display = 'block';
        
        if (window.testScore === window.activeTest.questions.length && typeof window.triggerConfetti === 'function') {
            window.triggerConfetti();
        }
    };

    window.abortTest = function() {
        if(confirm('Ви впевнені, що хочете перервати тест? Результати не будуть збережені.')) {
            window.exitRunner();
        }
    };

    window.exitRunner = function() {
        document.removeEventListener('fullscreenchange', window.fullscreenCheatCheck);
        if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen().catch(e=>{});
        document.getElementById('test-runner-overlay').style.display = 'none';
        
        const url = new URL(window.location);
        url.searchParams.delete('t');
        window.history.pushState({}, '', url);
    };

    console.log("📝 Логіку тестів (tests.js) завантажено!");
})();