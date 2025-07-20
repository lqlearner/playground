(function () {
    if (document.getElementById('myPromptPanel')) return;
  
    const promptsKey = 'myChatGPTPrompts';
    const savedPrompts = JSON.parse(localStorage.getItem(promptsKey) || '[]');
  
    const defaultPrompts = [
      '请将以下内容翻译成简体中文，并保留段落结构。',
      '你是一名简洁明了的分析师，请总结以下内容为关键要点。',
      '请使用财务分析视角评价以下公司表现。'
    ];
  
    const prompts = savedPrompts.length ? savedPrompts : defaultPrompts;
  
    const panel = document.createElement('div');
    panel.id = 'myPromptPanel';
    panel.style = `
      position: fixed;
      top: 0;
      right: 0;
      width: 280px;
      height: 100vh;
      background: #fff;
      border-left: 1px solid #ccc;
      box-shadow: -2px 0 5px rgba(0,0,0,0.1);
      padding: 10px;
      overflow-y: auto;
      z-index: 99999;
      font-family: sans-serif;
      font-size: 14px;
    `;
  
    function savePrompts() {
      const prompts = Array.from(panel.querySelectorAll('.prompt-item')).map(el => el.dataset.prompt);
      localStorage.setItem(promptsKey, JSON.stringify(prompts));
    }
  
    function fillInput(text) {
      const textarea = document.querySelector('textarea');
      if (!textarea) {
        alert('找不到输入框！请确认你在 ChatGPT 页面上。');
        return;
      }
      textarea.focus();
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  
    function createPromptItem(text) {
      const div = document.createElement('div');
      div.className = 'prompt-item';
      div.dataset.prompt = text;
      div.style = 'cursor:pointer;margin-bottom:6px;padding:6px;border:1px solid #aaa;background:#f9f9f9;';
      div.textContent = text;
      div.title = '点击插入 ChatGPT 输入框';
  
      div.onclick = () => fillInput(text);
  
      div.oncontextmenu = (e) => {
        e.preventDefault();
        if (confirm('是否删除此提示词？')) {
          div.remove();
          savePrompts();
        }
      };
  
      return div;
    }
  
    const title = document.createElement('div');
    title.innerHTML = `
      <b>📋 提示词工具</b>
      <button style="float:right;" id="closeBtn">❌</button>
      <p style="font-size:12px;color:#666;">点击填入，右键删除</p>
    `;
  
    const input = document.createElement('input');
    input.placeholder = '输入新提示词，回车添加';
    input.style = 'width:100%;margin-bottom:10px;padding:6px;border:1px solid #ccc;';
    input.onkeydown = (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        const item = createPromptItem(input.value.trim());
        list.appendChild(item);
        savePrompts();
        input.value = '';
      }
    };
  
    const list = document.createElement('div');
    prompts.forEach(p => list.appendChild(createPromptItem(p)));
  
    panel.appendChild(title);
    panel.appendChild(input);
    panel.appendChild(list);
    document.body.appendChild(panel);
  
    document.getElementById('closeBtn').onclick = () => panel.remove();
  })();
  