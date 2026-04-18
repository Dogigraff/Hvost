export const ru = {
  app: {
    name: 'Хвост',
    tagline: 'Забота о вашем питомце в одном месте',
  },
  auth: {
    login: 'Войти',
    signup: 'Зарегистрироваться',
    logout: 'Выйти',
    email: 'Email',
    password: 'Пароль',
    displayName: 'Ваше имя',
    loginTitle: 'Вход в Хвост',
    signupTitle: 'Создать аккаунт',
    noAccount: 'Нет аккаунта?',
    hasAccount: 'Уже есть аккаунт?',
    checkEmail: 'Проверьте почту и подтвердите email',
    confirmationSent: 'Мы отправили ссылку подтверждения на',
    forgotPassword: 'Забыли пароль?',
    passwordResetSupport: 'Обратитесь в поддержку для сброса пароля',
  },
  nav: {
    home: 'Главная',
    dogs: 'Собаки',
    chat: 'Чат',
    profile: 'Профиль',
  },
  dogs: {
    addFirst: 'Добавьте первую собаку',
    addFirstHint: 'Начните вести журнал здоровья вашего питомца',
    addDog: 'Добавить питомца',
    editDog: 'Редактировать',
    deleteDog: 'Удалить питомца',
    deleteConfirm: 'Вы уверены? Все данные питомца будут удалены безвозвратно.',
    name: 'Кличка',
    breed: 'Порода',
    sex: 'Пол',
    birthDate: 'Дата рождения',
    weight: 'Вес (кг)',
    features: 'Особенности (аллергии, диеты)',
    notes: 'Заметки',
    male: 'Мальчик',
    female: 'Девочка',
    uploadPhoto: 'Загрузить фото',
    changePhoto: 'Сменить фото',
    photoSizeError: 'Фото не должно превышать 5 МБ',
    photoFormatError: 'Допустимые форматы: JPEG, PNG, WEBP',
    age: (years: number, months: number) => {
      const y = years > 0 ? `${years} ${pluralYears(years)}` : '';
      const m = months > 0 ? `${months} ${pluralMonths(months)}` : '';
      return [y, m].filter(Boolean).join(' ') || 'Меньше месяца';
    },
  },
  events: {
    tab: 'События',
    historyTab: 'История',
    add: 'Добавить событие',
    type: 'Тип',
    title: 'Заголовок',
    dateTime: 'Дата и время',
    notes: 'Заметка',
    markDone: 'Готово',
    markMissed: 'Пропущено',
    noEvents: 'На сегодня ничего не запланировано',
    noEventsHint: 'Нажмите «+» чтобы добавить событие',
    noHistory: 'История пуста',
    upcoming: 'Ближайшее',
    overdue: 'Просрочено',
    done: 'Выполнено',
    missed: 'Пропущено',
    planned: 'Запланировано',
    filterPeriod: 'Период',
    filter7: '7 дней',
    filter30: '30 дней',
    filter90: '90 дней',
    eventTypeLabel: {
      vaccine: 'Прививка',
      tick_pill: 'От клещей',
      deworming: 'Глистогон',
      grooming: 'Груминг',
      procedure: 'Процедура',
      other: 'Другое',
    },
    types: {
      vaccine: 'Прививка',
      tick_pill: 'Таблетка от клещей',
      deworming: 'Дегельминтизация',
      grooming: 'Груминг',
      procedure: 'Процедура',
      other: 'Другое',
    },
  },
  chat: {
    title: 'Хвост-Помощник',
    placeholder: 'Спросите о вашем питомце...',
    thinking: 'Хвост думает...',
    tips: [
      'Что ему нельзя есть?',
      'Когда следующая прививка?',
      'Как понять, что пора к ветеринару?',
    ],
    errorRateLimit: 'Превышен лимит запросов. Попробуйте позже.',
    error: 'Произошла ошибка. Попробуйте ещё раз.',
    disclaimer: 'Информация носит общий характер и не заменяет консультацию ветеринара.',
  },
  profile: {
    title: 'Профиль',
    displayName: 'Имя',
    email: 'Email',
    save: 'Сохранить',
    saved: 'Сохранено',
    uploadAvatar: 'Загрузить аватар',
    theme: 'Тема',
  },
  theme: {
    light: 'Светлая',
    dark: 'Тёмная',
    system: 'Системная',
  },
  common: {
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    loading: 'Загрузка...',
    error: 'Ошибка',
    retry: 'Повторить',
    required: 'Обязательное поле',
    back: 'Назад',
    confirm: 'Подтвердить',
    tryAgain: 'Попробовать снова',
  },
  landing: {
    hero: 'Хвост — журнал здоровья\nвашей собаки',
    heroSub: 'Прививки, обработки, напоминания и AI-помощник — всё в одном месте',
    cta: 'Начать бесплатно',
    everythingUnderControl: 'Всё под контролем',
    openGmail: 'Открыть Gmail',
    features: [
      { title: 'Карточка питомца', desc: 'Все данные о здоровье собаки в одном месте' },
      { title: 'Умный календарь', desc: 'Прививки, таблетки, груминг — никогда не забудете' },
      { title: 'История событий', desc: 'Полная история ухода всегда под рукой' },
      { title: 'AI-помощник', desc: 'Спросите Хвост-Помощника о здоровье питомца' },
    ],
    footer: {
      privacy: 'Политика конфиденциальности',
      offer: 'Публичная оферта',
      contact: 'Контакты',
    },
  },
} as const;

function pluralYears(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'года';
  return 'лет';
}

function pluralMonths(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'месяц';
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'месяца';
  return 'месяцев';
}
