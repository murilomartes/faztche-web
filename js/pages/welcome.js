document.querySelectorAll('.btn-ripple').forEach(button => {
  button.addEventListener('click', function (e) {
    const circle = document.createElement('span');
    const diameter = Math.max(this.clientWidth, this.clientHeight);
    const radius = diameter / 2;

    const rect = this.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const ripple = this.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    this.appendChild(circle);
  });
});