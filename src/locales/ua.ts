import { TypeNotification } from "../shared.lib/api/notification.api";
import { StateTask, TypeTask } from "../shared.lib/api/task.api";
import { Constraints, Logic } from "../shared.lib/filter-and-sort/filter";
import { Translation } from "./lang";

const TypeNotificationLoc: Record<TypeNotification, string> = {
  taskFinish: "Завершення завдання",
  taskStart: "Початок завдання"
};

const TypeFilterLogicLoc: Record<Logic, string> = {
  [Logic.where]: 'Де',
  [Logic.or]: 'Або',
  [Logic.and]: 'І',
};

const TypeTaskLoc: Record<TypeTask, string> = {
  none: "Не визначено",
  readTestTask: "Читання тестового завдання",
  readTestUnits: "Читання тестового завдання за units",
  readAsinsAMZ: "Amazon - Читання ASINs",
  readUrlsAMZ: "Amazon - Читання URL",
  readListFromUrlAMZ: "Amazon - Читання списків",
  readUrlsEbay: "eBay - Читання сторінок за URL",
  readListFromUrlEbay: "eBay - Читання списків",
  readPagesFromSellerEbay: "eBay - Читання списків від продавця",
  comparePricesWithKeepa: "Порівняти з Amazon через Keepa",
  existListFromQuerySuplWB: "WB - Перевірити наявність товарів у запиті",
  posListFromQueryWB: "WB - Отримати позиції товарів у запитах",
  readListFromQueryWB: "WB - Отримати список товарів за запитами"
}

const TypeFilterConstraintsLoc: Record<Constraints, string> = {
  [Constraints.none]: "",
  [Constraints.strIs]: 'Дорівнює',
  [Constraints.strIsNot]: 'Не дорівнює',
  [Constraints.strContains]: 'Містить',
  [Constraints.strDoesNotContains]: 'Не містить',
  [Constraints.strStartWith]: 'Починається з',
  [Constraints.strEndWith]: 'Закінчується на',
  [Constraints.strIsEmpty]: 'Пусто',
  [Constraints.strIsNotEmpty]: 'Не пусто',

  [Constraints.numEquals]: "=",
  [Constraints.numNotEquals]: "≠",
  [Constraints.numGreaterThan]: ">",
  [Constraints.numLessThan]: "<",
  [Constraints.numGreaterThanOrEqualTo]: "≥",
  [Constraints.numLessThanOrEqualTo]: "≤",
  [Constraints.numIsEven]: 'Парне',
  [Constraints.numIsOdd]: 'Непарне',

  [Constraints.boolIs]: '=',
  [Constraints.boolIsNot]: '≠',
};

const StateTaskLoc: Record<StateTask, string> = {
  [StateTask.wait]: 'Очікування',
  [StateTask.cancel]: 'Скасовано',
  [StateTask.cancel_request]: 'Запит на скасування',
  [StateTask.complite]: 'Завершено',
  [StateTask.proccess]: 'В процесі',
  [StateTask.complite_err]: 'Помилка',
}


