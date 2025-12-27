# 🧮 Modern Calculator & Unit Converter

A sleek, feature-rich web-based calculator built with vanilla JavaScript, HTML5, and CSS3. This project features a responsive design, multiple UI themes, calculation history, and a built-in unit converter—all without requiring external APIs.



## ✨ Features

* **Standard Calculator:** Basic arithmetic operations (Addition, Subtraction, Multiplication, Division).
* **Three UI Themes:** * 🌞 **Light:** Clean and professional.
    * 🌙 **Dark:** Easy on the eyes for night use.
    * 💡 **Neon:** High-contrast with a glowing pulse effect.
* **Unit Converter:** Supports Length, Weight, Temperature, and Currency conversions.
* **Calculation History:** Remembers your last 10 calculations with timestamps; stored locally via `localStorage`.
* **Keyboard Support:** Use your physical keyboard to type numbers and operators.
* **Fully Responsive:** Optimized for both desktop and mobile screens.

## 📂 Project Structure

* `index.html` - The core structure of the calculator and panels.
* `style.css` - Custom styling using CSS variables for theme management and glassmorphism effects.
* `script.js` - Application logic including math evaluation, theme switching, and unit conversion.

## 🚀 How to Run the Project

Since this project uses standard web technologies, there are no dependencies to install. You can run it directly in your browser.

### Option 1: VS Code "Live Server" (Recommended)
1.  Open your project folder in **VS Code**.
2.  Install the **Live Server** extension (by Ritwick Dey) if you haven't already.
3.  Right-click on `index.html` in the file explorer.
4.  Select **"Open with Live Server"**.
5.  The project will automatically open in your default browser at `http://127.0.0.1:5500`.

### Option 2: Direct Open
1.  Navigate to the folder where you saved the files.
2.  Double-click `index.html`.
3.  The project will open in your web browser.

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0-9` | Numbers |
| `+`, `-`, `*`, `/` | Operators |
| `Enter` / `=` | Calculate Result |
| `Backspace` | Delete last character |
| `Escape` | Clear All |

## 🛠️ Technical Details

* **Logic:** Uses safe JavaScript `Function` evaluation for math operations.
* **Storage:** Uses `window.localStorage` to persist your calculation history even after refreshing the page.
* **Styling:** Utilizes CSS Grid and Flexbox for a modern, responsive layout.

---
*Created as a part of a Modern Web Development project.*