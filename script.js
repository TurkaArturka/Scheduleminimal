(function() {
    // ---------- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ПРЕОБРАЗОВАНИЯ СТРОК В ОБЪЕКТЫ ----------
    function parseLegacyLesson(lessonString) {
        if (!lessonString || lessonString === '—') {
            return { subject: '', teacher: '', room: '' };
        }
        // Пытаемся выделить предмет и аудиторию по шаблону " - ауд. "
        const match = lessonString.match(/^(.*?)\s*-\s*ауд\.?\s*(.*)$/i);
        if (match) {
            return {
                subject: match[1].trim(),
                teacher: '',
                room: 'ауд. ' + match[2].trim()
            };
        }
        // Если нет тире, вся строка считается предметом
        return {
            subject: lessonString.trim(),
            teacher: '',
            room: ''
        };
    }

    // ---------- ПРЕОБРАЗОВАНИЕ ВСЕХ ИСХОДНЫХ ДАННЫХ В НОВЫЙ ФОРМАТ ----------
    function convertLegacyData(data) {
        const newData = {};
        for (const course in data) {
            newData[course] = {};
            for (const group in data[course]) {
                const groupObj = data[course][group];
                const days = groupObj.days;
                const oldLessons = groupObj.lessons;
                const newLessons = {};
                days.forEach(day => {
                    const dayArray = oldLessons[day] || [];
                    newLessons[day] = dayArray.map(lesson => parseLegacyLesson(lesson));
                });
                newData[course][group] = {
                    days: days.slice(),
                    lessons: newLessons
                };
            }
        }
        return newData;
    }

    // ---------- ИСХОДНЫЕ ДАННЫЕ (СТАРЫЙ ФОРМАТ) ----------
    const scheduleDataOriginalRaw = {
        1: { // 1 курс
            'КИО-25-9': {
                days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                lessons: {
                    'Понедельник': ['Физика - ауд. 54', 'Иностранный язык - ауд. 54', 'Химия - ауд. 64', 'История - ауд. 54'],
                    'Вторник': ['', '', 'ОБЗР - ауд. 63', 'География - ауд. 64'],
                    'Среда': ['Русский язык - ауд. 52', 'Обществознание ауд. 43 ', '', ''],
                    'Четверг': ['Математика - ауд. 54', 'Литература - ауд. 213', 'Информатика - ауд. 75', 'Информатика - ауд. 75'],
                    'Пятница': ['Химия - ауд. 64', 'Математика - ауд. 54', '', '']
                }
            },
            'КТО-25-9': {
                days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                lessons: {
                    'Понедельник': ['', '', '', ''],
                    'Вторник': ['', '', '', ''],
                    'Среда': ['', '', '', ''],
                    'Четверг': ['', '', '', ''],
                    'Пятница': ['', '', '', ''],
                    'Суббота': ['', '', '', '']
                }
            },
            'КЭО-25-9': {
                days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                lessons: {
                    'Понедельник': ['', '', '', ''],
                    'Вторник': ['', '', '', ''],
                    'Среда': ['', '', '', ''],
                    'Четверг': ['', '', '', ''],
                    'Пятница': ['', '', '', ''],
                    'Суббота': ['', '', '', '']
                }
            }
        },
        2: { // 2 курс
            'КИО-24-9': {
                days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                lessons: {
                    'Понедельник': ['', '', '', ''],
                    'Вторник': ['', '', '', ''],
                    'Среда': ['', '', '', ''],
                    'Четверг': ['', '', '', ''],
                    'Пятница': ['', '', '', ''],
                    'Суббота': ['', '', '', '']
                }
            },
            'КТО-24-9': {
                days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                lessons: {
                    'Понедельник': ['', '', '', ''],
                    'Вторник': ['', '', '', ''],
                    'Среда': ['', '', '', ''],
                    'Четверг': ['', '', '', ''],
                    'Пятница': ['', '', '', ''],
                    'Суббота': ['', '', '', '']
                }
            }
        },
        3: { // 3 курс
            'КИО-23-9': {
                days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                lessons: {
                    'Понедельник': ['', '', '', ''],
                    'Вторник': ['', '', '', ''],
                    'Среда': ['', '', '', ''],
                    'Четверг': ['', '', '', ''],
                    'Пятница': ['', '', '', ''],
                    'Суббота': ['', '', '', '']
                }
            },
            'КТО-23-9': {
                days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                lessons: {
                    'Понедельник': ['', '', '', ''],
                    'Вторник': ['', '', '', ''],
                    'Среда': ['', '', '', ''],
                    'Четверг': ['', '', '', ''],
                    'Пятница': ['', '', '', ''],
                    'Суббота': ['', '', '', '']
                }
            }
        },
        4: { // 4 курс
            'КИО-22-9': {
                days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                lessons: {
                    'Понедельник': ['', '', '', ''],
                    'Вторник': ['', '', '', ''],
                    'Среда': ['', '', '', ''],
                    'Четверг': ['', '', '', ''],
                    'Пятница': ['', '', '', ''],
                    'Суббота': ['', '', '', '']
                }
            }
        }
    };

    // Преобразованный оригинал (для сброса)
    const scheduleDataOriginal = convertLegacyData(scheduleDataOriginalRaw);

    // Рабочая копия данных
    let scheduleData = JSON.parse(JSON.stringify(scheduleDataOriginal));

    // Состояние
    let currentCourse = '1';
    let currentGroup = 'КИО-25-9';
    let weekOffset = 0;
    let isAdmin = false;

    // DOM-элементы
    const courseBtns = document.querySelectorAll('.course-btn');
    const groupTabs = document.getElementById('groupTabs');
    const scheduleBody = document.getElementById('scheduleBody');
    const weekDisplay = document.getElementById('weekDisplay');
    const todaySpan = document.getElementById('todayDisplay');
    const headerActions = document.getElementById('headerActions');
    const loginToggle = document.getElementById('loginToggle');
    const modalOverlay = document.getElementById('modalOverlay');
    const cancelModal = document.getElementById('cancelModal');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    const adminGroupPanel = document.getElementById('adminGroupPanel');
    const adminScheduleActions = document.getElementById('adminScheduleActions');
    const editModal = document.getElementById('editModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const editForm = document.getElementById('editForm');
    // Новые поля редактирования
    const editSubject = document.getElementById('editSubject');
    const editTeacher = document.getElementById('editTeacher');
    const editRoom = document.getElementById('editRoom');

    // Новые модальные окна
    const addGroupModal = document.getElementById('addGroupModal');
    const renameGroupModal = document.getElementById('renameGroupModal');
    const deleteGroupModal = document.getElementById('deleteGroupModal');
    const removeLessonModal = document.getElementById('removeLessonModal');
    const resetChangesModal = document.getElementById('resetChangesModal');
    const infoModal = document.getElementById('infoModal');

    // Элементы внутри новых модалок
    const newGroupNameInput = document.getElementById('newGroupName');
    const cancelAddGroup = document.getElementById('cancelAddGroup');
    const submitAddGroup = document.getElementById('submitAddGroup');

    const renameGroupNameInput = document.getElementById('renameGroupName');
    const cancelRenameGroup = document.getElementById('cancelRenameGroup');
    const submitRenameGroup = document.getElementById('submitRenameGroup');

    const deleteGroupText = document.getElementById('deleteGroupText');
    const cancelDeleteGroup = document.getElementById('cancelDeleteGroup');
    const confirmDeleteGroup = document.getElementById('confirmDeleteGroup');

    const cancelRemoveLesson = document.getElementById('cancelRemoveLesson');
    const confirmRemoveLesson = document.getElementById('confirmRemoveLesson');

    const cancelReset = document.getElementById('cancelReset');
    const confirmReset = document.getElementById('confirmReset');

    const infoMessage = document.getElementById('infoMessage');
    const closeInfoModal = document.getElementById('closeInfoModal');

    // Переменная для хранения редактируемой ячейки
    let currentEditCell = null; // { course, group, day, lessonIndex }

    // Сегодняшняя дата
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    todaySpan.textContent = `📅 ${today.toLocaleDateString('ru-RU', options)}`;

    // ---------- ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ВРЕМЕНИ ПАРЫ ПО ИНДЕКСУ ----------
    function getLessonTime(index) {
        const startMinutes = 540 + index * 90; // 9:00 = 540 минут, каждая пара +90 мин (80 мин пара + 10 перерыв)
        const endMinutes = startMinutes + 80;
        const startHour = Math.floor(startMinutes / 60);
        const startMin = startMinutes % 60;
        const endHour = Math.floor(endMinutes / 60);
        const endMin = endMinutes % 60;
        const startStr = `${startHour}:${startMin.toString().padStart(2, '0')}`;
        const endStr = `${endHour}:${endMin.toString().padStart(2, '0')}`;
        const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        const num = index + 1;
        const romanNum = roman[index] || num; // для больших индексов используем число
        return `${romanNum} пара<br>${startStr}–${endStr}`;
    }

    // ---------- ФУНКЦИЯ ПОСТРОЕНИЯ ГЛОБАЛЬНОЙ КАРТЫ КОНФЛИКТОВ ----------
    function buildGlobalConflictMap() {
        const map = {}; // ключ: `${day}_${lessonIndex}_${room}`, значение: массив { course, group }

        for (const course in scheduleData) {
            const courseData = scheduleData[course];
            if (!courseData) continue;
            for (const group in courseData) {
                const groupData = courseData[group];
                if (!groupData) continue;
                const days = groupData.days;
                const lessons = groupData.lessons;
                days.forEach(day => {
                    const dayLessons = lessons[day] || [];
                    dayLessons.forEach((lesson, idx) => {
                        const room = lesson.room ? lesson.room.trim() : '';
                        if (room === '') return; // пустая аудитория не участвует
                        const key = `${day}_${idx}_${room.toLowerCase()}`;
                        if (!map[key]) map[key] = [];
                        map[key].push({ course, group });
                    });
                });
            }
        }
        return map;
    }

    // ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ МОДАЛОК ----------
    function openModal(modalElement) {
        modalElement.classList.add('show');
        document.body.classList.add('modal-open');
    }

    function closeModal(modalElement) {
        modalElement.classList.remove('show');
        // Если нет других открытых модалок, убираем блокировку прокрутки
        if (!document.querySelector('.modal-overlay.show')) {
            document.body.classList.remove('modal-open');
        }
    }

    function showInfoMessage(msg) {
        infoMessage.textContent = msg;
        openModal(infoModal);
    }

    // Закрытие по Escape (глобальный обработчик)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal-overlay.show');
            if (openModals.length) {
                closeModal(openModals[openModals.length - 1]);
            }
        }
    });

    // ---------- ФУНКЦИИ ОТКРЫТИЯ КОНКРЕТНЫХ МОДАЛОК ----------
    function openAddGroupModal() {
        newGroupNameInput.value = '';
        openModal(addGroupModal);
        setTimeout(() => newGroupNameInput.focus(), 50);
    }

    function openRenameGroupModal() {
        renameGroupNameInput.value = currentGroup;
        openModal(renameGroupModal);
        setTimeout(() => renameGroupNameInput.focus(), 50);
    }

    function openDeleteGroupModal() {
        deleteGroupText.textContent = `Удалить группу ${currentGroup}? Действие необратимо.`;
        openModal(deleteGroupModal);
    }

    function openRemoveLessonModal() {
        openModal(removeLessonModal);
    }

    function openResetChangesModal() {
        openModal(resetChangesModal);
    }

    // ---------- ОБРАБОТЧИКИ ДЛЯ НОВЫХ МОДАЛОК ----------
    // Добавление группы
    cancelAddGroup.addEventListener('click', () => closeModal(addGroupModal));
    addGroupModal.addEventListener('click', (e) => { if (e.target === addGroupModal) closeModal(addGroupModal); });

    submitAddGroup.addEventListener('click', (e) => {
        e.preventDefault();
        const newName = newGroupNameInput.value.trim();
        if (!newName) {
            showInfoMessage('Название группы не может быть пустым');
            return;
        }
        if (!scheduleData[currentCourse]) scheduleData[currentCourse] = {};
        if (scheduleData[currentCourse][newName]) {
            showInfoMessage('Группа с таким названием уже существует');
            return;
        }
        // Создание группы (массивы объектов)
        const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const lessons = {};
        days.forEach(day => {
            lessons[day] = Array(4).fill().map(() => ({ subject: '', teacher: '', room: '' }));
        });
        scheduleData[currentCourse][newName] = { days, lessons };
        updateGroupTabs();
        currentGroup = newName;
        renderSchedule();
        closeModal(addGroupModal);
    });

    // Переименование группы
    cancelRenameGroup.addEventListener('click', () => closeModal(renameGroupModal));
    renameGroupModal.addEventListener('click', (e) => { if (e.target === renameGroupModal) closeModal(renameGroupModal); });

    submitRenameGroup.addEventListener('click', (e) => {
        e.preventDefault();
        const newName = renameGroupNameInput.value.trim();
        if (!newName) {
            showInfoMessage('Название группы не может быть пустым');
            return;
        }
        if (newName === currentGroup) {
            closeModal(renameGroupModal);
            return;
        }
        if (scheduleData[currentCourse][newName]) {
            showInfoMessage('Группа с таким названием уже существует');
            return;
        }
        // Переименование
        scheduleData[currentCourse][newName] = scheduleData[currentCourse][currentGroup];
        delete scheduleData[currentCourse][currentGroup];
        currentGroup = newName;
        updateGroupTabs();
        renderSchedule();
        closeModal(renameGroupModal);
    });

    // Удаление группы
    cancelDeleteGroup.addEventListener('click', () => closeModal(deleteGroupModal));
    deleteGroupModal.addEventListener('click', (e) => { if (e.target === deleteGroupModal) closeModal(deleteGroupModal); });

    confirmDeleteGroup.addEventListener('click', () => {
        delete scheduleData[currentCourse][currentGroup];
        const groups = Object.keys(scheduleData[currentCourse]);
        if (groups.length === 0) {
            // Создаём пустую группу по умолчанию
            const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
            const lessons = {};
            days.forEach(day => {
                lessons[day] = Array(4).fill().map(() => ({ subject: '', teacher: '', room: '' }));
            });
            scheduleData[currentCourse]['Новая группа'] = { days, lessons };
        }
        currentGroup = Object.keys(scheduleData[currentCourse])[0];
        updateGroupTabs();
        renderSchedule();
        closeModal(deleteGroupModal);
    });

    // Удаление последней пары
    cancelRemoveLesson.addEventListener('click', () => closeModal(removeLessonModal));
    removeLessonModal.addEventListener('click', (e) => { if (e.target === removeLessonModal) closeModal(removeLessonModal); });

    confirmRemoveLesson.addEventListener('click', () => {
        const groupData = scheduleData[currentCourse]?.[currentGroup];
        if (!groupData) return;
        const days = groupData.days;
        if (days.length > 0 && groupData.lessons[days[0]] && groupData.lessons[days[0]].length > 0) {
            days.forEach(day => {
                if (groupData.lessons[day] && groupData.lessons[day].length > 0) {
                    groupData.lessons[day].pop();
                }
            });
        }
        renderSchedule();
        closeModal(removeLessonModal);
    });

    // Сброс изменений
    cancelReset.addEventListener('click', () => closeModal(resetChangesModal));
    resetChangesModal.addEventListener('click', (e) => { if (e.target === resetChangesModal) closeModal(resetChangesModal); });

    confirmReset.addEventListener('click', () => {
        scheduleData = JSON.parse(JSON.stringify(scheduleDataOriginal));
        updateGroupTabs();
        renderSchedule();
        closeModal(resetChangesModal);
    });

    // Информационное окно
    closeInfoModal.addEventListener('click', () => closeModal(infoModal));
    infoModal.addEventListener('click', (e) => { if (e.target === infoModal) closeModal(infoModal); });

    // ---------- ОБРАБОТЧИКИ КНОПОК УПРАВЛЕНИЯ РАСПИСАНИЕМ ----------
    // Функция для замены кнопок (чтобы гарантированно убрать старые обработчики)
    function replaceButton(btnId, newHandler) {
        const oldBtn = document.getElementById(btnId);
        if (!oldBtn) return null;
        const newBtn = oldBtn.cloneNode(true);
        oldBtn.parentNode.replaceChild(newBtn, oldBtn);
        newBtn.addEventListener('click', newHandler);
        return newBtn;
    }

    // Добавление пары
    replaceButton('addLessonBtn', (e) => {
        e.preventDefault();
        const groupData = scheduleData[currentCourse]?.[currentGroup];
        if (!groupData) return;
        const days = groupData.days;
        days.forEach(day => {
            if (!groupData.lessons[day]) groupData.lessons[day] = [];
            groupData.lessons[day].push({ subject: '', teacher: '', room: '' });
        });
        renderSchedule();
    });

    // Удаление последней пары
    replaceButton('removeLessonBtn', (e) => {
        e.preventDefault();
        const groupData = scheduleData[currentCourse]?.[currentGroup];
        if (!groupData) return;
        const days = groupData.days;
        if (days.length === 0 || !groupData.lessons[days[0]] || groupData.lessons[days[0]].length === 0) {
            showInfoMessage('Нет пар для удаления');
            return;
        }
        openRemoveLessonModal();
    });

    // Сброс
    replaceButton('resetChangesBtn', (e) => {
        e.preventDefault();
        openResetChangesModal();
    });

    // Сохранение (обработчик будет переопределён позже, но здесь оставляем как есть)
    // Управление группами (аналогично)
    replaceButton('addGroupBtn', (e) => {
        e.preventDefault();
        openAddGroupModal();
    });

    replaceButton('renameGroupBtn', (e) => {
        e.preventDefault();
        openRenameGroupModal();
    });

    replaceButton('deleteGroupBtn', (e) => {
        e.preventDefault();
        openDeleteGroupModal();
    });

    // ---------- ОСТАЛЬНЫЕ ФУНКЦИИ ----------
    function updateGroupTabs() {
        const groups = Object.keys(scheduleData[currentCourse] || {});
        if (groups.length === 0) {
            // Создаём группу по умолчанию с пустыми объектами
            const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
            const lessons = {};
            days.forEach(day => {
                lessons[day] = Array(4).fill().map(() => ({ subject: '', teacher: '', room: '' }));
            });
            scheduleData[currentCourse] = { 'Новая группа': { days, lessons } };
        }

        const updatedGroups = Object.keys(scheduleData[currentCourse]);
        if (!updatedGroups.includes(currentGroup)) {
            currentGroup = updatedGroups[0];
        }

        let html = '';
        updatedGroups.forEach(group => {
            html += `<button class="group-btn ${group === currentGroup ? 'active-group' : ''}" data-group="${group}">${group}</button>`;
        });
        groupTabs.innerHTML = html;

        document.querySelectorAll('.group-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.group-btn').forEach(b => b.classList.remove('active-group'));
                btn.classList.add('active-group');
                currentGroup = btn.dataset.group;
                renderSchedule();
            });
        });
    }

    function renderSchedule() {
        const courseData = scheduleData[currentCourse];
        if (!courseData) return;

        const groupData = courseData[currentGroup];
        if (!groupData) return;

        const days = groupData.days; // всегда 6 дней
        const lessons = groupData.lessons;

        // Определяем максимальное количество пар среди всех дней
        let maxLessons = 0;
        days.forEach(day => {
            if (lessons[day] && lessons[day].length > maxLessons) {
                maxLessons = lessons[day].length;
            }
        });

        // Построение глобальной карты конфликтов
        const globalConflictMap = buildGlobalConflictMap();

        let rows = '';
        for (let i = 0; i < maxLessons; i++) {
            const timeStr = getLessonTime(i);
            rows += '<tr>';
            rows += `<td class="time-col">${timeStr}</td>`;

            days.forEach(day => {
                const lesson = (lessons[day] && lessons[day][i]) || { subject: '', teacher: '', room: '' };
                const hasContent = lesson.subject || lesson.teacher || lesson.room;

                // Проверка на конфликт с использованием глобальной карты
                let isConflict = false;
                if (isAdmin) {
                    const room = lesson.room ? lesson.room.trim() : '';
                    if (room !== '') {
                        const key = `${day}_${i}_${room.toLowerCase()}`;
                        const conflictGroups = globalConflictMap[key];
                        if (conflictGroups && conflictGroups.length > 1) {
                            // Определяем, есть ли среди групп разные курсы
                            const uniqueCourses = new Set(conflictGroups.map(item => item.course));
                            if (uniqueCourses.size > 1) {
                                // Конфликт между курсами: проверяем, входит ли текущая группа
                                const currentInConflict = conflictGroups.some(item => item.course === currentCourse && item.group === currentGroup);
                                if (currentInConflict) {
                                    isConflict = true;
                                }
                            }
                        }
                    }
                }

                const classNames = ['lesson-cell'];
                if (isAdmin) classNames.push('editable-cell');
                if (isConflict) classNames.push('conflict-cell');
                const className = classNames.join(' ');

                if (!hasContent) {
                    rows += `<td class="${className}" data-course="${currentCourse}" data-group="${currentGroup}" data-day="${day}" data-lesson-index="${i}"><span class="subject">—</span></td>`;
                } else {
                    const subject = lesson.subject ? `<span class="subject">${lesson.subject}</span>` : '';
                    const teacher = lesson.teacher ? `<div class="teacher">${lesson.teacher}</div>` : '';
                    const roomDiv = lesson.room ? `<div class="room">${lesson.room}</div>` : '';
                    rows += `<td class="${className}" data-course="${currentCourse}" data-group="${currentGroup}" data-day="${day}" data-lesson-index="${i}">${subject}${teacher}${roomDiv}</td>`;
                }
            });

            rows += '</tr>';
        }

        scheduleBody.innerHTML = rows;

        if (isAdmin) {
            document.querySelectorAll('.lesson-cell').forEach(cell => {
                cell.addEventListener('click', (e) => {
                    openEditModal(cell);
                });
            });
        }

        // Обновление состояния кнопки сохранения (предупреждение удалено)
        const conflictCells = document.querySelectorAll('.conflict-cell');
        const hasConflicts = conflictCells.length > 0;
        const saveBtn = document.getElementById('saveChangesBtn');
        if (saveBtn) {
            saveBtn.disabled = hasConflicts;
        }

        const weekStr = weekOffset === 0 ? '🗓 Текущая неделя' : (weekOffset > 0 ? `🗓 +${weekOffset} нед.` : `🗓 ${weekOffset} нед.`);
        weekDisplay.textContent = weekStr;
    }

    function openEditModal(cell) {
        const course = cell.dataset.course;
        const group = cell.dataset.group;
        const day = cell.dataset.day;
        const lessonIndex = parseInt(cell.dataset.lessonIndex);
        const lesson = scheduleData[course]?.[group]?.lessons?.[day]?.[lessonIndex] || { subject: '', teacher: '', room: '' };
        currentEditCell = { course, group, day, lessonIndex };
        editSubject.value = lesson.subject || '';
        editTeacher.value = lesson.teacher || '';
        // Если аудитория пустая, предзаполняем "ауд. "
        editRoom.value = lesson.room ? lesson.room : 'ауд. ';
        openModal(editModal);
        setTimeout(() => editSubject.focus(), 50);
    }

    // Закрытие editModal
    cancelEdit.addEventListener('click', () => closeModal(editModal));
    editModal.addEventListener('click', (e) => { if (e.target === editModal) closeModal(editModal); });
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentEditCell) return;
        const { course, group, day, lessonIndex } = currentEditCell;
        const newLesson = {
            subject: editSubject.value.trim(),
            teacher: editTeacher.value.trim(),
            room: editRoom.value.trim()
        };
        if (scheduleData[course] && scheduleData[course][group] && scheduleData[course][group].lessons[day]) {
            scheduleData[course][group].lessons[day][lessonIndex] = newLesson;
        }
        closeModal(editModal);
        renderSchedule();
    });

    // Переключение курсов
    courseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            courseBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCourse = btn.dataset.course;
            updateGroupTabs();
            renderSchedule();
        });
    });

    // ---------- АДМИН-РЕЖИМ ----------
    function enableAdminMode() {
        isAdmin = true;
        loginToggle.style.display = 'none';
        if (!document.getElementById('logoutToggle')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logoutToggle';
            logoutBtn.className = 'logout-toggle';
            logoutBtn.textContent = '🔒 Выйти';
            logoutBtn.addEventListener('click', logout);
            headerActions.appendChild(logoutBtn);
        }
        adminGroupPanel.style.display = 'flex';
        adminScheduleActions.style.display = 'flex';
        renderSchedule();
    }

    function disableAdminMode() {
        isAdmin = false;
        const logoutBtn = document.getElementById('logoutToggle');
        if (logoutBtn) logoutBtn.remove();
        loginToggle.style.display = 'inline-flex';
        adminGroupPanel.style.display = 'none';
        adminScheduleActions.style.display = 'none';
        renderSchedule();
    }

    function logout() {
        disableAdminMode();
    }

    // ---------- МОДАЛЬНОЕ ОКНО ВХОДА ----------
    function openLoginModal() {
        openModal(modalOverlay);
        loginError.textContent = '';
        usernameInput.value = '';
        passwordInput.value = '';
        setTimeout(() => usernameInput.focus(), 50);
    }

    function closeLoginModal() {
        closeModal(modalOverlay);
    }

    loginToggle.addEventListener('click', openLoginModal);
    cancelModal.addEventListener('click', closeLoginModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeLoginModal(); });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        if (username === 'admin' && password === 'admin123') {
            closeLoginModal();
            enableAdminMode();
        } else {
            loginError.textContent = 'Неверный логин или пароль';
        }
    });

    // ---------- ТЕМА ----------
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('raepk-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        localStorage.setItem('raepk-theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    // Инициализация
    updateGroupTabs();
    renderSchedule();
})();