import { TypeNotification } from "../shared.lib/api/notification.api";
import { StateTask, TypeTask } from "../shared.lib/api/task.api";
import { Constraints, Logic } from "../shared.lib/filter-and-sort/filter";

const TypeNotificationLoc: Record<TypeNotification, string> = {
  taskFinish: "Завершение задачи",
  taskStart: "Начало задачи"
};

const TypeFilterLogicLoc: Record<Logic, string> = {
  [Logic.where]: 'Где',
  [Logic.or]: 'Или',
  [Logic.and]: 'И',
};

const TypeTaskLoc: Record<TypeTask, string> = {
  none: "Не определена",
  readTestTask: "Чтение тестовой задачи",
  readTestUnits: "Чтение тестовой задачи по units",
  readAsinsAMZ: "Amazon - Чтение ASINs",
  readUrlsAMZ: "Amazon - Чтение URL",
  readListFromUrlAMZ: "Amazon - Чтение списков",
  readUrlsEbay: "eBay - Чтение страниц по URL",
  readListFromUrlEbay: "eBay - Чтение списков",
  readPagesFromSellerEbay: "eBay - Чтение списков по селлеру",
  comparePricesWithKeepa: "Сравинить с Amazon через Keepa",
  existListFromQuerySuplWB: "WB - Проверить наличие товаров в запросе",
  posListFromQueryWB: "WB - Получить позиции товаров в запросах",
  readListFromQueryWB: "WB - Получить список товаров по запросам"
}

const TypeFilterConstraintsLoc: Record<Constraints, string> = {
  [Constraints.none]: "",
  [Constraints.strIs]: 'Равно',
  [Constraints.strIsNot]: 'Не равно',
  [Constraints.strContains]: 'Содержит',
  [Constraints.strDoesNotContains]: 'Не содержит',
  [Constraints.strStartWith]: 'Начинается с',
  [Constraints.strEndWith]: 'Заканчивается на',
  [Constraints.strIsEmpty]: 'Пусто',
  [Constraints.strIsNotEmpty]: 'Не пусто',

  [Constraints.numEquals]: "=",
  [Constraints.numNotEquals]: "≠",
  [Constraints.numGreaterThan]: ">",
  [Constraints.numLessThan]: "<",
  [Constraints.numGreaterThanOrEqualTo]: "≥",
  [Constraints.numLessThanOrEqualTo]: "≤",
  [Constraints.numIsEven]: 'Четное',
  [Constraints.numIsOdd]: 'Нечетное',

  [Constraints.boolIs]: '=',
  [Constraints.boolIsNot]: '≠',
};

const StateTaskLoc: Record<StateTask, string> = {
  [StateTask.wait]: 'Ожидание',
  [StateTask.cancel]: 'Отменен',
  [StateTask.cancel_request]: 'Запрос отмены',
  [StateTask.complite]: 'Завершен',
  [StateTask.proccess]: 'В процессе',
  [StateTask.complite_err]: 'Ошибка',
}

