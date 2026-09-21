// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Contact form — sends the request to the office email via FormSubmit
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const submitBtn = form ? form.querySelector('.submit-btn') : null;

function setStatus(msg) {
  if (status) status.textContent = msg;
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // FormSubmit ไม่ทำงานเมื่อเปิดไฟล์ตรงๆ (file://) ต้องเปิดผ่านเว็บไซต์จริงหรือ local server
    if (location.protocol === 'file:') {
      setStatus('ส่งไม่ได้เมื่อเปิดไฟล์โดยตรง กรุณาเปิดผ่านเว็บไซต์ที่อัปโหลดแล้ว หรือ local server');
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    setStatus('กำลังส่งข้อมูล...');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });

      let data = {};
      try { data = await response.json(); } catch (_) {}

      const ok = response.ok && String(data.success) === 'true';

      if (ok) {
        setStatus('ส่งคำขอปรึกษาเรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็วที่สุด');
        form.reset();
      } else {
        console.error('FormSubmit response:', data);
        setStatus(data.message
          ? 'ส่งไม่สำเร็จ: ' + data.message
          : 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (err) {
      console.error(err);
      setStatus('ส่งข้อมูลไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่อีกครั้ง');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
