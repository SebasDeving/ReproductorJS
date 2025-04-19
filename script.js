// Radio player functionality
document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('playButton');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumePercentage = document.getElementById('volumePercentage');
    const listenersCount = document.getElementById('listenersCount');
    
    // Create audio element
    const audio = new Audio();
    audio.src = "https://mx.hdaudiostreaming.com/8130/stream"; // Radio stream URL
    audio.volume = 0.7;
    audio.crossOrigin = "anonymous"; // Important for some streams
    
    
    let isPlaying = false;
    
    // Play/Pause button
    playButton.addEventListener('click', function() {
        if (isPlaying) {
            // Pause
            audio.pause();
            playButton.innerHTML = "▶";
            document.querySelector('.player-container').classList.remove('playing'); // Detener las animaciones de sonido
        } else {
            // Play
            audio.play().catch(e => {
                console.error("Error playing audio:", e);
                // Solo en caso de error mostramos un mensaje
                document.getElementById('sonic_title').textContent = "Error al reproducir";
            });
            playButton.innerHTML = "⏸";
            
            // No mostramos "Cargando..." y mantenemos el título actual
            document.querySelector('.player-container').classList.add('playing'); // Activar las animaciones de sonido
        }
        isPlaying = !isPlaying;
    });

    // Error handler
    audio.addEventListener('error', function() {
        document.getElementById('sonic_title').textContent = "Error con la transmisión";
        playButton.innerHTML = "▶";
        isPlaying = false;
    });
    
    // Volume control with dynamic icon and percentage display
    volumeSlider.addEventListener('input', function() {
        const volume = volumeSlider.value;
        audio.volume = volume;
        updateVolumeIcon(volume);
        
        // Actualizar el porcentaje mostrado
        const volumePercentage = document.getElementById('volumePercentage');
        volumePercentage.textContent = Math.round(volume * 100) + '%';
        
        // Actualizar el efecto de llenado del slider
        volumeSlider.style.setProperty('--volume-percent', Math.round(volume * 100) + '%');
    });

    // Asegurarnos de que el porcentaje inicial se muestra correctamente
    document.getElementById('volumePercentage').textContent = 
        Math.round(volumeSlider.value * 100) + '%';

    // También actualizar el porcentaje en la función de mute/unmute
    document.getElementById('volumeIcon').addEventListener('click', function() {
        if (audio.volume > 0) {
            // Si hay volumen, guardarlo y silenciar
            previousVolume = audio.volume;
            audio.volume = 0;
            volumeSlider.value = 0;
            updateVolumeIcon(0);
            document.getElementById('volumePercentage').textContent = '0%';
            
            // Actualizar el efecto de llenado del slider
            volumeSlider.style.setProperty('--volume-percent', '0%');
        } else {
            // Si está silenciado, restaurar volumen anterior
            audio.volume = previousVolume;
            volumeSlider.value = previousVolume;
            updateVolumeIcon(previousVolume);
            document.getElementById('volumePercentage').textContent = 
                Math.round(previousVolume * 100) + '%';
            
            // Actualizar el efecto de llenado del slider
            volumeSlider.style.setProperty('--volume-percent', Math.round(previousVolume * 100) + '%');
        }
    });

    // Función para actualizar el icono según el nivel de volumen
    function updateVolumeIcon(volume) {
        const volumeIcon = document.getElementById('volumeIcon');
        
        // Eliminar todas las clases de volumen existentes
        volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down', 'fa-volume-off', 'fa-volume-mute');
        
        // Agregar la clase apropiada según el nivel de volumen
        if (volume >= 0.7) {
            volumeIcon.classList.add('fa-volume-up');
        } else if (volume >= 0.3) {
            volumeIcon.classList.add('fa-volume-down');
        } else if (volume > 0) {
            volumeIcon.classList.add('fa-volume-off');
        } else {
            volumeIcon.classList.add('fa-volume-mute');
        }
    }

    // Inicializar el icono y porcentaje con el valor actual
    updateVolumeIcon(volumeSlider.value);
    
    // Variable para almacenar el volumen anterior cuando se silencia
    let previousVolume = 0.7;
});

// Después de cargar el script de Antyserv, reorganizar el contenido de sonic_dj
document.addEventListener('DOMContentLoaded', function() {
// Variable global para rastrear si ya hemos establecido AutoDj
let usingAutoDj = false;

// Función para formatear el texto del DJ
function formatDjText() {
const sonicDj = document.getElementById('sonic_dj');

if (sonicDj) {
    // Si el widget de Antyserv cambió la estructura, simplificamos el contenido
    if (sonicDj.querySelector('i')) {
        // Si hay un icono dentro, probablemente Antyserv lo agregó
        // Vamos a obtener solo el texto
        const textContent = sonicDj.textContent.trim();
        // Y reemplazar todo el contenido
        sonicDj.innerHTML = textContent;
    }
    
    // Verificar si el texto está vacío o contiene "No Dj"
    const currentText = sonicDj.textContent.trim();
    if (currentText === '' || currentText === '--' || currentText === 'No DJ' || currentText === 'no DJ') {
        // Reemplazar con "AutoDj"
        sonicDj.textContent = 'AutoDj';
        usingAutoDj = true; // Marcar que estamos usando AutoDj
    } else if (currentText !== 'AutoDj') {
        // Si hay un texto que no es "AutoDj", es un DJ real
        usingAutoDj = false;
    } else if (usingAutoDj) {
        // Si ya estamos usando AutoDj, forzar mantenerlo
        sonicDj.textContent = 'AutoDj';
    }
    
    // Asegurarnos que el texto nunca esté vacío
    if (sonicDj.textContent.trim() === '') {
        sonicDj.textContent = 'AutoDj';
        usingAutoDj = true;
    }
}
}

// Ejecutar inmediatamente para establecer el valor inicial
formatDjText();

// Verificar periódicamente con mayor frecuencia, ya que el widget actualiza rápido


// También ejecutar después de un pequeño retraso, cuando el widget podría haber cargado

setTimeout(function() {
formatDjText();
}, 5000); // 5 segundos de retraso para la primera verificación
});


