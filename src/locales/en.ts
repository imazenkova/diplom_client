import { TypeNotification } from "../shared.lib/api/notification.api";
import { StateTask, TypeTask } from "../shared.lib/api/task.api";
import { Constraints, Logic } from "../shared.lib/filter-and-sort/filter";
import { Translation } from "./lang";

const TypeNotificationLoc: Record<TypeNotification, string> = {
  taskFinish: "Task Completion",
  taskStart: "Task Start"
};

const TypeFilterLogicLoc: Record<Logic, string> = {
  [Logic.where]: 'Where',
  [Logic.or]: 'Or',
  [Logic.and]: 'And',
};

const TypeTaskLoc: Record<TypeTask, string> = {
  none: "Undefined",
  readTestTask: "Reading Test Task",
  readTestUnits: "Reading Test Task by units",
  readAsinsAMZ: "Amazon - Reading ASINs",
  readUrlsAMZ: "Amazon - Reading URL",
  readListFromUrlAMZ: "Amazon - Reading lists",
  readUrlsEbay: "eBay - Reading pages by URL",
  readListFromUrlEbay: "eBay - Reading lists",
  readPagesFromSellerEbay: "eBay - Reading lists by seller",
  comparePricesWithKeepa: "Compare with Amazon via Keepa",
  existListFromQuerySuplWB: "WB - Check the availability of products in the query",
  posListFromQueryWB: "WB - Retrieve product positions in queries",
  readListFromQueryWB: "WB - Read list of products by queries"
}

const TypeFilterConstraintsLoc: Record<Constraints, string> = {
  [Constraints.none]: "",
  [Constraints.strIs]: 'Equals',
  [Constraints.strIsNot]: 'Does not equal',
  [Constraints.strContains]: 'Contains',
  [Constraints.strDoesNotContains]: 'Does not contain',
  [Constraints.strStartWith]: 'Starts with',
  [Constraints.strEndWith]: 'Ends with',
  [Constraints.strIsEmpty]: 'Is empty',
  [Constraints.strIsNotEmpty]: 'Is not empty',

  [Constraints.numEquals]: "=",
  [Constraints.numNotEquals]: "≠",
  [Constraints.numGreaterThan]: ">",
  [Constraints.numLessThan]: "<",
  [Constraints.numGreaterThanOrEqualTo]: "≥",
  [Constraints.numLessThanOrEqualTo]: "≤",
  [Constraints.numIsEven]: 'Is even',
  [Constraints.numIsOdd]: 'Is odd',

  [Constraints.boolIs]: '=',
  [Constraints.boolIsNot]: '≠',
};

const StateTaskLoc: Record<StateTask, string> = {
  [StateTask.wait]: 'Waiting',
  [StateTask.cancel]: 'Cancelled',
  [StateTask.cancel_request]: 'Cancellation Request',
  [StateTask.complite]: 'Completed',
  [StateTask.proccess]: 'In Process',
  [StateTask.complite_err]: 'Error'
}


