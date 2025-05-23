// Đợi tài liệu HTML tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Khai báo các phần tử DOM
    const landingPage = document.getElementById('landing-page');
    const mainContent = document.getElementById('main-content');
    const letterPage = document.getElementById('letter-page');
    const giftBox = document.getElementById('gift-box');
    const backgroundMusic = document.getElementById('background-music');
    const cakesContainer = document.getElementById('cakes-container');
    const confettiContainer = document.getElementById('confetti-container');
    const zoomableImages = document.querySelectorAll('.zoomable-img');
    const zoomOverlay = document.getElementById('zoom-overlay');
    const zoomedImg = document.getElementById('zoomed-img');
    const goToLetterBtn = document.getElementById('go-to-letter');
    const goBackToPhotosBtn = document.getElementById('go-back-to-photos');
    
    // Cài đặt trạng thái âm nhạc
    let isMusicPlaying = false;
    
    // Tạo confetti cho animation trang 1
    function createConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                
                // Vị trí ngẫu nhiên theo chiều ngang
                const randomX = Math.floor(Math.random() * window.innerWidth);
                confetti.style.left = `${randomX}px`;
                
                // Màu ngẫu nhiên
                const colors = ['#f472b6', '#9f7aea', '#f6ad55', '#4fd1c5', '#68d391'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.backgroundColor = randomColor;
                
                // Kích thước ngẫu nhiên
                const size = Math.floor(Math.random() * 10) + 5;
                confetti.style.width = `${size}px`;
                confetti.style.height = `${size}px`;
                
                // Hình dạng ngẫu nhiên
                const shapes = ['circle', 'square', 'triangle'];
                const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
                if (randomShape === 'circle') {
                    confetti.style.borderRadius = '50%';
                } else if (randomShape === 'triangle') {
                    confetti.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                }
                
                // Tốc độ rơi ngẫu nhiên
                const duration = Math.random() * 3 + 2;
                confetti.style.animationDuration = `${duration}s`;
                
                // Thêm confetti vào container
                confettiContainer.appendChild(confetti);
                
                // Xóa confetti sau khi hoàn thành animation
                setTimeout(() => {
                    confetti.remove();
                }, duration * 1000);
            }, i * 100);
        }
    }
    
    // Tạo hiệu ứng bánh kem rơi
    function createCakes() {
        const cakeCount = 30; // Số lượng bánh kem
        
        for (let i = 0; i < cakeCount; i++) {
            setTimeout(() => {
                const cake = document.createElement('div');
                cake.className = 'cake';
                
                // Vị trí ngẫu nhiên theo chiều ngang
                const randomX = Math.floor(Math.random() * window.innerWidth);
                cake.style.left = `${randomX}px`;
                
                // Kích thước ngẫu nhiên cho bánh kem
                const size = Math.floor(Math.random() * 15) + 20;
                cake.style.width = `${size}px`;
                cake.style.height = `${size}px`;
                
                // Tốc độ rơi và đường đi ngẫu nhiên
                const duration = Math.random() * 5 + 5;
                cake.style.setProperty('--random', Math.random());
                cake.style.animationDuration = `${duration}s`;
                
                // Thêm bánh kem vào container
                cakesContainer.appendChild(cake);
                
                // Xóa bánh kem sau khi hoàn thành animation
                setTimeout(() => {
                    cake.remove();
                }, duration * 1000);
            }, i * 300); // Tạo bánh kem mới mỗi 300ms
        }
    }
    
    // Loại bỏ hoàn toàn xử lý animation cho bức thư
    function animateLetterContent(container) {
        // Không làm gì cả, bỏ qua animation
    }
    
    // Hiệu ứng khi scroll để làm cho các phần hiển thị lần lượt
    function addScrollEffects() {
        const memorySections = document.querySelectorAll('.memory-section');
        const specialMessage = document.querySelector('.special-message');
        
        // Không xử lý animation cho special-message nữa
        
        // Cải thiện hiệu suất bằng cách giảm số lần gọi callback
        let scrollTimeout;
        let pendingEntries = new Set();
        
        const processEntries = () => {
            pendingEntries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Sử dụng requestAnimationFrame để đồng bộ với chu kỳ render
                    requestAnimationFrame(() => {
                        // Chỉ áp dụng cho memory-section, không áp dụng cho special-message
                        if (!entry.target.classList.contains('special-message')) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                }
            });
            pendingEntries.clear();
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Chỉ xử lý memory-section, không xử lý special-message
                if (!entry.target.classList.contains('special-message')) {
                    pendingEntries.add(entry);
                }
            });
            
            // Gom nhóm các thay đổi và xử lý một lần
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(processEntries, 50);
        }, { 
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Chuẩn bị các phần tử trước để tránh reflow khi animation
        const prepareElements = elements => {
            const fragment = document.createDocumentFragment();
            elements.forEach(section => {
                // Không áp dụng cho special-message
                if (!section.classList.contains('special-message')) {
                    const clone = section.cloneNode(false);
                    clone.style.opacity = '0';
                    clone.style.transform = 'translateY(30px)';
                    clone.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    fragment.appendChild(clone);
                }
            });
            requestAnimationFrame(() => {
                memorySections.forEach((section, i) => {
                    // Không áp dụng cho special-message
                    if (!section.classList.contains('special-message')) {
                        section.style.opacity = '0';
                        section.style.transform = 'translateY(30px)';
                        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        observer.observe(section);
                    }
                });
            });
        };
        
        prepareElements(memorySections);
    }
    
    // Hiệu ứng zoom ảnh
    function setupImageZoom() {
        zoomableImages.forEach(img => {
            img.addEventListener('click', function() {
                zoomedImg.src = this.src;
                zoomedImg.alt = this.alt;
                zoomOverlay.classList.add('active');
                
                // Tự động đóng sau 5 giây
                const zoomTimer = setTimeout(() => {
                    closeZoom();
                }, 5000);
                
                // Lưu timer để có thể hủy nếu người dùng click để đóng sớm
                zoomOverlay.dataset.timer = zoomTimer;
            });
        });
        
        // Đóng khi click vào overlay
        zoomOverlay.addEventListener('click', closeZoom);
    }
    
    // Hàm đóng zoom
    function closeZoom() {
        clearTimeout(parseInt(zoomOverlay.dataset.timer));
        zoomOverlay.classList.remove('active');
    }
    
    // Tự động phát nhạc khi trang load
    function autoPlayMusic() {
        try {
            // Đặt âm lượng phù hợp
            backgroundMusic.volume = 0.5;
            
            // Thử phát nhạc
            let playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Phát thành công
                    isMusicPlaying = true;
                    console.log('Nhạc đang phát tự động');
                })
                .catch(error => {
                    // Thất bại - cần tương tác người dùng
                    console.log('Không thể phát nhạc tự động, cần tương tác người dùng');
                    
                    // Thêm sự kiện khi người dùng tương tác với trang
                    document.body.addEventListener('click', function bodyClick() {
                        backgroundMusic.play().catch(e => console.log('Vẫn không thể phát nhạc:', e));
                        document.body.removeEventListener('click', bodyClick);
                        isMusicPlaying = true;
                    }, { once: true });
                });
            }
            
            // Phát lại nhạc khi chuyển tab trở lại
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible' && isMusicPlaying) {
                    backgroundMusic.play().catch(e => console.log('Không thể khôi phục phát nhạc:', e));
                }
            });
        } catch (error) {
            console.log('Lỗi khi cố gắng phát nhạc:', error);
        }
    }
    
    // Xử lý sự kiện và khởi tạo các hiệu ứng
    window.addEventListener('load', function() {
        // Tạo confetti
        createConfetti();
        
        // Phát nhạc tự động
        autoPlayMusic();
    });
    
    // Xử lý sự kiện khi nhấp vào hộp quà
    giftBox.addEventListener('click', function() {
        // Kích hoạt nhạc nếu chưa phát (do cần tương tác người dùng)
        if (!isMusicPlaying) {
            backgroundMusic.volume = 0.5;
            backgroundMusic.play().then(() => {
                isMusicPlaying = true;
            }).catch(error => {
                console.log('Không thể phát nhạc: ', error);
            });
        }
        
        // Hiệu ứng hộp quà trước khi chuyển trang
        giftBox.style.transform = 'scale(1.2) rotate(10deg)';
        
        // Tạo hiệu ứng chớp sáng
        const flash = document.createElement('div');
        flash.className = 'page-transition-flash';
        document.body.appendChild(flash);
        
        // Hiệu ứng chớp sáng
        setTimeout(() => {
            flash.style.opacity = '1';
            
            setTimeout(() => {
                // Ẩn trang landing
                landingPage.style.opacity = '0';
                landingPage.style.transform = 'scale(0.9) translateY(-50px)';
                
                setTimeout(() => {
                    landingPage.style.display = 'none';
                    flash.style.opacity = '0';
                    
                    // Hiển thị nội dung chính với hiệu ứng
                    mainContent.style.display = 'block';
                    mainContent.style.transform = 'scale(0.9) translateY(50px)';
                    
                    // Thêm một khoảng thời gian nhỏ để hiệu ứng hiển thị mượt mà hơn
                    setTimeout(() => {
                        mainContent.style.opacity = '1';
                        mainContent.style.transform = 'scale(1) translateY(0)';
                        
                        // Tạo hiệu ứng bánh kem rơi
                        createCakes();
                        
                        // Thêm hiệu ứng scroll cho các phần kỷ niệm
                        addScrollEffects();
                        
                        // Thiết lập hiệu ứng zoom ảnh
                        setupImageZoom();
                        
                        // Xóa hiệu ứng flash
                        setTimeout(() => {
                            flash.remove();
                        }, 500);
                        
                        // Tạo hiệu ứng bánh kem rơi liên tục mỗi 30 giây
                        setInterval(createCakes, 30000);
                    }, 100);
                }, 1000);
            }, 200);
        }, 300);
    });
    
    // Xử lý chuyển trang sang trang thư
    goToLetterBtn.addEventListener('click', function() {
        // Tạo hiệu ứng chuyển trang
        const flash = document.createElement('div');
        flash.className = 'page-transition-flash';
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '1';
            
            setTimeout(() => {
                // Ẩn trang ảnh
                mainContent.style.opacity = '0';
                mainContent.style.transform = 'scale(0.9) translateY(-50px)';
                
                setTimeout(() => {
                    mainContent.style.display = 'none';
                    flash.style.opacity = '0';
                    
                    // Hiển thị trang thư
                    letterPage.style.display = 'flex';
                    letterPage.style.transform = 'scale(0.9) translateY(50px)';
                    
                    setTimeout(() => {
                        letterPage.style.opacity = '1';
                        letterPage.style.transform = 'scale(1) translateY(0)';
                        
                        // Xóa hiệu ứng flash
                        setTimeout(() => {
                            flash.remove();
                        }, 500);
                    }, 100);
                }, 800);
            }, 200);
        }, 300);
    });
    
    // Xử lý quay lại trang ảnh từ trang thư
    goBackToPhotosBtn.addEventListener('click', function() {
        // Tạo hiệu ứng chuyển trang
        const flash = document.createElement('div');
        flash.className = 'page-transition-flash';
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '1';
            
            setTimeout(() => {
                // Ẩn trang thư
                letterPage.style.opacity = '0';
                letterPage.style.transform = 'scale(0.9) translateY(-50px)';
                
                setTimeout(() => {
                    letterPage.style.display = 'none';
                    flash.style.opacity = '0';
                    
                    // Hiển thị lại trang ảnh
                    mainContent.style.display = 'block';
                    mainContent.style.transform = 'scale(0.9) translateY(50px)';
                    
                    setTimeout(() => {
                        mainContent.style.opacity = '1';
                        mainContent.style.transform = 'scale(1) translateY(0)';
                        
                        // Xóa hiệu ứng flash
                        setTimeout(() => {
                            flash.remove();
                        }, 500);
                    }, 100);
                }, 800);
            }, 200);
        }, 300);
    });
}); 