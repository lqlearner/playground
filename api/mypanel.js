(function () {
    if (document.getElementById('myPromptPanel')) return;
  
    const promptsKey = 'myChatGPTPrompts';
    const savedPrompts = JSON.parse(localStorage.getItem(promptsKey) || '[]');
    const prompts = savedPrompts;
  
    const panel = document.createElement('div');
    panel.id = 'myPromptPanel';
    panel.style = `
      position: fixed;
      top: 0;
      right: 0;
      width: 20vw;
      height: 100vh;
      background: #f7f9fa;
      border-radius: 0;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      padding: 32px 24px 24px 24px;
      overflow-y: auto;
      z-index: 99999;
      font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
      font-size: 15px;
      color: #222;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;
  
    // --- Add hover effect CSS for all interactive elements ---
    const style = document.createElement('style');
    style.textContent = `
      #myPromptPanel button.icon-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        vertical-align: middle;
        border-radius: 4px;
        transition: background 0.15s;
      }
      #myPromptPanel button.icon-btn:hover {
        background: #e5e7eb;
      }
      #myPromptPanel button#closeBtn.icon-btn:hover {
        background: #fee2e2;
      }
      #myPromptPanel button.add-btn {
        background: #2563eb;
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 6px 16px;
        font-size: 15px;
        cursor: pointer;
        margin-bottom: 10px;
        transition: background 0.15s;
      }
      #myPromptPanel button.add-btn:hover {
        background: #1d4ed8;
      }
      #myPromptPanel input:focus, #myPromptPanel textarea:focus {
        outline: 2px solid #2563eb;
        outline-offset: 1px;
      }
    `;
    document.head.appendChild(style);
  
    function savePrompts() {
      const prompts = Array.from(panel.querySelectorAll('.prompt-item')).map(el => el.dataset.prompt);
      localStorage.setItem(promptsKey, JSON.stringify(prompts));
    }
  
    function createPromptItem(text) {
      const div = document.createElement('div');
      div.className = 'prompt-item';
      div.dataset.prompt = text;
      div.style = `
        background: #fff;
        border-radius: 8px;
        border: 1px solid #e0e4ea;
        margin-bottom: 10px;
        padding: 12px 12px 8px 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        display: flex;
        flex-direction: column;
        gap: 8px;
        transition: box-shadow 0.2s;
      `;
  
      // Prompt text (show max 3 lines, add ... if more)
      const promptText = document.createElement('div');
      const lines = text.split(/\r?\n/);
      let displayText = '';
      if (lines.length > 3) {
        displayText = lines.slice(0, 3).join('\n') + ' ...';
      } else {
        displayText = text;
      }
      promptText.textContent = displayText;
      promptText.style = `
        font-size: 15px;
        color: #333;
        white-space: pre-line;
        word-break: break-word;
        margin-bottom: 2px;
        max-height: 4.2em; /* 3 lines * 1.4em */
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      `;
      div.appendChild(promptText);
  
      // Button container (row)
      const btnRow = document.createElement('div');
      btnRow.style = "display:flex;gap:10px;align-items:center;margin-top:2px;";
  
      // Copy button (icon)
      const copyButton = document.createElement('button');
      copyButton.className = 'icon-btn';
      copyButton.title = "Copy";
      const copyIcon = document.createElement('img');
      copyIcon.src = "http://localhost:3000/copy.png";
      copyIcon.alt = "Copy";
      copyIcon.width = 16;
      copyIcon.height = 16;
      copyButton.appendChild(copyIcon);
      copyButton.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
      };
      btnRow.appendChild(copyButton);
  
      // Edit button (icon)
      const editButton = document.createElement('button');
      editButton.className = 'icon-btn';
      editButton.title = "Edit";
      const editIcon = document.createElement('img');
      editIcon.src = "http://localhost:3000/editing.png";
      editIcon.alt = "Edit";
      editIcon.width = 16;
      editIcon.height = 16;
      editButton.appendChild(editIcon);
      editButton.onclick = (e) => {
        e.stopPropagation();
        div.innerHTML = '';
        const editArea = document.createElement('textarea');
        editArea.value = text;
        editArea.rows = 4;
        editArea.maxLength = 100000; // Max allow 100k length content
        editArea.style = `
          width: 98%;
          margin-bottom: 8px;
          resize: none;
          overflow: auto;
          max-height: 80px;
          border-radius: 6px;
          border: 1px solid #e0e4ea;
          padding: 8px;
          font-size: 15px;
          font-family: inherit;
          line-height: 1.4;
          box-sizing: border-box;
        `;
        div.appendChild(editArea);
  
        // Button row for Save and Cancel
        const btnRow = document.createElement('div');
        btnRow.style = "display:flex;gap:8px;align-items:center;margin-bottom:4px;";
  
        // Save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'add-btn';
        saveButton.onclick = (ev) => {
          ev.stopPropagation();
          const newText = editArea.value.trim();
          if (newText) {
            div.dataset.prompt = newText;
            div.innerHTML = '';
            promptText.textContent = newText;
            div.appendChild(promptText);
            div.appendChild(btnRowOrig); // btnRowOrig is the original row with icons
            savePrompts();
  
            // --- Refresh the prompt list to reflect the latest data ---
            list.innerHTML = '';
            const updatedPrompts = JSON.parse(localStorage.getItem(promptsKey) || '[]');
            updatedPrompts.forEach(p => list.appendChild(createPromptItem(p)));
          }
        };
        btnRow.appendChild(saveButton);
  
        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        // Use same style and color as save button
        cancelButton.className = 'add-btn';
        cancelButton.style.marginLeft = '8px';
        cancelButton.onclick = (ev) => {
          ev.stopPropagation();
          div.innerHTML = '';
          div.appendChild(promptText);
          div.appendChild(btnRowOrig);
        };
        btnRow.appendChild(cancelButton);
  
        div.appendChild(btnRow);
  
        // Save reference to original icon row for restoring after cancel/save
        const btnRowOrig = document.createElement('div');
        btnRowOrig.style = "display:flex;gap:10px;align-items:center;margin-top:2px;";
        btnRowOrig.appendChild(copyButton);
        btnRowOrig.appendChild(editButton);
        btnRowOrig.appendChild(deleteButton);
  
        editArea.focus();
      };
      btnRow.appendChild(editButton);
  
      // Delete button (icon)
      const deleteButton = document.createElement('button');
      deleteButton.className = 'icon-btn';
      deleteButton.title = "Delete";
      const deleteIcon = document.createElement('img');
      deleteIcon.src = "http://localhost:3000/delete.png";
      deleteIcon.alt = "Delete";
      deleteIcon.width = 16;
      deleteIcon.height = 16;
      deleteButton.appendChild(deleteIcon);
      deleteButton.onclick = (e) => {
        e.stopPropagation();
        if (confirm('Are you sure to delete this prompt?')) {
          div.remove();
          savePrompts();
        }
      };
      btnRow.appendChild(deleteButton);
  
      div.appendChild(btnRow);
  
      return div;
    }
  
    // Title area
    const title = document.createElement('div');
  
    // Title text
    const titleLabel = document.createElement('b');
    titleLabel.textContent = '📋 Prompt Tool';
    titleLabel.style.fontSize = '18px';
    titleLabel.style.color = '#2563eb';
  
    // Close button (icon)
    const closeBtn = document.createElement('button');
    closeBtn.id = 'closeBtn';
    closeBtn.title = 'Close';
    closeBtn.className = 'icon-btn';
    closeBtn.style.cssText += `
      float:right;
      margin-left:8px;
      display:flex;
      align-items:center;
    `;
    const closeIcon = document.createElement('img');
    closeIcon.src = "http://localhost:3000/close.png";
    closeIcon.alt = "Close";
    closeIcon.width = 16;
    closeIcon.height = 16;
    closeBtn.appendChild(closeIcon);
  
    // Description
    const description = document.createElement('p');
    description.textContent = 'Manage your prompts. Copy, edit, or delete as needed.';
    description.style.cssText = `
      font-size:13px;
      color:#666;
      margin-top:8px;
    `;
  
    // Append all parts safely
    title.appendChild(titleLabel);
    title.appendChild(closeBtn);
    title.appendChild(description);
  
    // --- Add New Prompt Button ---
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.style.width = '100%';
    addBtn.style.display = 'flex';
    addBtn.style.alignItems = 'center';
    addBtn.style.justifyContent = 'center';
    addBtn.style.gap = '0px';
    addBtn.style.margin = '4px 0 4px 0';
    addBtn.style.fontWeight = 'bold';
  
    // Icon
   // const addIcon = document.createElement('img');
   // addIcon.src = "http://localhost:3000/add.png";
   // addIcon.alt = "Add";
   // addIcon.width = 20;
   // addIcon.height = 20;
   // addBtn.appendChild(addIcon);
  
    // Text
    const addText = document.createElement('span');
    addText.textContent = "Add New Prompt";
    addBtn.appendChild(addText);
  
    let addTextarea = null;
    addText.style.cursor = "pointer";
    addText.onclick = (e) => {
      e.stopPropagation();
      // Prevent multiple textareas
      if (addTextarea) return;
      addTextarea = document.createElement('textarea');
      addTextarea.rows = 3; // Set rows to 3 for 3 lines
      addTextarea.maxLength = 100000;
      addTextarea.style = `
        width: 98%;
        margin: 10px 0 4px 0;
        resize: none;
        overflow: auto;
        min-height: 4.2em; /* 3 lines * 1.4em */
        height: 4.2em;
        max-height: 80px;
        border-radius: 6px;
        border: 1px solid #e0e4ea;
        padding: 8px;
        font-size: 15px;
        font-family: inherit;
        line-height: 1.4;
        box-sizing: border-box;
        display: block;
      `;
  
      // Button row for Save and Cancel (same line)
      const btnRow = document.createElement('div');
      btnRow.style = "display:flex;gap:8px;align-items:center;margin-bottom:8px;";
  
      // Save button for new prompt
      const saveNewBtn = document.createElement('button');
      saveNewBtn.textContent = 'Save';
      saveNewBtn.className = 'add-btn';
      saveNewBtn.onclick = (ev) => {
        ev.stopPropagation();
        const val = addTextarea.value.trim();
        if (val) {
          const item = createPromptItem(val);
          list.appendChild(item);
          savePrompts();
          addTextarea.remove();
          btnRow.remove();
          addTextarea = null;
        }
      };
  
      // Cancel button for new prompt
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.className = 'add-btn';
      cancelBtn.style.marginLeft = '8px';
      cancelBtn.onclick = (ev) => {
        ev.stopPropagation();
        addTextarea.remove();
        btnRow.remove();
        addTextarea = null;
      };
  
      btnRow.appendChild(saveNewBtn);
      btnRow.appendChild(cancelBtn);
  
      // Insert textarea and button row after addBtn
      addBtn.insertAdjacentElement('afterend', addTextarea);
      addTextarea.insertAdjacentElement('afterend', btnRow);
      addTextarea.focus();
    };
  
    const list = document.createElement('div');
    prompts.forEach(p => list.appendChild(createPromptItem(p)));
  
    panel.appendChild(title);
    panel.appendChild(addBtn);
    panel.appendChild(list);
    document.body.appendChild(panel);
  
    closeBtn.onclick = () => {
      if (panel.parentNode) {
        panel.parentNode.removeChild(panel);
      }
    };
  })();