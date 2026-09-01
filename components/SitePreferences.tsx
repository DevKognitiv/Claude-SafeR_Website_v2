'use client';

import { useEffect, useState } from 'react';

type Locale = 'fr' | 'en' | 'pt' | 'ar' | 'dyu';
type Theme = 'light' | 'dark';
const preferencesEvent = 'safer-preferences-change';

const languages: { code: Locale; short: string; label: string }[] = [
  { code: 'fr', short: 'FR', label: 'Français' },
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'pt', short: 'PT', label: 'Português' },
  { code: 'ar', short: 'AR', label: 'العربية' },
  { code: 'dyu', short: 'DY', label: 'Dioula' },
];

type LocalizedCopy = Record<Locale, string>;

const translations: Record<string, LocalizedCopy> = {
  'nav.solutions': { fr: 'Solutions', en: 'Solutions', pt: 'Soluções', ar: 'الحلول', dyu: 'Furakɛliw' },
  'nav.products': { fr: 'Équipements', en: 'Devices', pt: 'Equipamentos', ar: 'الأجهزة', dyu: 'Minɛnw' },
  'nav.store': { fr: 'Store', en: 'Store', pt: 'Loja', ar: 'المتجر', dyu: 'Feereyɔrɔ' },
  'nav.partners': { fr: 'Partenaires', en: 'Partners', pt: 'Parceiros', ar: 'الشركاء', dyu: 'Baarakɛɲɔgɔnw' },
  'nav.offers': { fr: 'Offres', en: 'Plans', pt: 'Planos', ar: 'الباقات', dyu: 'Pakiw' },
  'nav.collective': { fr: 'Quartiers & villes', en: 'Districts & cities', pt: 'Bairros e cidades', ar: 'الأحياء والمدن', dyu: 'Dugukolow ni dugubaw' },
  'nav.how': { fr: 'Comment ça marche', en: 'How it works', pt: 'Como funciona', ar: 'كيف تعمل', dyu: 'A bɛ baara cogo min' },
  'nav.client': { fr: 'Espace client', en: 'Client portal', pt: 'Área do cliente', ar: 'مساحة العميل', dyu: 'Kiliyan ka yɔrɔ' },
  'nav.diagnostic': { fr: 'Diagnostic gratuit', en: 'Free assessment', pt: 'Diagnóstico gratuito', ar: 'تقييم مجاني', dyu: 'Kɔrɔbɔli fu' },
  'nav.support': { fr: 'Support', en: 'Support', pt: 'Suporte', ar: 'الدعم', dyu: 'Dɛmɛ' },
  'theme.light': { fr: 'Mode clair', en: 'Light mode', pt: 'Modo claro', ar: 'الوضع الفاتح', dyu: 'Kɛnɛya mode' },
  'theme.dark': { fr: 'Mode sombre', en: 'Dark mode', pt: 'Modo escuro', ar: 'الوضع الداكن', dyu: 'Dibi mode' },
  'language.label': { fr: 'Choisir la langue', en: 'Choose language', pt: 'Escolher idioma', ar: 'اختر اللغة', dyu: 'Kan sugandi' },
  'home.badge': { fr: 'Centre de veille 24h/24 · Abidjan', en: '24/7 monitoring centre · Abidjan', pt: 'Centro de monitorização 24/7 · Abidjan', ar: 'مركز مراقبة على مدار الساعة · أبيدجان', dyu: 'Kɔlɔsili san 24/7 · Abidjan' },
  'home.title1': { fr: 'Votre monde.', en: 'Your world.', pt: 'O seu mundo.', ar: 'عالمك.', dyu: 'I ka diɲɛ.' },
  'home.title2': { fr: 'Sous haute intelligence.', en: 'Protected by intelligence.', pt: 'Protegido com inteligência.', ar: 'محمي بذكاء متقدم.', dyu: 'Hakilima lakana kɔnɔ.' },
  'home.description': { fr: 'Protégez, pilotez et simplifiez votre maison depuis une seule plateforme. SafeR veille, anticipe et intervient — même quand vous n’êtes pas là.', en: 'Protect, control and simplify your home from one platform. SafeR watches, anticipates and responds — even when you are away.', pt: 'Proteja, controle e simplifique a sua casa numa única plataforma. A SafeR vigia, antecipa e intervém — mesmo quando está ausente.', ar: 'احمِ منزلك وتحكم به من منصة واحدة. تراقب SafeR وتتوقع وتتدخل حتى عندما تكون بعيداً.', dyu: 'I ka so lakana, a mara ani a nɔgɔya plateforme kelen na. SafeR bɛ kɔlɔsi, ka kunbɛn ani ka baara kɛ hali i tun tɛ yen.' },
  'home.configure': { fr: 'Configurer ma sécurité', en: 'Configure my security', pt: 'Configurar a minha segurança', ar: 'إعداد نظام الحماية', dyu: 'N ka lakanafali labɛn' },
  'home.how': { fr: 'Voir comment ça marche', en: 'See how it works', pt: 'Ver como funciona', ar: 'اكتشف كيف تعمل', dyu: 'A baara cogo lajɛ' },
  'solutions.eyebrow': { fr: 'Protection connectée', en: 'Connected protection', pt: 'Proteção conectada', ar: 'حماية متصلة', dyu: 'Lakanafali min ka fara ɲɔgɔn kan' },
  'solutions.title': { fr: 'Une solution SafeR pour chaque risque.', en: 'A SafeR solution for every risk.', pt: 'Uma solução SafeR para cada risco.', ar: 'حل SafeR لكل خطر.', dyu: 'SafeR furakɛli bɛ gɛlɛya bɛɛ la.' },
  'solutions.intro': { fr: 'Explorez nos univers de protection, puis entrez dans le détail des équipements et services adaptés à votre espace.', en: 'Explore our protection solutions, then discover the equipment and services suited to your space.', pt: 'Explore as nossas soluções de proteção e descubra os equipamentos e serviços adequados ao seu espaço.', ar: 'اكتشف حلول الحماية والمعدات والخدمات المناسبة لمساحتك.', dyu: 'An ka lakanafaliw lajɛ, ka min bɛn i ka yɔrɔ ma sugandi.' },
  'solution.video-intelligente.title': { fr: 'Vidéo intelligente', en: 'Smart video', pt: 'Vídeo inteligente', ar: 'الفيديو الذكي', dyu: 'Vidéo hakilima' },
  'solution.video-intelligente.summary': { fr: 'Voyez ce qui compte. Ignorez le bruit.', en: 'See what matters. Ignore the noise.', pt: 'Veja o que importa. Ignore o ruído.', ar: 'شاهد ما يهم وتجاهل الضوضاء.', dyu: 'Min ka nafa, o lajɛ. Tɔw bila.' },
  'solution.video-intelligente.description': { fr: 'Une chaîne vidéo pensée pour vérifier rapidement, réduire les fausses alertes et garder un œil sur votre maison, même à distance.', en: 'A video system designed to verify quickly, reduce false alerts and watch over your home from anywhere.', pt: 'Um sistema de vídeo concebido para verificar rapidamente, reduzir falsos alertas e vigiar a sua casa à distância.', ar: 'نظام فيديو للتحقق السريع وتقليل الإنذارات الكاذبة ومراقبة منزلك عن بُعد.', dyu: 'Vidéo sistɛmu min bɛ ko kɔrɔbɔ joona, ka kunnafoni galontaw dɔgɔya ani ka i ka so kɔlɔsi yɔrɔ jan.' },
  'solution.alarmes-connectees.title': { fr: 'Alarmes connectées', en: 'Connected alarms', pt: 'Alarmes conectados', ar: 'إنذارات متصلة', dyu: 'Alarme faralenw' },
  'solution.alarmes-connectees.summary': { fr: 'Détecter tôt. Réagir juste.', en: 'Detect early. Respond right.', pt: 'Detetar cedo. Responder bem.', ar: 'اكتشف مبكراً واستجب بدقة.', dyu: 'A ye sɔrɔ joona. A ye baara kɛ ka ɲɛ.' },
  'solution.alarmes-connectees.description': { fr: 'Intrusion, fumée, chaleur ou appel d’urgence : chaque signal rejoint une plateforme commune et un protocole clair.', en: 'Intrusion, smoke, heat or emergency call: every signal reaches one platform and a clear response protocol.', pt: 'Intrusão, fumo, calor ou emergência: cada sinal chega a uma plataforma e a um protocolo claro.', ar: 'اقتحام أو دخان أو حرارة أو طوارئ: تصل كل إشارة إلى منصة واحدة وبروتوكول واضح.', dyu: 'Donni, sisi, funteni walima dɛmɛ ɲinini: kunnafoni bɛɛ bɛ taa plateforme kelen na.' },
  'solution.controle-acces.title': { fr: 'Contrôle d’accès', en: 'Access control', pt: 'Controlo de acesso', ar: 'التحكم في الدخول', dyu: 'Donni marali' },
  'solution.controle-acces.summary': { fr: 'La bonne personne. Au bon endroit. Au bon moment.', en: 'The right person. The right place. The right time.', pt: 'A pessoa certa. No lugar certo. No momento certo.', ar: 'الشخص المناسب، في المكان والوقت المناسبين.', dyu: 'Mɔgɔ min ka kan. Yɔrɔ min na. Waati min na.' },
  'solution.controle-acces.description': { fr: 'Simplifiez l’entrée des proches, employés, visiteurs et prestataires sans perdre la maîtrise des autorisations.', en: 'Simplify access for family, staff, visitors and providers while keeping full control of permissions.', pt: 'Simplifique o acesso de familiares, colaboradores, visitantes e prestadores mantendo o controlo.', ar: 'بسّط دخول العائلة والموظفين والزوار مع الاحتفاظ بالتحكم الكامل في الصلاحيات.', dyu: 'Denbayaw, baarakɛlaw, dunanw ni baarakɛlaw ka donni nɔgɔya, k’a mara i bolo.' },
  'solution.domotique.title': { fr: 'Maison intelligente', en: 'Smart home', pt: 'Casa inteligente', ar: 'المنزل الذكي', dyu: 'So hakilima' },
  'solution.domotique.summary': { fr: 'Votre sécurité devient un réflexe de la maison.', en: 'Security becomes a natural reflex of your home.', pt: 'A segurança torna-se um reflexo natural da sua casa.', ar: 'تصبح الحماية جزءاً طبيعياً من منزلك.', dyu: 'Lakanafali bɛ kɛ i ka so wali ye.' },
  'solution.domotique.description': { fr: 'Reliez éclairage, climatisation, accès et capteurs pour créer des scénarios utiles, économes et rassurants.', en: 'Connect lighting, climate, access and sensors to create useful, efficient and reassuring routines.', pt: 'Ligue iluminação, climatização, acessos e sensores para criar rotinas úteis e eficientes.', ar: 'اربط الإضاءة والتكييف والدخول والمستشعرات لإنشاء سيناريوهات مفيدة وفعالة.', dyu: 'Yeelen, nɛnɛmaya, donni ni capteurw fara ɲɔgɔn kan walasa ka baara nɔgɔmanw da.' },
  'common.discover': { fr: 'Découvrir', en: 'Discover', pt: 'Descobrir', ar: 'اكتشف', dyu: 'A lajɛ' },
  'common.details': { fr: 'Voir les détails', en: 'View details', pt: 'Ver detalhes', ar: 'عرض التفاصيل', dyu: 'A kunnafoni lajɛ' },
  'common.assessment': { fr: 'Faire mon diagnostic', en: 'Start my assessment', pt: 'Fazer o meu diagnóstico', ar: 'ابدأ تقييمي', dyu: 'N ka kɔrɔbɔli daminɛ' },
  'common.quote': { fr: 'Demander un devis', en: 'Request a quote', pt: 'Pedir orçamento', ar: 'اطلب عرضاً', dyu: 'Sɔngɔ ɲini' },
  'common.backSolutions': { fr: 'Toutes les solutions', en: 'All solutions', pt: 'Todas as soluções', ar: 'كل الحلول', dyu: 'Furakɛliw bɛɛ' },
  'detail.included': { fr: 'Ce qui est inclus', en: 'What is included', pt: 'O que está incluído', ar: 'ما هو مشمول', dyu: 'Min bɛ a kɔnɔ' },
  'detail.operation': { fr: 'Comment cela fonctionne', en: 'How it works', pt: 'Como funciona', ar: 'كيف يعمل', dyu: 'A bɛ baara cogo min' },
  'detail.ready': { fr: 'Prêt à mieux protéger votre espace ?', en: 'Ready to better protect your space?', pt: 'Pronto para proteger melhor o seu espaço?', ar: 'هل أنت مستعد لحماية مساحتك بشكل أفضل؟', dyu: 'I labɛnnen don i ka yɔrɔ lakana kosɛbɛ wa?' },
  'support.eyebrow': { fr: 'Assistance SafeR', en: 'SafeR support', pt: 'Suporte SafeR', ar: 'دعم SafeR', dyu: 'SafeR dɛmɛ' },
  'support.title': { fr: 'Une équipe présente, avant et après l’alerte.', en: 'A team by your side, before and after an alert.', pt: 'Uma equipa presente, antes e depois do alerta.', ar: 'فريق بجانبك قبل التنبيه وبعده.', dyu: 'An ka ekipi bɛ i fɛ sani ni kabini kunnafoni kɔ.' },
  'support.intro': { fr: 'Obtenez la bonne aide rapidement, suivez vos demandes et gardez votre système au meilleur niveau de disponibilité.', en: 'Get the right help quickly, track your requests and keep your system performing at its best.', pt: 'Obtenha rapidamente a ajuda certa, acompanhe os pedidos e mantenha o sistema no melhor nível.', ar: 'احصل على الدعم المناسب بسرعة وتابع طلباتك وحافظ على جاهزية نظامك.', dyu: 'Dɛmɛ min ka kan sɔrɔ joona, i ka ɲininiw nɔ bila ani i ka sistɛmu mara a ka ɲi.' },
  'support.maintenance': { fr: 'Maintenance & entretien', en: 'Maintenance & care', pt: 'Manutenção e assistência', ar: 'الصيانة والعناية', dyu: 'Dilan ni ladonni' },
  'about.eyebrow': { fr: 'À propos de SafeR', en: 'About SafeR', pt: 'Sobre a SafeR', ar: 'عن SafeR', dyu: 'SafeR ko' },
  'about.title': { fr: 'La confiance inspire tout ce que nous protégeons.', en: 'Trust inspires everything we protect.', pt: 'A confiança inspira tudo o que protegemos.', ar: 'الثقة تلهم كل ما نحميه.', dyu: 'Dannaya de bɛ an ka lakanafali bɛɛ la.' },
  'about.intro': { fr: 'SafeR est la marque de sécurité intelligente de RADIANT ASSISTANCE SECURITY, conçue pour rapprocher technologie, présence humaine et qualité de service.', en: 'SafeR is the smart security brand of RADIANT ASSISTANCE SECURITY, bringing technology, human presence and service quality together.', pt: 'A SafeR é a marca de segurança inteligente da RADIANT ASSISTANCE SECURITY, unindo tecnologia, presença humana e qualidade de serviço.', ar: 'SafeR هي علامة الأمن الذكي التابعة لـ RADIANT ASSISTANCE SECURITY، وتجمع بين التقنية والحضور البشري وجودة الخدمة.', dyu: 'SafeR ye RADIANT ASSISTANCE SECURITY ka lakanafali hakilima marka ye; a bɛ teknoloji, adamaden dɛmɛ ni baarakɛcogo ɲuman fara ɲɔgɔn kan.' },
  'footer.brand': { fr: 'Une marque de RADIANT ASSISTANCE SECURITY. La technologie ivoirienne au service d’une tranquillité sans compromis.', en: 'A RADIANT ASSISTANCE SECURITY brand. Ivorian technology serving uncompromising peace of mind.', pt: 'Uma marca RADIANT ASSISTANCE SECURITY. Tecnologia marfinense ao serviço da tranquilidade.', ar: 'علامة من RADIANT ASSISTANCE SECURITY. تقنية إيفوارية لراحة بال بلا تنازلات.', dyu: 'RADIANT ASSISTANCE SECURITY ka marka. Kotidiwari teknoloji bɛ hɛrɛ sɔrɔli dɛmɛ.' },
};

