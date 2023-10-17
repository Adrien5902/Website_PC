interface Props{
    children: JSX.Element | JSX.Element[]
    name: string
}

export default function HeaderDropDown({children, name}: Props) {
    return (<div className="dropdown">
        <span className="dropdown-name">{name}</span>
        <div className="dropdown-children">
            {children}
        </div>
    </div>);
}