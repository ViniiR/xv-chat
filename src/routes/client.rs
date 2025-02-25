use std::path::PathBuf;

use rocket::fs::NamedFile;

#[get("/", rank = 0)]
pub async fn index() -> Option<NamedFile> {
    NamedFile::open("client_dist/index.html").await.ok()
}

#[get("/main.bundle.js", rank = 1)]
pub async fn bundle() -> Option<NamedFile> {
    NamedFile::open("client_dist/main.bundle.js").await.ok()
}

#[get("/<file>", rank = 2)]
pub async fn file(file: PathBuf) -> Option<NamedFile> {
    let Some(ext) = file.extension() else {
        return NamedFile::open("client_dist/index.html").await.ok();
    };

    match ext.to_str().expect("no file extension") {
        "svg" | "jpeg" | "jpg" | "png" | "ico" | "gif" => {
            NamedFile::open(format!("client_dist/{}", file.to_str().expect("no file")))
                .await
                .ok()
        }
        _ => {
            todo!("add 404 page");
            NamedFile::open(format!("client_dist/{}", file.to_str().expect("no file")))
                .await
                .ok()
        }
    }
}
