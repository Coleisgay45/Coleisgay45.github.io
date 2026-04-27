document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("myAudio");
    const volumeSlider = document.getElementById("volume");
    const icon = document.getElementById("icon");

    let x = 100;
    let y = window.innerHeight / 2;
    let angle = 90;
    const speed = 6;

    updateIcon();

    // Handle window resize
    window.addEventListener("resize", () => {
        if (x > window.innerWidth - 80) {
            x = window.innerWidth - 80;
        }
        if (y > window.innerHeight) {
            y = window.innerHeight / 2;
        }
        updateIcon();
    });
 
    audio.autoplay = true;
    audio.muted = true;
    audio.play().catch(() => {});

    window.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "ArrowLeft":
                angle -= 1;
                break;

            case "ArrowRight":
                angle += 1;
                break;

            case "Space":
                moveForwardAcrossScreen();
                break;
        }

        updateIcon();
    });

    function moveForwardAcrossScreen() {
        const rad = (angle - 90) * (Math.PI / 180);
        const dx = Math.cos(rad) * 5;
        const dy = Math.sin(rad) * 5;
        
        const startX = x;
        const startY = y;
        let distance = 0;

        const interval = setInterval(() => {
            distance += 5;
            
            // Add parabolic arc - vertical offset based on distance
            const arcHeight = 100;
            const arc = -4 * arcHeight * (distance / window.innerWidth) * (1 - distance / window.innerWidth);
            
            x += dx;
            y = startY + (dy * distance / 5) + arc;
            updateIcon();

            const sliderX = window.innerWidth - 80;
            if (x >= sliderX) {
                x = sliderX;
                clearInterval(interval);
                
                // Map y position to volume (0-1)
                const sliderHeight = window.innerHeight;
                const volume = Math.max(0, Math.min(1, 1 - (y / sliderHeight)));
                volumeSlider.value = volume;
                audio.volume = volume;
                audio.muted = false;

                // Reset icon after 1 second
                setTimeout(() => {
                    x = 100;
                    y = window.innerHeight / 2;
                    angle = 90;
                    updateIcon();
                }, 1000);
            }

            if (
                x < -100 ||
                x > window.innerWidth + 100 ||
                y < -100 ||
                y > window.innerHeight + 100
            ) {
                clearInterval(interval);
            }
        }, 16);
    }


    function updateIcon() {
        icon.style.left = `${x}px`;
        icon.style.top = `${y}px`;
        icon.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }
});

