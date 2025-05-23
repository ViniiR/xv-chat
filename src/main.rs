mod auth;
mod cors;
mod database;
mod routes;

use database::user::User;
use dotenv::dotenv;
use regex::Regex;
use rocket::{
    http::Status,
    response::status::Custom,
    serde::{Deserialize, Serialize},
    Config,
};

#[derive(Debug, Deserialize, Serialize)]
struct LoginData {
    #[serde(rename = "userAtEmail")]
    pub user_at_email: String,
    #[serde(rename = "password")]
    pub password: String,
}

struct ValidField {
    valid: bool,
    message: &'static str,
}

pub const USER_NAME_MIN_LEN: usize = 2;
pub const USER_NAME_MAX_LEN: usize = 20;
pub const USER_AT_MIN_LEN: usize = 2;
pub const USER_AT_MAX_LEN: usize = 20;
pub const PASSWORD_MIN_LEN: usize = 8;
pub const PASSWORD_MAX_LEN: usize = 32;
pub const BIO_MAX_LEN: usize = 150;

#[macro_use]
extern crate rocket;

async fn validate_user_name(user_name: &str) -> ValidField {
    let mut is_valid: bool = true;
    let mut message: &str = "";
    let user_name = user_name.trim();
    //user_name.chars().for_each(|c| {
    //    if (!c.is_alphanumeric() && !is_brazilian(c)) || is_spanish(c) {
    //        is_valid = false;
    //        message = "username invalid character";
    //    }
    //});
    if user_name.chars().count() < USER_NAME_MIN_LEN {
        is_valid = false;
        message = "username too short";
    }
    if user_name.chars().count() > USER_NAME_MAX_LEN {
        is_valid = false;
        message = "username too long";
    }
    ValidField {
        valid: is_valid,
        message,
    }
}

fn is_brazilian(c: char) -> bool {
    c == 'ã' || c == 'á' || c == 'à' || c == 'â'||//a
    c == 'é' || c == 'è' || c == 'ê'||//e
    c == 'í' || c == 'ì' || c == 'î'||//i
    c == 'õ' || c == 'ó' || c == 'ò' || c == 'ô' || //o
    c == 'ú' || c == 'ù' || c == 'û' || //u
    c == 'ç' || // c
    c == 'Ã' || c == 'Á' || c == 'À' || c == 'Â'||//a
    c == 'É' || c == 'È' || c == 'Ê'||//e
    c == 'Í' || c == 'Ì' || c == 'Î'||//i
    c == 'Õ' || c == 'Ó' || c == 'Ò' || c == 'Ô' || //o
    c == 'Ú' || c == 'Ù' || c == 'Û' || //u
    c == 'Ç' // c
}

fn is_spanish(c: char) -> bool {
    c == 'ñ' || c == 'Ñ'
}

async fn validate_user_at(user_at: &str) -> ValidField {
    let mut is_valid: bool = true;
    let user_at = user_at.trim();
    let mut message = "";
    user_at.chars().for_each(|c| {
        if c == '_' {
            return;
        }
        if (!c.is_ascii_alphanumeric() && !is_brazilian(c)) || is_spanish(c) {
            is_valid = false;
            message = "user_at invalid character";
        }
    });
    if user_at.len() < USER_AT_MIN_LEN {
        is_valid = false;
        message = "user_at too short";
    }
    if user_at.len() > USER_AT_MAX_LEN {
        is_valid = false;
        message = "user_at too long";
    }
    ValidField {
        valid: is_valid,
        message,
    }
}

const EMAIL_REGEX: &str =
    r"^([a-z0-9_+]([a-z0-9_+.]*[a-z0-9_+])?)@([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6})$";
async fn validate_email(email: &str) -> ValidField {
    let mut is_valid = true;
    let mut message = "";
    let email = email.trim();

    let regex = Regex::new(EMAIL_REGEX).unwrap();

    if !regex.is_match(email) {
        message = "invalid email";
        is_valid = false;
    }
    //todo!("send EMAIL for verification");
    //its too complex so ill leave it for later or never
    ValidField {
        valid: is_valid,
        message,
    }
}

async fn validate_password(password: &str) -> ValidField {
    let mut is_valid = true;
    let mut message = "";
    let password = password.trim();

    password.chars().for_each(|c| {
        if (!c.is_ascii_alphanumeric() && !c.is_ascii_punctuation()) || c == ' ' {
            is_valid = false;
            message = "password invalid character";
        }
    });
    if password.len() < PASSWORD_MIN_LEN {
        is_valid = false;
        message = "password too short";
    }
    if password.len() > PASSWORD_MAX_LEN {
        is_valid = false;
        message = "password too long";
    }
    ValidField {
        valid: is_valid,
        message,
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

pub async fn validate_minimal_user_credentials(user: &User) -> Result<(), Custom<&'static str>> {
    let res = validate_user_name(&user.user_name).await;
    if !res.valid {
        return Err(Custom(Status::BadRequest, res.message));
    }

    let res = validate_user_at(&user.user_at).await;
    if !res.valid {
        return Err(Custom(Status::BadRequest, res.message));
    }

    let res = validate_email(&user.email).await;
    if !res.valid {
        return Err(Custom(Status::BadRequest, res.message));
    }

    let res = validate_password(&user.password).await;
    if !res.valid {
        return Err(Custom(Status::BadRequest, res.message));
    }

    Ok(())
}

#[launch]
async fn rocket() -> _ {
    dotenv().ok();
    let config = Config::figment()
        .merge(("port", 10_000))
        .merge(("address", "0.0.0.0"));
    rocket::custom(config)
        .attach(cors::Cors)
        .mount(
            "/api",
            routes![
                routes::user::create,
                routes::user::login,
                routes::user::logout,
                routes::user::delete,
                routes::auth::validate,
                options,
                routes::user_get::get_data,
                routes::user_get::get_profile_data,
                routes::user_get::get_following,
                routes::user_get::get_followers,
                routes::user_get::query,
                routes::user_get::fetch_comments,
                routes::change::change_profile,
                routes::change::change_password,
                routes::change::change_email,
                routes::change::change_user_at,
                routes::change::follow_user,
                routes::change::edit_post,
                routes::user::publish_post,
                routes::user::fetch_posts,
                routes::user::fetch_post,
                routes::user::fetch_user_posts,
                routes::user::like,
                routes::user::like_comment,
                routes::user::comment,
                routes::user::delete_post,
                routes::user::delete_comment,
                routes::user_get::get_profile_likes
            ],
        )
        .mount(
            "/",
            routes![
                routes::client::head,
                routes::client::index,
                routes::client::bundle,
                routes::client::file
            ],
        )
    //.register("/", catchers![not_found])
}

#[options("/<_..>")]
async fn options() {}