export const en: Translation = {
  common: {
    search: "Search...",
    close: "Close"
  },
  auth: {
    signUpSuccessDescription: "Use new credentials to log in",
    signUpSuccessMessage: "New user has been created",
  },
  login: {
    loginInfo: "Enter your email address and password to access the admin panel",
    noAccount: "Don’t have an account? Create ",
    signupLink: "here",
    forgotPassword: "Forgot password?",
    forgotPasswordTitle: "Password Recovery",
    sendEmail: "Send",
    signInSend: "Sign In",
    back: "Back",
    signInTitle: "Sign In",
    remember: "Remember me"
  },
  signUp: {
    signUpTitle: "Sign Up",
    inputData: "Please, input your data!",
    inputFirstName: "Please, input your first name",
    inputLastName: "Please, input your last name",
    inputEmail: "Please, input your email address",
    inputPassword: "Please, input your password",
    inputLang: "Please, choose a language",
    firstName: "First Name",
    lastName: "Last Name",
    password: "Password",
    email: "Email",
    signUpSend: "Sign Up",
    haveAccount: "Already have an account?",
    invalidEmail: "Invalid email address",
    invalidFirstName: "Invalid first name",
    invalidLastName: "Invalid last name",
    invalidPasswordLength: "Password should be at least 8 characters and no more than 32",
    chooseLang: "Choose a language"
  },
  newPassword: {
    successMessage: "New password has been set",
    title: "Set New Password"
  },
  verifyCode: {
    title: "A code has been sent to your email. Enter the code to verify your identity",
    code: "Code"
  },
  profile: {
    profile: "Profile",
    inputNewPassword: "Please, input a new password!",
    inputOldPassword: "Please, input the old password!",
    errorOldPassword: "Check the old password!",
    firstName: "First Name",
    lastName: "Last Name",
    title: "Personal Information",
    settings: "Settings",
    notification: "Notifications",
    email: "Email",
    logout: "Logout",
    lang: "Language",
    licDate: "License Expiry Date",
    change: "Change Information",
    succChange: "Information successfully changed!",
    errorChange: "Check the input data!",
    eqlPass: "The new password must not match the old one!",
    remember: "Remember me",
    chaneLang: "Change Language",
    changePassword: "Change Password",
    newPassword: "New Password",
    oldPassword: "Old Password",
    succChangePassword: "Password successfully changed"
  },
  apiProfile: {
    title: "API Access",
    updateKey: "Get a new key",
    keyName: "API Key",
    successRefresh: "API Key successfully refreshed!",
    successEnable: "API Access successfully enabled!",
    on: "Turn off API Access",
    off: "Turn on API Access",
  },
  errors: {
    invalidEmail: "Invalid email entered!",
    invalidData: "Check the input data!",
    invalidCode: "Invalid code!",
    inputOldPassword: "Enter the old password!",
    checkData: "Check the input data!",
    ErrPassword: "Wrong password entered!",
    UserNotExist: "User with such email does not exist!",
    emailExist: "User with such email already exists!",
    notNetwork: "Server connection error!",
    emailNotVerified: "Your email is not verified. Please go through the registration procedure again!",
    codeNotEq: "Wrong code!",
    taskNotFound: "Task not found!",
  },
  setNewPassword: {
    title: "Set New Password",
    confirmPassword: "Confirm Password",
    inputConfirmPassword: "Please, confirm your password"
  },
  sider: {
    tasks: "Tasks",
    priceComparator: "Price Comparator",
    priceComparatorTemplate: "Templates",
    competitors: "Competitors",
    othersCompetitors: "Other Sellers",
    analysisСompetitors: "Competitor Analysis",
    user: "User",
    profile: "Profile",
    apiProfile: "API Access",
    adminPanel: "Admin Panel"
  },
  filter: {
    name: "Filter",
    filtration: "Apply",
    clear: "Reset",
    addRule: "Add rule",
    emptyRule: "Fill in the empty fields!",
    column: "Column",
    constrainButton: "Constraint",
    value: "Value",
    logic: TypeFilterLogicLoc,
    constraints: TypeFilterConstraintsLoc,
    oneRule: "rule",
    manyRules: "rules",
  },
  view: {
    name: "View",
    fileName: "Name",
    checkFilter: "Correct the incorrect filter parameters to save!"
  },
  configColumns: {
    saveUploadView: "Save/Upload Views",
    showAll: " Show All",
    hideAll: "Reset All",
  },
  notif: {
    confirmAll: "Confirm all events",
    typeNotification: TypeNotificationLoc,
    date: "Date",
    msg: "Message",
    report: "Report"
  },

  resource: {
    invalidFile: "Invalid file extension. Please, select a .json file.",
    title: "Save/Load Column Presets",
    fileName: "File Name",
    saveResource: "Save Settings",
    textSave: "Save settings for reapplying to the table.",
    loadResource: "Load Settings",
    importFromLocal: "Import a column settings set.",
    required: "Fill in the field",
    maxFileName: "Maximum 15 characters"
  },
  priceCmp: {
    topMenuLabel: 'Price Lists',
    upload: "Upload Price List",
    template: "Template Name",
    newTemp: "Create New Template",
    saveTemp: "Template Saved!",
    notCorrectTemp: "Template Incorrect! ",
    errorUrl: "Invalid url!"
  },
  tasks: {
    addTaskTitle: "Add Task",
    writeUrl: "Enter a list of URLs, one URL per line, for example:",
    writeAsin: "Enter a list of ASINs. You can either enter one URL per line or separate them by a comma, semicolon, or space. For example:",
    enterUrlList: "Enter URL list",
    enterAsin: "Enter ASIN",
    successAdd: (name: string) => `Task ${name} successfully added`,
    errorAdd: (name: string) => `Error adding task ${name}`,
    type: TypeTaskLoc,
    more: "More...",
    canceledTask: "Task Canceled",
    requiredParams: "Mandatory parameters not entered"
  },
  notFoundUrl: {
    subTitle: "Sorry, the requested page does not exist",
    toPrimary: " To Homepage"
  },
  copyClipboard: {
    succCopy: 'Text copied. You can paste it into Google Sheets',
    errorCopy: "Error copying",
    errorCopyText: "Error copying text",
  },
  state: StateTaskLoc,
  asinColumns: {
    note: "Note",
    copy: "Copy"
  },
  saveSettings: {
    modalTitle: "Load/Save Column Presets",
    exportSettings: " Export Settings",
    uploadSettings: "Upload Settings"
  },
  tabView: {
    successAdd: (name: string) => `View: '${name}' successfully saved`,
    errorAdd: (err: string) => `Error saving view. ${err}. Contact the developer`,
    viewIsExist: "The view already exists. Rewrite?"
  },
  formatObject: {
    fullText: "Full Text",
    success: "Successful",
    succTextCopied: "Text successfully copied to clipboard!",
    error: "Copy Error!",
    errorTextCopied: "Error copying text!",
  },
  asinTable: {
    name: "Name:",
    row: "Row:"
  },
  comparePrice: {
    downloadPreset: "Download preset for Keepa",
    notFoundCodeInFile: `No suitable code found in the files`,
    succCopy: 'Text copied. You can paste it into Google Sheets, Excel etc.',
    errorCopy: "Error copying",
    chooseTemplate: 'Choose Supplier Template',
    missingRequireFields: `Mandatory Keepa fields are missing.`,
    notCorrectFile: (type: string, fileName: string) => `${fileName} does not match the type ${type} `,
    errorCopyText: (err: any) => `Error copying text. ${err}`,
    notFoundTempForFile: (fileName: string) => `Template for file ${fileName} not found. Create it in the compare prices section`,
    copyUpcKeepa: "Copy UPC for Keepa",
    uploadFileKeepa: "Upload Keepa file",
    finish: "Finish",
    cutCSV: 'CSV Separator',
    uploadFile: 'Upload file.',
    uploadSellerFile: 'Upload Supplier Files',
    uploadedFiles: (length: number) => `${length} supplier file(s) uploaded`,
    succUpload: 'Keepa.xlsx uploaded',
    uploadFileKeepaXLSX: 'Upload Keepa.xlsx',
    displayTable: "Display in the table if UPC is not specified?",
    template: {
      edit: "Edit",
      delete: "Delete",
      name: "Name"
    },
    saveTempAndSaveKeepa: "Download the template or add them to Keepa",
    copyUPC: "Copy UPC",
    openKeepa: "... and open Keepa"
  },
  addWBForm: {
    idSupl: "Vendor Id",
    dest: "Location",
    queries: "List of Queries",
    skuWBs: "List of WB seller's SKUs",
    deepRead: "Reading Depth",
    writeQueries: "Enter the list of queries one per line",
    writeSKUs: "Enter the list: <WB SKU><delimiter><seller SKU>. The delimiter can be a tab, ';', ','. Seller SKU is not a mandatory field",
  },
  addTestTaskForm: {
    timeOutStep: "Timeout Step (ms)",
    byNotRequired: "To (optional)",
    unitsSum: "Number of Units"
  },
  baseTaskForm: {
    additionalParameters: "Additional Parameters",
    name: "Name",
    description: "Description"
  },
  amazonEbayAddButtons: {
    errorAddTask: `Error adding task `,
    succAdd: (name: string) => `Task ${name} successfully added`,
    goToTask: "Go to Task",
    moreDetails: "Details...",
    test: "Test"
  },
  columns: {
    name: "Name",
    price: "Price",
    rating: "Rating",
    reviews: "Reviews",
    delivery: "Delivery",
    priceTo: "Price To",
    shipPrice: "Shipping Cost",
    condition: "Condition",
    cariation: "Variation",
    state: "State",
    progress: "Progress",
    report: "Report",
    repeat: "Repeat",
    cancel: "Cancel",
    description: "Description",
    fields: "Fields",
    sellersFields: "Suppliers Fields",
    formula: "Formula"
  },
  taskTableDesc: {
    notAvailableInfo: "Task information is unavailable.",
    typeOfTask: "Task Type",
    stateOfTask: "Task Status",
    taskInfo: "Task Information"
  },
  resourceTemplate: {
    menu: {
      viewing: "View",
      check: "Check",
      save: "Save"
    },
    formatters: {
      useAT: "Enter @ to use"
    },
    fields: "Fields",
    sellersFields: "Supplier Fields",
    formula: "Formula",
    checkColumn: "Verification",
    notCorrectFile: (type: string, fileName: string) => `${fileName} does not match the ${type} type `,
    errorFileParsing: "Error parsing file content.",
    checkData: "Check the data.",
    uploadSellerPrice: 'Upload Supplier Price',
    bindFileds: 'Bind supplier fields (column 2) to ASINExpert fields',
    useFormula: 'Use formula if there is no data in the supplier file',
    setNameAndSave: 'Set a name and save',
    getProfit: 'Earn profit 👍'
  }




}