export const ru = {
  common: {
    search: "Поиск...",
    close: "Закрыть",

  },
  asinTable: {
    name: "Имя:",
    row: "Строк:"
  },
  auth: {
    signUpSuccessDescription: "Используйте новые учетные данные для входа",
    signUpSuccessMessage: "Новый пользователь был создан",
  },
  login: {
    loginInfo: "Введите свой адрес электронной почты и пароль для доступа к панели администратора",
    noAccount: "Еще нет аккаунта? Создать ",
    signupLink: "здесь",
    forgotPassword: "Забыли пароль?",
    forgotPasswordTitle: "Восстановление пароля",
    sendEmail: "Отправить",
    signInSend: "Войти",
    back: "Назад",
    signInTitle: "Вход",
    remember: "Запомнить меня"
  },
  signUp: {
    signUpTitle: "Регистрация",
    inputData: "Пожалуйста, введите свои данные!",
    inputFirstName: "Пожалуйста, введите свое имя",
    inputLastName: "Пожалуйста, введите свою фамилию",
    inputEmail: "Пожалуйста, введите адрес электронной почты",
    inputPassword: "Пожалуйста, введите пароль",
    inputLang: "Пожалуйст, выберите язык",
    firstName: "Имя",
    lastName: "Фамилия",
    password: "Пароль",
    email: "Email",
    signUpSend: "Зарегистрироваться",
    haveAccount: "Уже есть аккаунт?",
    invalidEmail: "Некорректный адрес электронной почты",
    invalidFirstName: "Некорректное имя",
    invalidLastName: "Некорректная фамилия",
    invalidPasswordLength: "Пароль должен быть не менее 8 символов и не более 32 ",
    chooseLang: "Выберите язык"
  },
  newPassword: {
    successMessage: "Новый пароль установлен",
    title: "Установить новый пароль"
  },
  verifyCode: {
    title: "Код был отправлен на вашу почту. Введите код для подтверждения вашей личности",
    code: "Код"
  },
  profile: {
    profile: "Профиль",
    inputNewPassword: "Пожалуйста,введите новый пароль!",
    inputOldPassword: "Пожалуйста,введите старый пароль!",
    errorOldPassword: "Проверьте старый пароль!",
    firstName: "Имя",
    lastName: "Фамилия",
    title: "Личная информация",
    settings: "Настройки",
    notification: "Уведомления",
    email: "Email",
    logout: "Выход",
    lang: "Язык",
    licDate: "Дата окончания лицензии",
    change: "Изменить данные",
    succChange: "Данные успешно изменены!",
    errorChange: "Проверьте введенные данные!",
    eqlPass: "Новый пароль не должен совпадать со старым паролем!",
    remember: "Запомнить меня",
    chaneLang: "Сменить язык",
    changePassword: "Изменить пароль",
    newPassword: "Новый пароль",
    oldPassword: "Старый пароль",
    succChangePassword: "Пароль успешно изменен"
  },
  apiProfile: {
    title: "API доступ",
    updateKey: "Получить новый ключ",
    keyName: "Ключ API",
    successRefresh: "Ключ API успешно обновлен!",
    successEnable: "Доступ API успешно включен!",
    on: "Выключить доступ к API",
    off: "Включить доступ к API",
  },
  errors: {
    invalidEmail: "Введен некорректный адрес электронной почты!",
    invalidData: "Проверьте введенные данные!",
    invalidCode: "Неверный код!",
    inputOldPassword: "Введите старый пароль!",
    checkData: "Проверьте введенные данные!",
    ErrPassword: "Введен неверный пароль!",
    UserNotExist: "Пользователя с таким email не существует!",
    emailExist: "Пользователя с таким email уже существует!",
    notNetwork: "Ошибка подключения к серверу!",
    emailNotVerified: "Ваш email неверефицирован. Пройдите процедуру регистрации заново!",
    codeNotEq: "Неверный код!",
    taskNotFound: "Задача не найдена!",
  },
  setNewPassword: {
    title: "Установить новый пароль",
    confirmPassword: "Подтвердите пароль",
    inputConfirmPassword: "Пожалуйста, подтвердите Ваш пароль"
  },
  sider: {
    tasks: "Задачи",
    priceComparator: "Сравнитель цен",
    priceComparatorTemplate: "Шаблоны",
    competitors: "Конкуренты",
    othersCompetitors: "Другие продавцы",
    analysisСompetitors: "Анализ конкурентов",
    user: "Пользователь",
    profile: "Профиль",
    apiProfile: "API доступ",

  },
  filter: {
    name: "Фильтр",
    filtration: "Применить",
    clear: "Сбросить",
    addRule: "Добавить правило",
    emptyRule: "Заполните пустые поля!",
    column: "Колонка",
    constrainButton: "Ограничение",
    value: "Значение",
    logic: TypeFilterLogicLoc,
    constraints: TypeFilterConstraintsLoc,
    oneRule: "правило",
    manyRules: "правила",
  },
  view: {
    name: "Предствление",
    fileName: "Название",
    checkFilter: "Для сохранения исправьте некорректные параметры фильтрации!"
  },
  configColumns: {
    saveUploadView: "Cохранить/загрузить представления",
    showAll: " Показывать все",
    hideAll: "Сбросить все",
  },
  notif: {
    confirmAll: "Подтвердить все события",
    typeNotification: TypeNotificationLoc,
    date: "Дата",
    msg: "Сообщение",
    report: "Отчет"
  },
  resource: {
    invalidFile: "Некорректное расширение файла. Пожалуйста, выберите файл с расширением .json.",
    title: "Cохранить/загрузить предустановки столбцов",
    fileName: "Название файла",
    saveResource: "  Сохранить настройки",
    textSave: "Сохранить настройки для повторного примения к таблице.",
    loadResource: "Загрузить настройки",
    importFromLocal: "Импортировать набор параметров столбцов.",
    required: "Заполните поле",
    maxFileName: "Максимум 15 символов"
  },
  priceCmp: {
    topMenuLabel: 'Прайсы',
    upload: "Загрузить прайс",
    template: "Название шаблона",
    newTemp: "Создать новый шаблон",
    saveTemp: "Шаблон сохранен!",
    notCorrectTemp: "Шаблон некорретный! ",
    errorUrl: "Неверный url!"
  },
  tasks: {
    addTaskTitle: "Добавление задания",
    writeUrl: "Введите список URL-адресов, по одному URL в каждой строке, например:",
    writeAsin: "Введите список ASIN. Можно по одному URL в строку, или разделять запятой, точкой с запятой или пробелом. Например:",
    enterUrlList: "Введите URL списка",
    enterAsin: "Введите ASIN",
    successAdd: (name: string) => `Задание ${name} успешно добавлено`,
    errorAdd: (name: string) => `Ошибка при добавлении задания ${name}`,
    type: TypeTaskLoc,
    more: "Подробнее...",
    canceledTask: "Задание отменено",
    requiredParams: "Не введены обязательные параметры",
  },
  notFoundUrl: {
    subTitle: "Извините, запрашиваемая страница не существует",
    toPrimary: " На главную"
  },
  copyClipboard: {
    succCopy: 'Текст скопирован. Можно вставлять в Google таблицы',
    errorCopy: "Ошибка при копировании",
    errorCopyText: "Ошибка при копировании текста",

  },
  state: StateTaskLoc,
  asinColumns: {
    note: "Примечание",
    copy: "Копировать"
  },
  saveSettings: {
    modalTitle: "Загрузить/сохранить предустановки столбцов",
    exportSettings: " Экспортировать настройки",
    uploadSettings: "Загрузить настройки"
  },
  tabView: {
    successAdd: (name: string) => `Представление: '${name}' успешно сохранено`,
    errorAdd: (err: string) => `Ошибка сохранение представления. ${err}. Обратитесь к разработчику`,
    viewIsExist: "Представленние уже существует. Переписать?"
  },
  formatObject: {
    fullText: "Полный текст",
    success: "Успешно",
    succTextCopied: "Текст скопирован в буфер обмена!",
    error: "Ошибка копирования!",
    errorTextCopied: "Oшибка в копировании текста!",
  },
  comparePrice: {
    saveTempAndSaveKeepa:"Скачайте шаблон или добавьте их в Keepa",
    downloadPreset: "Скачать пресет для Keepa",
    notFoundCodeInFile: `Не найдено не одного подходящего кода в файлах`,
    succCopy: 'Текст скопирован. Можно вставлять в Google таблицы, Excel и др.',
    errorCopy: "Ошибка при копировании",
    chooseTemplate: 'Выберите шаблон поставщика',
    missingRequireFields: `Обязательные поля Keepa отсутствуют.`,
    notCorrectFile: (type: string, fileName: string) => `${fileName} не соответствует типу  ${type} `,
    errorCopyText: (err: any) => `Ошибка при копировании текста. ${err}`,
    notFoundTempForFile: (fileName: string) => `Шаблон для файла ${fileName} не найден. Создайте его в разделе сравнитель цен`,
    copyUpcKeepa: "Скопируйте UPC для Keepa",
    uploadFileKeepa: "Загрузите файл Keepa",
    finish: "Финиш",
    cutCSV: 'Разделитель CSV',
    uploadFile: 'Загрузите файл.',
    uploadSellerFile: 'Загрузите файлы поставщиков',
    uploadedFiles: (length: number) => `загруженo ${length} файл(а) поставщика`,
    succUpload: 'Keepa.xlsx загружен',
    uploadFileKeepaXLSX: 'Загрузите Keepa.xlsx',
    displayTable: "Выводить в таблицу если не указан UPC?",
    template: {
      edit: "Изменить",
      delete: "Удалить",
      name: "Название"
    },
    copyUPC:"Копировать UPC",
    openKeepa:".. и открыть Keepa"
  },
  addTestTaskForm: {
    timeOutStep: "Шаг Таймаута (мс)",
    byNotRequired: "До (необязательно)",
    unitsSum: "Количество юнитов"
  },
  addWBForm: {
    idSupl: "Id продавца",
    dest: "Локация",
    queries: "Список запросов",
    deepRead: "Глубина чтения",
    skuWBs: "Список артикулов WB, продавца",
    writeQueries: "Введите список запросов по одному в строку",
    writeSKUs: "Введите список: <артикул WB><разделитель><артикул продавца>. Разделителем может быть табуляция,';',','. Артикул продавца не обязательное поле",
  },
  baseTaskForm: {
    additionalParameters: "Дополнительные параметры",
    name: "Имя",
    description: "Описание"
  },
  amazonEbayAddButtons: {
    errorAddTask: `Ошибка добавления задания `,
    succAdd: (name: string) => `Задание ${name} успешно добавлено`,
    goToTask: "Перейти к заданию",
    moreDetails: "Подробно...",
    test: "Tecт"
  },
  columns: {//listAmazonEbayColumns
    name: "Название",
    price: "Цена",
    rating: "Рейтинг",
    reviews: "Отзывы",
    delivery: "Доставка",
    priceTo: "Цена",
    shipPrice: "Стоимость доставки",
    condition: "Состояние",
    cariation: "Варианция",
    state: "Состояние",
    progress: "Прогресс",
    report: "Отчет",
    repeat: "Повторить",
    cancel: "Заверишить",
    description: "Описание",
    fields: "Поля",
    sellersFields: "Поля поставщиков",
    formula: "Формула"
  },
  taskTableDesc: {
    notAvailableInfo: "Информация о задаче отсутствует.",
    typeOfTask: "Тип задачи",
    stateOfTask: "Состояние задачи",
    taskInfo: "Информация о задачах"
  },
  resourceTemplate: {
    menu: {
      viewing: "Просмотр",
      check: "Проверить",
      save: "Сохранить"
    },
    formatters: {
      useAT: "Введите @ для использования"
    },
    fields: "Поля",
    sellersFields: "Поля поставщика",
    formula: "Формула",
    checkColumn: "Проверка",
    notCorrectFile: (type: string, fileName: string) => `${fileName} не соответствует типу ${type} `,
    errorFileParsing: "Ошибка при разборе содержимого файла.",
    checkData: "Проверьте данные.",
    uploadSellerPrice: 'Загрузите прайс поставщика',
    bindFileds: 'Привяжите поля поставщика (колонка 2) к полям ASINExpert ',
    useFormula: 'Если в файле поставщика нет данных то используйте формулу',
    setNameAndSave: 'Задайте имя и сохраните',
    getProfit: 'Получайте прибыль 👍'
  },
}

// Промт для чаты GPT
// Перевести полностью все строки текста, используемые в пользовательском интерфейсе компьютерной программы, написанной на React, на английский и украинский языки.
// Сделать переводы максимально лаконичными и понятными для пользователя, поскольку они предназначены для пользовательского интерфейса.
// Обеспечить точность и ясность перевода, чтобы избежать недопонимания со стороны пользователей.
