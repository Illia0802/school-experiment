window.activeTest = null;
window.activeTestId = null;
window.currentQIndex = 0;
window.testScore = 0;
window.testCheatCount = 0;
window.testAnswers = [];
window.manualQuestionCount = 0;

window.switchTestMode = function(mode) {
    ['create', 'my', 'public'].forEach(m => {
        const btn = document.getElementById(`btn-test-${m}`);
        const el = document.getElementById(`test-mode-${m}`);
        if(btn) btn.classList.toggle('active', mode === m);
        if(el) el.style.display = mode === m ? 'block' : 'none';
    });
    if (mode === 'my' && window.loadMyTests) window.loadMyTests();
    if (mode === 'public' && window.loadPublicTests) window.loadPublicTests();
};

window.loadMyTests = async function() {
    const listEl = document.getElementById('my-tests-list');
    if (!listEl) return;
    
    if (!window.firestoreDB || !window.firebaseInitialized) {
        listEl.innerHTML = '<div class="sch-empty" style="color:var(--text-muted);">База даних ще завантажується...</div>';
        return;
    }

    listEl.innerHTML = '<div class="sch-empty" style="color:var(--primary);">⏳ Шукаю ваші тести...</div>';

    try {
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");
        const testsRef = collection(window.firestoreDB, 'artifacts', window.firebaseAppId, 'public', 'data', 'tests');
        const snapshot = await getDocs(testsRef);
        
        const myEmail = window.currentUser ? window.currentUser.email : 'guest';
        let html = '';
        let count = 0;

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            if (data.creatorEmail === myEmail || (window.isSuperAdmin && window.isSuperAdmin())) {
                count++;
                let basePath = window.location.pathname.replace(/\/index\.html$/i, '');
                if (!basePath.endsWith('/')) basePath += '/';
                const link = window.location.origin + basePath + '?t=' + docSnap.id;
                
                html += `
                    <div style="background:var(--bg-tab); border:1px solid var(--border); border-radius:12px; padding:15px; display:flex; flex-direction:column; gap:10px; transition:0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong style="font-size:16px; color:var(--text-main);">${data.title}</strong>
                            <span style="font-size:12px; background:rgba(59,130,246,0.1); color:var(--primary); padding:4px 8px; border-radius:8px; font-weight:bold;">${data.questions?.length || 0} питань</span>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button onclick="window.open('${link}', '_blank')" style="flex:1; padding:8px; background:var(--primary); color:white; border:none; border-radius:8px; font-weight:600; cursor:pointer; font-size:13px;">Проходити</button>
                            <button onclick="const temp=document.createElement('input');temp.value='${link}';document.body.appendChild(temp);temp.select();document.execCommand('copy');document.body.removeChild(temp);alert('Скопійовано!');" style="flex:1; padding:8px; background:transparent; border:1px solid var(--border); color:var(--text-main); border-radius:8px; font-weight:600; cursor:pointer; font-size:13px;">Копіювати лінк</button>
                        </div>
                    </div>
                `;
            }
        });

        if (count === 0) {
            listEl.innerHTML = '<div class="sch-empty" style="color:var(--text-muted);">Ви ще не створили жодного тесту.</div>';
        } else {
            listEl.innerHTML = html;
        }
    } catch (e) {
        listEl.innerHTML = '<div class="sch-empty" style="color:var(--danger);">Помилка завантаження. Спробуйте пізніше.</div>';
    }
};

