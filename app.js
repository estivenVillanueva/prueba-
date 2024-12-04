import { dictionary } from "./dictionary.js";

// Seleccionar elementos del DOM
const wordInput = document.getElementById('word');
const translateButton = document.querySelector('button');
const responseDiv = document.getElementById('response');
const categoryInputs = document.querySelectorAll('input[name="category"]');
const textarea = document.querySelector('textarea');
const languageInputs = document.querySelectorAll('input[name="language"]');
const newWordButton = document.querySelector('button:last-of-type');

// Variables globales
let currentCategory = null;
let currentSortOrder = 'english'; // Por defecto ordenar por inglés

// Función para generar ID único
function generateUniqueId(category) {
    const existingIds = dictionary.categories[category].map(entry => entry.id);
    return Math.max(...existingIds) + 1;
}

// Función para ordenar palabras
function sortWords(words, field) {
    return [...words].sort((a, b) => 
        a[field].toLowerCase().localeCompare(b[field].toLowerCase())
    );
}

// Función para mostrar palabras por categoría
function showCategoryWords(categoryName, sortBy = currentSortOrder) {
    currentCategory = categoryName;
    const category = dictionary.categories[categoryName];
    if (category) {
        const sortedWords = sortWords(category, sortBy);
        textarea.value = sortedWords.map(entry => 
            `${entry.english} - ${entry.spanish} (${entry.example})`
        ).join('\n');
    }
}

// Función para añadir nueva palabra
function addNewWord() {
    if (!currentCategory) {
        alert('Por favor, seleccione una categoría primero / Please select a category first');
        return;
    }

    const newWord = prompt('Ingrese la palabra en inglés / Enter the word in English:');
    const newTranslation = prompt('Ingrese la traducción en español / Enter the Spanish translation:');
    const newExample = prompt('Ingrese un ejemplo de uso / Enter a usage example:');

    if (newWord && newTranslation && newExample) {
        const newEntry = {
            id: generateUniqueId(currentCategory),
            english: newWord,
            spanish: newTranslation,
            example: newExample
        };

        dictionary.categories[currentCategory].push(newEntry);
        showCategoryWords(currentCategory); // Actualizar la vista
        alert('Palabra añadida exitosamente / Word successfully added');
    }
}

// Función para traducir palabras
function translateWord() {
    const word = wordInput.value.toLowerCase();
    const isEnglish = document.getElementById('english').checked;
    const sourceField = isEnglish ? 'english' : 'spanish';
    const targetField = isEnglish ? 'spanish' : 'english';
    
    let found = false;
    
    Object.values(dictionary.categories).forEach(category => {
        category.forEach(entry => {
            if (entry[sourceField].toLowerCase() === word) {
                responseDiv.textContent = `${entry[targetField]} (${entry.example})`;
                found = true;
            }
        });
    });
    
    if (!found) {
        responseDiv.textContent = "Palabra no encontrada / Word not found";
    }
}

// Event listeners
translateButton.addEventListener('click', translateWord);

categoryInputs.forEach(input => {
    input.addEventListener('change', (e) => {
        if (e.target.checked) {
            showCategoryWords(e.target.value);
        }
    });
});

// Agregar botón de ordenamiento
const sortButton = document.createElement('button');
sortButton.textContent = 'Cambiar orden (ES/EN)';
sortButton.type = 'button';
document.querySelector('form').insertBefore(sortButton, textarea);

sortButton.addEventListener('click', () => {
    currentSortOrder = currentSortOrder === 'english' ? 'spanish' : 'english';
    if (currentCategory) {
        showCategoryWords(currentCategory, currentSortOrder);
    }
});

// Event listener para añadir nuevas palabras
newWordButton.addEventListener('click', addNewWord);

