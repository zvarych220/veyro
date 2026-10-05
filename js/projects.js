/**
 * =========================================================================
 * СПИСОК ТА НАЛАШТУВАННЯ ПРОЄКТІВ (ПОРТФОЛІО)
 * =========================================================================
 * 
 * Тут ви можете легко додавати, змінювати або видаляти сайти зі свого портфоліо.
 * Кожен об'єкт у масиві нижче автоматично формує стильну картку на сайті.
 * 
 * ЯК ДОДАТИ НОВИЙ САЙТ:
 * Просто скопіюйте цей шаблон і вставте його в масив `PROJECTS`:
 * 
 *   {
 *     title: "Назва проєкту",
 *     badge: "Лендінг",                 // Бейдж: "Лендінг", "Магазин", "Демо-проєкт", "Корпоративний" (або "")
 *     description: "Короткий опис...", // Що робить сайт, які задачі вирішує
 *     image: "img/projects/site.jpg",  // Посилання на фото (URL або локальний шлях). Якщо немає фото — залиште ""
 *     link: "https://example.com",     // Посилання на робочий сайт або демо
 *     linkText: "Дивитись демо",       // Текст кнопки (за замовчуванням "Дивитись сайт")
 *     github: "",                      // Посилання на код GitHub (якщо є, інакше залиште "")
 *     tags: ["HTML", "CSS", "JS"]      // Список технологій (теги)
 *   },
 */

const PROJECTS = [
  {
    title: "Концепт: салон краси DAVERIKANTO",
    badge: "Демо-проєкт",
    description: "Преміальний лендінг для студії краси: естетична типографіка, зручний онлайн-запис, каталог послуг, прайс та бездоганна адаптивність під смартфони.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
    link: "https://zvarych220.github.io/daverikanto/",
    linkText: "Дивитись демо",
    github: "https://github.com/zvarych220/daverikanto",
    tags: ["HTML5", "CSS3 / SCSS", "JavaScript", "Адаптив"]
  },
  {
    title: "veyro.dev",
    badge: "Власний сайт",
    description: "Сайт frontend-розробника. Чистий HTML, CSS та JS без зайвих фреймворків, інтерактивні елементи та висока продуктивність 98+ у Google PageSpeed.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    link: "#top",
    linkText: "Ви тут",
    github: "",
    tags: ["HTML5", "CSS3", "JavaScript", "Швидкість 90+"]
  }
];

// =========================================================================
// АВТОМАТИЧНИЙ РЕНДЕРИНГ ПРОЄКТІВ У DOM
// (Код нижче не обов'язково редагувати, він сам будує картки)
// =========================================================================
(function () {
  'use strict';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getHostname(url) {
    try {
      if (!url || url.startsWith('#')) return 'veyro.dev';
      var u = new URL(url);
      return u.hostname.replace(/^www\./, '');
    } catch (e) {
      return 'веб-сайт';
    }
  }

  function renderProjects() {
    var container = document.getElementById('projects-grid');
    if (!container) return;

    if (!Array.isArray(PROJECTS) || PROJECTS.length === 0) {
      container.innerHTML = '<p class="projects-empty">Проєкти незабаром зʼявляться тут.</p>';
      return;
    }

    var html = PROJECTS.map(function (item, index) {
      var title = escapeHtml(item.title || 'Без назви');
      var desc = escapeHtml(item.description || '');
      var badge = item.badge ? escapeHtml(item.badge) : '';
      var link = (item.link || '#').trim();
      var isHash = link.startsWith('#');
      var isExternal = /^https?:\/\//i.test(link);
      var defaultText = isHash ? 'Ви тут' : 'Дивитись сайт';
      var linkText = escapeHtml(item.linkText || defaultText);
      var targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      var github = (item.github || '').trim();
      var image = (item.image || '').trim();
      var host = getHostname(link);

      // Теги
      var tagsHtml = '';
      if (Array.isArray(item.tags) && item.tags.length > 0) {
        tagsHtml = '<ul class="project-tags">' +
          item.tags.map(function (tag) {
            return '<li>' + escapeHtml(tag) + '</li>';
          }).join('') +
          '</ul>';
      }

      // Бейдж
      var badgeHtml = badge
        ? '<span class="project-badge">' + badge + '</span>'
        : '';

      // Блок превʼю: фото з імітацією браузерного вікна
      var imgContent = '';
      if (image) {
        imgContent =
          '<img src="' + escapeHtml(image) + '" alt="' + title + '" loading="lazy" class="project-img"' +
          ' onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';">' +
          '<div class="project-fallback-box" style="display:none;">' +
            '<span class="project-fallback-icon">✦</span>' +
            '<span>' + title + '</span>' +
          '</div>';
      } else {
        imgContent =
          '<div class="project-fallback-box">' +
            '<span class="project-fallback-icon">✦</span>' +
            '<span>' + title + '</span>' +
          '</div>';
      }

      var previewHtml =
        '<div class="project-browser">' +
          '<div class="project-browser-bar">' +
            '<div class="project-browser-dots">' +
              '<i class="dot-red"></i><i class="dot-yellow"></i><i class="dot-green"></i>' +
            '</div>' +
            '<span class="project-browser-url">' + escapeHtml(host) + '</span>' +
          '</div>' +
          '<div class="project-thumb">' +
            imgContent +
            '<div class="project-overlay" aria-hidden="true">' +
              '<span class="project-overlay-btn">' + linkText + ' ↗</span>' +
            '</div>' +
          '</div>' +
        '</div>';

      // Превʼю клікабельне, якщо є посилання
      var mediaHtml = (link && link !== '#')
        ? '<a href="' + escapeHtml(link) + '"' + targetAttr + ' class="project-media-link" aria-label="' + title + '">' + previewHtml + '</a>'
        : previewHtml;

      // Кнопка GitHub (опційно)
      var githubBtn = '';
      if (github) {
        githubBtn =
          '<a href="' + escapeHtml(github) + '" target="_blank" rel="noopener noreferrer" class="project-gh-link" title="Переглянути код на GitHub" aria-label="GitHub код проєкту">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">' +
              '<path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>' +
            '</svg>' +
            '<span>GitHub</span>' +
          '</a>';
      }

      // Головне посилання внизу картки
      var primaryAction = (link && link !== '#')
        ? '<a href="' + escapeHtml(link) + '"' + targetAttr + ' class="project-action-link">' +
            linkText +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7"></path><path d="M7 7h10v10"></path></svg>' +
          '</a>'
        : '<span class="project-action-static">' + linkText + '</span>';

      return (
        '<article class="card project-card" data-project-id="' + index + '">' +
          mediaHtml +
          '<div class="project-content">' +
            '<div class="project-head">' +
              (badgeHtml ? badgeHtml : '') +
            '</div>' +
            '<h3 class="project-title">' +
              (link && link !== '#'
                ? '<a href="' + escapeHtml(link) + '"' + targetAttr + '>' + title + '</a>'
                : title) +
            '</h3>' +
            (desc ? '<p class="project-desc">' + desc + '</p>' : '') +
            tagsHtml +
            '<div class="project-footer">' +
              primaryAction +
              githubBtn +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    container.innerHTML = html;
  }

  // Викликаємо рендеринг
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderProjects);
  } else {
    renderProjects();
  }

  // Робимо функцію та дані доступними глобально
  window.PROJECTS = PROJECTS;
  window.renderProjects = renderProjects;
})();