window.loadPublicTests = async function() {
    const listEl = document.getElementById('public-tests-list');
    if (!listEl) return;
    
    if (!window.firestoreDB || !window.firebaseInitialized) {
        listEl.innerHTML = '<div class="sch-empty" style="color:var(--text-muted);">База даних ще завантажується...</div>';
        return;
    }

    listEl.innerHTML = '<div class="sch-empty" style="color:var(--primary);">⏳ Шукаю публічні тести...</div>';

    try {
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");
        const testsRef = collection(window.firestoreDB, 'artifacts', window.firebaseAppId, 'public', 'data', 'tests');
        const snapshot = await getDocs(testsRef);
        
        let html = '';
        let count = 0;

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            if (data.isPublic === true) {
                count++;
                
                let basePath = window.location.pathname.replace(/\/index\.html$/i, '');
                if (!basePath.endsWith('/')) basePath += '/';
                const link = window.location.origin + basePath + '?t=' + docSnap.id;
                
                html += `
                    <div style="background:var(--bg-tab); border:1px solid var(--border); border-radius:12px; padding:15px; display:flex; flex-direction:column; gap:10px; transition:0.2s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <div>
                                <strong style="font-size:16px; color:var(--text-main);">${data.title}</strong>
                                <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Автор: ${data.creatorEmail || 'Невідомий'}</div>
                            </div>
                            <span style="font-size:12px; background:rgba(139,92,246,0.1); color:var(--accent); padding:4px 8px; border-radius:8px; font-weight:bold; white-space: nowrap;">${data.questions?.length || 0} питань</span>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button onclick="window.open('${link}', '_blank')" style="flex:1; padding:8px; background:var(--accent); color:white; border:none; border-radius:8px; font-weight:600; cursor:pointer; font-size:13px;">Проходити</button>
                            <button onclick="const temp=document.createElement('input');temp.value='${link}';document.body.appendChild(temp);temp.select();document.execCommand('copy');document.body.removeChild(temp);alert('Скопійовано!');" style="flex:1; padding:8px; background:transparent; border:1px solid var(--border); color:var(--text-main); border-radius:8px; font-weight:600; cursor:pointer; font-size:13px;">Копіювати лінк</button>
                        </div>
                    </div>
                `;
            }
        });

        if (count === 0) {
            listEl.innerHTML = '<div class="sch-empty" style="color:var(--text-muted);">Ще немає публічних тестів. Ви можете стати першим, хто опублікує свій тест!</div>';
        } else {
            listEl.innerHTML = html;
        }
    } catch (e) {
        console.error("Помилка завантаження публічних тестів:", e);
        listEl.innerHTML = '<div class="sch-empty" style="color:var(--danger);">Помилка завантаження. Спробуйте пізніше.</div>';
    }
};

