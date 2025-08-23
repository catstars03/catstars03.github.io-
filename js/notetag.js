// js/notetag.js
// 获取所有标签
function getCategories() {
    const categories = [];
    notes.forEach(note => {
        if (!categories.includes(note.category)) {
            categories.push(note.category);
        }
    });
    return categories;
}

// 计算每个标签的笔记数量
function getCategoryCount(category) {
    if (category === 'all') {
        return notes.length;
    }
    return notes.filter(note => note.category === category).length;
}

// 渲染标签
function renderTags() {
    const tagContainer = document.getElementById('filterTags');
    const categories = getCategories();
    let html = '<span class="tag active" data-category="all">全部笔记 <span class="tag-count">' + getCategoryCount('all') + '</span></span>';
    
    categories.forEach(category => {
        html += `<span class="tag" data-category="${category}">${category} <span class="tag-count">${getCategoryCount(category)}</span></span>`;
    });
    
    // 替换除了第一个标签外的内容
    tagContainer.innerHTML = html;
    
    // 添加点击事件
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            // 更新活动状态
            document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选笔记
            const category = this.getAttribute('data-category');
            filterNotes(category);
        });
    });
}

// 筛选笔记
function filterNotes(category) {
    const filteredNotes = category === 'all' ? notes : notes.filter(note => note.category === category);
    renderNotes(filteredNotes);
}

// 渲染笔记卡片
function renderNotes(notesToRender) {
    const container = document.getElementById('notesContainer');
    let html = '';
    
    notesToRender.forEach(note => {
        // 处理内容和评论中的换行符
        const formattedContent = note.content.replace(/\n/g, '<br>');
        
        html += `
            <div class="note-card">
                <div class="note-header" onclick="toggleOutline(${note.id})">
                    <h3 class="note-title">${note.title}</h3>
                    <div class="note-subtitle">${note.subtitle}</div>
                    <div class="note-meta">
                        <span class="mr-3"><i class="far fa-calendar-alt mr-1"></i> ${note.date}</span>
                        <span><i class="fas fa-tag mr-1"></i> ${note.category}</span>
                    </div>
                    <div class="toggle-icon" id="toggleIcon${note.id}">▼</div>
                </div>
                <div class="note-content" id="noteContent${note.id}">
                    <p>${formattedContent}</p>
                </div>
                <div class="note-outline" id="noteOutline${note.id}">
                    ${note.outline.map(item => {
                        // 处理大纲项评论中的换行符
                        const formattedComment = item.comment.replace(/\n/g, '<br>');
                        return `
                            <div class="outline-item">
                                <a href="note/${note.id}/${encodeURIComponent(item.title)}.pdf" class="outline-link" download>
                                    ${item.title}
                                    <button class="download-btn float-right">下载</button>
                                </a>
                                <div class="outline-comment">${formattedComment}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 切换显示目录
function toggleOutline(noteId) {
    const contentElement = document.getElementById(`noteContent${noteId}`);
    const outlineElement = document.getElementById(`noteOutline${noteId}`);
    const iconElement = document.getElementById(`toggleIcon${noteId}`);
    
    if (outlineElement.style.display === 'block') {
        outlineElement.style.display = 'none';
        contentElement.style.display = 'block';
        iconElement.classList.remove('rotated');
    } else {
        outlineElement.style.display = 'block';
        contentElement.style.display = 'none';
        iconElement.classList.add('rotated');
    }
}

// 真实下载功能
function downloadNote(noteId, title) {
    // 构造下载链接
    const filename = encodeURIComponent(title);
    const url = `note/${noteId}/${filename}.pdf`;
    
    // 创建一个隐藏的iframe来触发下载
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    // 一段时间后移除iframe
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 1000);
}

// 页面加载完成后渲染笔记和标签
document.addEventListener('DOMContentLoaded', function() {
    renderTags();
    renderNotes(notes);
});