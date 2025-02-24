import "@styles/menu_button_list.scss"

interface MenuBtnProps {
    children?: JSX.Element | JSX.Element[];
}

export default function MenuBtnList({ children }: MenuBtnProps) {
    return <ul className="menu-btn-list">{children}</ul>;
}