export const ua: Translation = {
  common: {
    search: "Пошук...",
    close: "Закрити"
  },
  auth: {
    signUpSuccessDescription: "Використовуйте нові облікові дані для входу",
    signUpSuccessMessage: "Нового користувача було створено",
  },
  login: {
    loginInfo: "Введіть свою електронну адресу та пароль для доступу до панелі адміністратора",
    noAccount: "Ще немає аккаунта? Створити ",
    signupLink: "тут",
    forgotPassword: "Забули пароль?",
    forgotPasswordTitle: "Відновлення пароля",
    sendEmail: "Відправити",
    signInSend: "Увійти",
    back: "Назад",
    signInTitle: "Вхід",
    remember: "Запам'ятати мене"
  },
  signUp: {
    signUpTitle: "Реєстрація",
    inputData: "Будь ласка, введіть свої дані!",
    inputFirstName: "Будь ласка, введіть своє ім'я",
    inputLastName: "Будь ласка, введіть своє прізвище",
    inputEmail: "Будь ласка, введіть адресу електронної пошти",
    inputPassword: "Будь ласка, введіть пароль",
    inputLang: "Будь ласка, оберіть мову",
    firstName: "Ім'я",
    lastName: "Прізвище",
    password: "Пароль",
    email: "Електронна пошта",
    signUpSend: "Зареєструватися",
    haveAccount: "Вже є аккаунт?",
    invalidEmail: "Неправильна електронна адреса",
    invalidFirstName: "Неправильне ім'я",
    invalidLastName: "Неправильне прізвище",
    invalidPasswordLength: "Пароль повинен містити не менше 8 символів та не більше 32",
    chooseLang: "Оберіть мову"
  },
  newPassword: {
    successMessage: "Новий пароль було встановлено",
    title: "Встановлення нового пароля"
  },
  verifyCode: {
    title: "На вашу електронну адресу було відправлено код. Введіть код, щоб підтвердити свою особу",
    code: "Код"
  },
  profile: {
    profile: "Профіль",
    inputNewPassword: "Будь ласка, введіть новий пароль!",
    inputOldPassword: "Будь ласка, введіть старий пароль!",
    errorOldPassword: "Перевірте старий пароль!",
    firstName: "Ім'я",
    lastName: "Прізвище",
    title: "Особиста інформація",
    settings: "Налаштування",
    notification: "Сповіщення",
    email: "Електронна пошта",
    logout: "Вийти",
    lang: "Мова",
    licDate: "Дата закінчення ліцензії",
    change: "Змінити інформацію",
    succChange: "Інформацію успішно змінено!",
    errorChange: "Перевірте введені дані!",
    eqlPass: "Новий пароль не повинен збігатися із старим!",
    remember: "Запам'ятати мене",
    chaneLang: "Змінити мову",
    changePassword: "Змінити пароль",
    newPassword: "Новий пароль",
    oldPassword: "Старий пароль",
    succChangePassword: "Пароль успішно змінено"
  },
  apiProfile: {
    title: "Доступ до API",
    updateKey: "Отримати новий ключ",
    keyName: "Ключ API",
    successRefresh: "Ключ API успішно оновлено!",
    successEnable: "Доступ до API успішно увімкнено!",
    on: "Вимкнути доступ до API",
    off: "Увімкнути доступ до API",
  },
  errors: {
    invalidEmail: "Введено неправильну електронну адресу!",
    invalidData: "Перевірте введені дані!",
    invalidCode: "Неправильний код!",
    inputOldPassword: "Введіть старий пароль!",
    checkData: "Перевірте введені дані!",
    ErrPassword: "Введено неправильний пароль!",
    UserNotExist: "Користувача з такою електронною адресою не існує!",
    emailExist: "Користувач з такою електронною адресою вже існує!",
    notNetwork: "Помилка підключення до сервера!",
    emailNotVerified: "Ваша електронна адреса не підтверджена. Будь ласка, пройдіть процедуру реєстрації знову!",
    codeNotEq: "Неправильний код!",
    taskNotFound: "Завдання не знайдено!",
  },
  setNewPassword: {
    title: "Встановлення нового пароля",
    confirmPassword: "Підтвердіть пароль",
    inputConfirmPassword: "Будь ласка, підтвердіть свій пароль"
  },
  sider: {
    tasks: "Завдання",
    priceComparator: "Порівняння цін",
    priceComparatorTemplate: "Шаблони",
    competitors: "Конкуренти",
    othersCompetitors: "Інші продавці",
    analysisСompetitors: "Аналіз конкурентів",
    user: "Користувач",
    profile: "Профіль",
    apiProfile: "Доступ до API",
    adminPanel: "Панель администратора"
  },
  filter: {
    name: "Фільтр",
    filtration: "Застосувати",
    clear: "Скинути",
    addRule: "Додати правило",
    emptyRule: "Заповніть порожні поля!",
    column: "Колонка",
    constrainButton: "Обмеження",
    value: "Значення",
    logic: TypeFilterLogicLoc,
    constraints: TypeFilterConstraintsLoc,
    oneRule: "правило",
    manyRules: "правил",
  },
  view: {
    name: "Вигляд",
    fileName: "Ім'я",
    checkFilter: "Виправте невірні параметри фільтра для збереження!"
  },
  configColumns: {
    saveUploadView: "Зберегти/Завантажити вигляди",
    showAll: " Показати все",
    hideAll: "Скинути все",
  },
  notif: {
    confirmAll: "Підтвердити всі події",
    typeNotification: TypeNotificationLoc,
    date: "Дата",
    msg: "Повідомлення",
    report: "Звіт"
  },

  resource: {
    invalidFile: "Невірне розширення файлу. Будь ласка, оберіть файл .json.",
    title: "Зберегти/Завантажити Налаштування Колонок",
    fileName: "Ім'я Файлу",
    saveResource: "Зберегти Налаштування",
    textSave: "Збережіть налаштування для повторного застосування до таблиці.",
    loadResource: "Завантажити Налаштування",
    importFromLocal: "Імпортуйте набір налаштувань колонок.",
    required: "Заповніть поле",
    maxFileName: "Максимум 15 символів"
  },
  priceCmp: {
    topMenuLabel: 'Прайс-листи',
    upload: "Завантажити Прайс-лист",
    template: "Ім'я Шаблону",
    newTemp: "Створити Новий Шаблон",
    saveTemp: "Шаблон Збережено!",
    notCorrectTemp: "Шаблон Невірний! ",
    errorUrl: "Невірний url!"
  },
  tasks: {
    addTaskTitle: "Додати Завдання",
    writeUrl: "Введіть список URL-адрес, одну URL-адресу на рядок, наприклад:",
    writeAsin: "Введіть список ASIN. Ви можете вводити одну URL-адресу на рядок або розділяти їх комою, крапкою з комою або пробілом. Наприклад:",
    enterUrlList: "Введіть список URL",
    enterAsin: "Введіть ASIN",
    successAdd: (name: string) => `Завдання ${name} успішно додано`,
    errorAdd: (name: string) => `Помилка додавання завдання ${name}`,
    type: TypeTaskLoc,
    more: "Більше...",
    canceledTask: "Завдання Скасовано",
    requiredParams: "Обов'язкові параметри не введені"
  },
  notFoundUrl: {
    subTitle: "Вибачте, запитувана сторінка не існує",
    toPrimary: " На Головну"
  },
  copyClipboard: {
    succCopy: 'Текст скопійовано. Ви можете вставити його в Google Sheets',
    errorCopy: "Помилка копіювання",
    errorCopyText: "Помилка копіювання тексту",
  },
  state: StateTaskLoc,
  asinColumns: {
    note: "Примітка",
    copy: "Копіювати"
  },
  saveSettings: {
    modalTitle: "Завантажити/Зберегти Налаштування Колонок",
    exportSettings: " Експортувати Налаштування",
    uploadSettings: "Завантажити Налаштування"
  },
  tabView: {
    successAdd: (name: string) => `Вигляд: '${name}' успішно збережено`,
    errorAdd: (err: string) => `Помилка збереження вигляду. ${err}. Зверніться до розробника`,
    viewIsExist: "Представлення вже існує. Переписати?"
  },
  formatObject: {
    fullText: "Повний Текст",
    success: "Успішно",
    succTextCopied: "Текст успішно скопійовано в буфер обміну!",
    error: "Помилка Копіювання!",
    errorTextCopied: "Помилка копіювання тексту!",
  },
  comparePrice: {
    downloadPreset: "Завантажити пресет для Keepa",
    notFoundCodeInFile: `Підходящий код у файлах не знайдено`,
    succCopy: 'Текст скопійовано. Ви можете вставити його в Google Sheets, Excel тощо.',
    errorCopy: "Помилка копіювання",
    chooseTemplate: 'Оберіть Шаблон Постачальника',
    missingRequireFields: `Відсутні обов'язкові поля Keepa.`,
    notCorrectFile: (type: string, fileName: string) => `${fileName} не відповідає типу ${type} `,
    errorCopyText: (err: any) => `Помилка копіювання тексту. ${err}`,
    notFoundTempForFile: (fileName: string) => `Шаблон для файлу ${fileName} не знайдено. Створіть його у розділі порівняння цін`,
    copyUpcKeepa: "Копіювати UPC для Keepa",
    uploadFileKeepa: "Завантажити файл Keepa",
    finish: "Завершити",
    cutCSV: 'Роздільник CSV',
    uploadFile: 'Завантажити файл.',
    uploadSellerFile: 'Завантажити Файли Постачальника',
    uploadedFiles: (length: number) => `${length} файл(ів) постачальника завантажено`,
    succUpload: 'Keepa.xlsx завантажено',
    uploadFileKeepaXLSX: 'Завантажити Keepa.xlsx',
    displayTable: "Відображати у таблиці, якщо UPC не вказано?",
    template: {
      edit: "Редагувати",
      delete: "Видалити",
      name: "Ім'я"
    },
    saveTempAndSaveKeepa: "Завантажте шаблон або додайте їх до Keepa",
    copyUPC: "Копіювати UPC",
    openKeepa: "... та відкрийте Keepa"
  },
  addWBForm: {
    idSupl: "Id продавця",
    dest: "Локація",
    queries: "Список запитів",
    deepRead: "Глибина читання",
    skuWBs: "Список артикулів WB, продавця",
    writeQueries: "Введіть список запитів по одному в рядок",
    writeSKUs: "Введіть список: <артикул WB><роздільник><артикул продавця>. Роздільником може бути табуляція, ';', ','. Артикул продавця не є обов'язковим полем",
  },
  addTestTaskForm: {
    timeOutStep: "Часова Затримка Кроку (мс)",
    byNotRequired: "До (не обов'язково)",
    unitsSum: "Кількість Одиниць"
  },
  baseTaskForm: {
    additionalParameters: "Додаткові Параметри",
    name: "Ім'я",
    description: "Опис"
  },
  amazonEbayAddButtons: {
    errorAddTask: `Помилка додавання завдання `,
    succAdd: (name: string) => `Завдання ${name} успішно додано`,
    goToTask: "Перейти до Завдання",
    moreDetails: "Деталі...",
    test: "Тест"
  },
  columns: {
    name: "Ім'я",
    price: "Ціна",
    rating: "Рейтинг",
    reviews: "Відгуки",
    delivery: "Доставка",
    priceTo: "Ціна До",
    shipPrice: "Вартість Доставки",
    condition: "Стан",
    cariation: "Варіація",
    state: "Стан",
    progress: "Прогрес",
    report: "Звіт",
    repeat: "Повторити",
    cancel: "Скасувати",
    description: "Опис",
    fields: "Поля",
    sellersFields: "Поля Постачальників",
    formula: "Формула"
  },

  taskTableDesc: {
    notAvailableInfo: "Інформація про завдання відсутня.",
    typeOfTask: "Тип Завдання",
    stateOfTask: "Стан Завдання",
    taskInfo: "Інформація про Завдання"
  },
  resourceTemplate: {
    menu: {
      viewing: "Перегляд",
      check: "Перевірити",
      save: "Зберегти"
    },
    formatters: {
      useAT: "Введіть @ для використання"
    },
    fields: "Поля",
    sellersFields: "Поля Постачальника",
    formula: "Формула",
    checkColumn: "Перевірка",
    notCorrectFile: (type: string, fileName: string) => `${fileName} не відповідає типу ${type} `,
    errorFileParsing: "Помилка розбору вмісту файлу.",
    checkData: "Перевірте дані.",
    uploadSellerPrice: 'Завантажте Прайс Постачальника',
    bindFileds: 'Прив’яжіть поля постачальника (колонка 2) до полів ASINExpert',
    useFormula: 'Використовуйте формулу, якщо в файлі постачальника немає даних',
    setNameAndSave: 'Встановіть ім’я і збережіть',
    getProfit: 'Отримуйте прибуток 👍'
  },
  asinTable: {
    name: "Ім'я:",
    row: "Рядок:"
  },
}

