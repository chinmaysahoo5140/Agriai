// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

  // Get the dark mode toggle switch
  const darkModeToggle = document.querySelector('input[type="checkbox"]');

  // Check for saved dark mode preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    darkModeToggle.checked = true;
  }

  // Add an event listener to the dark mode toggle
  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });

  // Get the navigation links
  const navLinks = document.querySelectorAll('nav a');

  // Add event listeners to the navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      // Prevent the default link behavior
      event.preventDefault();

      // Get the href attribute
      const href = link.getAttribute('href');

      // Navigate to the new page
      window.location.href = href;
    });
  });

});