// Control de actualizaciones para sonic_art y sonic_dj
document.addEventListener('DOMContentLoaded', function() {
// Variables para almacenar los valores actuales
let currentSong = '';
let currentArtUrl = '';
let currentDj = '';

// Función para supervisar y controlar actualizaciones
function monitorUpdates() {
const sonicTitle = document.getElementById('sonic_title');
const sonicArt = document.getElementById('sonic_art');
const sonicDj = document.getElementById('sonic_dj');

// Si hay un cambio en la canción, permitir actualizaciones
if (sonicTitle && sonicTitle.textContent.trim() !== currentSong) {
    // Almacenar la nueva canción
    currentSong = sonicTitle.textContent.trim();
    
    // Reiniciar el bloqueo de actualizaciones para la carátula
    // cuando hay una nueva canción
    currentArtUrl = '';
}

// Controlar actualizaciones de la carátula
if (sonicArt) {
    const artStyle = window.getComputedStyle(sonicArt);
    const artUrl = artStyle.backgroundImage;
    
    // Si no tenemos una URL de arte guardada o si hay un cambio de canción, permitir actualización
    if (currentArtUrl === '' && artUrl !== 'url("https://xatimg.com/image/OkgNwk2gOtiW.jpg")') {
        currentArtUrl = artUrl;
    } else if (currentArtUrl !== '' && artUrl !== currentArtUrl) {
        // Si intentan cambiar la carátula sin cambio de canción, restaurar la anterior
        sonicArt.style.backgroundImage = currentArtUrl;
    }
}

// Control para el DJ
if (sonicDj) {
    const djText = sonicDj.textContent.trim();
    
    // Gestionar el texto del DJ
    const isNoDj = djText === '' || djText === '--' || 
                   djText === 'No DJ' || djText === 'no DJ';
                   
    if (isNoDj) {
        // Si no hay DJ, usar AutoDj
        sonicDj.textContent = 'AutoDj';
        currentDj = 'AutoDj';
    } else if (djText !== currentDj && djText !== 'AutoDj') {
        // Si hay un nuevo DJ real, permitir la actualización
        currentDj = djText;
    } else if (djText !== currentDj) {
        // Si hay un intento de cambio que no sea a un DJ real, restaurar
        sonicDj.textContent = currentDj;
    }
}
}

// Ejecutar la comprobación inicial
setTimeout(monitorUpdates, 2000);

// Establecer un intervalo para verificar periódicamente
// Usamos 2 segundos para tener un buen balance entre rendimiento y respuesta
setInterval(monitorUpdates, 2000);
});

// Función para actualizar la fecha y hora
function updateDateTime() {
const now = new Date();

// Formatear la hora (formato 24h)
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');
const timeString = `${hours}:${minutes}:${seconds}`;

// Formatear la fecha (formato dd/mm/yyyy)
const day = String(now.getDate()).padStart(2, '0');
const month = String(now.getMonth() + 1).padStart(2, '0'); // +1 porque los meses van de 0 a 11
const year = now.getFullYear();
const dateString = `${day}/${month}/${year}`;

// Actualizar los elementos en el DOM
document.getElementById('current-time').textContent = timeString;
document.getElementById('current-date').textContent = dateString;
}

// Actualizar inmediatamente al cargar la página
updateDateTime();

// Actualizar cada segundo
setInterval(updateDateTime, 1000);

// Funcionalidad para el botón de historial
document.addEventListener('DOMContentLoaded', function() {
const historyButton = document.getElementById('historyButton');
const historyContainer = document.getElementById('historyContainer');
const closeHistory = document.getElementById('closeHistory');
const playerContainer = document.querySelector('.player-container');

// Función para mostrar el historial
historyButton.addEventListener('click', function() {
historyContainer.classList.add('active');
playerContainer.classList.add('blur-background'); // Añadir efecto de difuminado

// Opcional: Verificar si el contenido ya ha sido cargado
const historyContent = document.getElementById('sonic_history');
if (historyContent && historyContent.children.length === 0) {
    // Podríamos mostrar un mensaje de carga o animación aquí
    historyContent.innerHTML = '<div class="loading-history">Cargando historial...</div>';
}
});

// Función para cerrar el historial
closeHistory.addEventListener('click', function() {
historyContainer.classList.remove('active');
playerContainer.classList.remove('blur-background'); // Quitar efecto de difuminado
});

// Cerrar el historial al hacer clic fuera del contenedor
window.addEventListener('click', function(event) {
if (event.target === historyContainer) {
    historyContainer.classList.remove('active');
    playerContainer.classList.remove('blur-background'); // Quitar efecto de difuminado
}
});

// Evitar que los clics dentro del contenedor lo cierren
historyContainer.addEventListener('click', function(event) {
event.stopPropagation();
});
});