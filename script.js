// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 부드러운 스크롤 기능
    initSmoothScroll();
    
    // 버튼 클릭 이벤트
    initButtonClick();
    
    // 폼 제출 이벤트
    initFormSubmit();
    
    // 스크롤 시 헤더 스타일 변경
    initHeaderScroll();
});

// 부드러운 스크롤 구현
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 버튼 클릭 이벤트 처리
function initButtonClick() {
    const clickBtn = document.getElementById('clickBtn');
    
    if (clickBtn) {
        clickBtn.addEventListener('click', function() {
            alert('버튼이 클릭되었습니다!');
            
            // 버튼 텍스트 변경 예시
            this.textContent = '클릭됨!';
            
            // 2초 후 원래 텍스트로 복원
            setTimeout(() => {
                this.textContent = '클릭하세요';
            }, 2000);
        });
    }
}

// 폼 제출 이벤트 처리
function initFormSubmit() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 가져오기
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // 콘솔에 출력 (실제로는 서버로 전송)
            console.log('폼 데이터:', formData);
            
            // 사용자에게 피드백
            alert('메시지가 전송되었습니다!');
            
            // 폼 초기화
            this.reset();
        });
    }
}

// 스크롤 시 헤더 스타일 변경
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
            header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        } else {
            header.style.backgroundColor = 'var(--secondary-color)';
            header.style.boxShadow = 'none';
        }
    });
}

// 유틸리티 함수들

// 요소가 뷰포트에 있는지 확인
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 현재 시간 가져오기
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString('ko-KR');
}

// 로컬 스토리지 관련 함수
const storage = {
    set: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get: function(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    remove: function(key) {
        localStorage.removeItem(key);
    }
};

// API 호출 예시 (실제 사용 시 URL 변경 필요)
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}