window.addManualQuestion = function(preset = null) {
    window.manualQuestionCount++;
    const qId = window.manualQuestionCount;
    
    // БЕЗПЕЧНЕ зчитування типу
    const qType = preset && preset.type ? preset.type : 'single';
    
    // БЕЗПЕЧНЕ зчитування тексту питання (ШІ міг назвати його q, question або text)
    let qTextVal = '';
    if (preset) {
        const rawText = preset.q || preset.question || preset.text || "";
        qTextVal = String(rawText).replace(/"/g, '&quot;');
    }

    const html = `
        <div class="manual-q-block" data-qid="${qId}" style="background:var(--bg-main); padding:15px; border-radius:12px; border:1px solid var(--border); position:relative; animation: fadeIn 0.4s ease;">
            <button onclick="this.parentElement.remove()" style="position:absolute; top:10px; right:10px; background:var(--danger); color:white; border:none; border-radius:50%; width:24px; height:24px; cursor:pointer; font-weight:bold;">✕</button>
            
            <select class="setting-control q-type" style="margin-bottom:10px; font-weight:bold; color:var(--primary);" onchange="window.updateQuestionTypeUI(this, ${qId})">
                <option value="single" ${qType === 'single' ? 'selected' : ''}>🔘 Одна правильна відповідь</option>
                <option value="multi" ${qType === 'multi' ? 'selected' : ''}>☑️ Кілька правильних відповідей</option>
                <option value="open" ${qType === 'open' ? 'selected' : ''}>✍️ Відкрита відповідь (текст)</option>
            </select>

            <input type="text" class="setting-control q-text" placeholder="Запитання ${qId}" value="${qTextVal}" style="margin-bottom:10px; border-color:var(--primary);">
            
            <div class="q-options-area" id="opts_area_${qId}" style="display:flex; flex-direction:column; gap:8px;"></div>
        </div>
    `;
    document.getElementById('manual-questions-container').insertAdjacentHTML('beforeend', html);

    const selectEl = document.querySelector(`.manual-q-block[data-qid="${qId}"] .q-type`);
    window.updateQuestionTypeUI(selectEl, qId, preset);
};

window.updateQuestionTypeUI = function(selectEl, qId, preset = null) {
    const area = document.getElementById(`opts_area_${qId}`);
    const type = selectEl.value;

    // БЕЗПЕЧНЕ зчитування варіантів (ШІ міг назвати їх options або answers)
    let opts = ["", "", "", ""];
    if (preset) {
        if (Array.isArray(preset.options) && preset.options.length > 0) opts = preset.options;
        else if (Array.isArray(preset.answers) && preset.answers.length > 0) opts = preset.answers;
    }
    
    // БЕЗПЕЧНЕ зчитування правильних відповідей
    let correct = (type === 'multi' ? [] : [0]);
    if (preset) {
        if (Array.isArray(preset.correct)) correct = preset.correct;
        else if (typeof preset.correct === 'number') correct = [preset.correct];
        else if (typeof preset.answer === 'number') correct = [preset.answer];
        else if (Array.isArray(preset.answer)) correct = preset.answer;
    }

    // Безпечне отримання тексту варіанту
    const getOptVal = (i) => {
        return opts[i] !== undefined && opts[i] !== null ? String(opts[i]).replace(/"/g, '&quot;') : '';
    };

    if (type === 'open') {
        area.innerHTML = `<div style="font-size:12px; color:var(--text-muted); font-style:italic;">Учень вводитиме текст самостійно. Цю відповідь вам треба буде перевірити вручну.</div>`;
    } else if (type === 'multi') {
        let html = '';
        for(let i=0; i<4; i++){
            const isChecked = correct.includes(i) ? 'checked' : '';
            html += `
                <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);">
                    <input type="checkbox" name="correct_${qId}" value="${i}" ${isChecked} style="accent-color:var(--success); transform:scale(1.2);">
                    <input type="text" class="setting-control opt-text" placeholder="Варіант ${String.fromCharCode(1040+i)}" value="${getOptVal(i)}" style="padding:8px; border:none; box-shadow:none;">
                </label>
            `;
        }
        area.innerHTML = html;
    } else {
        let html = '';
        for(let i=0; i<4; i++){
            const isChecked = correct.includes(i) ? 'checked' : (i===0 && !preset ? 'checked' : '');
            html += `
                <label style="display:flex; align-items:center; gap:8px; background:var(--bg-tab); padding:8px; border-radius:8px; border:1px solid var(--border);">
                    <input type="radio" name="correct_${qId}" value="${i}" ${isChecked} style="accent-color:var(--success); transform:scale(1.2);">
                    <input type="text" class="setting-control opt-text" placeholder="Варіант ${String.fromCharCode(1040+i)}" value="${getOptVal(i)}" style="padding:8px; border:none; box-shadow:none;">
                </label>
            `;
        }
        area.innerHTML = html;
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
        
        let basePath = window.location.pathname.replace(/\/index\.html$/i, '');
        if (!basePath.endsWith('/')) basePath += '/';
        const link = window.location.origin + basePath + '?t=' + testId;
        
        document.getElementById('test-render-container').innerHTML = `
            <div style="text-align: center; padding: 25px; background: var(--glass); border-radius: 16px; border: 2px solid var(--success); box-shadow: var(--shadow-md); animation: fadeIn 0.4s ease;">
                <h2 style="color: var(--success); margin-bottom: 10px;">✅ Тест опубліковано!</h2>
                <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 15px;">Надішліть це посилання учням:</p>
                <input type="text" value="${link}" readonly style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-tab); color: var(--primary); font-weight: 600; text-align: center; cursor: pointer;" onclick="this.select(); document.execCommand('copy'); alert('Скопійовано!');">
            </div>
        `;
        document.getElementById('manual-test-title').value = '';
        document.getElementById('manual-questions-container').innerHTML = '';
        window.manualQuestionCount = 0;
        
    } catch(e) { alert('Помилка: ' + e.message); }
};

window.generateAITest = async function() {
    const topicInput = document.getElementById('ai-test-topic');
    const loader = document.getElementById('ai-test-loader');
    const btn = document.getElementById('btn-gen-test');
    
    let topic = topicInput.value.trim();
    if (!topic) return alert('Будь ласка, введіть тему!');

    let qCount = 5; 
    const qMatch = topic.match(/(\d+)\s*(питань|питання|запитань|запитання)/i);
    if (qMatch) {
        qCount = parseInt(qMatch[1]);
        if (qCount > 50) qCount = 50; 
    }

    const userClass = (window.currentUser && window.currentUser.userClass && window.currentUser.userClass !== '-') ? window.currentUser.userClass : "гість";
    const classInstruction = userClass !== "гість" ? `Зроби рівень питань відповідним для учня ${userClass} класу.` : `Підбери середній рівень складності.`;

    loader.style.display = 'block'; btn.disabled = true;

    const prompt = `Створи цікавий тест на тему: "${topic}". 
${classInstruction}
Ти ПОВИНЕН згенерувати РІВНО ${qCount} питань.
Кожне питання повинно мати масив 'options' з 4 варіантів і масив 'correct' з 1 правильним індексом (0-3).
Ти працюєш в JSON режимі. Поверни лише JSON-об'єкт з полем 'title' та масивом 'questions'.`;

    const parseAIJson = (txt) => {
        if (!txt || typeof txt !== 'string') return null;
        let cleanTxt = txt.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        try { return JSON.parse(cleanTxt); } catch(e) {}
        
        try { 
            const f = cleanTxt.indexOf('{'); 
            const l = cleanTxt.lastIndexOf('}'); 
            if(f !== -1 && l !== -1) return JSON.parse(cleanTxt.substring(f, l+1)); 
        } catch(e){}

        console.warn("JSON обірваний або пошкоджений. Запуск агресивного відновлення масиву питань...");
        try {
            let title = "Згенерований тест";
            let titleMatch = cleanTxt.match(/"title"\s*:\s*"([^"]+)"/);
            if (titleMatch) title = titleMatch[1];

            let questions = [];
            let parts = cleanTxt.split(/(?=\{"type"|\{"q"|\{"question")/);
            for (let i = 0; i < parts.length; i++) {
                let part = parts[i];
                if (!part.trim().startsWith('{')) continue;
                
                let match = part.match(/"correct"\s*:\s*\[[^\]]*\]\s*\}/);
                if (match) {
                    let endIndex = part.indexOf(match[0]) + match[0].length;
                    let objStr = part.substring(0, endIndex);
                    try {
                        let parsed = JSON.parse(objStr);
                        if (parsed.q || parsed.question || parsed.text) questions.push(parsed);
                    } catch(e) {}
                }
            }

            if (questions.length > 0) {
                console.log(`Успішно відновлено ${questions.length} питань з пошкодженого тексту!`);
                return { title: title, questions: questions };
            }
        } catch(e) { console.error("Помилка агресивного відновлення:", e); }
        
        return null;
    };

    try {
        let jsonResponse = null;
        let rawText = "";
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
                        generationConfig: { 
                            temperature: 0.7, 
                            maxOutputTokens: 8192, 
                            responseMimeType: "application/json",
                            responseSchema: {
                                type: "OBJECT",
                                properties: {
                                    title: { type: "STRING" },
                                    questions: {
                                        type: "ARRAY",
                                        items: {
                                            type: "OBJECT",
                                            properties: {
                                                type: { type: "STRING", description: "Завжди 'single'" },
                                                q: { type: "STRING", description: "Текст запитання" },
                                                options: { type: "ARRAY", items: { type: "STRING" }, description: "4 варіанти відповіді" },
                                                correct: { type: "ARRAY", items: { type: "INTEGER" }, description: "Масив з одним числом: індекс правильної відповіді (від 0 до 3)" }
                                            },
                                            required: ["type", "q", "options", "correct"]
                                        }
                                    }
                                },
                                required: ["title", "questions"]
                            }
                        } 
                    })
                });

                if (res.ok) {
                    const result = await res.json();
                    rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (rawText) jsonResponse = parseAIJson(rawText);
                } else {
                    console.warn("Gemini API Помилка:", await res.text());
                }
            } catch(e) { console.warn("Gemini Мережева помилка", e); }
        }
        
        if (!jsonResponse) {
            try {
                const res = await fetch('https://text.pollinations.ai/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [
                            { role: 'system', content: 'You are a test generator. Output ONLY valid JSON.' },
                            { role: 'user', content: prompt }
                        ],
                        model: 'openai',
                        jsonMode: true
                    })
                });
                if (res.ok) {
                    rawText = await res.text();
                    jsonResponse = parseAIJson(rawText);
                }
            } catch(e) { console.warn("Pollinations Помилка", e); }
        }

        if (jsonResponse && jsonResponse.questions && jsonResponse.questions.length > 0) {
            const titleInput = document.getElementById('manual-test-title');
            if (titleInput) titleInput.value = jsonResponse.title || "Згенерований тест";

            const containerBox = document.getElementById('manual-questions-container');
            if (containerBox) containerBox.innerHTML = ''; 
            window.manualQuestionCount = 0;

            jsonResponse.questions.forEach(q => {
                window.addManualQuestion(q);
            });
            
            topicInput.value = '';

        } else {
            console.error("Сирий текст від ШІ:", rawText);
            throw new Error("ШІ не зміг згенерувати жодного правильного питання. Спробуйте ще раз або зменшіть кількість питань.");
        }
    } catch (e) {
        console.error(e);
        alert(e.message || 'Помилка генерації. Сервери перевантажені, спробуйте ще раз!');
    } finally {
        loader.style.display = 'none';
        btn.disabled = false;
    }
};

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

    let html = `<div class="tr-q-box active"><div class="tr-q-text">${q.q || q.question || q.text || ''}</div>`;
    
    if (q.type === 'open') {
        html += `<textarea class="tr-textarea" id="tr-open-ans" placeholder="Напишіть вашу розгорнуту відповідь тут..."></textarea>`;
    } else {
        const inputType = q.type === 'multi' ? 'checkbox' : 'radio';
        let optionsToRender = q.options || q.answers || [];
        optionsToRender.forEach((opt, idx) => {
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
        
        let correctArr = Array.isArray(q.correct) ? q.correct : [q.correct];
        if (q.type === 'single') {
            isCorrect = answerData[0] === correctArr[0];
        } else if (q.type === 'multi') {
            isCorrect = answerData.length === correctArr.length && answerData.every(val => correctArr.includes(val));
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