function applyLocale(locale: Locale) {
  const html = document.documentElement;
  html.lang = locale === 'dyu' ? 'dyu' : locale;
  html.dir = locale === 'ar' ? 'rtl' : 'ltr';
  html.dataset.locale = locale;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (!key) return;
    const value = translations[key]?.[locale];
    if (value && element.textContent !== value) element.textContent = value;
  });
}

export default function SitePreferences({ compact = false }: { compact?: boolean }) {
  const [locale, setLocale] = useState<Locale>('fr');
  const [theme, setTheme] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncPreferences = (event: Event) => {
      const detail = (event as CustomEvent<{ locale?: Locale; theme?: Theme }>).detail;
      if (detail?.locale) setLocale(detail.locale);
      if (detail?.theme) setTheme(detail.theme);
    };
    window.addEventListener(preferencesEvent, syncPreferences);

    const savedLocale = localStorage.getItem('safer-locale') as Locale | null;
    const savedTheme = localStorage.getItem('safer-theme') as Theme | null;
    const initialLocale = languages.some((item) => item.code === savedLocale) ? savedLocale! : 'fr';
    const initialTheme = savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = initialTheme;
    applyLocale(initialLocale);

    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setLocale(initialLocale);
      setTheme(initialTheme);
      setReady(true);
    });
    return () => {
      active = false;
      window.removeEventListener(preferencesEvent, syncPreferences);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('safer-theme', theme);
    window.dispatchEvent(new CustomEvent(preferencesEvent, { detail: { theme } }));
  }, [ready, theme]);

  useEffect(() => {
    if (!ready) return;
    applyLocale(locale);
    localStorage.setItem('safer-locale', locale);
    window.dispatchEvent(new CustomEvent(preferencesEvent, { detail: { locale } }));
    const observer = new MutationObserver(() => applyLocale(locale));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale, ready]);

  const languageLabel = translations['language.label'][locale];
  const themeLabel = translations[theme === 'dark' ? 'theme.light' : 'theme.dark'][locale];

  return (
    <div className={`preference-controls flex items-center ${compact ? 'w-full gap-2' : 'gap-2'}`}>
      <label className={`language-control relative ${compact ? 'min-w-0 flex-1' : ''}`}>
        <span className="sr-only">{languageLabel}</span>
        <select
          aria-label={languageLabel}
          value={locale}
          onChange={(event) => setLocale(event.target.value as Locale)}
          className={`h-10 appearance-none rounded-full border border-current/15 bg-transparent pl-3 pr-8 text-xs font-bold outline-none transition hover:border-[#52c6ff] focus-visible:ring-2 focus-visible:ring-[#52c6ff] ${compact ? 'w-full' : 'w-[72px]'}`}
        >
          {languages.map((language) => <option key={language.code} value={language.code}>{compact ? language.label : language.short}</option>)}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px]">▾</span>
      </label>
      <button
        type="button"
        onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}
        aria-label={themeLabel}
        title={themeLabel}
        className="grid size-10 shrink-0 place-items-center rounded-full border border-current/15 bg-transparent text-sm transition hover:border-[#52c6ff] hover:text-[#52c6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52c6ff]"
      >
        <span aria-hidden="true">{theme === 'dark' ? '☀' : '◐'}</span>
      </button>
    </div>
  );
}
