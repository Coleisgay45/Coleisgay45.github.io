document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("myAudio");
    const volumeSlider = document.getElementById("volume");
    const icon = document.getElementById("icon");

    let x = 100;
    let y = window.innerHeight / 2;
    let angle = 90;
    const speed = 6;

    updateIcon();

    audio.autoplay = true;
    audio.muted = true;
    audio.play().catch(() => {});

    window.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "ArrowLeft":
                angle -= 5;
                break;

            case "ArrowRight":
                angle += 5;
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

        const interval = setInterval(() => {
            x += dx;
            y += dy;
            updateIcon();

            const sliderX = window.innerWidth - 80;
            if (x >= sliderX) {
                x = sliderX;
                clearInterval(interval);
                
                // Map y position to volume (0-1)
                const sliderHeight = window.innerHeight * 1.08;
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

