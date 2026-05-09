(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.project-links a, .project-links button').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    });

    document.querySelectorAll('.project-box-single-item[data-nav-url]').forEach(function (card) {
      card.addEventListener('click', function () {
        var url = card.getAttribute('data-nav-url');
        if (url) window.location.href = url;
      });
    });
  });
})();
