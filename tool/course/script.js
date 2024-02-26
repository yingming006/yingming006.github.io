document.addEventListener('DOMContentLoaded', function() {
    let draggedElement = null;
    let placeholder = document.createElement('div');
    placeholder.className = 'placeholder';

    // 处理课程方块的拖动事件
    const coursesContainer = document.getElementById('courses');
    coursesContainer.addEventListener('dragstart', function(e) {
        if (e.target.className.includes('course')) {
            draggedElement = e.target;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', null); // 对于Firefox，需要设置数据
            setTimeout(() => e.target.classList.add('hide'), 0);
        }
    });

    coursesContainer.addEventListener('dragend', function(e) {
        e.target.classList.remove('hide');
        draggedElement = null;
        coursesContainer.querySelectorAll('.placeholder').forEach(e => e.remove());
    });

    coursesContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        if (draggedElement) {
            const afterElement = getDragAfterElement(coursesContainer, e.clientY);
            if (afterElement == null) {
                coursesContainer.appendChild(placeholder);
            } else {
                coursesContainer.insertBefore(placeholder, afterElement);
            }
        }
    });

    coursesContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedElement) {
            coursesContainer.insertBefore(draggedElement, placeholder);
            placeholder.remove();
        }
    });

    // 处理放置到表格的逻辑
    document.querySelectorAll('#schedule td').forEach(cell => {
        cell.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        cell.addEventListener('drop', function(e) {
            e.preventDefault();
            const data = e.dataTransfer.getData('text');
            if (draggedElement) {
                const clonedElement = draggedElement.cloneNode(true);
                clonedElement.classList.remove('hide');
                this.appendChild(clonedElement);
            }
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.course:not(.hide)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
