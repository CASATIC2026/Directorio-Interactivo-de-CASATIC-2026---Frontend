const translations = {
    'es': {
        welcome_msg: "¡Bienvenido!",
        user_placeholder: "Usuario",
        pass_placeholder: "Contraseña",
        remember_me: "Recordarme",
        btn_login: "Ingresar",
        forgot_pass: "¿Olvidaste tu contraseña?",
        register: "Regístrate",
        current_lang: "Español",
        dir: "ltr"
    },
    'en': {
        welcome_msg: "Welcome!",
        user_placeholder: "Username",
        pass_placeholder: "Password",
        remember_me: "Remember me",
        btn_login: "Login",
        forgot_pass: "Forgot password?",
        register: "Register",
        current_lang: "English",
        dir: "ltr"
    },
    'zh': {
        welcome_msg: "欢迎！",
        user_placeholder: "用户名",
        pass_placeholder: "密码",
        remember_me: "记住我",
        btn_login: "登录",
        forgot_pass: "忘记密码？",
        register: "注册",
        current_lang: "中文",
        dir: "ltr"
    },
    'hi': {
        welcome_msg: "स्वागत है!",
        user_placeholder: "उपयोगकर्ता नाम",
        pass_placeholder: "पासवर्ड",
        remember_me: "मुझे याद रखें",
        btn_login: "लॉग इन करें",
        forgot_pass: "पासवर्ड भूल गए?",
        register: "पंजीकरण करें",
        current_lang: "हिन्दी",
        dir: "ltr"
    },
    'fr': {
        welcome_msg: "Bienvenue !",
        user_placeholder: "Nom d'utilisateur",
        pass_placeholder: "Mot de passe",
        remember_me: "Se souvenir de moi",
        btn_login: "Se connecter",
        forgot_pass: "Mot de passe oublié ?",
        register: "S'inscrire",
        current_lang: "Français",
        dir: "ltr"
    },
    'ar': {
        welcome_msg: "مرحباً بك!",
        user_placeholder: "اسم المستخدم",
        pass_placeholder: "كلمة المرور",
        remember_me: "تذكرني",
        btn_login: "تسجيل الدخول",
        forgot_pass: "هل نسيت كلمة السر؟",
        register: "سجل الآن",
        current_lang: "العربية",
        dir: "rtl"
    }
};

function changeLanguage(lang) {
    const data = translations[lang];

    // Cambiar textos con data-key
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (data[key]) {
            elem.innerText = data[key];
        }
    });

    // Cambiar placeholders de los inputs
    const userInput = document.getElementById('user-input');
    const passInput = document.getElementById('pass-input');
    
    if (userInput) userInput.placeholder = data.user_placeholder;
    if (passInput) passInput.placeholder = data.pass_placeholder;

    // Cambiar texto del botón selector
    const currentLangSpan = document.getElementById('current-lang');
    if (currentLangSpan) currentLangSpan.innerText = data.current_lang;

    // Cambiar dirección del documento (para idiomas RTL como Árabe)
    document.body.dir = data.dir;
    
    // Ajustar alineación de textos según la dirección
    document.body.style.textAlign = data.dir === 'rtl' ? 'right' : 'left';
}