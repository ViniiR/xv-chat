import "@styles/search_feed.scss";
import i18n from "../i18n";
import { useEffect, useRef, useState } from "react";
import genericIcon from "@assets/user-circle-solid-108.png";
import { Link } from "react-router-dom";
import { API_ROUTES } from "../main";

export default function SearchFeed() {
    const [openResults, setOpenResults] = useState(false);
    const [query, setQuery] = useState("");
    const [queryResult, setQueryResult] = useState([
        {
            icon: "",
            userAt: "",
            userName: "",
        },
    ]);
    const listRef = useRef<HTMLUListElement>(null);

    function animate(open: boolean) {
        if (!listRef.current) return;
        let height = listRef.current!.style.height;
        if (height == "") height = "0px";

        const heightInt = parseInt(height.slice(0, height.indexOf("p")));

        if (open) {
            listRef.current!.style.borderBottom = "1px solid grey";
            if (heightInt >= 300) return;
            listRef.current!.style.height = heightInt + 20 + "px";
        } else {
            if (heightInt <= 0) {
                listRef.current!.style.borderBottom = "none";
                return;
            }
            listRef.current!.style.height = heightInt - 20 + "px";
        }
        requestAnimationFrame(() => {
            animate(open);
        });
    }

    useEffect(() => {
        if (query.trim() == "") {
            setQueryResult([{ userName: "", icon: "", userAt: "" }]);
            return;
        }
        async function fetchQuery() {
            try {
                const url = `${process.env.API_URL_ROOT}${API_ROUTES.QUERY_PATH}/${query.trim()}`;
                const res = await fetch(url, {
                    mode: "cors",
                    credentials: "include",
                    method: "GET",
                });
                const body: {
                    Ok: Array<{
                        icon: string;
                        userAt: string;
                        userName: string;
                    }>;
                } = await res.json();
                if (body.Ok.length === 0) {
                    setQueryResult([{ userName: "", icon: "", userAt: "" }]);
                }
                setQueryResult(body.Ok);
            } catch (err) {
                console.error(err);
            }
        }
        fetchQuery();
    }, [query]);

    useEffect(() => {
        if (openResults) {
            requestAnimationFrame(() => {
                animate(true);
            });
        } else {
            requestAnimationFrame(() => {
                animate(false);
            });
        }
    }, [openResults]);

    return (
        <main className="search-feed">
            <input
                type="text"
                name="search-query"
                id="search-query"
                placeholder={i18n.t("searchingFor")}
                autoComplete="off"
                onInput={(e) => {
                    setQuery(e.currentTarget.value);
                }}
                onFocus={() => {
                    setOpenResults(true);
                }}
                onBlur={() => {
                    setOpenResults(false);
                }}
            />
            <ul className="results-list" ref={listRef}>
                {!queryResult[0] ? (
                    <div>{i18n.t("noResult")}</div>
                ) : (
                    queryResult[0].userAt !== "" &&
                    queryResult.map((o, i) => (
                        <li key={i}>
                            <Link to={`/${o.userAt}`}>
                                <img src={o.icon || genericIcon} alt="" />
                                <strong>{o.userName}</strong>
                                <span>@{o.userAt}</span>
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </main>
    );
}
