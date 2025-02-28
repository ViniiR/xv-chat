import { I18n } from "i18n-js";

// RULES:
// all text should be capitalized as "This"
//
const REQUIRED_FIELD: string = "Required field!";
const CAMPO_OBRIGATORIO: string = "Preencha este campo!";
const i18n = new I18n({
    en: {
        followCount: "Followers",
        followingCount: "Following",
        profile: "Profile",
        config: "Settings",
        profileSettings: "Profile",
        profileSettingsDesc: "Manage your Profile picture, Username and more.",
        languageSettings: "Language",
        languageSettingsDesc: "Change your current language.",
        ok: "Ok",
        accountSettings: "Account",
        accountSettingsDesc: "Change your password, E-mail and more.",
        login: "Login",
        signup: "Sign Up",
        signupAlt: "Sign Up",
        signupLinkDesc: "Don't have an account?",
        signupLinkDescAlt: "New here?",
        loginLinkDesc: "Already have an account?",
        email: "Email",
        password: "Password",
        passwordConfirm: "Confirm Password",
        passwordNoMatch: "Passwords don't match!",
        invalidEmail: "Invalid email!",
        passwordShort: "Password must be at least 8 characters!",
        passwordLong: "Password must be at most 32 characters!",
        loginSuccess: "User succesfully authenticated",
        userName: "Name",
        userAt: "Username",
        signupSuccess: "User succesfully created",
        userNameMinLength: "Name must be at least 2 characters!",
        userNameMaxLength: "Name must be at most 20 characters!",
        passwordConfirmRequired: REQUIRED_FIELD,
        userNameRequired: REQUIRED_FIELD,
        userAtRequired: REQUIRED_FIELD,
        emailRequired: REQUIRED_FIELD,
        passwordRequired: REQUIRED_FIELD,
        userAtMinLength: "Username must be at least 2 characters!",
        userAtMaxLength: "Username must be at most 20 characters!",
        loginInvalidCredentials: "Invalid credentials!",
        accountSubMenu: "Settings > Account",
        changeUserAt: "Change your Username",
        changeUserAtDesc: "Change your @Username.",
        changeUserEmail: "Change your Email",
        changeUserEmailDesc: "Change your account's current Email.",
        changeUserPassword: "Change your Password",
        changeUserPasswordDesc: "Change your account's Password.",
        logOut: "Log Out",
        logOutDesc: "Log Out of your Account.",
        deleteAcct: "Delete your Account",
        deleteAcctDesc: "Delete your Account Permanently.",
        logoutConfirm: "Are you sure you want to Log Out?",
        logout: "Log Out",
        cancel: "Cancel",
        deleteConfirm: "Are you sure you want to Delete your Account?",
        delete: "Delete",
        newPassword: "New Password:",
        oldPassword: "Current Password:",
        newEmail: "New Email:",
        newUserAt: "New Username:",
        passwordCannotEqOld: "New Password cannot be the same as the old one",
        oldPasswordInvalid: "Current Password doesn't match",
        passwordChangeOk: "Password altered",
        emailChangeOk: "Email altered",
        emailCannotBeSame: "New Email cannot be the same as the old one",
        userAtChangeOk: "Username altered",
        userAtCannotBeSame: "New Username cannot be the same as the old one",
        following: "Following",
        follow: "Follow",
        edit: "Edit",
        youFollowNobody: "You don't follow anyone yet.",
        youFollowedByNobody: "You don't have any followers yet.",
        heFollowsNobody: "This user doesn't follow anyone yet.",
        heIsFollowedByNobody: "This user isn't followed by anyone yet.",
        mustSignIn: "You must be logged in to follow someone!",
        editProfile: "Edit Profile",
        save: "Save",
        bio: "Bio",
        crop: "Crop",
        min150px: "The minimum size is 100 x 100 pixels.",
        profileDataOk: "Profile changed",
        publish: "Publish",
        yourThoughts: "What are your thoughts,",
        post: "Post",
        likes: "Likes",
        comments: "Comments",
        "10MBLimit": "Images are limited to 10MB!",
        searchingFor: "Who are you searching for?",
        noResult: "No results",
        deletePost: "Delete Post",
        editPost: "Edit Post",
        copyLink: "Copy link",
        usernameOrEmail: "Username or Email",

        // datetime formats plural
        yearsFormat: "y",
        monthsFormat: "mo",
        daysFormat: "d",
        hoursFormat: "h",
        minutesFormat: "min",
        secondsFormat: "s",
        // datetime formats singular
        yearFormat: "y",
        monthFormat: "mo",
        dayFormat: "d",
        hourFormat: "h",
        minuteFormat: "min",
        secondFormat: "s",
        ago: "%{time} ago",
        postComment: "Comment about this Post!",
        noComments: "This Post has no comments yet.",
        deleteComment: "Delete Comment",
        writeSomething: "Write something",
        edited: "Edited",
        posts: "Posts",

        // server
        // username / userat
        usernameInUse: "Username already in use!",
        usernameInvalidCharacter: "Username contains invalid characters!",
        newUsernameInvalidCharacter:
            "New Username contains invalid characters!",
        usernameShort: "Username must be at least 2 character!",
        usernameLong: "Username must be at most 20 characters!",
        userAtInUse: "Username already in use!",
        userAtInvalidCharacter: "Username contains invalid characters!",
        userAtShort: "Username must be at most 20 characters!",
        userAtLong: "Username must be at least 2 character!",
        // email
        emailInUse: "Email already in use!",
        emailInvalid: "Invalid Email!",
        // password
        passwordInvalidCharacter: "Password contains invalid characters!",
        // extra
        internalErr: "Internal server error :(",
        userNoExist: "User does not exist!",
        serverInactive: "Server inactive, please try again in a few minutes...",
    },
    "pt-BR": {
        followCount: "Seguidores",
        followingCount: "Seguindo",
        profile: "Perfil",
        config: "Configurações",
        profileSettings: "Perfil",
        profileSettingsDesc:
            "Altere sua foto de Perfil, Nome de usuário e mais.",
        languageSettings: "Preferências de idioma",
        languageSettingsDesc: "Altere o idioma atual.",
        ok: "Ok",
        accountSettings: "Conta",
        accountSettingsDesc: "Mude sua senha, E-mail e mais.",
        login: "Entrar",
        signup: "Cadastre-se",
        signupAlt: "Cadastrar-se",
        signupLinkDesc: "Não possui uma conta?",
        signupLinkDescAlt: "Novo aqui?",
        loginLinkDesc: "Já possui uma conta?",
        email: "Email",
        password: "Senha",
        passwordConfirm: "Confirmar Senha",
        passwordNoMatch: "Senhas não coincidem!",
        passwordConfirmRequired: CAMPO_OBRIGATORIO,
        emailRequired: CAMPO_OBRIGATORIO,
        passwordRequired: CAMPO_OBRIGATORIO,
        userNameRequired: CAMPO_OBRIGATORIO,
        userAtRequired: CAMPO_OBRIGATORIO,
        invalidEmail: "Email inválido!",
        passwordShort: "Senha deve ter no mínimo 8 caracteres!",
        passwordLong: "Senha deve ter no máximo 32 caracteres!",
        loginSuccess: "Usuário autenticado com sucesso",
        userName: "Nome",
        userAt: "Nome de Usuário",
        signupSuccess: "Usuário criado com sucesso",
        userNameMinLength: "Nome deve ter no mínimo 2 caracteres!",
        userNameMaxLength: "Nome deve ter no máximo 20 caracteres!",
        userAtMinLength: "Nome de usuário deve ter no mínimo 2 caracteres!",
        userAtMaxLength: "Nome de usuário deve ter no máximo 20 caracteres!",
        loginInvalidCredentials: "Credenciais inválidas!",
        accountSubMenu: "Configurações > Conta",
        changeUserAt: "Mude seu Nome de usuário",
        changeUserAtDesc: "Altere seu @NomeDeUsuário.",
        changeUserEmail: "Mude seu Email",
        changeUserEmailDesc: "Altere o Email da sua conta.",
        changeUserPassword: "Mude sua Senha",
        changeUserPasswordDesc: "Altere a senha da sua conta.",
        logOut: "Sair",
        logOutDesc: "Sair da sua Conta.",
        deleteAcct: "Deletar sua Conta",
        deleteAcctDesc: "Deletar sua Conta Permanentemente.",
        logoutConfirm: "Tem certeza que deseja Sair da sua Conta?",
        logout: "Sair",
        cancel: "Cancelar",
        deleteConfirm: "Tem certeza que deseja Deletar sua Conta?",
        delete: "Deletar",
        newPassword: "Nova Senha:",
        oldPassword: "Senha Atual:",
        newEmail: "Novo Email:",
        newUserAt: "Novo Nome de Usuário:",
        passwordCannotEqOld: "Nova Senha não pode ser igual à antiga",
        oldPasswordInvalid: "Senha Atual incorreta",
        passwordChangeOk: "Senha alterada",
        emailChangeOk: "Email alterado",
        emailCannotBeSame: "Novo Email não pode ser igual ao antigo",
        userAtChangeOk: "Nome de Usuário alterado",
        userAtCannotBeSame: "Novo Nome de Usuário não pode ser igual ao antigo",
        following: "Seguindo",
        follow: "Seguir",
        edit: "Editar",
        youFollowNobody: "Você ainda não segue ninguém.",
        youFollowedByNobody: "Você ainda não tem seguidores.",
        heFollowsNobody: "Este usuário ainda não segue ninguém.",
        heIsFollowedByNobody: "Este usuário ainda não tem seguidores.",
        mustSignIn: "Você precisa estar logado para seguir alguém!",
        editProfile: "Editar Perfil",
        save: "Salvar",
        bio: "Bio",
        crop: "Cortar",
        min150px: "O tamanho mínimo é de 100 x 100 pixels",
        profileDataOk: "Perfil alterado",
        publish: "Publicar",
        yourThoughts: "O que você está pensando,",
        post: "Post",
        likes: "Curtidas",
        comments: "Comentários",
        "10MBLimit": "Imagens são limitadas há 10MB!",
        searchingFor: "Quem você está procurando?",
        noResult: "Sem resultados",
        deletePost: "Deletar Post",
        editPost: "Editar Post",
        copyLink: "Copiar link",
        usernameOrEmail: "Nome de Usuário ou Email",

        // datetime formats plural
        yearsFormat: "a",
        monthsFormat: "meses",
        daysFormat: "d",
        hoursFormat: "h",
        minutesFormat: "min",
        secondsFormat: "s",
        // datetime formats singular
        yearFormat: "a",
        monthFormat: "mês",
        dayFormat: "d",
        hourFormat: "h",
        minuteFormat: "min",
        secondFormat: "s",
        ago: "há %{time}",
        postComment: "Comente sobre esse Post!",
        noComments: "Esse Post ainda não possui comentários.",
        deleteComment: "Deletar Comentário",
        writeSomething: "Escreva algo",
        edited: "Editado",
        posts: "Posts",

        // server
        // username / userat
        usernameInUse: "Nome de usuário indisponível",
        usernameInvalidCharacter:
            "Nome de usuário contém caracteres inválidos!",
        newUsernameInvalidCharacter:
            "Novo Nome de usuário contém caracteres inválidos!",
        usernameShort: "Nome de usuário deve ter no máximo 20 caracteres!",
        usernameLong: "Nome de usuário deve ter no mínimo 2 caracteres!",
        userAtInUse: "Nome de usuário já está em uso!",
        userAtInvalidCharacter: "Nome de usuário contém caracteres inválidos!",
        userAtShort: "Nome de usuário deve ter no máximo 20 caracteres!",
        userAtLong: "Nome de usuário deve ter no mínimo 2 caracteres!",
        // email
        emailInUse: "Email já está em uso!",
        emailInvalid: "Email inválido!",
        // password
        passwordInvalidCharacter: "Senha contém caracteres inválidos!",
        // extra
        internalErr: "Erro interno do servidor :(",
        userNoExist: "Usuário não existe!",
        serverInactive:
            "Servidor inativo, tente novamente em alguns minutos...",
    },
    // only enable those who actually work
    //ru: {
    //TODO
    //oh boy am i cooked
    //},
});

const selectedLang = localStorage.getItem("language");
const userBrowserLang = navigator.language;

//please make this better it looks like shit
if (selectedLang == null || selectedLang == "") {
    if (userBrowserLang.match(/^pt($|-.)/)) {
        i18n.locale = "pt-BR";
        //} else if (userBrowserLang.match(/^en($|-)./)) {
        //    i18n.locale = "en";
    } else if (userBrowserLang.match(/^ru($|-.)/)) {
        i18n.locale = "ru";
    } else {
        i18n.locale = "en";
    }
} else if (selectedLang.match(/(en|pt|ru)(-([A-Z]|[a-z]){2}|$)/)) {
    if (selectedLang.match(/^pt($|-.)/)) {
        i18n.locale = "pt-BR";
    } else if (selectedLang.match(/^ru($|-.)/)) {
        i18n.locale = "ru";
    } else {
        i18n.locale = "en";
    }
} else {
    i18n.locale = "en";
}

export default i18n;
