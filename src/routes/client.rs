use std::path::{self, PathBuf};

use rocket::{
    fs::NamedFile,
    http::Status,
    request::{self, FromRequest},
    response::Responder,
    Request,
};

#[head("/")]
pub async fn head() -> Status {
    Status::Ok
}
#[get("/", rank = 0)]
pub async fn index(gzip: AcceptGzip) -> ResponseFile {
    if gzip.0 {
        ResponseFile::GzipHtml(GzipHtmlFile(get_file("index.html.gz").await))
    } else {
        ResponseFile::Normal(get_file("index.html").await)
    }
}

#[get("/main.bundle.js", rank = 1)]
pub async fn bundle(gzip: AcceptGzip) -> ResponseFile {
    if gzip.0 {
        ResponseFile::GzipJs(GzipJsFile(get_file("main.bundle.js.gz").await))
    } else {
        ResponseFile::Normal(get_file("main.bundle.js").await)
    }
}

#[get("/<file..>", rank = 2)]
pub async fn file(file: PathBuf, gzip: AcceptGzip) -> ResponseFile {
    let Some(ext) = file.extension() else {
        return if gzip.0 {
            ResponseFile::GzipHtml(GzipHtmlFile(get_file("index.html.gz").await))
        } else {
            ResponseFile::Normal(get_file("index.html").await)
        };
    };

    if !file_exists(file.to_str().unwrap_or("")) {
        return ResponseFile::Normal(get_file("index.html").await);
    }

    match ext.to_str().expect("no file extension") {
        "svg" => {
            if file_exists(&format!("{}.gz", file.to_str().unwrap_or(""))) {
                ResponseFile::GzipSvg(GzipSvgFile(
                    get_file(&format!("{}.gz", file.to_str().unwrap_or(""))).await,
                ))
            } else {
                ResponseFile::GzipSvg(GzipSvgFile(get_file(file.to_str().unwrap_or("")).await))
            }
        }
        "jpeg" | "jpg" | "png" | "ico" | "gif" => {
            ResponseFile::Normal(get_file(file.to_str().unwrap_or("")).await)
        }
        _ => {
            eprintln!(
                "this might be useful filename: {}",
                &file.to_str().unwrap_or("no_name")
            );
            todo!("add 404 page");
            //NamedFile::open(format!("client_dist/{}", file.to_str().expect("no file")))
            //    .await
            //    .ok()
        }
    }
}

#[derive(Responder)]
pub enum ResponseFile {
    GzipJs(GzipJsFile),
    GzipHtml(GzipHtmlFile),
    GzipSvg(GzipSvgFile),
    Normal(Option<NamedFile>),
}

pub struct GzipJsFile(Option<NamedFile>);
pub struct GzipHtmlFile(Option<NamedFile>);
pub struct GzipSvgFile(Option<NamedFile>);

impl<'r> Responder<'r, 'static> for GzipJsFile {
    fn respond_to(self, request: &'r rocket::Request<'_>) -> rocket::response::Result<'static> {
        let mut res = self.0.respond_to(request)?;
        res.set_raw_header("Content-Encoding", "gzip");
        res.set_raw_header("Content-Type", "text/javascript");
        Ok(res)
    }
}

impl<'r> Responder<'r, 'static> for GzipHtmlFile {
    fn respond_to(self, request: &'r rocket::Request<'_>) -> rocket::response::Result<'static> {
        let mut res = self.0.respond_to(request)?;
        res.set_raw_header("Content-Encoding", "gzip");
        res.set_raw_header("Content-Type", "text/html; charset=utf-8");
        Ok(res)
    }
}

impl<'r> Responder<'r, 'static> for GzipSvgFile {
    fn respond_to(self, request: &'r rocket::Request<'_>) -> rocket::response::Result<'static> {
        let mut res = self.0.respond_to(request)?;
        res.set_raw_header("Content-Encoding", "gzip");
        res.set_raw_header("Content-Type", "image/svg+xml");
        Ok(res)
    }
}

#[derive()]
pub struct AcceptGzip(bool);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AcceptGzip {
    type Error = &'r str;
    async fn from_request(req: &'r Request<'_>) -> request::Outcome<Self, Self::Error> {
        match req.headers().get_one("Accept-Encoding") {
            Some(h) => {
                if h.contains("gzip") {
                    request::Outcome::Success(AcceptGzip(true))
                } else {
                    request::Outcome::Success(AcceptGzip(false))
                }
            }
            None => request::Outcome::Success(AcceptGzip(false)),
        }
    }
}

/// must not include file_path
async fn get_file(file_name: &str) -> Option<NamedFile> {
    NamedFile::open(format!("client_dist/{}", file_name))
        .await
        .ok()
}

/// must not include file_path
fn file_exists(file_name: &str) -> bool {
    path::Path::new(&format!("client_dist/{}", file_name)).exists()
}

//#[catch(404)]
//pub async fn not_found() -> RawHtml<&'static str> {
//    RawHtml(
//        r#"
//        <div id="error-root">
//            <div id="error-number">
//                    404
//            </div>
//            <div id="error-name">
//                Not found
//            </div>
//        </div>"#,
//    )
//}
